import './styles.css';
import catalog from './data/faltas.json';
import {
  deleteSimulation,
  deleteStudent,
  getSetting,
  getSimulation,
  getStudent,
  listSimulations,
  listStudents,
  makeId,
  openDatabase,
  putSetting,
  putSimulation,
  putStudent
} from './db.js';
import { evaluateSimulation, levelName } from './rules.js';
import { friendlyError, userError } from './userErrors.js';
import {
  extractSimulationsFromImport,
  formatDateEs,
  hasRunningTimers,
  localTodayIso,
  normalizeImportedSimulation,
  normalizeImportedStudent,
  pauseAllTimers,
  sanitizeFaults,
  sanitizeTimers,
  validateCatalog,
  validateCountdownMinutes,
  validateImportFile,
  validateSimulationForPdf
} from './validation.js';

const app = document.querySelector('#app');
const DEFAULT_COUNTDOWN_MINUTES = 25;

// Metadatos técnicos de los bloques del catálogo oficial DGT
const BLOCK_SHORT_META = {
  '1. Comprobaciones previas': { code: '01', short: 'Comprobac.' },
  '2. Instalación': { code: '02', short: 'Instalación' },
  '3. Incorporación': { code: '03', short: 'Incorporac.' },
  '4. Progresión normal': { code: '04', short: 'Progresión' },
  '5. Desplazamientos laterales': { code: '05', short: 'Desplazam.' },
  '6. Adelantamientos': { code: '06', short: 'Adelantam.' },
  '7. Intersecciones y glorietas': { code: '07', short: 'Intersecc.' },
  '8. Cambio de sentido': { code: '08', short: 'C. sentido' },
  '9. Paradas y estacionamientos': { code: '09', short: 'Estacionam.' },
  '11. Señales: agentes y paneles': { code: '11A', short: 'Agentes' },
  '11. Semáforos': { code: '11B', short: 'Semáforos' },
  '11. Señales verticales': { code: '11C', short: 'Verticales' },
  '11. Marcas viales': { code: '11D', short: 'Marcas vial.' },
  '12. Luces': { code: '12', short: 'Luces' },
  '13. Manejo de mandos': { code: '13', short: 'Mandos' },
  '14. Otros mandos': { code: '14', short: 'Otros mand.' },
  '15. Durante la prueba': { code: '15', short: 'Desarrollo' }
};

// Asignar códigos jerárquicos estilo hoja oficial (ej. 03.01, 07.12)
const blockCounters = new Map();
const enrichedCatalog = catalog.map((item) => {
  const meta = BLOCK_SHORT_META[item.bloque] || {
    code: String(item.bloque || '').split('.')[0].padStart(2, '0'),
    short: String(item.bloque || '').replace(/^\d+\.\s*/, '').slice(0, 12)
  };
  const nextIdx = (blockCounters.get(item.bloque) || 0) + 1;
  blockCounters.set(item.bloque, nextIdx);
  return {
    ...item,
    blockCode: meta.code,
    blockShort: meta.short,
    code: `${meta.code}.${String(nextIdx).padStart(2, '0')}`
  };
});

const catalogById = new Map(enrichedCatalog.map((item) => [item.id, item]));
const uniqueBlocks = [];
{
  const seen = new Set();
  for (const item of enrichedCatalog) {
    if (!seen.has(item.bloque)) {
      seen.add(item.bloque);
      uniqueBlocks.push({
        bloque: item.bloque,
        code: item.blockCode,
        short: item.blockShort
      });
    }
  }
}

const state = {
  screen: 'sheet', // 'sheet' | 'acta' | 'students' | 'student-detail' | 'archive'
  current: null,
  currentPersisted: false,
  history: [],
  students: [],
  selectedStudentId: null,
  showHeaderMeta: false,
  showTimersDrawer: false,
  showBlockGrid: true,
  showNewStudentForm: false,
  selectedBlock: 'ALL',
  query: '',
  filter: 'ALL',
  studentQuery: '',
  historyQuery: '',
  historyFilter: 'ALL',
  openBlocks: new Set([uniqueBlocks[0]?.bloque, uniqueBlocks[2]?.bloque].filter(Boolean)),
  openFault: null,
  toast: '',
  userAlert: null,
  pdfBusy: false,
  wakeLockEnabled: false,
  wakeLockSentinel: null,
  studentDraft: emptyStudentDraft()
};

const nowIso = () => new Date().toISOString();
const currentTimestamp = () => Date.now();
let timerIntervalId = null;

function emptyStudentDraft() {
  return { name: '', phone: '', email: '', notes: '' };
}

function defaultTimers() {
  return sanitizeTimers({}, { makeId, nowIso });
}

