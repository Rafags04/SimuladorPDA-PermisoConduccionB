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
const catalogById = new Map(catalog.map((item) => [item.id, item]));
const DEFAULT_COUNTDOWN_MINUTES = 25;

const ICONS = {
  home: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5.5v-6.5h-5V21H4a1 1 0 0 1-1-1v-9.5Z"/></svg>',
  users: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/></svg>',
  exam: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v6.5M4.2 16.5l5.6-3.2M19.8 16.5l-5.6-3.2"/></svg>',
  faults: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  summary: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8M8 9h2"/></svg>',
  history: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>',
  settings: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.08a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>',
  back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" stroke="none"/></svg>',
  reset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
  flag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22v-7"/></svg>',
  download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/></svg>',
  upload: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/></svg>',
  print: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  screen: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/></svg>'
};

const state = {
  screen: 'home',
  previousScreen: 'home',
  catalog,
  current: null,
  history: [],
  students: [],
  selectedStudentId: null,
  query: '',
  studentQuery: '',
  historyQuery: '',
  historyFilter: 'ALL',
  filter: 'ALL',
  openBlocks: new Set(),
  openFault: null,
  toast: '',
  userAlert: null,
  installedHintDismissed: false,
  pdfBusy: false,
  wakeLockEnabled: false,
  wakeLockSentinel: null,
  studentDraft: emptyStudentDraft()
};

const nowIso = () => new Date().toISOString();
const currentTimestamp = () => Date.now();
let timerIntervalId = null;

function isStandaloneMode() {
  return Boolean(
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator?.standalone === true
  );
}

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
  const main = hours > 0 ? `${String(hours).padStart(2, '0')}:${mm}:${ss}` : `${mm}:${ss}`;
  if (!showTenths) return esc(main);
  return `${esc(main)}<span class="clock-tenths">.${tenths}</span>`;
}

function countdownMinutes(timer) {
  return Math.max(1, Math.round(Number(timer?.durationMs || DEFAULT_COUNTDOWN_MINUTES * 60 * 1000) / 60000));
}

