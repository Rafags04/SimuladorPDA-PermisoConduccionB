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
import { downloadSimulationPdf } from './pdf.js';
import { friendlyError, userError } from './userErrors.js';
import {
  extractSimulationsFromImport,
  normalizeImportedSimulation,
  validateCatalog,
  validateCountdownMinutes,
  validateImportFile,
  validateSimulationForPdf
} from './validation.js';

const app = document.querySelector('#app');
const catalogById = new Map(catalog.map((item) => [item.id, item]));
const DEFAULT_COUNTDOWN_MINUTES = 25;

const state = {
  screen: 'home',
  catalog,
  current: null,
  history: [],
  students: [],
  selectedStudentId: null,
  query: '',
  studentQuery: '',
  filter: 'ALL',
  openFault: null,
  toast: '',
  userAlert: null,
  installedHintDismissed: false,
  studentDraft: emptyStudentDraft(),
  settings: {
    autoSave: true,
    keepScreenNote: true
  }
};

const today = () => new Date().toISOString().slice(0, 10);
const nowIso = () => new Date().toISOString();
const currentTimestamp = () => Date.now();

function emptyStudentDraft() {
  return {
    name: '',
    phone: '',
    email: '',
    notes: ''
  };
}

function defaultTimers() {
  return {
    exam: {
      label: 'Examen completo',
      elapsedMs: 0,
      running: false,
      startedAt: null
    },
    parking: {
      label: 'Aparcamiento',
      elapsedMs: 0,
      running: false,
      startedAt: null,
      records: []
    },
    countdown: {
      label: 'Examen temporizado',
      durationMs: DEFAULT_COUNTDOWN_MINUTES * 60 * 1000,
      remainingMs: DEFAULT_COUNTDOWN_MINUTES * 60 * 1000,
      running: false,
      startedAt: null,
      endedAt: null
    }
  };
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
    date: today(),
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
  if (!simulation) return simulation;
  const defaults = defaultTimers();
  simulation.studentId = simulation.studentId || null;
  simulation.studentName = String(simulation.studentName || '');
  simulation.faults = Array.isArray(simulation.faults) ? simulation.faults : [];
  simulation.timers = simulation.timers || {};
  simulation.timers.exam = { ...defaults.exam, ...(simulation.timers.exam || {}) };
  simulation.timers.parking = { ...defaults.parking, ...(simulation.timers.parking || {}) };
  simulation.timers.parking.records = Array.isArray(simulation.timers.parking.records) ? simulation.timers.parking.records : [];
  simulation.timers.countdown = { ...defaults.countdown, ...(simulation.timers.countdown || {}) };
  if (!Number.isFinite(simulation.timers.countdown.durationMs) || simulation.timers.countdown.durationMs <= 0) {
    simulation.timers.countdown.durationMs = defaults.countdown.durationMs;
  }
  if (!Number.isFinite(simulation.timers.countdown.remainingMs)) {
    simulation.timers.countdown.remainingMs = simulation.timers.countdown.durationMs;
  }
  simulation.status = simulation.status === 'finalized' ? 'finalized' : 'draft';
  return simulation;
}