function emptyStudent(overrides = {}) {
  const now = nowIso();
  return {
    id: makeId('stu'),
    name: '',
    phone: '',
    email: '',
    notes: '',
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

function emptySimulation(student = null) {
  const now = nowIso();
  return {
    id: makeId('sim'),
    studentId: student?.id || null,
    studentName: student?.name || '',
    date: localTodayIso(),
    zone: '',
    teacher: '',
    vehicle: '',
    generalNotes: '',
    faults: [],
    timers: defaultTimers(),
    status: 'draft',
    createdAt: now,
    updatedAt: now
  };
}

function ensureSimulationShape(simulation) {
  if (!simulation) return null;
  simulation.studentId = simulation.studentId || null;
  simulation.studentName = String(simulation.studentName || '');
  simulation.date = simulation.date || localTodayIso();
  simulation.zone = String(simulation.zone || '');
  simulation.teacher = String(simulation.teacher || '');
  simulation.vehicle = String(simulation.vehicle || '');
  simulation.generalNotes = String(simulation.generalNotes || '');
  simulation.faults = sanitizeFaults(simulation.faults, { makeId, nowIso, catalogById });
  simulation.timers = sanitizeTimers(simulation.timers, { makeId, nowIso });
  simulation.status = simulation.status === 'finalized' ? 'finalized' : 'draft';
  return simulation;
}

function ensureStudentShape(student) {
  if (!student) return null;
  const now = nowIso();
  return {
    id: student.id || makeId('stu'),
    name: String(student.name || student.studentName || '').slice(0, 120),
    phone: String(student.phone || '').slice(0, 60),
    email: String(student.email || '').slice(0, 120),
    notes: String(student.notes || '').slice(0, 4000),
    createdAt: student.createdAt || now,
    updatedAt: student.updatedAt || now
  };
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function normalise(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function effectiveElapsed(timer) {
  const base = Number(timer?.elapsedMs || 0);
  if (!timer?.running || !timer.startedAt) return base;
  return Math.max(0, base + (currentTimestamp() - Number(timer.startedAt)));
}

function effectiveRemaining(timer) {
  const base = Number(timer?.remainingMs ?? timer?.durationMs ?? 0);
  if (!timer?.running || !timer.startedAt) return Math.max(0, base);
  return Math.max(0, base - (currentTimestamp() - Number(timer.startedAt)));
}

function formatClock(ms, { showTenths = true } = {}) {
  const safe = Math.max(0, Math.floor(Number(ms || 0)));
  const tenths = Math.floor((safe % 1000) / 100);
  const totalSeconds = Math.floor(safe / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const ss = String(seconds).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  const base = hours > 0 ? `${String(hours).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
  if (!showTenths) return esc(base);
  return `${esc(base)}<span class="t-tenths">.${tenths}</span>`;
}

function countdownMinutes(timer) {
  return Math.max(1, Math.round(Number(timer?.durationMs || DEFAULT_COUNTDOWN_MINUTES * 60 * 1000) / 60000));
}

function playCountdownAlert() {
  try {
    if (navigator.vibrate) navigator.vibrate([220, 100, 220, 100, 320]);
  } catch {
    // Sin soporte de vibración
  }
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const beep = (startOffset, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + startOffset + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration + 0.02);
    };
    beep(0, 880, 0.16);
    beep(0.22, 880, 0.16);
    beep(0.44, 1046, 0.25);
    window.setTimeout(() => ctx.close().catch(() => {}), 1000);
  } catch {
    // Audio bloqueado
  }
}

async function syncWakeLock() {
  if (!('wakeLock' in navigator)) return;
  const shouldHold = state.wakeLockEnabled && Boolean(state.current) && state.current.status !== 'finalized' && document.visibilityState === 'visible';
  try {
    if (shouldHold && !state.wakeLockSentinel) {
      const sentinel = await navigator.wakeLock.request('screen');
      state.wakeLockSentinel = sentinel;
      sentinel.addEventListener('release', () => {
        if (state.wakeLockSentinel === sentinel) state.wakeLockSentinel = null;
      });
    } else if (!shouldHold && state.wakeLockSentinel) {
      await state.wakeLockSentinel.release();
      state.wakeLockSentinel = null;
    }
  } catch {
    // Ignorar rechazo de wakeLock
  }
}

function syncTimerLoop() {
  const shouldRun = Boolean(state.current) && hasRunningTimers(state.current.timers) && document.visibilityState === 'visible';
  if (shouldRun && !timerIntervalId) {
    timerIntervalId = window.setInterval(updateTimerDisplays, 80);
  } else if (!shouldRun && timerIntervalId) {
    window.clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  syncWakeLock();
}

function selectedStudent() {
  return state.students.find((student) => student.id === state.selectedStudentId) || null;
}

function simulationsForStudent(studentId) {
  return state.history.filter((sim) => sim.studentId === studentId);
}

function calculateCurrent() {
  return evaluateSimulation(state.current?.faults || []);
}

function faultCountsByCatalogId() {
  const counts = new Map();
  for (const item of state.current?.faults || []) {
    if (item.faultId != null) {
      counts.set(item.faultId, (counts.get(item.faultId) || 0) + 1);
    }
  }
  return counts;
}

function faultCountsByBlock() {
  const counts = new Map();
  for (const item of state.current?.faults || []) {
    const cat = item.faultId != null ? catalogById.get(item.faultId) : null;
    const bloque = cat?.bloque || item.snapshot?.bloque;
    if (bloque) counts.set(bloque, (counts.get(bloque) || 0) + 1);
  }
  return counts;
}

function navigateTo(screen) {
  state.screen = screen;
  state.openFault = null;
  render();
  window.scrollTo(0, 0);
}

function setToast(message) {
  state.toast = message;
  const root = document.querySelector('#status-toast');
  if (root) {
    root.innerHTML = state.toast ? `<div class="dgt-toast" role="status">${esc(state.toast)}</div>` : '';
  } else {
    render();
  }
  if (message) {
    window.clearTimeout(setToast.timer);
    setToast.timer = window.setTimeout(() => {
      state.toast = '';
      const el = document.querySelector('#status-toast');
      if (el) el.innerHTML = '';
    }, 2200);
  }
}

function setUserAlert(title, message, { type = 'error', code = '' } = {}) {
  state.userAlert = { title, message, type, code };
  render();
}

function clearUserAlert() {
  if (!state.userAlert) return;
  state.userAlert = null;
  render();
}

function showUserError(error, context = 'general') {
  console.error(error);
  const friendly = friendlyError(error, context);
  setUserAlert(friendly.title, friendly.message, { type: 'error', code: friendly.code });
}

function alertBannerHtml() {
  if (!state.userAlert) return '';
  const a = state.userAlert;
  return `
    <div class="dgt-alert" role="alert" aria-live="assertive">
      <div class="dgt-alert-text">
        <strong>${esc(a.title)}:</strong> ${esc(a.message)}
        ${a.code ? `<span class="dgt-code">[${esc(a.code)}]</span>` : ''}
      </div>
      <button type="button" class="t-btn" data-action="clear-alert">Cerrar</button>
    </div>
  `;
}

function severityBox(tipo) {
  const safe = ['L', 'D', 'E'].includes(tipo) ? tipo : 'L';
  return `<span class="sev-box sev-${safe}" title="Falta ${esc(levelName(safe))}">${safe}</span>`;
}

function topChromeHtml() {
  ensureSimulationShape(state.current);
  const sim = state.current;
  const res = calculateCurrent();
  const examTimer = sim.timers.exam;
  const otherTimerActive = sim.timers.parking.running || sim.timers.countdown.running;

  const navTabs = [
    ['sheet', 'Hoja'],
    ['acta', 'Acta / PDF'],
    ['students', `Alumnos (${state.students.length})`],
    ['archive', `Archivo (${state.history.length})`]
  ];

  return `
    <header class="dgt-chrome no-print">
      <div class="dgt-Masthead">
        <div class="dgt-brand">
          <span class="dgt-plate">B</span>
          <span class="dgt-system-name">CALIFICACIÓN</span>
        </div>

        <nav class="dgt-tabs" aria-label="Secciones">
          ${navTabs.map(([id, label]) => `
            <button type="button" class="dgt-tab ${state.screen === id || (id === 'students' && state.screen === 'student-detail') ? 'is-active' : ''}" data-action="screen" data-screen="${id}">
              ${esc(label)}
            </button>
          `).join('')}
        </nav>

        <button type="button" class="dgt-new-btn" data-action="new-sheet" title="Abrir hoja en blanco nueva">+ Nueva</button>
      </div>

      <div class="dgt-instrument-bar" id="instrument-bar">
        <div class="inst-counts">
          <div class="inst-cell inst-L" title="Faltas leves (máx. 9)">
            <span class="inst-k">L</span>
            <strong class="inst-v" id="tally-L">${res.L}</strong>
          </div>
          <div class="inst-cell inst-D" title="Faltas deficientes (máx. 1)">
            <span class="inst-k">D</span>
            <strong class="inst-v" id="tally-D">${res.D}</strong>
          </div>
          <div class="inst-cell inst-E" title="Faltas eliminatorias (0)">
            <span class="inst-k">E</span>
            <strong class="inst-v" id="tally-E">${res.E}</strong>
          </div>
          <button type="button" class="inst-verdict ${res.noApto ? 'is-noapto' : 'is-apto'}" id="tally-verdict" data-action="screen" data-screen="acta" title="Ver acta completa">
            ${res.result}
          </button>
        </div>

        <div class="inst-clock-group">
          <span class="inst-time ${examTimer.running ? 'is-running' : ''}" data-timer-display="elapsed:exam:compact">${formatClock(effectiveElapsed(examTimer), { showTenths: false })}</span>
          <button type="button" class="inst-btn ${examTimer.running ? 'is-stop' : 'is-start'}" id="top-exam-timer-btn" data-action="${examTimer.running ? 'timer-pause' : 'timer-start'}" data-timer="exam">
            ${examTimer.running ? 'Parar' : 'Iniciar'}
          </button>
          <button type="button" class="inst-btn inst-btn-sub ${state.showTimersDrawer || otherTimerActive ? 'is-active' : ''}" data-action="toggle-timers" title="Mostrar cronómetro de maniobra y cuenta atrás">
            Relojes ${state.showTimersDrawer ? '▴' : '▾'}
          </button>
        </div>
      </div>
    </header>
  `;
}

function timersDrawerHtml() {
  if (!state.showTimersDrawer) return '';
  const { exam, parking, countdown } = state.current.timers;
  const countdownDone = effectiveRemaining(countdown) <= 0 && !countdown.running;
  const wakeSupported = 'wakeLock' in navigator;

  return `
    <section class="form-section timers-drawer no-print">
      <div class="section-bar">
        <span>CONTROL DE TIEMPOS DE PRUEBA</span>
        ${wakeSupported ? `
          <label class="inline-check">
            <input type="checkbox" data-toggle="wake-lock" ${state.wakeLockEnabled ? 'checked' : ''} />
            <span>No apagar pantalla</span>
          </label>
        ` : ''}
      </div>

      <div class="timers-table">
        <div class="timer-cell">
          <div class="timer-cell-head">
            <span class="cell-label">1. CIRCULACIÓN GENERAL</span>
            <span class="cell-state" data-timer-status="exam">${exam.running ? 'EN MARCHA' : effectiveElapsed(exam) > 0 ? 'PAUSADO' : 'PARADO'}</span>
          </div>
          <div class="timer-cell-body">
            <div class="lcd-box" data-timer-display="elapsed:exam">${formatClock(effectiveElapsed(exam))}</div>
            <div class="timer-btn-strip" data-timer-buttons="exam">${timerButtonsHtml('exam')}</div>
          </div>
        </div>

        <div class="timer-cell">
          <div class="timer-cell-head">
            <input type="text" class="cell-label-input" data-timer-input="parkingLabel" value="${esc(parking.label || 'Maniobra')}" aria-label="Etiqueta maniobra" />
            <span class="cell-state" data-timer-status="parking">${parking.running ? 'EN MARCHA' : effectiveElapsed(parking) > 0 ? 'PAUSADO' : 'PARADO'}</span>
          </div>
          <div class="timer-cell-body">
            <div class="lcd-box" data-timer-display="elapsed:parking">${formatClock(effectiveElapsed(parking))}</div>
            <div class="timer-btn-strip" data-timer-buttons="parking">${timerButtonsHtml('parking')}</div>
          </div>
          ${parking.records.length ? `
            <div class="lap-table">
              ${parking.records.map((rec) => `
                <div class="lap-row">
                  <span>${esc(rec.label || 'Maniobra')}</span>
                  <strong class="mono">${formatClock(rec.elapsedMs)}</strong>
                  <button type="button" class="t-link-danger" data-action="remove-time-record" data-id="${esc(rec.id)}">×</button>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>

        <div class="timer-cell timer-cell-full ${countdownDone ? 'is-expired' : ''}">
          <div class="timer-cell-head">
            <span class="cell-label">3. CUENTA ATRÁS (DURACIÓN REGLAMENTARIA 25 MIN)</span>
            <span class="cell-state" data-timer-status="countdown">${countdown.running ? 'ACTIVO' : countdownDone ? 'TIEMPO AGOTADO' : 'PREPARADO'}</span>
          </div>
          <div class="timer-cell-body countdown-row">
            <div class="lcd-box" data-timer-display="remaining:countdown">${formatClock(effectiveRemaining(countdown))}</div>
            <div class="preset-strip">
              ${[20, 25, 30, 45].map((m) => `
                <button type="button" class="t-btn ${countdownMinutes(countdown) === m ? 'is-selected' : ''}" data-action="set-countdown" data-minutes="${m}">${m}m</button>
              `).join('')}
              <label class="min-box">
                <input type="number" min="1" max="180" step="1" data-timer-input="countdownMinutes" value="${countdownMinutes(countdown)}" aria-label="Minutos" />
                <span>min</span>
              </label>
            </div>
            <div class="timer-btn-strip" data-timer-buttons="countdown">${timerButtonsHtml('countdown')}</div>
          </div>
        </div>
      </div>
    </section>
  `;
}

function timerButtonsHtml(key) {
  const timer = state.current.timers[key];
  if (key === 'exam') {
    const elapsed = effectiveElapsed(timer);
    if (timer.running) {
      return `
        <button type="button" class="t-btn t-btn-warn" data-action="timer-pause" data-timer="exam">Parar</button>
        <button type="button" class="t-btn" data-action="timer-reset" data-timer="exam">Cero</button>`;
    }
    return `
      <button type="button" class="t-btn t-btn-go" data-action="timer-start" data-timer="exam">${elapsed > 0 ? 'Seguir' : 'Iniciar'}</button>
      ${elapsed > 0 ? '<button type="button" class="t-btn" data-action="timer-reset" data-timer="exam">Cero</button>' : ''}`;
  }

  if (key === 'parking') {
    const elapsed = effectiveElapsed(timer);
    if (timer.running) {
      return `
        <button type="button" class="t-btn t-btn-primary" data-action="timer-save-record">Anotar</button>
        <button type="button" class="t-btn t-btn-warn" data-action="timer-pause" data-timer="parking">Parar</button>
        <button type="button" class="t-btn" data-action="timer-reset" data-timer="parking">Cero</button>`;
    }
    return `
      ${elapsed > 0 ? '<button type="button" class="t-btn t-btn-primary" data-action="timer-save-record">Anotar</button>' : ''}
      <button type="button" class="t-btn t-btn-go" data-action="timer-start" data-timer="parking">${elapsed > 0 ? 'Seguir' : 'Iniciar'}</button>
      ${elapsed > 0 ? '<button type="button" class="t-btn" data-action="timer-reset" data-timer="parking">Cero</button>' : ''}`;
  }

  if (key === 'countdown') {
    const rem = effectiveRemaining(timer);
    const done = rem <= 0 && !timer.running;
    if (timer.running) {
      return `
        <button type="button" class="t-btn t-btn-warn" data-action="countdown-pause">Parar</button>
        <button type="button" class="t-btn" data-action="countdown-reset">Reiniciar</button>`;
    }
    if (done) {
      return '<button type="button" class="t-btn t-btn-primary" data-action="countdown-reset">Restablecer</button>';
    }
    return `
      <button type="button" class="t-btn t-btn-go" data-action="countdown-start">${rem < timer.durationMs ? 'Seguir' : 'Iniciar'}</button>
      ${rem < timer.durationMs ? '<button type="button" class="t-btn" data-action="countdown-reset">Reiniciar</button>' : ''}`;
  }
  return '';
}

function refreshTimerControls(key) {
  if (!state.current) return;
  const timer = state.current.timers[key];
  const btnBox = document.querySelector(`[data-timer-buttons="${key}"]`);
  if (btnBox) btnBox.innerHTML = timerButtonsHtml(key);

  const stBox = document.querySelector(`[data-timer-status="${key}"]`);
  if (stBox) {
    if (key === 'countdown') {
      const done = effectiveRemaining(timer) <= 0 && !timer.running;
      stBox.textContent = timer.running ? 'ACTIVO' : done ? 'TIEMPO AGOTADO' : 'PREPARADO';
    } else {
      stBox.textContent = timer.running ? 'EN MARCHA' : effectiveElapsed(timer) > 0 ? 'PAUSADO' : 'PARADO';
    }
  }

  if (key === 'exam') {
    const topBtn = document.querySelector('#top-exam-timer-btn');
    if (topBtn) {
      topBtn.textContent = timer.running ? 'Parar' : 'Iniciar';
      topBtn.dataset.action = timer.running ? 'timer-pause' : 'timer-start';
      topBtn.className = `inst-btn ${timer.running ? 'is-stop' : 'is-start'}`;
    }
  }
}

function sheetHeaderFormHtml() {
  const sim = state.current;
  const linkedStudent = sim.studentId ? state.students.find((s) => s.id === sim.studentId) : null;

  return `
    <section class="form-section">
      <div class="candidate-strip">
        <div class="candidate-cell">
          <label class="cell-label" for="sheet-student-input">ASPIRANTE / ALUMNO</label>
          <div class="candidate-input-row">
            <input
              id="sheet-student-input"
              type="text"
              class="bare-input"
              data-field="studentName"
              value="${esc(sim.studentName)}"
              placeholder="Escribir apellidos y nombre o elegir..."
              list="dgt-students-datalist"
              autocomplete="off"
            />
            <datalist id="dgt-students-datalist">
              ${state.students.map((s) => `<option value="${esc(s.name)}"></option>`).join('')}
            </datalist>
            ${linkedStudent ? `<button type="button" class="t-tag-btn" data-action="view-student" data-id="${esc(linkedStudent.id)}" title="Abrir expediente del alumno">Ficha</button>` : ''}
          </div>
        </div>

        <div class="date-cell">
          <label class="cell-label" for="sheet-date-input">FECHA</label>
          <input id="sheet-date-input" type="date" class="bare-input" data-field="date" value="${esc(sim.date)}" />
        </div>

        <button type="button" class="expand-meta-btn ${state.showHeaderMeta ? 'is-open' : ''}" data-action="toggle-header-meta">
          Datos ${state.showHeaderMeta ? '▴' : '▾'}
        </button>
      </div>

      ${state.showHeaderMeta ? `
        <div class="meta-grid">
          <div class="meta-cell">
            <label class="cell-label">ZONA / RECORRIDO</label>
            <input type="text" class="bare-input" data-field="zone" value="${esc(sim.zone)}" placeholder="Ej.: Ruta 4 / Móstoles" autocomplete="off" />
          </div>
          <div class="meta-cell">
            <label class="cell-label">MATRÍCULA / VEHÍCULO</label>
            <input type="text" class="bare-input" data-field="vehicle" value="${esc(sim.vehicle)}" placeholder="Ej.: 0000-BBB" autocomplete="off" />
          </div>
          <div class="meta-cell">
            <label class="cell-label">PROFESOR / EVALUADOR</label>
            <input type="text" class="bare-input" data-field="teacher" value="${esc(sim.teacher)}" placeholder="Nombre evaluador" autocomplete="off" />
          </div>
          <div class="meta-cell meta-cell-full">
            <label class="cell-label">OBSERVACIONES GENERALES DE LA PRUEBA</label>
            <textarea class="bare-textarea" rows="2" data-field="generalNotes" placeholder="Anotaciones generales del desarrollo de la circulación...">${esc(sim.generalNotes)}</textarea>
          </div>
        </div>
      ` : ''}
    </section>
  `;
}

function markedFaultsInlineHtml() {
  const faults = state.current?.faults || [];
  if (!faults.length) return '';

  return `
    <details class="form-section marked-strip">
      <summary class="section-bar clickable-bar">
        <span>FALTAS IMPUTADAS EN ESTA PRUEBA (${faults.length})</span>
        <span class="bar-hint">Desplegar / corregir ▾</span>
      </summary>
      <div class="marked-table">
        ${faults.map((f, idx) => {
          const cat = f.faultId != null ? catalogById.get(f.faultId) : null;
          const data = cat || f.snapshot || f;
          const tipo = data.tipo || f.tipo || 'L';
          const code = cat?.code || String(data.bloque || '').split('.')[0] || '—';
          return `
            <div class="marked-row">
              <span class="marked-code mono">${esc(code)}</span>
              ${severityBox(tipo)}
              <div class="marked-desc">
                <span>${esc(data.falta || 'Falta')}</span>
                ${f.note ? `<small class="marked-note-inline">Nota: ${esc(f.note)}</small>` : ''}
              </div>
              <button type="button" class="t-btn t-btn-danger-text" data-action="remove-fault" data-index="${idx}" title="Anular esta falta">Quitar</button>
            </div>
          `;
        }).join('')}
        <div class="marked-footer">
          <button type="button" class="t-btn" data-action="clear-current">Anular todas</button>
          <div class="marked-footer-right">
            <button type="button" class="t-btn t-btn-primary" data-action="screen" data-screen="acta">Abrir Acta / PDF</button>
          </div>
        </div>
      </div>
    </details>
  `;
}

function blockMatrixHtml() {
  const blockCounts = faultCountsByBlock();
  const totalMarked = state.current?.faults?.length || 0;

  return `
    <section class="form-section">
      <div class="section-bar">
        <span>BLOQUES DE CALIFICACIÓN (1 – 15)</span>
        <button type="button" class="bar-toggle-btn" data-action="toggle-block-grid">
          ${state.showBlockGrid ? 'Ocultar cuadrícula ▴' : 'Mostrar cuadrícula ▾'}
        </button>
      </div>
      ${state.showBlockGrid ? `
        <div class="block-matrix" role="navigation" aria-label="Bloques del examen">
          <button type="button" class="matrix-cell ${state.selectedBlock === 'ALL' ? 'is-selected' : ''}" data-action="select-block" data-block="ALL">
            <span class="matrix-code">1-15</span>
            <span class="matrix-name">Todos</span>
            ${totalMarked > 0 ? `<em class="matrix-hit">${totalMarked}</em>` : ''}
          </button>
          ${uniqueBlocks.map((b) => {
            const hits = blockCounts.get(b.bloque) || 0;
            const active = state.selectedBlock === b.bloque;
            return `
              <button type="button" class="matrix-cell ${active ? 'is-selected' : ''} ${hits > 0 ? 'has-hits' : ''}" data-action="select-block" data-block="${esc(b.bloque)}">
                <span class="matrix-code">${esc(b.code)}</span>
                <span class="matrix-name">${esc(b.short)}</span>
                ${hits > 0 ? `<em class="matrix-hit">${hits}</em>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function filterToolbarHtml() {
  const severities = [
    ['ALL', 'Todas'],
    ['L', 'L · Leve'],
    ['D', 'D · Defic.'],
    ['E', 'E · Elimin.']
  ];

  return `
    <div class="filter-toolbar">
      <div class="filter-search">
        <input
          type="search"
          id="catalog-search-input"
          data-search="faults"
          value="${esc(state.query)}"
          placeholder="Filtrar por código (ej. 07.) o texto (intermitente, retrovisor, ceda...)"
          autocomplete="off"
        />
        ${state.query ? '<button type="button" class="clear-x" data-action="clear-fault-query" aria-label="Limpiar texto">×</button>' : ''}
      </div>
      <div class="filter-sev-group" role="group" aria-label="Filtrar gravedad">
        ${severities.map(([code, label]) => `
          <button type="button" class="sev-filter-btn ${state.filter === code ? `is-active is-${code}` : ''}" data-action="filter" data-filter="${code}">
            ${label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function filteredCatalogGroups() {
  const query = normalise(state.query).trim();
  const filter = state.filter;
  const blockFilter = state.selectedBlock;

  const rows = enrichedCatalog.filter((item) => {
    // Si hay texto en el buscador, buscar en todos los bloques para no ocultar resultados
    if (!query && blockFilter !== 'ALL' && item.bloque !== blockFilter) return false;
    if (filter !== 'ALL' && item.tipo !== filter) return false;
    if (!query) return true;
    const haystack = normalise(`${item.code} ${item.falta} ${item.obs} ${item.bloque} ${item.nivel}`);
    return haystack.includes(query);
  });

  const groups = new Map();
  for (const item of rows) {
    if (!groups.has(item.bloque)) groups.set(item.bloque, []);
    groups.get(item.bloque).push(item);
  }
  return groups;
}

function catalogTableInnerHtml() {
  const groups = filteredCatalogGroups();
  const countsById = faultCountsByCatalogId();
  const forceOpen = Boolean(state.query.trim()) || state.filter !== 'ALL' || state.selectedBlock !== 'ALL';

  if (!groups.size) {
    return `
      <div class="empty-row">
        <span>No hay criterios que coincidan con el filtro seleccionado.</span>
        <button type="button" class="t-btn" data-action="reset-fault-filters">Mostrar todos los bloques</button>
      </div>
    `;
  }

  return [...groups.entries()].map(([bloque, items]) => {
    const isOpen = forceOpen || state.openBlocks.has(bloque);
    const markedSum = items.reduce((acc, it) => acc + (countsById.get(it.id) || 0), 0);
    const meta = BLOCK_SHORT_META[bloque];
    const cleanTitle = String(bloque).replace(/^\d+\.\s*/, '').toUpperCase();

    return `
      <details class="dgt-block" data-block="${esc(bloque)}" ${isOpen ? 'open' : ''}>
        <summary class="dgt-block-head">
          <span class="dgt-block-code mono">${esc(meta?.code || '')}</span>
          <span class="dgt-block-title">${esc(cleanTitle)}</span>
          <span class="dgt-block-right">
            ${markedSum > 0 ? `<strong class="block-marked-tag">${markedSum} anot.</strong>` : ''}
            <span class="block-total-count mono">[${items.length}]</span>
          </span>
        </summary>

        <div class="dgt-rows">
          ${items.map((item) => {
            const count = countsById.get(item.id) || 0;
            const itemNotes = count > 0
              ? (state.current?.faults || []).filter((f) => f.faultId === item.id && f.note).map((f) => f.note)
              : [];

            return `
              <div class="dgt-fault-row ${count > 0 ? `is-marked is-marked-${item.tipo}` : ''}" data-fault-row="${item.id}">
                <button type="button" class="fault-cell-info" data-action="open-fault" data-id="${item.id}" title="Pulsar para añadir con nota detallada">
                  <span class="fault-cell-code">
                    <span class="mono code-num">${esc(item.code)}</span>
                    ${severityBox(item.tipo)}
                  </span>
                  <span class="fault-cell-desc">
                    <span class="fault-main-text">${esc(item.falta)}</span>
                    ${item.obs ? `<span class="fault-sub-text">${esc(item.obs)}</span>` : ''}
                    ${itemNotes.length ? `<span class="fault-saved-note">Nota: ${esc(itemNotes.join(' | '))}</span>` : ''}
                  </span>
                </button>

                <div class="fault-cell-stepper">
                  ${count > 0 ? `
                    <button type="button" class="step-btn step-minus" data-action="decrement-fault" data-id="${item.id}" aria-label="Restar falta ${esc(item.code)}">−</button>
                    <span class="step-count mono">${count}</span>
                  ` : ''}
                  <button type="button" class="step-btn step-plus" data-action="quick-add-fault" data-id="${item.id}" aria-label="Anotar falta ${esc(item.code)}">+</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </details>
    `;
  }).join('');
}

function sheetView() {
  return `
    <main class="dgt-sheet">
      ${timersDrawerHtml()}
      ${sheetHeaderFormHtml()}
      <div id="marked-faults-slot">${markedFaultsInlineHtml()}</div>
      <div id="block-matrix-slot">${blockMatrixHtml()}</div>
      <section class="form-section catalog-section">
        ${filterToolbarHtml()}
        <div id="catalog-table-container">
          ${catalogTableInnerHtml()}
        </div>
      </section>
      ${faultNoteModalHtml()}
    </main>
  `;
}

function faultNoteModalHtml() {
  if (!state.openFault) return '';
  const item = catalogById.get(state.openFault);
  if (!item) return '';
  const hits = (state.current?.faults || []).filter((f) => f.faultId === item.id).length;

  return `
    <div class="modal-backdrop" data-action="close-sheet"></div>
    <section class="dgt-modal" role="dialog" aria-modal="true" aria-labelledby="modal-fault-heading">
      <div class="dgt-modal-bar">
        <span>IMPUTACIÓN CON OBSERVACIÓN · CÓD. ${esc(item.code)}</span>
        <button type="button" class="modal-close-x" data-action="close-sheet" aria-label="Cerrar">×</button>
      </div>
      <div class="dgt-modal-body">
        <div class="modal-fault-header">
          ${severityBox(item.tipo)}
          <div>
            <h2 id="modal-fault-heading">${esc(item.falta)}</h2>
            <p class="modal-sub">${esc(item.bloque)} · Gravedad ${esc(levelName(item.tipo))}${hits > 0 ? ` · Anotada ${hits} vez/veces` : ''}</p>
          </div>
        </div>
        ${item.obs ? `<p class="modal-criterion">${esc(item.obs)}</p>` : ''}

        <label class="cell-label mt-10" for="fault-note">OBSERVACIÓN ESPECÍFICA (PUNTO DEL RECORRIDO / DETALLE)</label>
        <textarea id="fault-note" class="bare-textarea framed-input" rows="3" placeholder="Ej.: Glorieta salida 2, no cede paso a vehículo prioritario..."></textarea>

        <div class="modal-actions">
          <button type="button" class="t-btn" data-action="close-sheet">Cancelar</button>
          <button type="button" class="t-btn t-btn-primary" data-action="add-fault-continue" data-id="${item.id}">Imputar falta</button>
        </div>
      </div>
    </section>
  `;
}

function actaView() {
  ensureSimulationShape(state.current);
  const sim = state.current;
  const res = calculateCurrent();
  const timers = sim.timers;
  const records = timers.parking?.records || [];

  return `
    <main class="dgt-sheet acta-sheet">
      <div class="acta-toolbar no-print">
        <button type="button" class="t-btn" data-action="screen" data-screen="sheet">‹ Volver a la Hoja</button>
        <div class="acta-toolbar-right">
          <button type="button" class="t-btn t-btn-primary" data-action="pdf" ${state.pdfBusy ? 'disabled' : ''}>
            ${state.pdfBusy ? 'Generando...' : 'Descargar PDF'}
          </button>
          <button type="button" class="t-btn" data-action="print">Imprimir acta</button>
          ${sim.status === 'finalized' ? `
            <button type="button" class="t-btn" data-action="reopen">Reabrir edición</button>
          ` : `
            <button type="button" class="t-btn t-btn-go" data-action="finalize">Cerrar acta</button>
          `}
        </div>
      </div>

      <section class="official-form">
        <div class="official-title-band">
          <div>
            <strong>ACTA DE EVALUACIÓN · PRUEBA PRÁCTICA DE CIRCULACIÓN</strong>
            <span>PERMISO DE CONDUCCIÓN CLASE B</span>
          </div>
          <span class="official-state-tag">${sim.status === 'finalized' ? 'ACTA CERRADA' : 'EN CURSO'}</span>
        </div>

        <div class="official-grid">
          <div class="off-cell off-span-2">
            <span class="cell-label">ASPIRANTE</span>
            <strong>${esc(sim.studentName || '—')}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">FECHA</span>
            <strong class="mono">${formatDateEs(sim.date, '—')}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">ZONA / RECORRIDO</span>
            <strong>${esc(sim.zone || '—')}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">VEHÍCULO</span>
            <strong class="mono">${esc(sim.vehicle || '—')}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">EVALUADOR / PROFESOR</span>
            <strong>${esc(sim.teacher || '—')}</strong>
          </div>
        </div>

        <div class="official-score-band">
          <div class="off-score-cell">
            <span class="cell-label">FALTAS LEVES (L)</span>
            <strong class="mono">${res.L}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">DEFICIENTES (D)</span>
            <strong class="mono">${res.D}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">ELIMINATORIAS (E)</span>
            <strong class="mono">${res.E}</strong>
          </div>
          <div class="off-score-cell">
            <span class="cell-label">TOTAL FALTAS</span>
            <strong class="mono">${res.total}</strong>
          </div>
          <div class="off-score-cell off-verdict-cell ${res.noApto ? 'is-noapto' : 'is-apto'}">
            <span class="cell-label">CALIFICACIÓN</span>
            <strong>${res.result}</strong>
          </div>
        </div>

        ${res.reasons.length ? `
          <div class="official-cause">
            <strong>MOTIVO DE NO APTO:</strong> ${esc(res.reasons.join(' · '))}.
          </div>
        ` : ''}

        <div class="section-bar">TIEMPOS REGISTRADOS</div>
        <div class="official-times-grid">
          <div class="off-cell">
            <span class="cell-label">DURACIÓN CIRCULACIÓN</span>
            <strong class="mono" data-timer-display="elapsed:exam">${formatClock(effectiveElapsed(timers.exam))}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">${esc((timers.parking?.label || 'MANIOBRA').toUpperCase())}</span>
            <strong class="mono" data-timer-display="elapsed:parking">${formatClock(effectiveElapsed(timers.parking))}</strong>
          </div>
          <div class="off-cell">
            <span class="cell-label">CUENTA ATRÁS RESTANTE</span>
            <strong class="mono" data-timer-display="remaining:countdown">${formatClock(effectiveRemaining(timers.countdown))}</strong>
          </div>
        </div>
        ${records.length ? `
          <div class="official-sublist">
            ${records.map((r) => `<div class="off-subrow"><span>${esc(r.label || 'Maniobra')}</span><strong class="mono">${formatClock(r.elapsedMs)}</strong></div>`).join('')}
          </div>
        ` : ''}

        <div class="section-bar">
          <span>DESGLOSE DE FALTAS CALIFICADAS (${sim.faults.length})</span>
          ${sim.faults.length ? '<button type="button" class="bar-toggle-btn no-print" data-action="clear-current">Vaciar faltas</button>' : ''}
        </div>
        ${sim.faults.length ? `
          <div class="official-faults-table">
            <div class="off-fault-thead">
              <span>Nº</span>
              <span>CÓD.</span>
              <span>TIPO</span>
              <span>DESCRIPCIÓN DEL CRITERIO / OBSERVACIONES</span>
              <span class="no-print"></span>
            </div>
            ${sim.faults.map((f, idx) => {
              const cat = f.faultId != null ? catalogById.get(f.faultId) : null;
              const data = cat || f.snapshot || f;
              const tipo = data.tipo || f.tipo || 'L';
              const code = cat?.code || '—';
              return `
                <div class="off-fault-trow">
                  <span class="mono text-muted">${idx + 1}</span>
                  <span class="mono">${esc(code)}</span>
                  <span>${severityBox(tipo)}</span>
                  <div class="off-fault-desc">
                    <strong>${esc(data.falta || 'Falta')}</strong>
                    <span>${esc(data.bloque || '')} (${esc(levelName(tipo))})</span>
                    ${f.note ? `<div class="off-fault-note">Observación: ${esc(f.note)}</div>` : ''}
                  </div>
                  <button type="button" class="t-link-danger no-print" data-action="remove-fault" data-index="${idx}">Quitar</button>
                </div>
              `;
            }).join('')}
          </div>
        ` : '<div class="empty-row">Sin faltas imputadas en la presente prueba.</div>'}

        <div class="section-bar">OBSERVACIONES GENERALES</div>
        <div class="official-notes-box">
          ${sim.generalNotes ? esc(sim.generalNotes) : '<span class="text-muted">Sin observaciones adicionales.</span>'}
        </div>
      </section>
    </main>
  `;
}

function studentsListInnerHtml() {
  const q = normalise(state.studentQuery).trim();
  const rows = state.students.filter((s) => {
    if (!q) return true;
    return normalise(`${s.name} ${s.phone} ${s.email} ${s.notes}`).includes(q);
  });

  if (!rows.length) {
    return `<div class="empty-row">${state.students.length ? 'Ningún expediente coincide con la búsqueda.' : 'No hay alumnos registrados. Pulsa «+ Alta de alumno» para crear uno.'}</div>`;
  }

  return `
    <div class="data-table">
      <div class="data-thead students-cols">
        <span>ALUMNO / EXPEDIENTE</span>
        <span>CONTACTO</span>
        <span>PRUEBAS</span>
        <span>ÚLTIMA</span>
        <span>ACCIONES</span>
      </div>
      ${rows.map((s) => {
        const exams = simulationsForStudent(s.id);
        const latest = exams[0];
        const latestRes = latest ? evaluateSimulation(latest.faults || []) : null;
        return `
          <div class="data-trow students-cols">
            <div class="cell-primary">
              <strong>${esc(s.name)}</strong>
              ${s.notes ? `<small>${esc(s.notes.slice(0, 70))}${s.notes.length > 70 ? '…' : ''}</small>` : ''}
            </div>
            <div class="cell-secondary">${esc([s.phone, s.email].filter(Boolean).join(' · ') || '—')}</div>
            <div class="cell-mono mono">${exams.length}</div>
            <div>
              ${latestRes
                ? `<span class="verdict-tag ${latestRes.noApto ? 'is-noapto' : 'is-apto'}">${latestRes.result}</span>`
                : '<span class="text-muted">—</span>'}
            </div>
            <div class="cell-actions">
              <button type="button" class="t-btn t-btn-primary" data-action="new-exam-student" data-id="${esc(s.id)}">Abrir hoja</button>
              <button type="button" class="t-btn" data-action="view-student" data-id="${esc(s.id)}">Expediente</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function studentsView() {
  const draft = state.studentDraft;
  return `
    <main class="dgt-sheet">
      <section class="form-section">
        <div class="section-bar">
          <span>DIRECTORIO DE ALUMNOS (${state.students.length})</span>
          <button type="button" class="bar-toggle-btn" data-action="toggle-new-student">
            ${state.showNewStudentForm ? 'Cerrar alta ▴' : '+ Alta de alumno'}
          </button>
        </div>

        ${state.showNewStudentForm ? `
          <div class="new-student-box">
            <div class="meta-grid">
              <div class="meta-cell">
                <label class="cell-label">APELLIDOS Y NOMBRE *</label>
                <input type="text" class="bare-input" data-student-draft="name" value="${esc(draft.name)}" placeholder="Ej.: Martínez Ruiz, Carlos" autocomplete="off" />
              </div>
              <div class="meta-cell">
                <label class="cell-label">TELÉFONO</label>
                <input type="tel" class="bare-input" data-student-draft="phone" value="${esc(draft.phone)}" placeholder="600 000 000" inputmode="tel" autocomplete="off" />
              </div>
              <div class="meta-cell">
                <label class="cell-label">CORREO ELECTRÓNICO</label>
                <input type="email" class="bare-input" data-student-draft="email" value="${esc(draft.email)}" placeholder="correo@ejemplo.es" inputmode="email" autocomplete="off" />
              </div>
              <div class="meta-cell meta-cell-full">
                <label class="cell-label">OBSERVACIONES DE SEGUIMIENTO</label>
                <textarea class="bare-textarea" rows="2" data-student-draft="notes" placeholder="Anotaciones del alumno...">${esc(draft.notes)}</textarea>
              </div>
            </div>
            <div class="form-action-bar">
              <button type="button" class="t-btn" data-action="toggle-new-student">Cancelar</button>
              <button type="button" class="t-btn" data-action="create-student">Guardar ficha</button>
              <button type="button" class="t-btn t-btn-primary" data-action="create-student-and-exam">Guardar y abrir hoja</button>
            </div>
          </div>
        ` : ''}

        <div class="filter-toolbar">
          <div class="filter-search">
            <input type="search" data-search="students" value="${esc(state.studentQuery)}" placeholder="Buscar alumno por nombre, teléfono o notas..." autocomplete="off" />
          </div>
        </div>

        <div id="student-results-container">
          ${studentsListInnerHtml()}
        </div>
      </section>
    </main>
  `;
}

function studentDetailView() {
  const student = selectedStudent();
  if (!student) {
    return `
      <main class="dgt-sheet">
        <section class="form-section">
          <div class="empty-row">
            <span>Expediente no encontrado.</span>
            <button type="button" class="t-btn" data-action="screen" data-screen="students">Volver a alumnos</button>
          </div>
        </section>
      </main>
    `;
  }
  const exams = simulationsForStudent(student.id);

  return `
    <main class="dgt-sheet">
      <div class="acta-toolbar">
        <button type="button" class="t-btn" data-action="screen" data-screen="students">‹ Directorio de alumnos</button>
        <div class="acta-toolbar-right">
          <button type="button" class="t-btn t-btn-danger-text" data-action="delete-student" data-id="${esc(student.id)}">Eliminar ficha</button>
          <button type="button" class="t-btn t-btn-primary" data-action="new-exam-student" data-id="${esc(student.id)}">+ Nueva hoja para este alumno</button>
        </div>
      </div>

      <section class="form-section">
        <div class="section-bar">DATOS DEL EXPEDIENTE (GUARDADO AUTOMÁTICO)</div>
        <div class="meta-grid">
          <div class="meta-cell">
            <label class="cell-label">APELLIDOS Y NOMBRE</label>
            <input type="text" class="bare-input" data-student-field="name" data-id="${esc(student.id)}" value="${esc(student.name)}" autocomplete="off" />
          </div>
          <div class="meta-cell">
            <label class="cell-label">TELÉFONO</label>
            <input type="tel" class="bare-input" data-student-field="phone" data-id="${esc(student.id)}" value="${esc(student.phone)}" inputmode="tel" autocomplete="off" />
          </div>
          <div class="meta-cell">
            <label class="cell-label">CORREO ELECTRÓNICO</label>
            <input type="email" class="bare-input" data-student-field="email" data-id="${esc(student.id)}" value="${esc(student.email)}" inputmode="email" autocomplete="off" />
          </div>
          <div class="meta-cell meta-cell-full">
            <label class="cell-label">NOTAS PEDAGÓGICAS</label>
            <textarea class="bare-textarea" rows="3" data-student-field="notes" data-id="${esc(student.id)}" placeholder="Evolución del alumno...">${esc(student.notes)}</textarea>
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-bar">PRUEBAS REALIZADAS POR EL ALUMNO (${exams.length})</div>
        ${exams.length ? archiveTableHtml(exams) : '<div class="empty-row">Todavía no se han registrado pruebas para este alumno.</div>'}
      </section>
    </main>
  `;
}

function archiveTableHtml(list) {
  return `
    <div class="data-table">
      <div class="data-thead archive-cols">
        <span>FECHA</span>
        <span>ASPIRANTE / ZONA</span>
        <span>CÓMPUTO</span>
        <span>RESULTADO</span>
        <span>ACCIONES</span>
      </div>
      ${list.map((sim) => {
        const res = evaluateSimulation(sim.faults || []);
        const isCurrent = state.currentPersisted && state.current?.id === sim.id;
        return `
          <div class="data-trow archive-cols ${isCurrent ? 'is-active-row' : ''}">
            <div class="cell-mono mono">${formatDateEs(sim.date)}</div>
            <div class="cell-primary">
              <strong>${esc(sim.studentName || 'Sin nombre')} ${isCurrent ? '<em class="open-flag">[ABIERTA]</em>' : ''}</strong>
              <small>${esc(sim.zone || 'Sin recorrido')} · ${sim.status === 'finalized' ? 'Cerrada' : 'En curso'}</small>
            </div>
            <div class="cell-mono mono">${res.L}L · ${res.D}D · ${res.E}E</div>
            <div>
              <span class="verdict-tag ${res.noApto ? 'is-noapto' : 'is-apto'}">${res.result}</span>
            </div>
            <div class="cell-actions">
              <button type="button" class="t-btn t-btn-primary" data-action="load-simulation" data-id="${esc(sim.id)}">Abrir</button>
              <button type="button" class="t-btn" data-action="duplicate" data-id="${esc(sim.id)}">Duplicar</button>
              <button type="button" class="t-btn t-btn-danger-text" data-action="delete" data-id="${esc(sim.id)}">Borrar</button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function filteredArchiveInnerHtml() {
  const q = normalise(state.historyQuery).trim();
  const f = state.historyFilter;
  const rows = state.history.filter((sim) => {
    const res = evaluateSimulation(sim.faults || []);
    if (f === 'APTO' && res.noApto) return false;
    if (f === 'NO_APTO' && !res.noApto) return false;
    if (f === 'DRAFT' && sim.status === 'finalized') return false;
    if (!q) return true;
    return normalise(`${sim.studentName} ${sim.zone} ${sim.vehicle} ${sim.teacher} ${sim.date}`).includes(q);
  });

  if (!rows.length) {
    return `<div class="empty-row">${state.history.length ? 'Ninguna prueba coincide con el filtro.' : 'No hay pruebas guardadas en el archivo.'}</div>`;
  }
  return archiveTableHtml(rows);
}

function archiveView() {
  const filters = [
    ['ALL', 'Todas'],
    ['APTO', 'Aptas'],
    ['NO_APTO', 'No aptas'],
    ['DRAFT', 'Abiertas']
  ];

  return `
    <main class="dgt-sheet">
      <section class="form-section">
        <div class="section-bar">COPIAS DE SEGURIDAD Y ALMACENAMIENTO LOCAL (JSON)</div>
        <div class="backup-bar">
          <span class="backup-note">Datos guardados en IndexedDB local del navegador. Exporta respaldo antes de limpiar datos del navegador.</span>
          <div class="backup-buttons">
            <button type="button" class="t-btn t-btn-primary" data-action="export-all">Exportar todo (.json)</button>
            <button type="button" class="t-btn" data-action="export-json">Exportar hoja actual</button>
            <label class="t-btn file-upload-btn" for="import-json-file">Importar copia (.json)</label>
            <input id="import-json-file" type="file" accept="application/json,.json" data-import="json" class="sr-only-input" />
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-bar">ARCHIVO DE PRUEBAS GUARDADAS (${state.history.length})</div>
        <div class="filter-toolbar">
          <div class="filter-search">
            <input type="search" data-search="history" value="${esc(state.historyQuery)}" placeholder="Buscar por aspirante, zona, matrícula o fecha..." autocomplete="off" />
          </div>
          <div class="filter-sev-group">
            ${filters.map(([code, label]) => `
              <button type="button" class="sev-filter-btn ${state.historyFilter === code ? 'is-active' : ''}" data-action="history-filter" data-filter="${code}">${label}</button>
            `).join('')}
          </div>
        </div>
        <div id="history-results-container">
          ${filteredArchiveInnerHtml()}
        </div>
      </section>
    </main>
  `;
}

function updateScoreStripDom() {
  const res = calculateCurrent();
  const lEl = document.querySelector('#tally-L');
  const dEl = document.querySelector('#tally-D');
  const eEl = document.querySelector('#tally-E');
  const vEl = document.querySelector('#tally-verdict');
  if (lEl) lEl.textContent = String(res.L);
  if (dEl) dEl.textContent = String(res.D);
  if (eEl) eEl.textContent = String(res.E);
  if (vEl) {
    vEl.textContent = res.result;
    vEl.className = `inst-verdict ${res.noApto ? 'is-noapto' : 'is-apto'}`;
  }
}

function updateSheetFaultPartials() {
  updateScoreStripDom();
  const markedSlot = document.querySelector('#marked-faults-slot');
  if (markedSlot) markedSlot.innerHTML = markedFaultsInlineHtml();
  const matrixSlot = document.querySelector('#block-matrix-slot');
  if (matrixSlot) matrixSlot.innerHTML = blockMatrixHtml();
  const tableContainer = document.querySelector('#catalog-table-container');
  if (tableContainer) tableContainer.innerHTML = catalogTableInnerHtml();
}

function render() {
  if (!state.current) {
    state.current = ensureSimulationShape(emptySimulation());
    state.currentPersisted = false;
  }

  const views = {
    sheet: sheetView,
    acta: actaView,
    students: studentsView,
    'student-detail': studentDetailView,
    archive: archiveView
  };

  app.innerHTML = `
    ${topChromeHtml()}
    ${alertBannerHtml()}
    ${(views[state.screen] || sheetView)()}
    <div id="status-toast">${state.toast ? `<div class="dgt-toast" role="status">${esc(state.toast)}</div>` : ''}</div>
  `;
  updateTimerDisplays();
  syncTimerLoop();
}

async function refreshData() {
  state.students = (await listStudents()).map(ensureStudentShape).filter(Boolean);
  state.history = (await listSimulations()).map(ensureSimulationShape).filter(Boolean);
}

async function persistCurrent() {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  state.current.updatedAt = nowIso();
  if (state.current.studentId) {
    const student = state.students.find((item) => item.id === state.current.studentId);
    if (student) state.current.studentName = student.name;
  }
  await putSimulation(state.current);
  state.currentPersisted = true;
  await putSetting('currentSimulationId', state.current.id);
  await refreshData();
  // Actualizar contadores de las pestañas superiores sin reconstruir el DOM activo
  const archiveTab = document.querySelector('[data-screen="archive"]');
  if (archiveTab) archiveTab.textContent = `Archivo (${state.history.length})`;
  const studentsTab = document.querySelector('[data-screen="students"]');
  if (studentsTab) studentsTab.textContent = `Alumnos (${state.students.length})`;
}

let persistDebounceTimer;
function schedulePersistCurrent(delay = 280) {
  window.clearTimeout(persistDebounceTimer);
  persistDebounceTimer = window.setTimeout(() => {
    persistCurrent().catch((error) => showUserError(error, 'save'));
  }, delay);
}

let studentPersistDebounceTimer;
function scheduleStudentPersist(student, delay = 280) {
  window.clearTimeout(studentPersistDebounceTimer);
  studentPersistDebounceTimer = window.setTimeout(async () => {
    try {
      student.updatedAt = nowIso();
      await putStudent(student);
      await refreshData();
      if (state.current?.studentId === student.id) {
        state.current.studentName = student.name;
        if (state.currentPersisted) await persistCurrent();
      }
    } catch (error) {
      showUserError(error, 'save');
    }
  }, delay);
}

async function pauseAndSaveActiveIfNeeded() {
  if (!state.current || !state.currentPersisted) return true;
  if (hasRunningTimers(state.current.timers)) {
    const ok = window.confirm('La hoja actual tiene un cronómetro en marcha. ¿Detenerlo y abrir otra hoja?');
    if (!ok) return false;
    pauseAllTimers(state.current.timers);
  }
  await persistCurrent();
  return true;
}

async function updateField(target, { immediate = false } = {}) {
  const field = target.dataset.field;
  if (!field || !state.current) return;
  state.current[field] = target.value;

  if (field === 'studentName') {
    const trimmed = target.value.trim();
    const match = trimmed ? state.students.find((s) => normalise(s.name) === normalise(trimmed)) : null;
    state.current.studentId = match ? match.id : null;
    if (match && immediate) state.current.studentName = match.name;
  }

  if (immediate) await persistCurrent();
  else schedulePersistCurrent();
}

function updateStudentDraft(target) {
  const field = target.dataset.studentDraft;
  if (!field) return;
  state.studentDraft[field] = target.value;
}

async function updateStudentField(target, { immediate = false } = {}) {
  const id = target.dataset.id;
  const field = target.dataset.studentField;
  const student = state.students.find((item) => item.id === id);
  if (!student || !field) return;
  student[field] = target.value;
  if (immediate) {
    student.updatedAt = nowIso();
    await putStudent(student);
    await refreshData();
    if (state.current?.studentId === student.id) {
      state.current.studentName = student.name;
      if (state.currentPersisted) await persistCurrent();
    }
  } else {
    scheduleStudentPersist(student);
  }
}

function handleTimerInput(target, { immediate = false } = {}) {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const key = target.dataset.timerInput;
  if (key === 'parkingLabel') {
    state.current.timers.parking.label = target.value;
  }
  if (key === 'countdownMinutes') {
    applyCountdownDuration(target.value, { renderAfter: immediate });
  }
  if (immediate) persistCurrent().catch((error) => showUserError(error, 'save'));
  else schedulePersistCurrent();
}

async function createStudent({ startExam = false } = {}) {
  const name = String(state.studentDraft.name || '').trim();
  if (!name) {
    setUserAlert('Campo obligatorio', 'Introduce apellidos y nombre del alumno.', { code: 'STUDENT_NAME_REQUIRED' });
    return;
  }
  const existing = state.students.find((s) => normalise(s.name) === normalise(name));
  if (existing) {
    const proceed = window.confirm(`Ya figura un expediente para «${existing.name}». ¿Crear otro igualmente?`);
    if (!proceed) return;
  }
  const student = emptyStudent({
    name,
    phone: String(state.studentDraft.phone || '').trim(),
    email: String(state.studentDraft.email || '').trim(),
    notes: String(state.studentDraft.notes || '').trim()
  });
  await putStudent(student);
  state.studentDraft = emptyStudentDraft();
  state.showNewStudentForm = false;
  await refreshData();
  state.selectedStudentId = student.id;
  setToast('Expediente guardado');
  if (startExam) {
    await startSimulationForStudent(student.id);
  } else {
    render();
  }
}

async function removeStudent(studentId) {
  const student = state.students.find((s) => s.id === studentId);
  if (!student) return;
  const exams = simulationsForStudent(studentId);
  const msg = exams.length
    ? `¿Eliminar la ficha de «${student.name}»? Sus ${exams.length} prueba(s) permanecerán en el Archivo.`
    : `¿Eliminar la ficha de «${student.name}»?`;
  if (!window.confirm(msg)) return;

  for (const sim of exams) {
    sim.studentId = null;
    if (!sim.studentName) sim.studentName = student.name;
    await putSimulation(sim);
  }
  if (state.current?.studentId === studentId) {
    state.current.studentId = null;
    if (!state.current.studentName) state.current.studentName = student.name;
    if (state.currentPersisted) await persistCurrent();
  }
  await deleteStudent(studentId);
  if (state.selectedStudentId === studentId) state.selectedStudentId = null;
  await refreshData();
  setToast('Ficha eliminada');
  navigateTo('students');
}

async function startSimulationForStudent(studentId) {
  const canSwitch = await pauseAndSaveActiveIfNeeded();
  if (!canSwitch) return;
  const student = state.students.find((item) => item.id === studentId) || await getStudent(studentId);
  if (!student) {
    setUserAlert('Alumno no encontrado', 'No existe la ficha solicitada.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(emptySimulation(student));
  state.selectedStudentId = student.id;
  await persistCurrent();
  setToast(`Hoja abierta: ${student.name}`);
  navigateTo('sheet');
}

async function startBlankSheet() {
  const hasWork = state.current && (
    state.current.faults?.length > 0 ||
    Boolean(state.current.studentName?.trim()) ||
    hasRunningTimers(state.current.timers) ||
    effectiveElapsed(state.current.timers?.exam) > 0
  );

  if (hasWork && state.current.status !== 'finalized') {
    const ok = window.confirm('¿Abrir una nueva hoja de calificación en blanco? La actual quedará guardada en el Archivo.');
    if (!ok) return;
    pauseAllTimers(state.current.timers);
    await persistCurrent();
  }

  state.current = ensureSimulationShape(emptySimulation());
  state.currentPersisted = false;
  await putSetting('currentSimulationId', null);
  syncTimerLoop();
  setToast('Nueva hoja en blanco');
  navigateTo('sheet');
}

async function viewStudent(id) {
  const student = state.students.find((item) => item.id === id) || await getStudent(id);
  if (!student) {
    setUserAlert('Expediente no encontrado', 'La ficha ya no existe.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.selectedStudentId = student.id;
  navigateTo('student-detail');
}

async function recordFault(id, { note = '' } = {}) {
  const item = catalogById.get(Number(id));
  if (!item) return;
  if (state.current.status === 'finalized') state.current.status = 'draft';

  state.current.faults.push({
    uid: makeId('fault'),
    faultId: item.id,
    tipo: item.tipo,
    note,
    snapshot: { ...item },
    createdAt: nowIso()
  });

  const hadModal = Boolean(state.openFault);
  state.openFault = null;
  await persistCurrent();
  setToast(`+${item.code} [${item.tipo}] anotada`);

  if (state.screen === 'sheet' && !hadModal) {
    updateSheetFaultPartials();
  } else {
    render();
  }
}

async function decrementFaultByCatalogId(id) {
  const faultId = Number(id);
  const faults = state.current?.faults || [];
  for (let i = faults.length - 1; i >= 0; i -= 1) {
    if (faults[i].faultId === faultId) {
      const removed = faults.splice(i, 1)[0];
      const item = catalogById.get(faultId);
      await persistCurrent();
      setToast(`−${item?.code || ''} [${removed.tipo}] retirada`);
      if (state.screen === 'sheet') updateSheetFaultPartials();
      else render();
      return;
    }
  }
}

function setTimerStatus(key, running) {
  if (!state.current?.timers?.[key]) return null;
  const timer = state.current.timers[key];
  if (running && !timer.running) {
    if (state.current.status === 'finalized') state.current.status = 'draft';
    timer.running = true;
    timer.startedAt = currentTimestamp();
  }
  if (!running && timer.running) {
    timer.elapsedMs = effectiveElapsed(timer);
    timer.running = false;
    timer.startedAt = null;
  }
  return timer;
}

async function startStopwatch(key) {
  ensureSimulationShape(state.current);
  setTimerStatus(key, true);
  await persistCurrent();
  syncTimerLoop();
  updateTimerDisplays();
  refreshTimerControls(key);
}

async function pauseStopwatch(key) {
  ensureSimulationShape(state.current);
  setTimerStatus(key, false);
  await persistCurrent();
  syncTimerLoop();
  updateTimerDisplays();
  refreshTimerControls(key);
}

async function resetStopwatch(key) {
  ensureSimulationShape(state.current);
  const timer = state.current.timers[key];
  if (!timer) return;
  timer.elapsedMs = 0;
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  syncTimerLoop();
  updateTimerDisplays();
  refreshTimerControls(key);
}

async function saveParkingRecord() {
  ensureSimulationShape(state.current);
  const timer = state.current.timers.parking;
  const elapsedMs = effectiveElapsed(timer);
  if (elapsedMs <= 0) return;
  timer.records.unshift({
    id: makeId('time'),
    label: String(timer.label || 'Maniobra').trim() || 'Maniobra',
    elapsedMs,
    note: '',
    createdAt: nowIso()
  });
  timer.elapsedMs = 0;
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  syncTimerLoop();
  setToast('Marca de maniobra guardada');
  render();
}

async function removeTimeRecord(id) {
  ensureSimulationShape(state.current);
  state.current.timers.parking.records = state.current.timers.parking.records.filter((r) => r.id !== id);
  await persistCurrent();
  render();
}

function applyCountdownDuration(value, { renderAfter = false } = {}) {
  ensureSimulationShape(state.current);
  const minutes = validateCountdownMinutes(value);
  const countdown = state.current.timers.countdown;
  countdown.durationMs = minutes * 60 * 1000;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
  syncTimerLoop();
  if (renderAfter) render();
}

async function startCountdown() {
  ensureSimulationShape(state.current);
  if (state.current.status === 'finalized') state.current.status = 'draft';
  const countdown = state.current.timers.countdown;
  if (effectiveRemaining(countdown) <= 0) countdown.remainingMs = countdown.durationMs;
  countdown.running = true;
  countdown.startedAt = currentTimestamp();
  countdown.endedAt = null;
  await persistCurrent();
  syncTimerLoop();
  document.querySelector('.timer-cell-full')?.classList.remove('is-expired');
  updateTimerDisplays();
  refreshTimerControls('countdown');
}

async function pauseCountdown() {
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  countdown.remainingMs = effectiveRemaining(countdown);
  countdown.running = false;
  countdown.startedAt = null;
  await persistCurrent();
  syncTimerLoop();
  updateTimerDisplays();
  refreshTimerControls('countdown');
}

async function resetCountdown() {
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
  await persistCurrent();
  syncTimerLoop();
  document.querySelector('.timer-cell-full')?.classList.remove('is-expired');
  updateTimerDisplays();
  refreshTimerControls('countdown');
}

function updateTimerDisplays() {
  if (!state.current) return;
  const timers = state.current.timers;
  document.querySelectorAll('[data-timer-display]').forEach((node) => {
    const [mode, key, variant] = node.dataset.timerDisplay.split(':');
    const timer = timers[key];
    if (!timer) return;
    const ms = mode === 'remaining' ? effectiveRemaining(timer) : effectiveElapsed(timer);
    node.innerHTML = formatClock(ms, { showTenths: variant !== 'compact' });
    if (key === 'exam' && variant === 'compact') {
      node.classList.toggle('is-running', Boolean(timer.running));
    }
  });

  const countdown = timers.countdown;
  if (countdown?.running && effectiveRemaining(countdown) <= 0) {
    countdown.running = false;
    countdown.remainingMs = 0;
    countdown.startedAt = null;
    countdown.endedAt = nowIso();
    syncTimerLoop();
    persistCurrent().catch((error) => showUserError(error, 'save'));
    playCountdownAlert();
    setToast('FIN DE TIEMPO REGLAMENTARIO');
    document.querySelector('.timer-cell-full')?.classList.add('is-expired');
    refreshTimerControls('countdown');
  }
}

async function loadSimulation(id) {
  if (state.current?.id !== id) {
    const canSwitch = await pauseAndSaveActiveIfNeeded();
    if (!canSwitch) return;
  }
  const sim = await getSimulation(id);
  if (!sim) {
    setUserAlert('Prueba no encontrada', 'El registro ya no figura en el archivo.', { code: 'SIMULATION_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(sim);
  state.currentPersisted = true;
  state.selectedStudentId = sim.studentId || null;
  await putSetting('currentSimulationId', sim.id);
  navigateTo(sim.status === 'finalized' ? 'acta' : 'sheet');
}

async function duplicateSimulation(id) {
  const canSwitch = await pauseAndSaveActiveIfNeeded();
  if (!canSwitch) return;
  const original = await getSimulation(id);
  if (!original) return;
  const timersCopy = sanitizeTimers(original.timers, { makeId, nowIso });
  pauseAllTimers(timersCopy);
  const copy = ensureSimulationShape({
    ...original,
    id: makeId('sim'),
    date: localTodayIso(),
    timers: timersCopy,
    faults: (original.faults || []).map((f) => ({ ...f, uid: makeId('fault') })),
    status: 'draft',
    createdAt: nowIso(),
    updatedAt: nowIso()
  });
  await putSimulation(copy);
  state.current = copy;
  state.currentPersisted = true;
  state.selectedStudentId = copy.studentId || null;
  await refreshData();
  await putSetting('currentSimulationId', copy.id);
  setToast('Hoja duplicada');
  navigateTo('sheet');
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.append(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function migrateExistingSimulationsToStudents() {
  await refreshData();
  const studentsByName = new Map(state.students.map((student) => [normalise(student.name), student]));
  let changed = false;
  for (const sim of state.history) {
    if (sim.studentId || !String(sim.studentName || '').trim()) continue;
    const key = normalise(sim.studentName.trim());
    let student = studentsByName.get(key);
    if (!student) {
      student = emptyStudent({
        name: sim.studentName.trim(),
        createdAt: sim.createdAt || nowIso(),
        updatedAt: nowIso()
      });
      await putStudent(student);
      studentsByName.set(key, student);
    }
    sim.studentId = student.id;
    await putSimulation(sim);
    changed = true;
  }
  if (changed) await refreshData();
}

async function handleImport(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    validateImportFile(file);
    const text = await file.text();
    const payload = JSON.parse(text);
    const { simulations, students, invalidIndexes } = extractSimulationsFromImport(payload);

    let studentsSaved = 0;
    for (const rawStudent of students) {
      const normalized = normalizeImportedStudent(rawStudent, { makeId, nowIso });
      if (normalized) {
        await putStudent(normalized);
        studentsSaved += 1;
      }
    }

    for (const rawSim of simulations) {
      const normalized = ensureSimulationShape(normalizeImportedSimulation(rawSim, { makeId, nowIso, catalogById }));
      await putSimulation(normalized);
    }

    await migrateExistingSimulationsToStudents();
    await refreshData();

    if (state.currentPersisted && state.current) {
      const refreshed = await getSimulation(state.current.id);
      if (refreshed) state.current = ensureSimulationShape(refreshed);
    } else if (state.history.length) {
      state.current = ensureSimulationShape(state.history[0]);
      state.currentPersisted = true;
      await putSetting('currentSimulationId', state.current.id);
    }

    const skipped = invalidIndexes.length ? ` (${invalidIndexes.length} omitidas)` : '';
    setToast(`Importadas ${simulations.length} pruebas y ${studentsSaved} fichas${skipped}`);
    render();
  } catch (error) {
    showUserError(error, 'import');
  } finally {
    input.value = '';
  }
}

async function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'clear-alert') {
    clearUserAlert();
    return;
  }
  clearUserAlert();

  if (action === 'screen') {
    navigateTo(target.dataset.screen);
    return;
  }

  if (action === 'new-sheet') return startBlankSheet();

  if (action === 'toggle-header-meta') {
    state.showHeaderMeta = !state.showHeaderMeta;
    render();
    return;
  }

  if (action === 'toggle-timers') {
    state.showTimersDrawer = !state.showTimersDrawer;
    render();
    return;
  }

  if (action === 'toggle-block-grid') {
    state.showBlockGrid = !state.showBlockGrid;
    const slot = document.querySelector('#block-matrix-slot');
    if (slot) slot.innerHTML = blockMatrixHtml();
    return;
  }

  if (action === 'toggle-new-student') {
    state.showNewStudentForm = !state.showNewStudentForm;
    render();
    return;
  }

  if (action === 'select-block') {
    const blk = target.dataset.block;
    state.selectedBlock = (state.selectedBlock === blk && blk !== 'ALL') ? 'ALL' : blk;
    const matrixSlot = document.querySelector('#block-matrix-slot');
    if (matrixSlot) matrixSlot.innerHTML = blockMatrixHtml();
    const tableContainer = document.querySelector('#catalog-table-container');
    if (tableContainer) tableContainer.innerHTML = catalogTableInnerHtml();
    return;
  }

  if (action === 'filter') {
    state.filter = target.dataset.filter;
    render();
    return;
  }

  if (action === 'clear-fault-query') {
    state.query = '';
    render();
    document.querySelector('#catalog-search-input')?.focus();
    return;
  }

  if (action === 'reset-fault-filters') {
    state.query = '';
    state.filter = 'ALL';
    state.selectedBlock = 'ALL';
    render();
    return;
  }

  if (action === 'history-filter') {
    state.historyFilter = target.dataset.filter;
    render();
    return;
  }

  if (action === 'create-student') return createStudent({ startExam: false });
  if (action === 'create-student-and-exam') return createStudent({ startExam: true });
  if (action === 'delete-student') return removeStudent(target.dataset.id);
  if (action === 'view-student') return viewStudent(target.dataset.id);
  if (action === 'new-exam-student') return startSimulationForStudent(target.dataset.id);

  if (action === 'open-fault') {
    state.openFault = Number(target.dataset.id);
    render();
    document.querySelector('#fault-note')?.focus();
    return;
  }

  if (action === 'close-sheet') {
    state.openFault = null;
    render();
    return;
  }

  if (action === 'quick-add-fault') {
    return recordFault(target.dataset.id);
  }

  if (action === 'decrement-fault') {
    return decrementFaultByCatalogId(target.dataset.id);
  }

  if (action === 'add-fault-continue') {
    const note = document.querySelector('#fault-note')?.value?.trim() || '';
    return recordFault(target.dataset.id, { note });
  }

  if (action === 'remove-fault') {
    const index = Number(target.dataset.index);
    if (!state.current || !Number.isInteger(index) || index < 0 || index >= state.current.faults.length) return;
    state.current.faults.splice(index, 1);
    await persistCurrent();
    if (state.screen === 'sheet') updateSheetFaultPartials();
    else render();
    return;
  }

  if (action === 'timer-start') return startStopwatch(target.dataset.timer);
  if (action === 'timer-pause') return pauseStopwatch(target.dataset.timer);
  if (action === 'timer-reset') return resetStopwatch(target.dataset.timer);
  if (action === 'timer-save-record') return saveParkingRecord();
  if (action === 'remove-time-record') return removeTimeRecord(target.dataset.id);

  if (action === 'set-countdown') {
    applyCountdownDuration(target.dataset.minutes);
    await persistCurrent();
    render();
    return;
  }
  if (action === 'countdown-start') return startCountdown();
  if (action === 'countdown-pause') return pauseCountdown();
  if (action === 'countdown-reset') return resetCountdown();

  if (action === 'load-simulation') return loadSimulation(target.dataset.id);
  if (action === 'duplicate') return duplicateSimulation(target.dataset.id);

  if (action === 'delete') {
    if (!window.confirm('¿Eliminar definitivamente esta prueba del archivo?')) return;
    const deletedId = target.dataset.id;
    await deleteSimulation(deletedId);
    if (state.current?.id === deletedId) {
      state.current = ensureSimulationShape(emptySimulation());
      state.currentPersisted = false;
      await putSetting('currentSimulationId', null);
      syncTimerLoop();
    }
    await refreshData();
    setToast('Registro eliminado');
    render();
    return;
  }

  if (action === 'pdf') {
    try {
      const warnings = validateSimulationForPdf(state.current);
      if (warnings.length) {
        const ok = window.confirm(`${warnings.join(' ')} ¿Generar PDF igualmente?`);
        if (!ok) return;
      }
      state.pdfBusy = true;
      render();
      await persistCurrent();
      const { downloadSimulationPdf } = await import('./pdf.js');
      downloadSimulationPdf(state.current, catalogById);
      setToast('PDF generado');
    } catch (error) {
      showUserError(error, 'pdf');
    } finally {
      state.pdfBusy = false;
      render();
    }
    return;
  }

  if (action === 'print') {
    window.print();
    return;
  }

  if (action === 'export-json') {
    try {
      if (!state.current) throw userError('No hay hoja abierta.', { title: 'Sin hoja activa', code: 'NO_CURRENT_SIMULATION' });
      await persistCurrent();
      downloadJson(state.current, `Hoja_PermisoB_${state.current.date || localTodayIso()}.json`);
      setToast('Hoja exportada');
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'export-all') {
    try {
      if (state.currentPersisted && state.current) await persistCurrent();
      await refreshData();
      downloadJson(
        { exportedAt: nowIso(), version: '0.6.0', students: state.students, simulations: state.history },
        `Archivo_PermisoB_${localTodayIso()}.json`
      );
      setToast('Archivo exportado');
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'finalize') {
    pauseAllTimers(state.current.timers);
    state.current.status = 'finalized';
    await persistCurrent();
    syncTimerLoop();
    setToast('Acta cerrada');
    render();
    return;
  }

  if (action === 'reopen') {
    state.current.status = 'draft';
    await persistCurrent();
    setToast('Acta reabierta');
    render();
    return;
  }

  if (action === 'clear-current') {
    if (!state.current?.faults?.length) return;
    if (!window.confirm('¿Anular todas las faltas anotadas en la hoja actual?')) return;
    state.current.faults = [];
    await persistCurrent();
    if (state.screen === 'sheet') updateSheetFaultPartials();
    else render();
  }
}

app.addEventListener('input', (event) => {
  const target = event.target;
  if (target.dataset.field) updateField(target);
  if (target.dataset.studentDraft) updateStudentDraft(target);
  if (target.dataset.studentField) updateStudentField(target);
  if (target.dataset.timerInput) handleTimerInput(target);

  if (target.dataset.search === 'faults') {
    state.query = target.value;
    const container = document.querySelector('#catalog-table-container');
    if (container) container.innerHTML = catalogTableInnerHtml();
  } else if (target.dataset.search === 'students') {
    state.studentQuery = target.value;
    const container = document.querySelector('#student-results-container');
    if (container) container.innerHTML = studentsListInnerHtml();
  } else if (target.dataset.search === 'history') {
    state.historyQuery = target.value;
    const container = document.querySelector('#history-results-container');
    if (container) container.innerHTML = filteredArchiveInnerHtml();
  }
});

app.addEventListener('change', async (event) => {
  const target = event.target;
  try {
    if (target.dataset.field) await updateField(target, { immediate: true });
    if (target.dataset.studentField) await updateStudentField(target, { immediate: true });
    if (target.dataset.timerInput) handleTimerInput(target, { immediate: true });
    if (target.dataset.import === 'json') await handleImport(target);
    if (target.dataset.toggle === 'wake-lock') {
      state.wakeLockEnabled = Boolean(target.checked);
      await putSetting('wakeLockEnabled', state.wakeLockEnabled);
      await syncWakeLock();
      setToast(state.wakeLockEnabled ? 'Pantalla activa fijada' : 'Bloqueo normal de pantalla');
    }
  } catch (error) {
    showUserError(error, 'general');
  }
});

app.addEventListener('toggle', (event) => {
  const details = event.target;
  if (!(details instanceof HTMLDetailsElement) || !details.classList.contains('dgt-block')) return;
  if (state.query.trim() || state.filter !== 'ALL' || state.selectedBlock !== 'ALL') return;
  const block = details.dataset.block;
  if (!block) return;
  if (details.open) state.openBlocks.add(block);
  else state.openBlocks.delete(block);
}, true);

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const tag = target.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || tag === 'LABEL') return;
  event.preventDefault();
  handleAction(target).catch((error) => showUserError(error, 'general'));
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.openFault) {
    state.openFault = null;
    render();
  }
});

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') updateTimerDisplays();
  syncTimerLoop();
});

async function initServiceWorker() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      reg.update().catch(() => {});
    } catch (error) {
      console.warn('Service worker no registrado', error);
    }
  }
}

async function init() {
  const catalogErrors = validateCatalog(catalog);
  if (catalogErrors.length) {
    setUserAlert('Catálogo con avisos', `Se detectaron ${catalogErrors.length} avisos en el catálogo.`, { code: 'CATALOG_WARNINGS' });
  }
  await openDatabase();
  state.wakeLockEnabled = Boolean(await getSetting('wakeLockEnabled', false));
  await migrateExistingSimulationsToStudents();
  await refreshData();

  const currentId = await getSetting('currentSimulationId');
  if (currentId) {
    const saved = await getSimulation(currentId);
    if (saved) {
      state.current = ensureSimulationShape(saved);
      state.currentPersisted = true;
    }
  }
  if (!state.current) {
    state.current = ensureSimulationShape(emptySimulation());
    state.currentPersisted = false;
  }

  state.screen = 'sheet';
  render();
  initServiceWorker();
}

window.addEventListener('error', (event) => {
  showUserError(event.error || event.message, 'general');
});

window.addEventListener('unhandledrejection', (event) => {
  showUserError(event.reason, 'general');
});

init().catch((error) => {
  const friendly = friendlyError(error, 'init');
  app.innerHTML = `
    <main class="dgt-sheet startup-error">
      <div class="dgt-alert" role="alert">
        <div class="dgt-alert-text">
          <strong>${esc(friendly.title || 'Error de inicio')}:</strong> ${esc(friendly.message)}
          <span class="dgt-code">[${esc(friendly.code || 'INIT_ERROR')}]</span>
        </div>
      </div>
    </main>
  `;
});