function playCountdownAlert() {
  try {
    if (navigator.vibrate) navigator.vibrate([220, 100, 220, 100, 320]);
  } catch {
    // Ignorar si el navegador bloquea vibración
  }
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const beep = (startOffset, freq, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + startOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration + 0.02);
    };
    beep(0, 880, 0.18);
    beep(0.24, 880, 0.18);
    beep(0.48, 1046, 0.28);
    window.setTimeout(() => ctx.close().catch(() => {}), 1200);
  } catch {
    // Audio no disponible sin interacción previa
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
    // Permiso denegado o batería baja en iOS/Android
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

function navigateTo(screen) {
  if (screen !== state.screen) {
    state.previousScreen = state.screen;
    state.screen = screen;
  }
  state.openFault = null;
  render();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function setToast(message) {
  state.toast = message;
  const existing = document.querySelector('#toast-root');
  if (existing) {
    existing.innerHTML = toastInnerHtml();
  } else {
    render();
  }
  if (message) {
    window.clearTimeout(setToast.timer);
    setToast.timer = window.setTimeout(() => {
      state.toast = '';
      const root = document.querySelector('#toast-root');
      if (root) root.innerHTML = '';
    }, 2500);
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

function badge(tipo) {
  const safe = ['L', 'D', 'E'].includes(tipo) ? tipo : 'L';
  return `<span class="fault-tag fault-tag-${safe}" title="${esc(levelName(safe))}">${safe}</span>`;
}

function statusPill(result, compact = false) {
  const cls = result.noApto ? 'status-noapto' : 'status-apto';
  return `<span class="status-badge ${cls} ${compact ? 'is-compact' : ''}">${result.result}</span>`;
}

function alertHtml() {
  if (!state.userAlert) return '';
  const alert = state.userAlert;
  return `
    <div class="alert-banner alert-${esc(alert.type)}" role="alert" aria-live="assertive">
      <div class="alert-body">
        <strong>${esc(alert.title)}</strong>
        <p>${esc(alert.message)}</p>
        ${alert.code ? `<span class="alert-code">Ref: ${esc(alert.code)}</span>` : ''}
      </div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="clear-alert">Cerrar</button>
    </div>
  `;
}

function topBar() {
  const student = selectedStudent();
  const titles = {
    home: 'Registro PDA · Permiso B',
    'student-new': 'Alta de alumno',
    students: 'Alumnos',
    'student-detail': student?.name || 'Ficha de alumno',
    sim: 'Datos y tiempos',
    faults: 'Catálogo de faltas',
    summary: 'Informe de prueba',
    history: 'Historial',
    settings: 'Ajustes y copias'
  };
  const subtitles = {
    home: 'Evaluación práctica de circulación',
    'student-new': 'Nuevo expediente local',
    students: `${state.students.length} registrado${state.students.length === 1 ? '' : 's'}`,
    'student-detail': 'Expediente e historial',
    sim: state.current ? (state.current.studentName || 'Examen libre') : 'Sin prueba activa',
    faults: state.current ? (state.current.studentName || 'Examen libre') : 'Consulta de criterios',
    summary: state.current ? `${formatDateEs(state.current.date)}${state.current.zone ? ` · ${state.current.zone}` : ''}` : 'Sin prueba activa',
    history: `${state.history.length} prueba${state.history.length === 1 ? '' : 's'} guardada${state.history.length === 1 ? '' : 's'}`,
    settings: 'Almacenamiento local y respaldos'
  };

  const showBack = state.screen !== 'home';
  const currentRes = state.current ? calculateCurrent() : null;

  const desktopLinks = [
    ['home', 'Inicio'],
    ['students', 'Alumnos'],
    ['sim', 'Prueba'],
    ['faults', 'Faltas'],
    ['summary', 'Informe'],
    ['history', 'Historial'],
    ['settings', 'Ajustes']
  ];

  return `
    <header class="topbar">
      <div class="topbar-inner">
        <div class="topbar-left">
          ${showBack ? `<button type="button" class="icon-btn" data-action="go-back" aria-label="Volver">${ICONS.back}</button>` : '<span class="brand-mark" aria-hidden="true">B</span>'}
          <div class="topbar-titles">
            <h1>${esc(titles[state.screen] || 'Permiso B')}</h1>
            <p>${esc(subtitles[state.screen] || '')}</p>
          </div>
        </div>

        <nav class="desktop-nav" aria-label="Navegación principal">
          ${desktopLinks.map(([scr, label]) => `
            <button type="button" class="desktop-nav-link ${state.screen === scr || (scr === 'students' && ['student-detail', 'student-new'].includes(state.screen)) ? 'is-active' : ''}" data-action="screen" data-screen="${scr}">
              ${label}
            </button>
          `).join('')}
        </nav>

        ${currentRes ? `
          <button type="button" class="topbar-status ${currentRes.noApto ? 'is-danger' : 'is-ok'}" data-action="screen" data-screen="summary" title="Ver informe de la prueba activa">
            <span class="topbar-counts">${currentRes.L}L · ${currentRes.D}D · ${currentRes.E}E</span>
            <strong>${currentRes.result}</strong>
          </button>
        ` : ''}
      </div>
    </header>
  `;
}

function activeExamStrip() {
  if (!state.current || !['faults', 'students', 'history'].includes(state.screen)) return '';
  const sim = state.current;
  const res = calculateCurrent();
  const examTimer = sim.timers.exam;
  return `
    <div class="exam-strip">
      <div class="exam-strip-inner">
        <button type="button" class="exam-strip-info" data-action="screen" data-screen="sim">
          <span class="exam-strip-dot ${examTimer.running ? 'is-running' : ''}"></span>
          <strong class="exam-strip-name">${esc(sim.studentName || 'Examen libre')}</strong>
          <span class="exam-strip-clock" data-timer-display="elapsed:exam:compact">${formatClock(effectiveElapsed(examTimer), { showTenths: false })}</span>
        </button>
        <div class="exam-strip-right">
          <span class="exam-strip-tally"><b>${res.L}</b>L · <b>${res.D}</b>D · <b>${res.E}</b>E</span>
          <button type="button" class="btn btn-xs ${examTimer.running ? 'btn-amber' : 'btn-outline-light'}" data-action="${examTimer.running ? 'timer-pause' : 'timer-start'}" data-timer="exam" aria-label="${examTimer.running ? 'Pausar cronómetro' : 'Iniciar cronómetro'}">
            ${examTimer.running ? ICONS.pause : ICONS.play}
          </button>
        </div>
      </div>
    </div>
  `;
}

function bottomNav() {
  const faultTotal = state.current?.faults?.length || 0;
  const items = [
    { screen: 'home', label: 'Inicio', icon: ICONS.home },
    { screen: 'students', label: 'Alumnos', icon: ICONS.users, match: ['students', 'student-detail', 'student-new'] },
    { screen: 'sim', label: 'Prueba', icon: ICONS.exam },
    { screen: 'faults', label: 'Faltas', icon: ICONS.faults, count: faultTotal },
    { screen: 'summary', label: 'Informe', icon: ICONS.summary }
  ];
  return `
    <nav class="bottom-nav" aria-label="Navegación inferior">
      ${items.map((item) => {
        const active = item.match ? item.match.includes(state.screen) : state.screen === item.screen;
        return `
          <button type="button" class="bottom-nav-item ${active ? 'is-active' : ''}" data-action="screen" data-screen="${item.screen}">
            <span class="bottom-nav-icon">
              ${item.icon}
              ${item.count ? `<em class="nav-counter">${item.count > 99 ? '99+' : item.count}</em>` : ''}
            </span>
            <span class="bottom-nav-label">${item.label}</span>
          </button>
        `;
      }).join('')}
    </nav>
  `;
}

function kpiStripHtml(result) {
  return `
    <div class="score-strip" role="group" aria-label="Cómputo de faltas">
      <div class="score-cell score-cell-L">
        <span class="score-label">Leves <small>(máx. 9)</small></span>
        <strong class="score-num">${result.L}</strong>
      </div>
      <div class="score-cell score-cell-D">
        <span class="score-label">Deficientes <small>(máx. 1)</small></span>
        <strong class="score-num">${result.D}</strong>
      </div>
      <div class="score-cell score-cell-E">
        <span class="score-label">Eliminatorias <small>(0)</small></span>
        <strong class="score-num">${result.E}</strong>
      </div>
      <div class="score-cell">
        <span class="score-label">Total</span>
        <strong class="score-num">${result.total}</strong>
      </div>
    </div>
  `;
}

function installNoticeHtml() {
  if (state.installedHintDismissed || isStandaloneMode()) return '';
  return `
    <section class="notice-bar">
      <div>
        <strong>Acceso directo sin conexión</strong>
        <span>En Safari (iPhone) o Chrome (Android), usa «Añadir a pantalla de inicio» para usarla como aplicación nativa en el vehículo.</span>
      </div>
      <button type="button" class="btn btn-ghost btn-sm" data-action="dismiss-install">Ocultar</button>
    </section>
  `;
}

function homeView() {
  const recent = state.history.slice(0, 4);
  const aptosCount = state.history.filter((sim) => !evaluateSimulation(sim.faults || []).noApto).length;

  let activeBlock = '';
  if (state.current) {
    const sim = state.current;
    const res = calculateCurrent();
    activeBlock = `
      <section class="panel panel-highlight">
        <div class="panel-header">
          <div>
            <span class="section-tag">${sim.status === 'finalized' ? 'Prueba finalizada' : 'Prueba activa'}</span>
            <h2 class="panel-title">${esc(sim.studentName || 'Examen libre sin alumno')}</h2>
            <p class="panel-sub">${formatDateEs(sim.date)}${sim.zone ? ` · ${esc(sim.zone)}` : ''} · Tiempo: <span data-timer-display="elapsed:exam:compact">${formatClock(effectiveElapsed(sim.timers.exam), { showTenths: false })}</span></p>
          </div>
          ${statusPill(res)}
        </div>
        ${kpiStripHtml(res)}
        <div class="btn-row btn-row-3 mt-12">
          <button type="button" class="btn btn-primary" data-action="screen" data-screen="faults">${ICONS.plus} Anotar faltas</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="sim">${ICONS.exam} Tiempos y datos</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="summary">${ICONS.summary} Informe</button>
        </div>
      </section>
    `;
  }

  return `
    <main class="workspace">
      ${installNoticeHtml()}
      ${activeBlock}

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Operaciones</h2>
          <span class="text-muted text-sm">${state.students.length} alumnos · ${state.history.length} pruebas (${aptosCount} aptas)</span>
        </div>
        <div class="action-grid">
          <button type="button" class="action-tile action-tile-primary" data-action="new-quick-simulation">
            <span class="tile-icon">${ICONS.exam}</span>
            <span class="tile-text">
              <strong>Nueva prueba libre</strong>
              <small>Iniciar simulación inmediata sin ficha previa</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="students">
            <span class="tile-icon">${ICONS.users}</span>
            <span class="tile-text">
              <strong>Alumnos (${state.students.length})</strong>
              <small>Seleccionar alumno e iniciar evaluación</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="student-new">
            <span class="tile-icon">${ICONS.userPlus}</span>
            <span class="tile-text">
              <strong>Dar de alta alumno</strong>
              <small>Registrar nombre, contacto y observaciones</small>
            </span>
          </button>
          <button type="button" class="action-tile" data-action="screen" data-screen="history">
            <span class="tile-icon">${ICONS.history}</span>
            <span class="tile-text">
              <strong>Historial de pruebas</strong>
              <small>Consultar, duplicar o exportar evaluaciones</small>
            </span>
          </button>
          <button type="button" class="action-tile action-tile-wide" data-action="screen" data-screen="settings">
            <span class="tile-icon">${ICONS.settings}</span>
            <span class="tile-text">
              <strong>Copias de seguridad y ajustes</strong>
              <small>Exportar/importar datos JSON y opciones de pantalla en vehículo</small>
            </span>
          </button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Pruebas recientes</h2>
          ${state.history.length > 4 ? `<button type="button" class="btn btn-ghost btn-sm" data-action="screen" data-screen="history">Ver todas (${state.history.length})</button>` : ''}
        </div>
        ${recent.length ? `<div class="record-list">${recent.map(historyRowHtml).join('')}</div>` : emptyStateHtml('Sin pruebas registradas', 'Inicia una prueba libre o da de alta un alumno para comenzar.')}
      </section>
    </main>
  `;
}

function newStudentView() {
  const draft = state.studentDraft;
  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Ficha de nuevo alumno</h2>
            <p class="panel-sub">Los datos quedan almacenados únicamente en este dispositivo.</p>
          </div>
        </div>
        <div class="form-stack">
          <label class="field">
            <span class="field-label">Nombre y apellidos <abbr title="Obligatorio">*</abbr></span>
            <input type="text" data-student-draft="name" value="${esc(draft.name)}" placeholder="Ej.: Laura Gómez Martín" autocomplete="off" />
          </label>
          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Teléfono</span>
              <input type="tel" data-student-draft="phone" value="${esc(draft.phone)}" placeholder="600 000 000" inputmode="tel" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Correo electrónico</span>
              <input type="email" data-student-draft="email" value="${esc(draft.email)}" placeholder="alumno@ejemplo.es" inputmode="email" autocomplete="off" />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Notas de seguimiento</span>
            <textarea data-student-draft="notes" placeholder="Puntos a reforzar, horario habitual, vehículo...">${esc(draft.notes)}</textarea>
          </label>
        </div>
        <div class="btn-row mt-16">
          <button type="button" class="btn btn-primary" data-action="create-student-and-exam">${ICONS.exam} Guardar e iniciar prueba</button>
          <button type="button" class="btn btn-secondary" data-action="create-student">Guardar ficha</button>
        </div>
      </section>
    </main>
  `;
}

function filteredStudentsHtml() {
  const query = normalise(state.studentQuery);
  const rows = state.students.filter((student) => {
    if (!query) return true;
    const haystack = normalise(`${student.name} ${student.phone} ${student.email} ${student.notes}`);
    return haystack.includes(query);
  });

  if (!rows.length) {
    return emptyStateHtml(
      state.students.length ? 'Ningún alumno coincide con la búsqueda' : 'No hay alumnos dados de alta',
      state.students.length ? 'Prueba con otro nombre o limpia el filtro.' : 'Pulsa «Alta alumno» para crear el primer expediente.'
    );
  }

  return `<div class="record-list">${rows.map(studentRowHtml).join('')}</div>`;
}

function studentsView() {
  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Listado de alumnos</h2>
            <p class="panel-sub">${state.students.length} expediente${state.students.length === 1 ? '' : 's'} en este dispositivo</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-action="screen" data-screen="student-new">${ICONS.plus} Alta alumno</button>
        </div>
        <div class="search-box">
          <span class="search-icon">${ICONS.search}</span>
          <input type="search" data-search="students" value="${esc(state.studentQuery)}" placeholder="Buscar por nombre, teléfono o notas..." autocomplete="off" />
        </div>
        <div id="student-results-container" class="mt-12">
          ${filteredStudentsHtml()}
        </div>
      </section>
    </main>
  `;
}

function studentRowHtml(student) {
  const exams = simulationsForStudent(student.id);
  const latest = exams[0];
  const latestEval = latest ? evaluateSimulation(latest.faults || []) : null;

  return `
    <article class="record-row">
      <div class="record-main">
        <div class="record-title-line">
          <h3>${esc(student.name || 'Alumno sin nombre')}</h3>
          ${latestEval ? statusPill(latestEval, true) : '<span class="meta-pill">Sin pruebas</span>'}
        </div>
        <p class="record-meta">
          ${exams.length} prueba${exams.length === 1 ? '' : 's'}
          ${latest ? ` · Última: ${formatDateEs(latest.date)}` : ''}
          ${student.phone ? ` · ${esc(student.phone)}` : ''}
        </p>
      </div>
      <div class="record-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="view-student" data-id="${esc(student.id)}">Ficha</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="new-exam-student" data-id="${esc(student.id)}">Iniciar prueba</button>
      </div>
    </article>
  `;
}

function studentDetailView() {
  const student = selectedStudent();
  if (!student) {
    return `
      <main class="workspace">
        <section class="panel">
          ${emptyStateHtml('Ficha no encontrada', 'Selecciona un alumno desde el listado.')}
          <div class="btn-row mt-12">
            <button type="button" class="btn btn-secondary" data-action="screen" data-screen="students">Ir al listado de alumnos</button>
          </div>
        </section>
      </main>
    `;
  }
  const exams = simulationsForStudent(student.id);
  const aptos = exams.filter((s) => !evaluateSimulation(s.faults || []).noApto).length;

  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="section-tag">Expediente de alumno</span>
            <h2 class="panel-title" id="student-detail-heading">${esc(student.name)}</h2>
            <p class="panel-sub">${exams.length} prueba${exams.length === 1 ? '' : 's'} realizada${exams.length === 1 ? '' : 's'} (${aptos} apta${aptos === 1 ? '' : 's'}) · Guardado automático</p>
          </div>
          <button type="button" class="btn btn-primary" data-action="new-exam-student" data-id="${esc(student.id)}">${ICONS.exam} Nueva prueba</button>
        </div>

        <div class="form-stack mt-12">
          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Nombre y apellidos</span>
              <input type="text" data-student-field="name" data-id="${esc(student.id)}" value="${esc(student.name)}" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Teléfono</span>
              <input type="tel" data-student-field="phone" data-id="${esc(student.id)}" value="${esc(student.phone)}" inputmode="tel" autocomplete="off" />
            </label>
          </div>
          <label class="field">
            <span class="field-label">Correo electrónico</span>
            <input type="email" data-student-field="email" data-id="${esc(student.id)}" value="${esc(student.email)}" inputmode="email" autocomplete="off" />
          </label>
          <label class="field">
            <span class="field-label">Notas pedagógicas</span>
            <textarea data-student-field="notes" data-id="${esc(student.id)}" placeholder="Evolución, puntos débiles, maniobras pendientes...">${esc(student.notes)}</textarea>
          </label>
        </div>

        <div class="panel-footer-danger">
          <span class="text-muted text-sm">Eliminar la ficha conserva sus exámenes en el historial general como pruebas libres.</span>
          <button type="button" class="btn btn-danger-outline btn-sm" data-action="delete-student" data-id="${esc(student.id)}">${ICONS.trash} Eliminar alumno</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Historial del alumno (${exams.length})</h2>
        </div>
        ${exams.length ? `<div class="record-list">${exams.map(historyRowHtml).join('')}</div>` : emptyStateHtml('Sin pruebas todavía', 'Pulsa «Nueva prueba» para registrar la primera simulación de este alumno.')}
      </section>
    </main>
  `;
}

function noActiveExamPanel(contextText) {
  return `
    <main class="workspace">
      <section class="panel">
        ${emptyStateHtml('No hay ninguna prueba activa', contextText)}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-primary" data-action="new-quick-simulation">${ICONS.exam} Iniciar prueba libre</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="students">${ICONS.users} Elegir alumno</button>
        </div>
      </section>
    </main>
  `;
}

function simulationView() {
  if (!state.current) return noActiveExamPanel('Inicia una prueba libre o selecciona un alumno para registrar tiempos y faltas.');
  ensureSimulationShape(state.current);
  const sim = state.current;
  const result = calculateCurrent();
  const linkedStudent = sim.studentId ? state.students.find((s) => s.id === sim.studentId) : null;

  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <span class="section-tag">${sim.status === 'finalized' ? 'Prueba cerrada' : 'Prueba en curso'}</span>
            <h2 class="panel-title" id="sim-student-heading">${esc(sim.studentName || 'Examen libre sin alumno')}</h2>
            <p class="panel-sub">${linkedStudent ? 'Vinculado a expediente de alumno' : 'Sin vincular a ficha de alumno'}</p>
          </div>
          ${statusPill(result)}
        </div>
        ${kpiStripHtml(result)}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-primary" data-action="screen" data-screen="faults">${ICONS.plus} Añadir faltas (${sim.faults.length})</button>
          <button type="button" class="btn btn-secondary" data-action="screen" data-screen="summary">${ICONS.summary} Ver informe / PDF</button>
        </div>
      </section>

      ${timersSectionHtml()}

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Datos identificativos de la prueba</h2>
        </div>
        <div class="form-stack">
          ${linkedStudent ? `
            <div class="linked-banner">
              <div>
                <span class="field-label">Alumno asignado</span>
                <strong>${esc(linkedStudent.name)}</strong>
              </div>
              <div class="btn-row-inline">
                <button type="button" class="btn btn-secondary btn-sm" data-action="view-student" data-id="${esc(linkedStudent.id)}">Ver ficha</button>
                <button type="button" class="btn btn-ghost btn-sm" data-action="unlink-student">Desvincular</button>
              </div>
            </div>
          ` : `
            <label class="field">
              <span class="field-label">Alumno/a</span>
              <input type="text" data-field="studentName" value="${esc(sim.studentName)}" placeholder="Nombre del aspirante" autocomplete="off" list="students-datalist" />
              <datalist id="students-datalist">
                ${state.students.map((s) => `<option value="${esc(s.name)}"></option>`).join('')}
              </datalist>
            </label>
          `}

          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Fecha</span>
              <input type="date" data-field="date" value="${esc(sim.date)}" />
            </label>
            <label class="field">
              <span class="field-label">Zona / recorrido</span>
              <input type="text" data-field="zone" value="${esc(sim.zone)}" placeholder="Ej.: Centro exámenes / Ruta 3" autocomplete="off" />
            </label>
          </div>

          <div class="field-grid-2">
            <label class="field">
              <span class="field-label">Profesor/a evaluador</span>
              <input type="text" data-field="teacher" value="${esc(sim.teacher)}" placeholder="Opcional" autocomplete="off" />
            </label>
            <label class="field">
              <span class="field-label">Vehículo / matrícula</span>
              <input type="text" data-field="vehicle" value="${esc(sim.vehicle)}" placeholder="Ej.: 1234 MNP" autocomplete="off" />
            </label>
          </div>

          <label class="field">
            <span class="field-label">Observaciones generales de circulación</span>
            <textarea data-field="generalNotes" placeholder="Valoración general, fluidez, adaptación al tráfico, autonomía...">${esc(sim.generalNotes)}</textarea>
          </label>
        </div>
      </section>
    </main>
  `;
}

function getTimerButtonsHtml(key) {
  ensureSimulationShape(state.current);
  const timer = state.current.timers[key];
  if (key === 'exam') {
    const elapsed = effectiveElapsed(timer);
    if (timer.running) {
      return `
        <button type="button" class="btn btn-amber btn-sm" data-action="timer-pause" data-timer="exam">${ICONS.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="exam">${ICONS.reset} Reiniciar</button>`;
    }
    if (elapsed > 0) {
      return `
        <button type="button" class="btn btn-primary btn-sm" data-action="timer-start" data-timer="exam">${ICONS.play} Reanudar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="exam">${ICONS.reset} Reiniciar</button>`;
    }
    return `<button type="button" class="btn btn-success btn-sm" data-action="timer-start" data-timer="exam">${ICONS.play} Iniciar</button>`;
  }

  if (key === 'parking') {
    const elapsed = effectiveElapsed(timer);
    if (timer.running) {
      return `
        <button type="button" class="btn btn-secondary btn-sm" data-action="timer-save-record">${ICONS.flag} Guardar</button>
        <button type="button" class="btn btn-amber btn-sm" data-action="timer-pause" data-timer="parking">${ICONS.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="parking">${ICONS.reset}</button>`;
    }
    if (elapsed > 0) {
      return `
        <button type="button" class="btn btn-secondary btn-sm" data-action="timer-save-record">${ICONS.flag} Guardar</button>
        <button type="button" class="btn btn-primary btn-sm" data-action="timer-start" data-timer="parking">${ICONS.play} Seguir</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="timer-reset" data-timer="parking">${ICONS.reset}</button>`;
    }
    return `<button type="button" class="btn btn-success btn-sm" data-action="timer-start" data-timer="parking">${ICONS.play} Iniciar</button>`;
  }

  if (key === 'countdown') {
    const remaining = effectiveRemaining(timer);
    const finished = remaining <= 0 && !timer.running;
    if (timer.running) {
      return `
        <button type="button" class="btn btn-amber btn-sm" data-action="countdown-pause">${ICONS.pause} Pausar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="countdown-reset">${ICONS.reset} Reiniciar</button>`;
    }
    if (finished) {
      return `<button type="button" class="btn btn-primary btn-sm" data-action="countdown-reset">${ICONS.reset} Restablecer</button>`;
    }
    if (remaining < timer.durationMs) {
      return `
        <button type="button" class="btn btn-primary btn-sm" data-action="countdown-start">${ICONS.play} Reanudar</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="countdown-reset">${ICONS.reset} Reiniciar</button>`;
    }
    return `<button type="button" class="btn btn-success btn-sm" data-action="countdown-start">${ICONS.play} Iniciar (${countdownMinutes(timer)}m)</button>`;
  }
  return '';
}

function timerStateBadge(key, timer) {
  if (key === 'countdown') {
    const finished = effectiveRemaining(timer) <= 0 && !timer.running;
    if (timer.running) return '<span class="timer-chip is-running">Activo</span>';
    if (finished) return '<span class="timer-chip is-finished">Tiempo agotado</span>';
    if (effectiveRemaining(timer) < timer.durationMs) return '<span class="timer-chip is-paused">En pausa</span>';
    return '<span class="timer-chip">Preparado</span>';
  }
  const elapsed = effectiveElapsed(timer);
  if (timer.running) return '<span class="timer-chip is-running">En marcha</span>';
  if (elapsed > 0) return '<span class="timer-chip is-paused">Pausado</span>';
  return '<span class="timer-chip">En cero</span>';
}

function refreshTimerControls(key) {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const timer = state.current.timers[key];
  const btnBox = document.querySelector(`[data-timer-buttons="${key}"]`);
  if (btnBox) btnBox.innerHTML = getTimerButtonsHtml(key);
  const chipBox = document.querySelector(`[data-timer-status="${key}"]`);
  if (chipBox) chipBox.innerHTML = timerStateBadge(key, timer);
}

function timersSectionHtml() {
  ensureSimulationShape(state.current);
  const { exam, parking, countdown } = state.current.timers;
  const countdownFinished = effectiveRemaining(countdown) <= 0 && !countdown.running;
  const wakeLockSupported = 'wakeLock' in navigator;

  return `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Control de tiempos</h2>
          <p class="panel-sub">La duración oficial habitual de circulación para permiso B es de 25 min.</p>
        </div>
        ${wakeLockSupported ? `
          <label class="switch-inline" title="Evita que el teléfono apague la pantalla durante el examen">
            <input type="checkbox" data-toggle="wake-lock" ${state.wakeLockEnabled ? 'checked' : ''} />
            <span>Pantalla activa</span>
          </label>
        ` : ''}
      </div>

      <div class="timers-grid">
        <article class="timer-box">
          <div class="timer-box-top">
            <span class="timer-box-label">Examen general</span>
            <span data-timer-status="exam">${timerStateBadge('exam', exam)}</span>
          </div>
          <div class="clock-readout" data-timer-display="elapsed:exam">${formatClock(effectiveElapsed(exam))}</div>
          <div class="timer-controls" data-timer-buttons="exam">${getTimerButtonsHtml('exam')}</div>
        </article>

        <article class="timer-box">
          <div class="timer-box-top">
            <input type="text" class="inline-label-input" data-timer-input="parkingLabel" value="${esc(parking.label || 'Maniobra')}" aria-label="Nombre de la maniobra" placeholder="Maniobra" autocomplete="off" />
            <span data-timer-status="parking">${timerStateBadge('parking', parking)}</span>
          </div>
          <div class="clock-readout" data-timer-display="elapsed:parking">${formatClock(effectiveElapsed(parking))}</div>
          <div class="timer-controls" data-timer-buttons="parking">${getTimerButtonsHtml('parking')}</div>
        </article>

        <article class="timer-box timer-box-wide ${countdownFinished ? 'is-expired' : ''}">
          <div class="timer-box-top">
            <span class="timer-box-label">Cuenta atrás programada</span>
            <span data-timer-status="countdown">${timerStateBadge('countdown', countdown)}</span>
          </div>
          <div class="countdown-layout">
            <div class="clock-readout" data-timer-display="remaining:countdown">${formatClock(effectiveRemaining(countdown))}</div>
            <div class="countdown-config">
              <div class="preset-group" role="group" aria-label="Duración rápida">
                ${[20, 25, 30, 45].map((min) => `
                  <button type="button" class="chip-btn ${countdownMinutes(countdown) === min ? 'is-active' : ''}" data-action="set-countdown" data-minutes="${min}">${min} min</button>
                `).join('')}
                <label class="custom-min-input" title="Minutos personalizados">
                  <input type="number" min="1" max="180" step="1" data-timer-input="countdownMinutes" value="${countdownMinutes(countdown)}" aria-label="Minutos cuenta atrás" />
                  <span>min</span>
                </label>
              </div>
              <div class="timer-controls" data-timer-buttons="countdown">${getTimerButtonsHtml('countdown')}</div>
            </div>
          </div>
        </article>
      </div>

      ${parking.records.length ? `
        <div class="saved-times-list">
          <div class="saved-times-head">Maniobras guardadas (${parking.records.length})</div>
          ${parking.records.map((rec) => `
            <div class="saved-time-row">
              <div>
                <strong>${esc(rec.label || 'Maniobra')}</strong>
                <span class="text-muted text-xs">${formatDateEs(rec.createdAt)}</span>
              </div>
              <div class="saved-time-right">
                <span class="mono-time">${formatClock(rec.elapsedMs)}</span>
                <button type="button" class="btn btn-ghost btn-xs text-danger" data-action="remove-time-record" data-id="${esc(rec.id)}" aria-label="Borrar tiempo">${ICONS.trash}</button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  `;
}

function groupedFaults() {
  const query = normalise(state.query).trim();
  const filter = state.filter;
  const rows = catalog.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.tipo === filter;
    if (!matchesFilter) return false;
    if (!query) return true;
    const searchable = normalise(`${item.id} ${item.falta} ${item.obs} ${item.bloque} ${item.nivel}`);
    return searchable.includes(query);
  });

  const map = new Map();
  rows.forEach((item) => {
    if (!map.has(item.bloque)) map.set(item.bloque, []);
    map.get(item.bloque).push(item);
  });
  return map;
}

function faultBlocksInnerHtml() {
  const blocks = groupedFaults();
  const markedById = faultCountsByCatalogId();
  const forceOpen = Boolean(state.query.trim()) || state.filter !== 'ALL';

  if (!blocks.size) {
    return `
      <div class="panel">
        ${emptyStateHtml('Sin coincidencias en el catálogo', 'Prueba con otros términos (ej.: retrovisor, intermitente, carril, ceda) o restablece el filtro.')}
        <div class="btn-row mt-12">
          <button type="button" class="btn btn-secondary btn-sm" data-action="reset-fault-filters">Limpiar búsqueda y filtro</button>
        </div>
      </div>
    `;
  }

  return [...blocks.entries()].map(([block, rows]) => {
    const isOpen = forceOpen || state.openBlocks.has(block);
    const markedInBlock = rows.reduce((sum, item) => sum + (markedById.get(item.id) || 0), 0);

    return `
      <details class="fault-group" data-block="${esc(block)}" ${isOpen ? 'open' : ''}>
        <summary class="fault-group-header">
          <span class="fault-group-title">${esc(block)}</span>
          <span class="fault-group-badges">
            ${markedInBlock > 0 ? `<span class="marked-pill">${markedInBlock} marcada${markedInBlock === 1 ? '' : 's'}</span>` : ''}
            <span class="count-pill">${rows.length}</span>
          </span>
        </summary>
        <div class="fault-group-body">
          ${rows.map((item) => {
            const count = markedById.get(item.id) || 0;
            return `
              <div class="catalog-row ${count > 0 ? 'is-marked' : ''}">
                <button type="button" class="catalog-row-main" data-action="open-fault" data-id="${item.id}">
                  ${badge(item.tipo)}
                  <span class="catalog-row-text">
                    <span class="catalog-row-title">
                      ${esc(item.falta)}
                      ${count > 0 ? `<em class="fault-hit-count" data-fault-count="${item.id}">×${count}</em>` : ''}
                    </span>
                    ${item.obs ? `<small class="catalog-row-obs">${esc(item.obs)}</small>` : ''}
                  </span>
                </button>
                <button type="button" class="quick-add-btn" data-action="quick-add-fault" data-id="${item.id}" title="Anotar +1 falta directamente" aria-label="Anotar falta: ${esc(item.falta)}">
                  ${ICONS.plus}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </details>
    `;
  }).join('');
}

function faultsView() {
  if (!state.current) return noActiveExamPanel('Debes tener una prueba abierta para imputar faltas del catálogo oficial.');

  const filters = [
    ['ALL', 'Todas'],
    ['L', 'Leves (L)'],
    ['D', 'Deficientes (D)'],
    ['E', 'Eliminatorias (E)']
  ];

  return `
    <main class="workspace">
      <section class="sticky-filter-bar">
        <div class="search-box">
          <span class="search-icon">${ICONS.search}</span>
          <input type="search" id="fault-search-input" data-search="faults" value="${esc(state.query)}" placeholder="Buscar criterio (intermitente, prioridad, embrague...)" autocomplete="off" />
          ${state.query ? `<button type="button" class="search-clear" data-action="clear-fault-query" aria-label="Borrar búsqueda">${ICONS.close}</button>` : ''}
        </div>
        <div class="segmented-row" role="tablist" aria-label="Filtrar por gravedad">
          ${filters.map(([code, label]) => `
            <button type="button" class="seg-btn ${state.filter === code ? 'is-active' : ''} seg-${code}" data-action="filter" data-filter="${code}">
              ${label}
            </button>
          `).join('')}
        </div>
      </section>

      <section id="fault-blocks-container" class="fault-groups-stack">
        ${faultBlocksInnerHtml()}
      </section>

      ${faultSheetHtml()}
    </main>
  `;
}

function faultSheetHtml() {
  if (!state.openFault) return '';
  const item = catalogById.get(state.openFault);
  if (!item) return '';
  const currentHits = (state.current?.faults || []).filter((f) => f.faultId === item.id).length;

  return `
    <div class="sheet-backdrop" data-action="close-sheet"></div>
    <section class="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="sheet-fault-title">
      <div class="sheet-header">
        <div class="sheet-meta">
          ${badge(item.tipo)}
          <span>${esc(item.bloque)} · Falta ${esc(levelName(item.tipo).toLowerCase())}</span>
        </div>
        <button type="button" class="icon-btn icon-btn-light" data-action="close-sheet" aria-label="Cerrar">${ICONS.close}</button>
      </div>

      <h2 id="sheet-fault-title" class="sheet-title">${esc(item.falta)}</h2>
      ${item.obs ? `<p class="sheet-criterion">${esc(item.obs)}</p>` : ''}
      ${currentHits > 0 ? `<p class="sheet-already">Ya anotada <strong>${currentHits}</strong> ${currentHits === 1 ? 'vez' : 'veces'} en esta prueba.</p>` : ''}

      <label class="field mt-12">
        <span class="field-label">Observación concreta (ubicación, maniobra o detalle)</span>
        <textarea id="fault-note" rows="3" placeholder="Ej.: Glorieta Av. Europa, no observa retrovisor izquierdo..."></textarea>
      </label>

      <div class="btn-row mt-16">
        <button type="button" class="btn btn-primary" data-action="add-fault-continue" data-id="${item.id}">${ICONS.plus} Añadir y seguir en catálogo</button>
        <button type="button" class="btn btn-secondary" data-action="add-fault" data-id="${item.id}">Añadir e ir al informe</button>
      </div>
    </section>
  `;
}

function summaryView() {
  if (!state.current) return noActiveExamPanel('Abre una prueba del historial o inicia una nueva para generar su informe.');
  ensureSimulationShape(state.current);
  const sim = state.current;
  const result = calculateCurrent();
  const timers = sim.timers;
  const records = timers.parking?.records || [];

  return `
    <main class="workspace print-sheet">
      <section class="panel report-header-panel">
        <div class="report-top">
          <div>
            <span class="section-tag">Informe de simulación · Permiso B</span>
            <h2 class="report-student">${esc(sim.studentName || 'Aspirante sin identificar')}</h2>
            <p class="panel-sub">
              Fecha: <strong>${formatDateEs(sim.date)}</strong>
              ${sim.zone ? ` · Recorrido: <strong>${esc(sim.zone)}</strong>` : ''}
              ${sim.vehicle ? ` · Vehículo: <strong>${esc(sim.vehicle)}</strong>` : ''}
              ${sim.teacher ? ` · Evaluador: <strong>${esc(sim.teacher)}</strong>` : ''}
            </p>
          </div>
          <div class="verdict-box ${result.noApto ? 'is-noapto' : 'is-apto'}">
            <strong>${result.result}</strong>
            <small>${sim.status === 'finalized' ? 'Prueba cerrada' : 'Resultado provisional'}</small>
          </div>
        </div>

        ${result.reasons.length ? `
          <div class="verdict-reasons">
            <strong>Causa de calificación NO APTO:</strong> ${esc(result.reasons.join(' · '))}.
          </div>
        ` : ''}

        ${kpiStripHtml(result)}

        <div class="btn-row wrap mt-16 no-print">
          <button type="button" class="btn btn-primary" data-action="pdf" ${state.pdfBusy ? 'disabled' : ''}>
            ${ICONS.download} ${state.pdfBusy ? 'Generando PDF...' : 'Descargar PDF'}
          </button>
          <button type="button" class="btn btn-secondary" data-action="print">${ICONS.print} Imprimir</button>
          ${sim.status === 'finalized' ? `
            <button type="button" class="btn btn-secondary" data-action="reopen">${ICONS.exam} Reabrir edición</button>
          ` : `
            <button type="button" class="btn btn-success" data-action="finalize">${ICONS.check} Finalizar prueba</button>
          `}
          <button type="button" class="btn btn-ghost" data-action="screen" data-screen="faults">${ICONS.plus} Añadir falta</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Tiempos registrados</h2>
        </div>
        <div class="summary-times-row">
          <div class="summary-time-item">
            <span>Duración circulación</span>
            <strong data-timer-display="elapsed:exam">${formatClock(effectiveElapsed(timers.exam))}</strong>
          </div>
          <div class="summary-time-item">
            <span>${esc(timers.parking?.label || 'Maniobra')}</span>
            <strong data-timer-display="elapsed:parking">${formatClock(effectiveElapsed(timers.parking))}</strong>
          </div>
          <div class="summary-time-item">
            <span>Cuenta atrás restante</span>
            <strong data-timer-display="remaining:countdown">${formatClock(effectiveRemaining(timers.countdown))}</strong>
          </div>
        </div>
        ${records.length ? `
          <div class="saved-times-list mt-12">
            ${records.map((rec) => `
              <div class="saved-time-row">
                <strong>${esc(rec.label || 'Maniobra')}</strong>
                <span class="mono-time">${formatClock(rec.elapsedMs)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </section>

      <section class="panel">
        <div class="panel-header">
          <h2 class="panel-title">Faltas calificadas (${sim.faults.length})</h2>
          ${sim.faults.length ? `<button type="button" class="btn btn-danger-outline btn-sm no-print" data-action="clear-current">${ICONS.trash} Vaciar faltas</button>` : ''}
        </div>
        ${sim.faults.length ? `
          <div class="marked-faults-list">
            ${sim.faults.map((fault, index) => faultSummaryItemHtml(fault, index)).join('')}
          </div>
        ` : '<p class="text-muted no-margin">No se han registrado faltas en esta prueba.</p>'}
      </section>

      ${sim.generalNotes ? `
        <section class="panel">
          <h2 class="panel-title">Observaciones generales</h2>
          <p class="notes-paragraph">${esc(sim.generalNotes)}</p>
        </section>
      ` : ''}
    </main>
  `;
}

function faultSummaryItemHtml(fault, index) {
  const data = fault.snapshot || catalogById.get(fault.faultId) || fault;
  const tipo = data.tipo || fault.tipo || 'L';
  return `
    <article class="marked-fault-item">
      <div class="marked-fault-body">
        <div class="marked-fault-head">
          <span class="marked-index">${index + 1}.</span>
          ${badge(tipo)}
          <h3>${esc(data.falta || 'Falta registrada')}</h3>
        </div>
        <p class="marked-fault-meta">${esc(data.bloque || 'General')} · ${esc(levelName(tipo))}</p>
        ${data.obs ? `<p class="marked-fault-obs">${esc(data.obs)}</p>` : ''}
        ${fault.note ? `<p class="marked-fault-note"><strong>Nota:</strong> ${esc(fault.note)}</p>` : ''}
      </div>
      <button type="button" class="btn btn-ghost btn-sm text-danger no-print" data-action="remove-fault" data-index="${index}" aria-label="Quitar falta">Quitar</button>
    </article>
  `;
}

function filteredHistoryHtml() {
  const query = normalise(state.historyQuery).trim();
  const filter = state.historyFilter;

  const rows = state.history.filter((sim) => {
    const res = evaluateSimulation(sim.faults || []);
    if (filter === 'APTO' && res.noApto) return false;
    if (filter === 'NO_APTO' && !res.noApto) return false;
    if (filter === 'DRAFT' && sim.status === 'finalized') return false;
    if (!query) return true;
    const haystack = normalise(`${sim.studentName} ${sim.zone} ${sim.teacher} ${sim.vehicle} ${sim.date}`);
    return haystack.includes(query);
  });

  if (!rows.length) {
    return emptyStateHtml(
      state.history.length ? 'Ninguna prueba coincide con el filtro' : 'No hay pruebas guardadas',
      state.history.length ? 'Cambia el filtro o el texto de búsqueda.' : 'Las pruebas que inicies quedarán registradas aquí.'
    );
  }

  return `<div class="record-list">${rows.map(historyRowHtml).join('')}</div>`;
}

function historyView() {
  const filters = [
    ['ALL', 'Todas'],
    ['APTO', 'Aptas'],
    ['NO_APTO', 'No aptas'],
    ['DRAFT', 'En curso']
  ];

  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Historial de evaluaciones</h2>
            <p class="panel-sub">${state.history.length} prueba${state.history.length === 1 ? '' : 's'} almacenada${state.history.length === 1 ? '' : 's'} en el navegador</p>
          </div>
          <button type="button" class="btn btn-primary btn-sm" data-action="new-quick-simulation">${ICONS.plus} Prueba libre</button>
        </div>

        <div class="search-box">
          <span class="search-icon">${ICONS.search}</span>
          <input type="search" data-search="history" value="${esc(state.historyQuery)}" placeholder="Buscar por alumno, recorrido, vehículo..." autocomplete="off" />
        </div>

        <div class="segmented-row mt-8">
          ${filters.map(([code, label]) => `
            <button type="button" class="seg-btn ${state.historyFilter === code ? 'is-active' : ''}" data-action="history-filter" data-filter="${code}">${label}</button>
          `).join('')}
        </div>

        <div id="history-results-container" class="mt-12">
          ${filteredHistoryHtml()}
        </div>
      </section>
    </main>
  `;
}

function historyRowHtml(sim) {
  const result = evaluateSimulation(sim.faults || []);
  const student = sim.studentId ? state.students.find((item) => item.id === sim.studentId) : null;
  const isCurrent = state.current?.id === sim.id;

  return `
    <article class="record-row ${isCurrent ? 'is-current-row' : ''}">
      <div class="record-main">
        <div class="record-title-line">
          <h3>${esc(sim.studentName || student?.name || 'Prueba libre sin alumno')}</h3>
          ${statusPill(result, true)}
          ${isCurrent ? '<span class="meta-pill is-blue">Abierta</span>' : ''}
        </div>
        <p class="record-meta">
          ${formatDateEs(sim.date)}
          ${sim.zone ? ` · ${esc(sim.zone)}` : ''}
          · <strong>${result.L}L · ${result.D}D · ${result.E}E</strong>
          · ${sim.status === 'finalized' ? 'Finalizada' : 'Borrador'}
        </p>
      </div>
      <div class="record-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="load-simulation" data-id="${esc(sim.id)}">Abrir</button>
        <button type="button" class="btn btn-ghost btn-sm" data-action="duplicate" data-id="${esc(sim.id)}">Duplicar</button>
        <button type="button" class="btn btn-ghost btn-sm text-danger" data-action="delete" data-id="${esc(sim.id)}" aria-label="Borrar prueba">${ICONS.trash}</button>
      </div>
    </article>
  `;
}

function settingsView() {
  const wakeLockSupported = 'wakeLock' in navigator;
  return `
    <main class="workspace">
      <section class="panel">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Copias de seguridad (JSON)</h2>
            <p class="panel-sub">Todos los alumnos y exámenes se guardan localmente en IndexedDB de este navegador. Exporta una copia periódicamente para no perder datos si borras el historial de Safari o Chrome.</p>
          </div>
        </div>
        <div class="btn-row wrap">
          <button type="button" class="btn btn-primary" data-action="export-all">${ICONS.download} Exportar copia completa</button>
          <button type="button" class="btn btn-secondary" data-action="export-json" ${!state.current ? 'disabled' : ''}>${ICONS.download} Exportar prueba activa</button>
          <label class="btn btn-secondary file-upload-btn" for="import-json-file">
            ${ICONS.upload} Importar copia JSON
          </label>
          <input id="import-json-file" type="file" accept="application/json,.json" data-import="json" class="sr-only-input" />
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Preferencias en el vehículo</h2>
        <div class="setting-item">
          <div>
            <strong>Mantener pantalla encendida en examen</strong>
            <p class="text-muted text-sm no-margin">
              ${wakeLockSupported
                ? 'Impide el bloqueo automático de pantalla mientras tengas una prueba abierta.'
                : 'Tu navegador actual no soporta la API Screen Wake Lock. Ajusta el bloqueo automático en Ajustes del teléfono.'}
            </p>
          </div>
          <label class="switch-inline">
            <input type="checkbox" data-toggle="wake-lock" ${state.wakeLockEnabled ? 'checked' : ''} ${wakeLockSupported ? '' : 'disabled'} />
            <span>${state.wakeLockEnabled ? 'Activado' : 'Desactivado'}</span>
          </label>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel-title">Criterios de calificación (Permiso B)</h2>
        <ul class="rules-list">
          <li><strong>NO APTO directo:</strong> 1 falta eliminatoria (<strong>E</strong>), 2 faltas deficientes (<strong>D</strong>), 1 deficiente + 5 leves (<strong>1D + 5L</strong>) o 10 faltas leves (<strong>10L</strong>).</li>
          <li><strong>Catálogo cargado:</strong> ${catalog.length} criterios oficiales distribuidos por bloques de maniobra y circulación.</li>
          <li><strong>Instalación móvil:</strong> En iOS (Safari → Compartir → Añadir a pantalla de inicio) o Android (Chrome → Instalar aplicación) sobre conexión HTTPS o red local.</li>
        </ul>
      </section>
    </main>
  `;
}

function emptyStateHtml(title, text) {
  return `
    <div class="empty-box">
      <strong>${esc(title)}</strong>
      <p>${esc(text)}</p>
    </div>
  `;
}

function toastInnerHtml() {
  return state.toast ? `<div class="toast-pill" role="status" aria-live="polite">${esc(state.toast)}</div>` : '';
}

function render() {
  const views = {
    home: homeView,
    'student-new': newStudentView,
    students: studentsView,
    'student-detail': studentDetailView,
    sim: simulationView,
    faults: faultsView,
    summary: summaryView,
    history: historyView,
    settings: settingsView
  };
  app.innerHTML = `
    ${topBar()}
    ${activeExamStrip()}
    <div class="alerts-container">${alertHtml()}</div>
    ${(views[state.screen] || homeView)()}
    ${bottomNav()}
    <div id="toast-root">${toastInnerHtml()}</div>
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
  await putSetting('currentSimulationId', state.current.id);
  await refreshData();
}

let persistDebounceTimer;
function schedulePersistCurrent(delay = 300) {
  window.clearTimeout(persistDebounceTimer);
  persistDebounceTimer = window.setTimeout(() => {
    persistCurrent().catch((error) => showUserError(error, 'save'));
  }, delay);
}

let studentPersistDebounceTimer;
function scheduleStudentPersist(student, delay = 300) {
  window.clearTimeout(studentPersistDebounceTimer);
  studentPersistDebounceTimer = window.setTimeout(async () => {
    try {
      student.updatedAt = nowIso();
      await putStudent(student);
      await refreshData();
      if (state.current?.studentId === student.id) {
        state.current.studentName = student.name;
        await persistCurrent();
      }
    } catch (error) {
      showUserError(error, 'save');
    }
  }, delay);
}

async function pauseAndSaveActiveIfNeeded() {
  if (!state.current) return true;
  if (hasRunningTimers(state.current.timers)) {
    const ok = window.confirm('La prueba actual tiene un cronómetro en marcha. ¿Pausarlo y cambiar de prueba?');
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
    const simHeading = document.querySelector('#sim-student-heading');
    if (simHeading) simHeading.textContent = state.current.studentName || 'Examen libre sin alumno';
    const subTitle = document.querySelector('.topbar-titles p');
    if (subTitle && state.screen === 'sim') subTitle.textContent = state.current.studentName || 'Examen libre';
  }
  if (immediate) {
    // Si escribió el nombre exacto de un alumno existente y no estaba vinculado, ofrecer vínculo automático limpio
    if (field === 'studentName' && !state.current.studentId) {
      const match = state.students.find((s) => normalise(s.name) === normalise(target.value.trim()));
      if (match) {
        state.current.studentId = match.id;
        state.current.studentName = match.name;
      }
    }
    await persistCurrent();
  } else {
    schedulePersistCurrent();
  }
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
  if (field === 'name') {
    const detailHeading = document.querySelector('#student-detail-heading');
    if (detailHeading) detailHeading.textContent = student.name || 'Ficha de alumno';
    const topHeading = document.querySelector('.topbar-titles h1');
    if (topHeading && state.screen === 'student-detail') topHeading.textContent = student.name || 'Ficha de alumno';
  }
  if (immediate) {
    student.updatedAt = nowIso();
    await putStudent(student);
    await refreshData();
    if (state.current?.studentId === student.id) {
      state.current.studentName = student.name;
      await persistCurrent();
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
    setUserAlert('Nombre obligatorio', 'Introduce el nombre y apellidos del alumno para guardar su expediente.', { code: 'STUDENT_NAME_REQUIRED' });
    return;
  }
  const existing = state.students.find((s) => normalise(s.name) === normalise(name));
  if (existing) {
    const proceed = window.confirm(`Ya existe un alumno llamado «${existing.name}». ¿Quieres crear otra ficha distinta igualmente?`);
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
  await refreshData();
  state.selectedStudentId = student.id;
  setToast('Ficha de alumno guardada');
  if (startExam) {
    await startSimulationForStudent(student.id);
  } else {
    navigateTo('student-detail');
  }
}

async function removeStudent(studentId) {
  const student = state.students.find((s) => s.id === studentId);
  if (!student) return;
  const exams = simulationsForStudent(studentId);
  const msg = exams.length
    ? `¿Eliminar la ficha de «${student.name}»? Sus ${exams.length} prueba(s) se conservarán en el historial general como pruebas libres.`
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
    await persistCurrent();
  }
  await deleteStudent(studentId);
  if (state.selectedStudentId === studentId) state.selectedStudentId = null;
  await refreshData();
  setToast('Ficha de alumno eliminada');
  navigateTo('students');
}

async function startSimulationForStudent(studentId) {
  const canSwitch = await pauseAndSaveActiveIfNeeded();
  if (!canSwitch) return;
  const student = state.students.find((item) => item.id === studentId) || await getStudent(studentId);
  if (!student) {
    setUserAlert('Alumno no encontrado', 'No se ha encontrado la ficha del alumno seleccionado.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(emptySimulation(student));
  state.selectedStudentId = student.id;
  await persistCurrent();
  navigateTo('sim');
}

async function startQuickSimulation() {
  if (state.current && state.current.status !== 'finalized' && (state.current.faults?.length || state.current.studentName || hasRunningTimers(state.current.timers))) {
    const ok = window.confirm('¿Iniciar una prueba nueva? La prueba actual quedará guardada en el historial.');
    if (!ok) return;
    pauseAllTimers(state.current.timers);
    await persistCurrent();
  }
  state.current = ensureSimulationShape(emptySimulation());
  await persistCurrent();
  navigateTo('sim');
}

async function viewStudent(id) {
  const student = state.students.find((item) => item.id === id) || await getStudent(id);
  if (!student) {
    setUserAlert('Alumno no encontrado', 'El expediente solicitado ya no existe.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.selectedStudentId = student.id;
  navigateTo('student-detail');
}

async function recordFault(id, { note = '', goSummary = false } = {}) {
  if (!state.current) return;
  const item = catalogById.get(Number(id));
  if (!item) {
    setUserAlert('Criterio no encontrado', 'La falta seleccionada no figura en el catálogo.', { code: 'FAULT_CATALOG_NOT_FOUND' });
    return;
  }
  if (state.current.status === 'finalized') {
    state.current.status = 'draft';
  }
  state.current.faults.push({
    uid: makeId('fault'),
    faultId: item.id,
    tipo: item.tipo,
    note,
    snapshot: { ...item },
    createdAt: nowIso()
  });
  state.openFault = null;
  await persistCurrent();
  setToast(`+1 ${levelName(item.tipo)}: ${item.falta.slice(0, 42)}${item.falta.length > 42 ? '…' : ''}`);
  if (goSummary) navigateTo('summary');
  else render();
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
  if (!state.current) return;
  ensureSimulationShape(state.current);
  setTimerStatus(key, true);
  await persistCurrent();
  syncTimerLoop();
  if (state.screen === 'sim') {
    updateTimerDisplays();
    refreshTimerControls(key);
  } else {
    render();
  }
}

async function pauseStopwatch(key) {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  setTimerStatus(key, false);
  await persistCurrent();
  syncTimerLoop();
  if (state.screen === 'sim') {
    updateTimerDisplays();
    refreshTimerControls(key);
  } else {
    render();
  }
}

async function resetStopwatch(key) {
  if (!state.current) return;
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
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const timer = state.current.timers.parking;
  const elapsedMs = effectiveElapsed(timer);
  if (elapsedMs <= 0) {
    setUserAlert('Cronómetro en cero', 'Inicia el cronómetro de maniobra antes de guardar una marca.', { code: 'NO_TIME_TO_SAVE' });
    return;
  }
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
  setToast('Tiempo de maniobra registrado');
  render();
}

async function removeTimeRecord(id) {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  state.current.timers.parking.records = state.current.timers.parking.records.filter((record) => record.id !== id);
  await persistCurrent();
  render();
}

function applyCountdownDuration(value, { renderAfter = false } = {}) {
  if (!state.current) return;
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
  if (!state.current) return;
  ensureSimulationShape(state.current);
  if (state.current.status === 'finalized') state.current.status = 'draft';
  const countdown = state.current.timers.countdown;
  if (effectiveRemaining(countdown) <= 0) countdown.remainingMs = countdown.durationMs;
  countdown.running = true;
  countdown.startedAt = currentTimestamp();
  countdown.endedAt = null;
  await persistCurrent();
  syncTimerLoop();
  const box = document.querySelector('.timer-box-wide');
  if (box) box.classList.remove('is-expired');
  updateTimerDisplays();
  refreshTimerControls('countdown');
}

async function pauseCountdown() {
  if (!state.current) return;
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
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
  await persistCurrent();
  syncTimerLoop();
  const box = document.querySelector('.timer-box-wide');
  if (box) box.classList.remove('is-expired');
  updateTimerDisplays();
  refreshTimerControls('countdown');
}

function updateTimerDisplays() {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  document.querySelectorAll('[data-timer-display]').forEach((node) => {
    const [mode, key, variant] = node.dataset.timerDisplay.split(':');
    const timer = timers[key];
    if (!timer) return;
    const ms = mode === 'remaining' ? effectiveRemaining(timer) : effectiveElapsed(timer);
    node.innerHTML = formatClock(ms, { showTenths: variant !== 'compact' });
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
    setToast('Tiempo de cuenta atrás cumplido');
    const box = document.querySelector('.timer-box-wide');
    if (box) box.classList.add('is-expired');
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
    setUserAlert('Prueba no encontrada', 'El examen seleccionado ya no se encuentra en la base de datos.', { code: 'SIMULATION_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(sim);
  state.selectedStudentId = sim.studentId || null;
  await putSetting('currentSimulationId', sim.id);
  navigateTo(sim.status === 'finalized' ? 'summary' : 'sim');
}

async function duplicateSimulation(id) {
  const canSwitch = await pauseAndSaveActiveIfNeeded();
  if (!canSwitch) return;
  const original = await getSimulation(id);
  if (!original) {
    setUserAlert('No se pudo duplicar', 'El examen original no existe o no se pudo leer.', { code: 'DUPLICATE_NOT_FOUND' });
    return;
  }
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
  state.selectedStudentId = copy.studentId || null;
  await refreshData();
  await putSetting('currentSimulationId', copy.id);
  setToast('Prueba duplicada');
  navigateTo('sim');
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

    if (state.current) {
      const updatedCurrent = await getSimulation(state.current.id);
      if (updatedCurrent) state.current = ensureSimulationShape(updatedCurrent);
    } else if (state.history.length) {
      state.current = ensureSimulationShape(state.history[0]);
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

  if (action === 'go-back') {
    if (state.screen === 'student-detail' || state.screen === 'student-new') {
      navigateTo('students');
    } else {
      navigateTo('home');
    }
    return;
  }

  if (action === 'screen') {
    navigateTo(target.dataset.screen);
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
    document.querySelector('#fault-search-input')?.focus();
    return;
  }

  if (action === 'reset-fault-filters') {
    state.query = '';
    state.filter = 'ALL';
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
  if (action === 'new-quick-simulation') return startQuickSimulation();

  if (action === 'unlink-student') {
    if (!state.current) return;
    state.current.studentId = null;
    await persistCurrent();
    render();
    return;
  }

  if (action === 'open-fault') {
    state.openFault = Number(target.dataset.id);
    render();
    return;
  }

  if (action === 'quick-add-fault') {
    return recordFault(target.dataset.id, { goSummary: false });
  }

  if (action === 'close-sheet') {
    state.openFault = null;
    render();
    return;
  }

  if (action === 'add-fault') {
    const note = document.querySelector('#fault-note')?.value?.trim() || '';
    return recordFault(target.dataset.id, { note, goSummary: true });
  }

  if (action === 'add-fault-continue') {
    const note = document.querySelector('#fault-note')?.value?.trim() || '';
    return recordFault(target.dataset.id, { note, goSummary: false });
  }

  if (action === 'remove-fault') {
    const index = Number(target.dataset.index);
    if (!state.current || !Number.isInteger(index) || index < 0 || index >= state.current.faults.length) {
      setUserAlert('No se pudo quitar la falta', 'La falta seleccionada ya no existe en esta prueba.', { code: 'FAULT_NOT_FOUND' });
      return;
    }
    state.current.faults.splice(index, 1);
    await persistCurrent();
    render();
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
    const ok = window.confirm('¿Borrar definitivamente esta prueba del historial?');
    if (!ok) return;
    const deletedId = target.dataset.id;
    await deleteSimulation(deletedId);
    if (state.current?.id === deletedId) {
      state.current = null;
      await putSetting('currentSimulationId', null);
      syncTimerLoop();
    }
    await refreshData();
    setToast('Prueba eliminada');
    render();
    return;
  }

  if (action === 'pdf') {
    try {
      const warnings = validateSimulationForPdf(state.current);
      if (warnings.length) {
        const ok = window.confirm(`${warnings.join(' ')} ¿Generar el informe PDF igualmente?`);
        if (!ok) return;
      }
      state.pdfBusy = true;
      render();
      await persistCurrent();
      const { downloadSimulationPdf } = await import('./pdf.js');
      downloadSimulationPdf(state.current, catalogById);
      setToast('Informe PDF descargado');
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
      if (!state.current) throw userError('No hay prueba activa para exportar.', { title: 'Sin prueba activa', code: 'NO_CURRENT_SIMULATION' });
      await persistCurrent();
      downloadJson(state.current, `Simulacion_${state.current.date || localTodayIso()}.json`);
      setToast('Prueba exportada');
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'export-all') {
    try {
      if (state.current) await persistCurrent();
      await refreshData();
      downloadJson(
        { exportedAt: nowIso(), version: '0.6.0', students: state.students, simulations: state.history },
        `Copia_PermisoB_${localTodayIso()}.json`
      );
      setToast('Copia completa descargada');
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'finalize') {
    if (!state.current) return;
    pauseAllTimers(state.current.timers);
    state.current.status = 'finalized';
    await persistCurrent();
    syncTimerLoop();
    setToast('Prueba finalizada y tiempos detenidos');
    render();
    return;
  }

  if (action === 'reopen') {
    if (!state.current) return;
    state.current.status = 'draft';
    await persistCurrent();
    setToast('Prueba reabierta para edición');
    render();
    return;
  }

  if (action === 'clear-current') {
    if (!state.current?.faults?.length) return;
    const ok = window.confirm('¿Eliminar todas las faltas anotadas en la prueba actual?');
    if (!ok) return;
    state.current.faults = [];
    await persistCurrent();
    render();
    return;
  }

  if (action === 'dismiss-install') {
    state.installedHintDismissed = true;
    await putSetting('installHintDismissed', true);
    render();
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
    const container = document.querySelector('#fault-blocks-container');
    if (container) container.innerHTML = faultBlocksInnerHtml();
  } else if (target.dataset.search === 'students') {
    state.studentQuery = target.value;
    const container = document.querySelector('#student-results-container');
    if (container) container.innerHTML = filteredStudentsHtml();
  } else if (target.dataset.search === 'history') {
    state.historyQuery = target.value;
    const container = document.querySelector('#history-results-container');
    if (container) container.innerHTML = filteredHistoryHtml();
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
      setToast(state.wakeLockEnabled ? 'Pantalla activa habilitada' : 'Pantalla activa desactivada');
      if (state.screen === 'settings') render();
    }
  } catch (error) {
    showUserError(error, 'general');
  }
});

app.addEventListener('toggle', (event) => {
  const details = event.target;
  if (!(details instanceof HTMLDetailsElement) || !details.classList.contains('fault-group')) return;
  if (state.query.trim() || state.filter !== 'ALL') return;
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
  if (document.visibilityState === 'visible') {
    updateTimerDisplays();
  }
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
    setUserAlert('Revisa el catálogo de faltas', `Se han detectado ${catalogErrors.length} problemas en el catálogo.`, { code: 'CATALOG_WARNINGS' });
  }
  await openDatabase();
  state.installedHintDismissed = Boolean(await getSetting('installHintDismissed'));
  state.wakeLockEnabled = Boolean(await getSetting('wakeLockEnabled', false));
  await migrateExistingSimulationsToStudents();
  await refreshData();

  const currentId = await getSetting('currentSimulationId');
  if (currentId) {
    const saved = await getSimulation(currentId);
    state.current = saved ? ensureSimulationShape(saved) : null;
  }

  state.screen = 'home';
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
    <main class="workspace startup-error">
      <div class="alert-banner alert-error" role="alert">
        <div class="alert-body">
          <strong>${esc(friendly.title || 'No se pudo iniciar la aplicación')}</strong>
          <p>${esc(friendly.message)}</p>
          <span class="alert-code">Ref: ${esc(friendly.code || 'INIT_ERROR')}</span>
        </div>
      </div>
    </main>
  `;
});