function ensureStudentShape(student) {
  if (!student) return student;
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

function fmtDate(value) {
  if (!value) return 'Sin fecha';
  try {
    return new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
  } catch {
    return value;
  }
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

function formatMs(ms) {
  const safe = Math.max(0, Math.floor(Number(ms || 0)));
  const milliseconds = safe % 1000;
  const totalSeconds = Math.floor(safe / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  
  const decimas = Math.floor(milliseconds / 100);
  const centesimas = Math.floor((milliseconds % 100) / 10);
  const milesimas = milliseconds % 10;
  
  const ss = String(seconds).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  
  const smallPart = `<small>.${decimas}${centesimas}${milesimas}</small>`;
  const formatted = `${mm}:${ss}${smallPart}`;
  if (hours > 0) return `${String(hours).padStart(2, '0')}:${formatted}`;
  return formatted;
}

function countdownMinutes(timer) {
  return Math.max(1, Math.round(Number(timer?.durationMs || DEFAULT_COUNTDOWN_MINUTES * 60 * 1000) / 60000));
}

function selectedStudent() {
  return state.students.find((student) => student.id === state.selectedStudentId) || null;
}

function simulationsForStudent(studentId) {
  return state.history.filter((sim) => sim.studentId === studentId);
}

function latestSimulationForStudent(studentId) {
  return simulationsForStudent(studentId)[0] || null;
}

function calculateCurrent() {
  return evaluateSimulation(state.current?.faults || []);
}

function setToast(message) {
  state.toast = message;
  render();
  if (message) {
    window.clearTimeout(setToast.timer);
    setToast.timer = window.setTimeout(() => {
      state.toast = '';
      render();
    }, 2600);
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

function alertHtml() {
  if (!state.userAlert) return '';
  const alert = state.userAlert;
  return `
    <section class="user-alert user-alert-${esc(alert.type)}" role="alert" aria-live="assertive">
      <div>
        <strong>${esc(alert.title)}</strong>
        <p>${esc(alert.message)}</p>
        ${alert.code ? `<small>Código: ${esc(alert.code)}</small>` : ''}
      </div>
      <button class="ghost-button" data-action="clear-alert">Cerrar</button>
    </section>
  `;
}

function badge(tipo) {
  return `<span class="badge badge-${esc(tipo)}">${esc(tipo)}</span>`;
}

function resultBanner(result, compact = false) {
  const reason = result.reasons.length ? `<small>${esc(result.reasons.join(' · '))}</small>` : '<small>Resultado provisional según reglas de cómputo.</small>';
  return `
    <div class="result-banner ${result.noApto ? 'is-noapto' : 'is-apto'} ${compact ? 'compact' : ''}">
      <strong>${result.result}</strong>
      ${compact ? '' : reason}
    </div>
  `;
}

function kpisHtml(result) {
  return `
    <div class="kpi-grid">
      <div class="kpi"><b>${result.L}</b><span>Leves</span></div>
      <div class="kpi"><b>${result.D}</b><span>Deficientes</span></div>
      <div class="kpi"><b>${result.E}</b><span>Eliminatorias</span></div>
      <div class="kpi"><b>${result.total}</b><span>Total</span></div>
    </div>
  `;
}

function topBar() {
  const titleByScreen = {
    home: 'Inicio',
    'student-new': 'Nuevo alumno',
    students: 'Lista de alumnos',
    'student-detail': selectedStudent()?.name || 'Ficha de alumno',
    sim: state.current?.studentName || 'Simulación',
    faults: 'Añadir faltas',
    summary: 'Resumen',
    history: 'Historial de exámenes',
    settings: 'Ajustes'
  };
  const subtitleByScreen = {
    home: 'Simulador permiso B',
    'student-new': 'Crear ficha de alumno',
    students: `${state.students.length} alumnos guardados`,
    'student-detail': 'Datos y exámenes del alumno',
    sim: [state.current?.zone, fmtDate(state.current?.date)].filter(Boolean).join(' · ') || 'Examen activo',
    faults: state.current?.studentName || 'Selecciona la falta cometida',
    summary: state.current?.studentName || 'Informe de la simulación',
    history: `${state.history.length} exámenes guardados`,
    settings: 'Copias, importación y ayuda'
  };
  const showBack = state.screen !== 'home';
  const mini = state.current ? `<div class="mini-result ${calculateCurrent().noApto ? 'danger' : 'ok'}">${calculateCurrent().result}</div>` : '';
  return `
    <header class="app-header">
      ${showBack ? `<button class="icon-button" data-action="go-home" aria-label="Volver al inicio">‹</button>` : ''}
      <div>
        <p class="eyebrow">${esc(subtitleByScreen[state.screen] || 'Simulador permiso B')}</p>
        <h1>${esc(titleByScreen[state.screen] || 'Simulador')}</h1>
      </div>
      ${mini}
    </header>
  `;
}

function navButton(screen, label, icon) {
  return `<button class="nav-item ${state.screen === screen ? 'active' : ''}" data-action="screen" data-screen="${screen}"><span>${icon}</span>${label}</button>`;
}

function bottomNav() {
  return `
    <nav class="bottom-nav">
      ${navButton('home', 'Inicio', '⌂')}
      ${navButton('students', 'Alumnos', '👤')}
      ${navButton('sim', 'Examen', '🚘')}
      ${navButton('faults', 'Faltas', '＋')}
      ${navButton('summary', 'Resumen', '📋')}
    </nav>
  `;
}

function installHint() {
  if (state.installedHintDismissed) return '';
  return `
    <section class="card install-card">
      <div>
        <strong>Instalable en iPhone</strong>
        <p>Cuando esté publicada en HTTPS: Safari → Compartir → Añadir a pantalla de inicio.</p>
      </div>
      <button class="ghost-button" data-action="dismiss-install">Ocultar</button>
    </section>
  `;
}

function homeView() {
  const activeName = state.current?.studentName || 'Sin examen activo';
  const activeResult = calculateCurrent();
  const finalized = state.history.filter((sim) => sim.status === 'finalized').length;
  return `
    <main class="screen home-screen">
      ${installHint()}
      <section class="card hero-card">
        <p class="eyebrow">Simulador PDA</p>
        <h2>Permiso de Conducción B</h2>
        <p class="muted">Gestiona tus alumnos y simulaciones con facilidad.</p>
        <div class="home-stats kpi-grid">
          <div class="kpi"><b>${state.students.length}</b><span>Alumnos</span></div>
          <div class="kpi"><b>${state.history.length}</b><span>Exámenes</span></div>
          <div class="kpi"><b>${finalized}</b><span>Finalizados</span></div>
        </div>
      </section>

      <section class="home-grid">
        <button class="home-card primary-card" data-action="screen" data-screen="student-new">
          <span>👨‍🎓</span>
          <strong>Nuevo alumno</strong>
          <small>Crea una nueva ficha rápidamente</small>
        </button>
        <button class="home-card" data-action="screen" data-screen="students">
          <span>👥</span>
          <strong>Lista de alumnos</strong>
          <small>Gestiona tus alumnos registrados</small>
        </button>
        <button class="home-card" data-action="new-quick-simulation">
          <span>🚘</span>
          <strong>Examen rápido</strong>
          <small>Inicia una simulación libre</small>
        </button>
        <button class="home-card" data-action="screen" data-screen="history">
          <span>🕘</span>
          <strong>Historial</strong>
          <small>Consulta todas las pruebas</small>
        </button>
        ${state.current ? `
        <button class="home-card primary-card" style="grid-column: 1 / -1; flex-direction: row; gap: 16px; padding: 14px 20px;" data-action="screen" data-screen="sim">
          <span style="margin: 0; font-size: 24px;">▶</span>
          <div style="text-align: left; flex: 1;">
            <strong style="margin: 0; font-size: 18px;">Continuar examen</strong>
            <small style="display: block;">${esc(activeName)} · ${activeResult.result}</small>
          </div>
        </button>
        ` : ''}
        <button class="home-card" style="grid-column: 1 / -1;" data-action="screen" data-screen="settings">
          <span>⚙️</span>
          <strong>Ajustes y copias</strong>
          <small>Opciones, exportación e importación</small>
        </button>
      </section>
    </main>
  `;
}

function newStudentView() {
  const draft = state.studentDraft;
  return `
    <main class="screen">
      <section class="card form-card">
        <h2>Nuevo alumno</h2>
        <p class="muted">Al guardar, el alumno aparecerá en la lista y podrás crear exámenes asociados a su ficha.</p>
        <label>Nombre y apellidos *</label>
        <input data-student-draft="name" value="${esc(draft.name)}" placeholder="Ej.: Juan Pérez" autocomplete="off" />
        <div class="two-cols">
          <label>Teléfono
            <input data-student-draft="phone" value="${esc(draft.phone)}" placeholder="Opcional" inputmode="tel" autocomplete="off" />
          </label>
          <label>Email
            <input data-student-draft="email" value="${esc(draft.email)}" placeholder="Opcional" inputmode="email" autocomplete="off" />
          </label>
        </div>
        <label>Notas del alumno
          <textarea data-student-draft="notes" placeholder="Observaciones generales del alumno">${esc(draft.notes)}</textarea>
        </label>
        <div class="actions-row">
          <button class="primary" data-action="create-student">Guardar alumno</button>
          <button class="secondary" data-action="create-student-and-exam">Guardar y empezar examen</button>
        </div>
      </section>
    </main>
  `;
}

function studentsView() {
  const query = normalise(state.studentQuery);
  const rows = state.students.filter((student) => {
    const haystack = normalise(`${student.name} ${student.phone} ${student.email} ${student.notes}`);
    return !query || haystack.includes(query);
  });
  return `
    <main class="screen">
      <section class="card list-tools">
        <div class="section-head">
          <div>
            <h2>Alumnos</h2>
            <p class="muted">Selecciona un alumno para ver sus datos y exámenes.</p>
          </div>
          <button class="primary" data-action="screen" data-screen="student-new">Nuevo alumno</button>
        </div>
        <input class="search" data-action="student-search" value="${esc(state.studentQuery)}" placeholder="Buscar alumno, teléfono, email..." autocomplete="off" />
      </section>
      <section class="student-list">
        ${rows.length ? rows.map(studentCard).join('') : emptyState('No hay alumnos que coincidan', 'Crea un alumno nuevo o cambia la búsqueda.')}
      </section>
    </main>
  `;
}

function studentCard(student) {
  const exams = simulationsForStudent(student.id);
  const latest = exams[0];
  const lastResult = latest ? evaluateSimulation(latest.faults || []).result : 'Sin exámenes';
  return `
    <article class="card student-card" data-student-id="${esc(student.id)}">
      <div>
        <h3>${esc(student.name || 'Alumno sin nombre')}</h3>
        <p class="muted">${esc([student.phone, student.email].filter(Boolean).join(' · ') || 'Sin contacto guardado')}</p>
        <small>${exams.length} examen/es · Último: ${latest ? `${fmtDate(latest.date)} · ${lastResult}` : 'sin datos'}</small>
      </div>
      <div class="student-actions">
        <button class="secondary" data-action="view-student" data-id="${esc(student.id)}">Ver ficha</button>
        <button class="primary" data-action="new-exam-student" data-id="${esc(student.id)}">Nuevo examen</button>
      </div>
    </article>
  `;
}

function studentDetailView() {
  const student = selectedStudent();
  if (!student) return `<main class="screen">${emptyState('Alumno no encontrado', 'Vuelve a la lista de alumnos y selecciona de nuevo.')}</main>`;
  const exams = simulationsForStudent(student.id);
  return `
    <main class="screen">
      <section class="card student-profile">
        <div class="section-head">
          <div>
            <p class="eyebrow">Ficha de alumno</p>
            <h2>${esc(student.name)}</h2>
            <p class="muted">${exams.length} examen/es guardados</p>
          </div>
          <button class="primary" data-action="new-exam-student" data-id="${esc(student.id)}">Nuevo examen</button>
        </div>
        <div class="two-cols">
          <label>Nombre y apellidos
            <input data-student-field="name" data-id="${esc(student.id)}" value="${esc(student.name)}" autocomplete="off" />
          </label>
          <label>Teléfono
            <input data-student-field="phone" data-id="${esc(student.id)}" value="${esc(student.phone)}" inputmode="tel" autocomplete="off" />
          </label>
        </div>
        <label>Email
          <input data-student-field="email" data-id="${esc(student.id)}" value="${esc(student.email)}" inputmode="email" autocomplete="off" />
        </label>
        <label>Notas del alumno
          <textarea data-student-field="notes" data-id="${esc(student.id)}" placeholder="Observaciones del alumno">${esc(student.notes)}</textarea>
        </label>
      </section>

      <section class="card">
        <div class="section-head">
          <div>
            <h2>Exámenes del alumno</h2>
            <p class="muted">Todos los exámenes asociados a esta ficha.</p>
          </div>
        </div>
        ${exams.length ? exams.map(historyItem).join('') : emptyState('Todavía no hay exámenes', 'Pulsa “Nuevo examen” para iniciar una simulación asociada a este alumno.')}
      </section>
    </main>
  `;
}

function byBlock() {
  const query = normalise(state.query);
  const filter = state.filter;
  const rows = catalog.filter((item) => {
    const matchesFilter = filter === 'ALL' || item.tipo === filter;
    const searchable = normalise(`${item.falta} ${item.obs} ${item.bloque} ${item.nivel}`);
    return matchesFilter && (!query || searchable.includes(query));
  });
  const map = new Map();
  rows.forEach((item) => {
    if (!map.has(item.bloque)) map.set(item.bloque, []);
    map.get(item.bloque).push(item);
  });
  return map;
}

function simulationView() {
  if (!state.current) return `<main class="screen">${emptyState('No hay examen activo', 'Crea un alumno o inicia un examen rápido.')}</main>`;
  ensureSimulationShape(state.current);
  const sim = state.current;
  const result = calculateCurrent();
  const linkedStudent = sim.studentId ? state.students.find((student) => student.id === sim.studentId) : null;
  return `
    <main class="screen">
      <section class="card hero-card">
        <div class="hero-row">
          <div>
            <p class="eyebrow">Examen activo</p>
            <h2>${esc(sim.studentName || 'Sin alumno asignado')}</h2>
            <p class="muted">${linkedStudent ? 'Asociado a ficha de alumno' : 'Examen rápido sin ficha asociada'}</p>
          </div>
          ${resultBanner(result, true)}
        </div>
        ${kpisHtml(result)}
      </section>

      <section class="card form-card">
        <h2>Datos del examen</h2>
        ${linkedStudent ? `
          <div class="linked-student-box">
            <span>Alumno vinculado</span>
            <strong>${esc(linkedStudent.name)}</strong>
            <button class="ghost-button" data-action="view-student" data-id="${esc(linkedStudent.id)}">Ver ficha</button>
          </div>
        ` : `
          <label>Alumno/a
            <input data-field="studentName" value="${esc(sim.studentName)}" placeholder="Nombre del alumno" autocomplete="off" />
          </label>
        `}
        <div class="two-cols">
          <label>Fecha
            <input data-field="date" value="${esc(sim.date)}" type="date" />
          </label>
          <label>Zona / recorrido
            <input data-field="zone" value="${esc(sim.zone)}" placeholder="Ej.: Zona 2" autocomplete="off" />
          </label>
        </div>
        <div class="two-cols">
          <label>Profesor/a
            <input data-field="teacher" value="${esc(sim.teacher)}" placeholder="Opcional" autocomplete="off" />
          </label>
          <label>Vehículo
            <input data-field="vehicle" value="${esc(sim.vehicle)}" placeholder="Opcional" autocomplete="off" />
          </label>
        </div>
        <label>Observaciones generales
          <textarea data-field="generalNotes" placeholder="Comentarios generales del examen">${esc(sim.generalNotes)}</textarea>
        </label>
      </section>

      ${timersCard()}

      <section class="actions-stack">
        <button class="primary big" data-action="screen" data-screen="faults">Añadir falta</button>
        <button class="secondary big" data-action="screen" data-screen="summary">Ver resumen</button>
        <button class="ghost-button big" data-action="new-quick-simulation">Nuevo examen rápido</button>
      </section>
    </main>
  `;
}

function timeRecordsHtml(records = []) {
  if (!records.length) return '<p class="muted no-margin">No hay tiempos guardados todavía.</p>';
  return `
    <div class="time-records">
      ${records.map((record) => `
        <article class="time-record">
          <div>
            <strong>${esc(record.label || 'Maniobra')}</strong>
            <span>${fmtDate(record.createdAt || record.date)} · ${esc(record.note || '')}</span>
          </div>
          <div class="time-record-value">${formatMs(record.elapsedMs)}</div>
          <button class="ghost-button danger" data-action="remove-time-record" data-id="${esc(record.id)}">Borrar</button>
        </article>
      `).join('')}
    </div>
  `;
}

function timersCard() {
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  const exam = timers.exam;
  const parking = timers.parking;
  const countdown = timers.countdown;
  const countdownFinished = effectiveRemaining(countdown) <= 0 && !countdown.running;

  // Determinar estado de cada cronómetro
  const examElapsed = effectiveElapsed(exam);
  const parkingElapsed = effectiveElapsed(parking);

  // Botones del cronómetro del examen
  let examButtons;
  if (exam.running) {
    examButtons = `
      <button class="timer-btn timer-btn-stop" data-action="timer-pause" data-timer="exam">⏹ Parar</button>
      <button class="timer-btn timer-btn-reset" data-action="timer-reset" data-timer="exam">↺ Reiniciar</button>`;
  } else if (examElapsed > 0) {
    examButtons = `
      <button class="timer-btn timer-btn-resume" data-action="timer-start" data-timer="exam">▶ Reanudar</button>
      <button class="timer-btn timer-btn-reset" data-action="timer-reset" data-timer="exam">↺ Reiniciar</button>`;
  } else {
    examButtons = `<button class="timer-btn timer-btn-start" data-action="timer-start" data-timer="exam">▶ Iniciar</button>`;
  }

  // Botones del cronómetro de maniobra
  let parkingButtons;
  if (parking.running) {
    parkingButtons = `
      <button class="timer-btn timer-btn-lap" data-action="timer-save-record">⊕ Vuelta</button>
      <button class="timer-btn timer-btn-stop" data-action="timer-pause" data-timer="parking">⏹ Parar</button>
      <button class="timer-btn timer-btn-reset" data-action="timer-reset" data-timer="parking">↺ Reiniciar</button>`;
  } else if (parkingElapsed > 0) {
    parkingButtons = `
      <button class="timer-btn timer-btn-resume" data-action="timer-start" data-timer="parking">▶ Reanudar</button>
      <button class="timer-btn timer-btn-reset" data-action="timer-reset" data-timer="parking">↺ Reiniciar</button>`;
  } else {
    parkingButtons = `<button class="timer-btn timer-btn-start" data-action="timer-start" data-timer="parking">▶ Iniciar</button>`;
  }

  // Botones del temporizador cuenta atrás
  let countdownButtons;
  if (countdown.running) {
    countdownButtons = `
      <button class="timer-btn timer-btn-stop" data-action="countdown-pause">⏹ Parar</button>
      <button class="timer-btn timer-btn-reset" data-action="countdown-reset">↺ Reiniciar</button>`;
  } else if (countdownFinished) {
    countdownButtons = `<button class="timer-btn timer-btn-reset" data-action="countdown-reset">↺ Reiniciar</button>`;
  } else if (effectiveRemaining(countdown) < countdown.durationMs) {
    countdownButtons = `
      <button class="timer-btn timer-btn-resume" data-action="countdown-start">▶ Reanudar</button>
      <button class="timer-btn timer-btn-reset" data-action="countdown-reset">↺ Reiniciar</button>`;
  } else {
    countdownButtons = `<button class="timer-btn timer-btn-start" data-action="countdown-start">▶ Iniciar</button>`;
  }

  return `
    <section class="card timers-card">
      <div class="section-head">
        <div>
          <h2>Cronómetros y temporizadores</h2>
          <p class="muted">Mide el tiempo del examen, maniobras y cuenta atrás con precisión.</p>
        </div>
      </div>
      <div class="timer-grid">
        <article class="timer-panel">
          <div class="timer-status-bar">
            <strong>Cronómetro del examen</strong>
            <span class="timer-status-pill ${exam.running ? 'running' : examElapsed > 0 ? 'paused' : ''}">${
              exam.running ? '● En marcha' : examElapsed > 0 ? '‖ Pausado' : 'Listo'
            }</span>
          </div>
          <div class="timer-value digital-display" data-timer-display="elapsed:exam">${formatMs(examElapsed)}</div>
          <div class="timer-btn-row">${examButtons}</div>
        </article>

        <article class="timer-panel">
          <div class="timer-status-bar">
            <strong>Cronómetro de maniobra</strong>
            <span class="timer-status-pill ${parking.running ? 'running' : parkingElapsed > 0 ? 'paused' : ''}">${
              parking.running ? '● En marcha' : parkingElapsed > 0 ? '‖ Pausado' : 'Listo'
            }</span>
          </div>
          <label class="compact-label">Nombre
            <input data-timer-input="parkingLabel" value="${esc(parking.label || 'Aparcamiento')}" placeholder="Ej.: Aparcamiento" autocomplete="off" />
          </label>
          <div class="timer-value digital-display" data-timer-display="elapsed:parking">${formatMs(parkingElapsed)}</div>
          <div class="timer-btn-row">${parkingButtons}</div>
        </article>

        <article class="timer-panel timer-panel-wide ${countdownFinished ? 'timer-finished' : ''}">
          <div class="timer-status-bar">
            <strong>Temporizador cuenta atrás</strong>
            <span class="timer-status-pill ${countdown.running ? 'running' : countdownFinished ? 'finished' : ''}">${
              countdown.running ? '● Cuenta atrás' : countdownFinished ? '✓ Finalizado' : 'Listo'
            }</span>
          </div>
          <div class="countdown-settings">
            <label class="compact-label">Minutos
              <input type="number" min="1" max="180" step="1" data-timer-input="countdownMinutes" value="${countdownMinutes(countdown)}" />
            </label>
            <div class="preset-row">
              <button class="pill small" data-action="set-countdown" data-minutes="20">20 min</button>
              <button class="pill small" data-action="set-countdown" data-minutes="25">25 min</button>
              <button class="pill small" data-action="set-countdown" data-minutes="30">30 min</button>
              <button class="pill small" data-action="set-countdown" data-minutes="45">45 min</button>
            </div>
          </div>
          <div class="timer-value" data-timer-display="remaining:countdown">${formatMs(effectiveRemaining(countdown))}</div>
          <div class="timer-btn-row">${countdownButtons}</div>
        </article>
      </div>
      <details class="time-records-box" ${parking.records.length ? 'open' : ''}>
        <summary>Tiempos guardados <b>${parking.records.length}</b></summary>
        ${timeRecordsHtml(parking.records)}
      </details>
    </section>
  `;
}

function faultsView() {
  if (!state.current) return `<main class="screen">${emptyState('No hay examen activo', 'Inicia un examen antes de añadir faltas.')}</main>`;
  const blocks = byBlock();
  return `
    <main class="screen">
      <section class="card sticky-tools">
        <input class="search" data-action="search" value="${esc(state.query)}" placeholder="Buscar falta..." autocomplete="off" />
        <div class="filters">
          ${['ALL', 'L', 'D', 'E'].map((filter) => `
            <button class="pill ${state.filter === filter ? 'active' : ''}" data-action="filter" data-filter="${filter}">
              ${filter === 'ALL' ? 'Todas' : filter}
            </button>
          `).join('')}
        </div>
      </section>
      <section class="fault-blocks">
        ${[...blocks.entries()].map(([block, rows]) => `
          <details class="fault-block">
            <summary>
              <span class="fault-block-name">${esc(block)}</span>
              <span class="fault-block-count">${rows.length} falta${rows.length !== 1 ? 's' : ''}</span>
            </summary>
            <div class="fault-block-list">
              ${rows.map((item) => `
                <button class="fault-row" data-action="open-fault" data-id="${item.id}">
                  <span class="fault-row-badge">${badge(item.tipo)}</span>
                  <span class="fault-row-body">
                    <span class="fault-row-title">${esc(item.falta)}</span>
                    ${item.obs || item.nivel ? `<small class="fault-row-obs">${esc(item.obs || item.nivel)}</small>` : ''}
                  </span>
                </button>
              `).join('')}
            </div>
          </details>
        `).join('')}
      </section>
      ${faultSheet()}
    </main>
  `;
}

function faultSheet() {
  if (!state.openFault) return '';
  const item = catalogById.get(state.openFault);
  if (!item) return '';
  return `
    <div class="sheet-backdrop" data-action="close-sheet"></div>
    <section class="bottom-sheet" role="dialog" aria-modal="true">
      <button class="sheet-close" data-action="close-sheet">×</button>
      <p class="eyebrow">Añadir falta</p>
      <h2>${badge(item.tipo)} ${esc(item.falta)}</h2>
      <p class="muted">${esc(item.bloque)} · ${esc(levelName(item.tipo))}</p>
      ${item.obs ? `<p>${esc(item.obs)}</p>` : ''}
      <label>Observación para este examen
        <textarea id="fault-note" placeholder="Opcional"></textarea>
      </label>
      <div class="actions-row">
        <button class="primary" data-action="add-fault" data-id="${item.id}">Añadir y ver resumen</button>
        <button class="secondary" data-action="add-fault-continue" data-id="${item.id}">Añadir y seguir</button>
      </div>
    </section>
  `;
}

function summaryTimesCard() {
  if (!state.current) return '';
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  const records = timers.parking?.records || [];
  return `
    <section class="card">
      <h2>Tiempos</h2>
      <div class="time-summary-grid">
        <div><span>Examen</span><strong data-timer-display="elapsed:exam">${formatMs(effectiveElapsed(timers.exam))}</strong></div>
        <div><span>${esc(timers.parking?.label || 'Maniobra')}</span><strong data-timer-display="elapsed:parking">${formatMs(effectiveElapsed(timers.parking))}</strong></div>
        <div><span>Temporizador restante</span><strong data-timer-display="remaining:countdown">${formatMs(effectiveRemaining(timers.countdown))}</strong></div>
      </div>
      ${records.length ? `<div class="time-records compact-records">${records.map((record) => `
        <article class="time-record"><div><strong>${esc(record.label || 'Maniobra')}</strong><span>${fmtDate(record.createdAt)}</span></div><div class="time-record-value">${formatMs(record.elapsedMs)}</div></article>
      `).join('')}</div>` : '<p class="muted">No hay tiempos guardados.</p>'}
    </section>
  `;
}

function summaryView() {
  if (!state.current) return `<main class="screen">${emptyState('No hay examen activo', 'Inicia un examen para ver el resumen.')}</main>`;
  const result = calculateCurrent();
  return `
    <main class="screen">
      <section class="card hero-card">
        <div class="hero-row">
          <div>
            <p class="eyebrow">Resumen del examen</p>
            <h2>${esc(state.current.studentName || 'Sin alumno')}</h2>
          </div>
          ${resultBanner(result)}
        </div>
        ${kpisHtml(result)}
      </section>
      ${summaryTimesCard()}
      <section class="card">
        <h2>Faltas marcadas</h2>
        ${(state.current.faults || []).length ? state.current.faults.map((fault, index) => faultSummaryRow(fault, index)).join('') : '<p class="muted">No hay faltas marcadas.</p>'}
      </section>
      <section class="card">
        <h2>Acciones</h2>
        <div class="actions-row wrap">
          <button class="primary" data-action="pdf">Descargar PDF</button>
          <button class="secondary" data-action="print">Imprimir / guardar PDF</button>
          <button class="secondary" data-action="finalize">Marcar finalizado</button>
          <button class="ghost-button danger" data-action="clear-current">Vaciar faltas</button>
        </div>
      </section>
    </main>
  `;
}

function faultSummaryRow(fault, index) {
  const data = fault.snapshot || catalogById.get(fault.faultId) || fault;
  const tipo = data.tipo || fault.tipo || '';
  return `
    <article class="summary-fault">
      <div>
        <h3>${badge(tipo)} ${esc(data.falta || 'Falta')}</h3>
        <p>${esc(data.bloque || '')} · ${esc(levelName(tipo))}</p>
        ${fault.note ? `<small>Observación: ${esc(fault.note)}</small>` : ''}
      </div>
      <button class="ghost-button danger" data-action="remove-fault" data-index="${index}">Borrar</button>
    </article>
  `;
}

function historyView() {
  return `
    <main class="screen">
      <section class="card">
        <div class="section-head">
          <div>
            <h2>Historial general</h2>
            <p class="muted">Todos los exámenes guardados en este dispositivo.</p>
          </div>
          <button class="primary" data-action="new-quick-simulation">Nuevo examen rápido</button>
        </div>
        ${state.history.length ? state.history.map(historyItem).join('') : emptyState('No hay exámenes guardados', 'Crea un alumno o inicia un examen rápido.')}
      </section>
    </main>
  `;
}

function historyItem(sim) {
  const result = evaluateSimulation(sim.faults || []);
  const student = sim.studentId ? state.students.find((item) => item.id === sim.studentId) : null;
  return `
    <article class="history-item">
      <div>
        <h3>${esc(sim.studentName || student?.name || 'Sin alumno')}</h3>
        <p>${fmtDate(sim.date)} · ${esc(sim.zone || 'Sin zona')} · ${result.result}</p>
        <small>${result.L} L · ${result.D} D · ${result.E} E · ${sim.status === 'finalized' ? 'Finalizado' : 'Borrador'}</small>
      </div>
      <div class="history-actions">
        <button class="secondary" data-action="load-simulation" data-id="${esc(sim.id)}">Abrir</button>
        <button class="ghost-button" data-action="duplicate" data-id="${esc(sim.id)}">Duplicar</button>
        <button class="ghost-button danger" data-action="delete" data-id="${esc(sim.id)}">Borrar</button>
      </div>
    </article>
  `;
}

function settingsView() {
  return `
    <main class="screen">
      <section class="card">
        <h2>Ajustes y copias</h2>
        <p class="muted">Los datos se guardan localmente en este dispositivo. Haz copias periódicas antes de actualizar o desplegar.</p>
        <div class="actions-row wrap">
          <button class="secondary" data-action="export-json">Exportar examen activo</button>
          <button class="secondary" data-action="export-all">Exportar copia completa</button>
          <label class="file-button">Importar copia JSON
            <input type="file" accept="application/json,.json" data-action="import-json" />
          </label>
        </div>
      </section>
      <section class="card">
        <h2>Notas de uso</h2>
        <p>Para iPhone, publica la carpeta <code>dist</code> en HTTPS y abre la URL desde Safari. Luego usa “Añadir a pantalla de inicio”.</p>
      </section>
    </main>
  `;
}

function emptyState(title, text) {
  return `
    <section class="empty-state">
      <strong>${esc(title)}</strong>
      <p>${esc(text)}</p>
    </section>
  `;
}

function toastHtml() {
  return state.toast ? `<div class="toast">${esc(state.toast)}</div>` : '';
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
    ${alertHtml()}
    ${(views[state.screen] || homeView)()}
    ${bottomNav()}
    ${toastHtml()}
  `;
  updateTimerDisplays();
}

async function refreshData() {
  state.students = (await listStudents()).map(ensureStudentShape);
  state.history = (await listSimulations()).map(ensureSimulationShape);
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
function schedulePersistCurrent(delay = 350) {
  window.clearTimeout(persistDebounceTimer);
  persistDebounceTimer = window.setTimeout(() => persistCurrent().catch((error) => showUserError(error, 'save')), delay);
}

let studentPersistDebounceTimer;
function scheduleStudentPersist(student, delay = 350) {
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

function updateHeaderSnapshot() {
  if (!state.current) return;
  const headerTitle = document.querySelector('.app-header h1');
  if (headerTitle && ['sim', 'faults', 'summary'].includes(state.screen)) headerTitle.textContent = state.current.studentName || 'Simulación';
}

async function updateField(target, { immediate = false } = {}) {
  const field = target.dataset.field;
  if (!field || !state.current) return;
  state.current[field] = target.value;
  if (field === 'studentName') updateHeaderSnapshot();
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
    applyCountdownDuration(target.value, { renderAfter: false });
  }
  if (immediate) persistCurrent().catch((error) => showUserError(error, 'save'));
  else schedulePersistCurrent();
}

async function createStudent({ startExam = false } = {}) {
  const name = String(state.studentDraft.name || '').trim();
  if (!name) {
    setUserAlert('Falta el nombre del alumno', 'Escribe el nombre y apellidos antes de guardar la ficha.', { code: 'STUDENT_NAME_REQUIRED' });
    return;
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
  setToast('Alumno guardado');
  if (startExam) await startSimulationForStudent(student.id);
  else {
    state.screen = 'student-detail';
    render();
  }
}

async function startSimulationForStudent(studentId) {
  const student = state.students.find((item) => item.id === studentId) || await getStudent(studentId);
  if (!student) {
    setUserAlert('Alumno no encontrado', 'No se ha podido crear el examen porque la ficha del alumno no existe.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(emptySimulation(student));
  state.selectedStudentId = student.id;
  state.screen = 'sim';
  await persistCurrent();
  render();
}

async function startQuickSimulation() {
  if (state.current?.faults?.length || state.current?.studentName) {
    const ok = window.confirm('¿Crear un examen nuevo? El actual quedará guardado en el historial.');
    if (!ok) return;
  }
  state.current = ensureSimulationShape(emptySimulation());
  state.screen = 'sim';
  await persistCurrent();
  render();
}

async function viewStudent(id) {
  const student = state.students.find((item) => item.id === id) || await getStudent(id);
  if (!student) {
    setUserAlert('Alumno no encontrado', 'La ficha seleccionada no existe o no se ha podido abrir.', { code: 'STUDENT_NOT_FOUND' });
    return;
  }
  state.selectedStudentId = student.id;
  state.screen = 'student-detail';
  render();
}

async function addFault(id, stayOnFaults = false) {
  const item = catalogById.get(Number(id));
  if (!item) {
    setUserAlert('Falta no encontrada', 'La falta seleccionada no existe en el catálogo actual.', { code: 'FAULT_CATALOG_NOT_FOUND' });
    return;
  }
  const note = document.querySelector('#fault-note')?.value?.trim() || '';
  state.current.faults.push({
    uid: makeId('fault'),
    faultId: item.id,
    tipo: item.tipo,
    note,
    snapshot: { ...item },
    createdAt: nowIso()
  });
  state.openFault = null;
  if (!stayOnFaults) state.screen = 'summary';
  await persistCurrent();
  setToast('Falta añadida');
  render();
}

function setTimerStatus(key, running) {
  if (!state.current?.timers?.[key]) return null;
  const timer = state.current.timers[key];
  if (running && !timer.running) {
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
  updateTimerDisplays();
}

async function pauseStopwatch(key) {
  ensureSimulationShape(state.current);
  setTimerStatus(key, false);
  await persistCurrent();
  updateTimerDisplays();
}

async function resetStopwatch(key) {
  ensureSimulationShape(state.current);
  const timer = state.current.timers[key];
  if (!timer) return;
  timer.elapsedMs = 0;
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  updateTimerDisplays();
}

async function saveParkingRecord() {
  ensureSimulationShape(state.current);
  const timer = state.current.timers.parking;
  const elapsedMs = effectiveElapsed(timer);
  if (elapsedMs <= 0) {
    setUserAlert('No hay tiempo que guardar', 'Inicia el cronómetro de maniobra antes de guardar un tiempo.', { code: 'NO_TIME_TO_SAVE' });
    return;
  }
  timer.records.unshift({
    id: makeId('time'),
    label: timer.label || 'Maniobra',
    elapsedMs,
    createdAt: nowIso()
  });
  timer.elapsedMs = 0;
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  setToast('Tiempo guardado');
  render();
}

async function removeTimeRecord(id) {
  ensureSimulationShape(state.current);
  state.current.timers.parking.records = state.current.timers.parking.records.filter((record) => record.id !== id);
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
  if (renderAfter) render();
}

async function startCountdown() {
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  if (effectiveRemaining(countdown) <= 0) countdown.remainingMs = countdown.durationMs;
  countdown.running = true;
  countdown.startedAt = currentTimestamp();
  countdown.endedAt = null;
  await persistCurrent();
  updateTimerDisplays();
}

async function pauseCountdown() {
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  countdown.remainingMs = effectiveRemaining(countdown);
  countdown.running = false;
  countdown.startedAt = null;
  await persistCurrent();
  updateTimerDisplays();
}

async function resetCountdown() {
  ensureSimulationShape(state.current);
  const countdown = state.current.timers.countdown;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
  await persistCurrent();
  updateTimerDisplays();
}

function updateTimerDisplays() {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  document.querySelectorAll('[data-timer-display]').forEach((node) => {
    const [mode, key] = node.dataset.timerDisplay.split(':');
    const timer = timers[key];
    if (!timer) return;
    node.innerHTML = mode === 'remaining' ? formatMs(effectiveRemaining(timer)) : formatMs(effectiveElapsed(timer));
  });
  const countdown = timers.countdown;
  if (countdown?.running && effectiveRemaining(countdown) <= 0) {
    countdown.running = false;
    countdown.remainingMs = 0;
    countdown.startedAt = null;
    countdown.endedAt = nowIso();
    persistCurrent().catch((error) => showUserError(error, 'save'));
    setToast('Temporizador finalizado');
  }
}

async function loadSimulation(id) {
  const sim = await getSimulation(id);
  if (!sim) {
    setUserAlert('Examen no encontrado', 'No se ha podido abrir ese examen. Puede que se haya borrado.', { code: 'SIMULATION_NOT_FOUND' });
    return;
  }
  state.current = ensureSimulationShape(sim);
  state.selectedStudentId = sim.studentId || null;
  await putSetting('currentSimulationId', sim.id);
  state.screen = 'sim';
  render();
}

async function duplicateSimulation(id) {
  const original = await getSimulation(id);
  if (!original) {
    setUserAlert('No se pudo duplicar', 'El examen seleccionado no existe o no se ha podido leer.', { code: 'DUPLICATE_NOT_FOUND' });
    return;
  }
  const copy = ensureSimulationShape({
    ...original,
    id: makeId('sim'),
    status: 'draft',
    createdAt: nowIso(),
    updatedAt: nowIso()
  });
  await putSimulation(copy);
  state.current = copy;
  state.selectedStudentId = copy.studentId || null;
  await refreshData();
  await putSetting('currentSimulationId', copy.id);
  state.screen = 'sim';
  render();
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
  URL.revokeObjectURL(url);
}

async function handleImport(input) {
  const file = input.files?.[0];
  if (!file) return;
  try {
    validateImportFile(file);
    const text = await file.text();
    const payload = JSON.parse(text);
    const { simulations, invalidIndexes } = extractSimulationsFromImport(payload);
    const importedStudents = Array.isArray(payload?.students) ? payload.students : [];

    for (const student of importedStudents) {
      const normalized = ensureStudentShape(student);
      if (normalized.name) await putStudent(normalized);
    }

    for (const sim of simulations) {
      const normalized = ensureSimulationShape(normalizeImportedSimulation(sim, { makeId, nowIso }));
      await putSimulation(normalized);
    }

    await refreshData();
    const skipped = invalidIndexes.length ? ` (${invalidIndexes.length} entradas omitidas)` : '';
    setToast(`Copia importada${skipped}`);
    render();
  } catch (error) {
    showUserError(error, 'import');
  } finally {
    input.value = '';
  }
}

async function migrateExistingSimulationsToStudents() {
  await refreshData();
  const studentsByName = new Map(state.students.map((student) => [normalise(student.name), student]));
  let changed = false;
  for (const sim of state.history) {
    if (sim.studentId || !String(sim.studentName || '').trim()) continue;
    const key = normalise(sim.studentName);
    let student = studentsByName.get(key);
    if (!student) {
      student = emptyStudent({ name: sim.studentName.trim(), createdAt: sim.createdAt || nowIso(), updatedAt: nowIso() });
      await putStudent(student);
      studentsByName.set(key, student);
    }
    sim.studentId = student.id;
    await putSimulation(sim);
    changed = true;
  }
  if (changed) await refreshData();
}

async function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'clear-alert') {
    clearUserAlert();
    return;
  }
  if (action !== 'search' && action !== 'student-search') clearUserAlert();

  if (action === 'go-home') {
    state.screen = 'home';
    render();
    return;
  }

  if (action === 'screen') {
    state.screen = target.dataset.screen;
    render();
    return;
  }

  if (action === 'student-search') {
    state.studentQuery = target.value;
    render();
    const search = document.querySelector('.search');
    if (search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
    return;
  }

  if (action === 'search') {
    state.query = target.value;
    render();
    const search = document.querySelector('.search');
    if (search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
    return;
  }

  if (action === 'filter') {
    state.filter = target.dataset.filter;
    render();
    return;
  }

  if (action === 'create-student') return createStudent({ startExam: false });
  if (action === 'create-student-and-exam') return createStudent({ startExam: true });
  if (action === 'view-student') return viewStudent(target.dataset.id);
  if (action === 'new-exam-student') return startSimulationForStudent(target.dataset.id);
  if (action === 'new-quick-simulation') return startQuickSimulation();

  if (action === 'open-fault') {
    state.openFault = Number(target.closest('[data-id]')?.dataset.id || target.dataset.id);
    render();
    return;
  }
  if (action === 'close-sheet') {
    state.openFault = null;
    render();
    return;
  }
  if (action === 'add-fault') return addFault(target.dataset.id, false);
  if (action === 'add-fault-continue') return addFault(target.dataset.id, true);

  if (action === 'remove-fault') {
    const index = Number(target.dataset.index);
    if (!Number.isInteger(index) || index < 0 || index >= state.current.faults.length) {
      setUserAlert('No se pudo borrar la falta', 'La falta seleccionada ya no existe en este examen.', { code: 'FAULT_NOT_FOUND' });
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
    const ok = window.confirm('¿Borrar este examen del historial?');
    if (!ok) return;
    await deleteSimulation(target.dataset.id);
    if (state.current?.id === target.dataset.id) state.current = ensureSimulationShape(emptySimulation());
    await persistCurrent();
    await refreshData();
    render();
    return;
  }

  if (action === 'pdf') {
    try {
      const warnings = validateSimulationForPdf(state.current);
      if (warnings.length) {
        const ok = window.confirm(`${warnings.join(' ')} ¿Quieres generar el PDF igualmente?`);
        if (!ok) return;
      }
      await persistCurrent();
      downloadSimulationPdf(state.current, catalogById);
      setToast('PDF generado');
    } catch (error) {
      showUserError(error, 'pdf');
    }
    return;
  }

  if (action === 'print') {
    window.print();
    return;
  }

  if (action === 'export-json') {
    try {
      if (!state.current) throw userError('No hay examen activo para exportar.', { title: 'Sin examen activo', code: 'NO_CURRENT_SIMULATION' });
      downloadJson(state.current, `Simulacion_${state.current.date || today()}.json`);
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'export-all') {
    try {
      await refreshData();
      downloadJson({ exportedAt: nowIso(), students: state.students, simulations: state.history }, `Copia_simulador_permiso_B_${today()}.json`);
    } catch (error) {
      showUserError(error, 'export');
    }
    return;
  }

  if (action === 'import-json') return handleImport(target);

  if (action === 'finalize') {
    state.current.status = 'finalized';
    await persistCurrent();
    setToast('Examen marcado como finalizado');
    render();
    return;
  }

  if (action === 'clear-current') {
    const ok = window.confirm('¿Vaciar todas las faltas del examen activo?');
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
  if (target.dataset.action === 'search' || target.dataset.action === 'student-search') {
    handleAction(target).catch((error) => showUserError(error, 'general'));
  }
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.field) updateField(target, { immediate: true });
  if (target.dataset.studentField) updateStudentField(target, { immediate: true });
  if (target.dataset.timerInput) handleTimerInput(target, { immediate: true });
  if (target.dataset.action === 'import-json') handleAction(target).catch((error) => showUserError(error, 'general'));
});

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  event.preventDefault();
  handleAction(target).catch((error) => showUserError(error, 'general'));
});

async function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
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
  await migrateExistingSimulationsToStudents();
  const currentId = await getSetting('currentSimulationId');
  state.current = currentId ? ensureSimulationShape(await getSimulation(currentId)) : null;
  if (!state.current) {
    state.current = ensureSimulationShape(emptySimulation());
    await persistCurrent();
  }
  state.screen = 'home';
  render();
  window.setInterval(updateTimerDisplays, 16);
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
    <main class="screen startup-error">
      <section class="card user-alert user-alert-error" role="alert">
        <div>
          <strong>${esc(friendly.title || 'No se pudo iniciar')}</strong>
          <p>${esc(friendly.message)}</p>
          <small>Código: ${esc(friendly.code || 'INIT_ERROR')}</small>
        </div>
      </section>
    </main>
  `;
});
