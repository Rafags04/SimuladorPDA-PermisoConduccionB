import './styles.css';
import catalog from './data/faltas.json';
import {
  deleteSimulation,
  getSetting,
  getSimulation,
  listSimulations,
  makeId,
  openDatabase,
  putSetting,
  putSimulation
} from './db.js';
import { countFaults, evaluateSimulation, levelName } from './rules.js';
import { downloadSimulationPdf } from './pdf.js';

const catalogById = new Map(catalog.map((item) => [item.id, item]));
const app = document.querySelector('#app');

const state = {
  tab: 'sim',
  catalog,
  current: null,
  history: [],
  query: '',
  filter: 'ALL',
  openFault: null,
  toast: '',
  installedHintDismissed: false,
  settings: {
    autoSave: true,
    keepScreenNote: true
  }
};

const today = () => new Date().toISOString().slice(0, 10);

const DEFAULT_COUNTDOWN_MINUTES = 25;

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

function ensureSimulationShape(simulation) {
  if (!simulation) return simulation;
  const defaults = defaultTimers();
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
  return simulation;
}

function currentTimestamp() {
  return Date.now();
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
  const totalSeconds = Math.max(0, Math.floor(Number(ms || 0) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, '0');
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

function countdownMinutes(timer) {
  return Math.max(1, Math.round(Number(timer?.durationMs || DEFAULT_COUNTDOWN_MINUTES * 60 * 1000) / 60000));
}

function emptySimulation() {
  const now = new Date().toISOString();
  return {
    id: makeId('sim'),
    studentName: '',
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

function nowIso() {
  return new Date().toISOString();
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

async function persistCurrent() {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  state.current.updatedAt = nowIso();
  await putSimulation(state.current);
  await putSetting('currentSimulationId', state.current.id);
  state.history = await listSimulations();
}

let persistDebounceTimer;
function schedulePersistCurrent(delay = 350) {
  window.clearTimeout(persistDebounceTimer);
  persistDebounceTimer = window.setTimeout(() => {
    persistCurrent().catch((error) => console.warn('No se pudo guardar automáticamente', error));
  }, delay);
}

function updateHeaderSnapshot() {
  if (!state.current) return;
  const title = state.current.studentName?.trim() || 'Nueva simulación';
  const subtitle = [state.current.zone, fmtDate(state.current.date)].filter(Boolean).join(' · ') || 'Datos guardados en este dispositivo';
  const headerTitle = document.querySelector('.app-header h1');
  const headerSubtitle = document.querySelector('.header-subtitle');
  const heroTitle = document.querySelector('.hero-card h2');
  if (headerTitle) headerTitle.textContent = title;
  if (headerSubtitle) headerSubtitle.textContent = subtitle;
  if (heroTitle) heroTitle.textContent = state.current.studentName || 'Sin alumno asignado';
}


function calculateCurrent() {
  return evaluateSimulation(state.current?.faults || []);
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

function badge(tipo) {
  return `<span class="badge badge-${esc(tipo)}">${esc(tipo)}</span>`;
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

function resultBanner(result, compact = false) {
  const reason = result.reasons.length ? `<small>${esc(result.reasons.join(' · '))}</small>` : '<small>Resultado provisional según reglas de cómputo.</small>';
  return `
    <div class="result-banner ${result.noApto ? 'is-noapto' : 'is-apto'} ${compact ? 'compact' : ''}">
      <strong>${result.result}</strong>
      ${compact ? '' : reason}
    </div>
  `;
}

function topBar() {
  const result = calculateCurrent();
  const title = state.current?.studentName?.trim() || 'Nueva simulación';
  const subtitle = [state.current?.zone, fmtDate(state.current?.date)].filter(Boolean).join(' · ');
  return `
    <header class="app-header">
      <div>
        <p class="eyebrow">Simulador permiso B</p>
        <h1>${esc(title)}</h1>
        <p class="header-subtitle">${esc(subtitle || 'Datos guardados en este dispositivo')}</p>
      </div>
      <div class="mini-result ${result.noApto ? 'danger' : 'ok'}">${result.result}</div>
    </header>
  `;
}

function tabButton(id, label, icon) {
  return `<button class="nav-item ${state.tab === id ? 'active' : ''}" data-action="tab" data-tab="${id}"><span>${icon}</span>${label}</button>`;
}

function bottomNav() {
  return `
    <nav class="bottom-nav">
      ${tabButton('sim', 'Simulación', '🚘')}
      ${tabButton('faults', 'Faltas', '＋')}
      ${tabButton('summary', 'Resumen', '📋')}
      ${tabButton('history', 'Historial', '🕘')}
      ${tabButton('settings', 'Ajustes', '⚙️')}
    </nav>
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
  return `
    <section class="card timers-card">
      <div class="section-head">
        <div>
          <h2>Cronómetros y temporizadores</h2>
          <p class="muted">Para controlar la duración del examen y medir maniobras como aparcamiento.</p>
        </div>
      </div>

      <div class="timer-grid">
        <article class="timer-panel">
          <div class="timer-title">
            <strong>Cronómetro del examen</strong>
            <span>${exam.running ? 'En marcha' : 'Pausado'}</span>
          </div>
          <div class="timer-value" data-timer-display="elapsed:exam">${formatMs(effectiveElapsed(exam))}</div>
          <div class="timer-actions">
            <button class="primary" data-action="timer-start" data-timer="exam">Iniciar</button>
            <button class="secondary" data-action="timer-pause" data-timer="exam">Pausar</button>
            <button class="ghost-button" data-action="timer-reset" data-timer="exam">Reiniciar</button>
          </div>
        </article>

        <article class="timer-panel">
          <div class="timer-title">
            <strong>Cronómetro de maniobra</strong>
            <span>${parking.running ? 'En marcha' : 'Pausado'}</span>
          </div>
          <label class="compact-label">Nombre de la maniobra
            <input data-timer-input="parkingLabel" value="${esc(parking.label || 'Aparcamiento')}" placeholder="Ej.: Aparcamiento, cambio de sentido..." autocomplete="off" />
          </label>
          <div class="timer-value" data-timer-display="elapsed:parking">${formatMs(effectiveElapsed(parking))}</div>
          <div class="timer-actions">
            <button class="primary" data-action="timer-start" data-timer="parking">Iniciar</button>
            <button class="secondary" data-action="timer-pause" data-timer="parking">Pausar</button>
            <button class="ghost-button" data-action="timer-reset" data-timer="parking">Reiniciar</button>
            <button class="primary light" data-action="timer-save-record">Guardar tiempo</button>
          </div>
        </article>

        <article class="timer-panel timer-panel-wide ${countdownFinished ? 'timer-finished' : ''}">
          <div class="timer-title">
            <strong>Temporizador</strong>
            <span>${countdown.running ? 'Cuenta atrás' : countdownFinished ? 'Finalizado' : 'Preparado'}</span>
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
          <div class="timer-actions">
            <button class="primary" data-action="countdown-start">Iniciar</button>
            <button class="secondary" data-action="countdown-pause">Pausar</button>
            <button class="ghost-button" data-action="countdown-reset">Reiniciar</button>
          </div>
        </article>
      </div>

      <details class="time-records-box" ${parking.records.length ? 'open' : ''}>
        <summary>Tiempos guardados <b>${parking.records.length}</b></summary>
        ${timeRecordsHtml(parking.records)}
      </details>
    </section>
  `;
}

function simulationView() {
  const sim = state.current;
  const result = calculateCurrent();
  return `
    <main class="screen">
      <section class="card hero-card">
        <div class="hero-row">
          <div>
            <p class="eyebrow">Simulación activa</p>
            <h2>${esc(sim.studentName || 'Sin alumno asignado')}</h2>
          </div>
          ${resultBanner(result, true)}
        </div>
        ${kpisHtml(result)}
      </section>

      <section class="card form-card">
        <h2>Datos de la simulación</h2>
        <label>Alumno/a
          <input data-field="studentName" value="${esc(sim.studentName)}" placeholder="Nombre del alumno" autocomplete="off" />
        </label>
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
          <textarea data-field="generalNotes" placeholder="Comentarios generales de la simulación">${esc(sim.generalNotes)}</textarea>
        </label>
      </section>

      ${timersCard()}

      <section class="card quick-actions">
        <button class="primary big" data-action="tab" data-tab="faults">＋ Añadir falta</button>
        <button class="secondary" data-action="tab" data-tab="summary">Ver resumen</button>
        <button class="secondary" data-action="new-simulation">Nueva simulación</button>
      </section>
    </main>
  `;
}

function filterPill(value, label) {
  return `<button class="pill ${state.filter === value ? 'active' : ''}" data-action="filter" data-filter="${value}">${label}</button>`;
}

function faultButton(item) {
  return `
    <button class="fault-button" data-action="open-fault" data-id="${item.id}">
      <span class="fault-title">${badge(item.tipo)}<strong>${esc(item.falta)}</strong></span>
      <small>${esc(item.bloque)} · ${esc(item.obs || '')}</small>
    </button>
  `;
}

function faultsView() {
  const groups = byBlock();
  const total = Array.from(groups.values()).reduce((sum, items) => sum + items.length, 0);
  const recent = [...(state.current?.faults || [])]
    .slice(-4)
    .reverse()
    .map((item) => item.snapshot || catalogById.get(item.faultId))
    .filter(Boolean);

  return `
    <main class="screen">
      <section class="card sticky-search">
        <label class="search-label">Buscar falta
          <input class="search" data-action="search" value="${esc(state.query)}" placeholder="Ej.: intermitente, stop, bordillo..." />
        </label>
        <div class="pills">
          ${filterPill('ALL', 'Todas')}
          ${filterPill('L', 'Leves')}
          ${filterPill('D', 'Deficientes')}
          ${filterPill('E', 'Eliminatorias')}
        </div>
        <p class="muted">${total} faltas encontradas en el catálogo.</p>
      </section>

      ${recent.length ? `
        <section class="card">
          <h2>Recientes</h2>
          <div class="fault-list compact-list">
            ${recent.map(faultButton).join('')}
          </div>
        </section>
      ` : ''}

      <section class="card">
        <h2>Catálogo por bloques</h2>
        <div class="accordion-list">
          ${Array.from(groups.entries()).map(([block, items], index) => `
            <details class="block" ${index === 0 && state.query ? 'open' : ''}>
              <summary><span>${esc(block)}</span><b>${items.length}</b></summary>
              <div class="fault-list">
                ${items.map(faultButton).join('')}
              </div>
            </details>
          `).join('') || '<p class="muted">No hay resultados con estos filtros.</p>'}
        </div>
      </section>
    </main>
  `;
}

function summaryItem(item, index) {
  const data = item.snapshot || catalogById.get(item.faultId) || item;
  return `
    <article class="marked-fault">
      <div class="marked-head">
        <div>
          <div class="marked-title">${badge(data.tipo)}<strong>${esc(data.falta)}</strong></div>
          <p>${esc(data.bloque)} · ${esc(levelName(data.tipo))}</p>
        </div>
        <button class="danger ghost-button" data-action="remove-fault" data-index="${index}">Quitar</button>
      </div>
      ${data.obs ? `<p class="obs">${esc(data.obs)}</p>` : ''}
      ${item.note ? `<p class="note"><strong>Observación:</strong> ${esc(item.note)}</p>` : ''}
    </article>
  `;
}


function summaryTimesCard() {
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  const examElapsed = effectiveElapsed(timers.exam);
  const parkingElapsed = effectiveElapsed(timers.parking);
  const countdownRemainingValue = effectiveRemaining(timers.countdown);
  const hasTimes = examElapsed > 0 || parkingElapsed > 0 || timers.parking.records.length;
  if (!hasTimes) return '';
  return `
    <section class="card">
      <h2>Tiempos</h2>
      <div class="time-summary-grid">
        <div class="kpi"><b data-timer-display="elapsed:exam">${formatMs(examElapsed)}</b><span>Examen</span></div>
        <div class="kpi"><b data-timer-display="elapsed:parking">${formatMs(parkingElapsed)}</b><span>${esc(timers.parking.label || 'Maniobra')}</span></div>
        <div class="kpi"><b data-timer-display="remaining:countdown">${formatMs(countdownRemainingValue)}</b><span>Temporizador</span></div>
      </div>
      ${timers.parking.records.length ? `<h3 class="subheading">Tiempos guardados</h3>${timeRecordsHtml(timers.parking.records)}` : ''}
    </section>
  `;
}

function summaryView() {
  const sim = state.current;
  const result = evaluateSimulation(sim.faults || []);
  return `
    <main class="screen">
      <section class="card">
        ${resultBanner(result)}
        ${kpisHtml(result)}
        <p class="muted rule-text">No apto con: 1 eliminatoria, 2 deficientes, 1 deficiente + 5 leves, o 10 leves.</p>
      </section>

      <section class="card report-actions">
        <button class="primary" data-action="pdf">Descargar PDF</button>
        <button class="secondary" data-action="print">Imprimir / guardar PDF del navegador</button>
        <button class="secondary" data-action="export-json">Copia JSON</button>
        <button class="secondary" data-action="finalize">Marcar como finalizada</button>
      </section>

      ${summaryTimesCard()}

      <section class="card">
        <h2>Faltas marcadas</h2>
        ${sim.faults?.length ? sim.faults.map(summaryItem).join('') : '<p class="muted">Todavía no hay faltas marcadas.</p>'}
      </section>
    </main>
  `;
}

function historyRow(sim) {
  const result = evaluateSimulation(sim.faults || []);
  return `
    <article class="history-row">
      <button data-action="load-simulation" data-id="${esc(sim.id)}" class="history-main">
        <strong>${esc(sim.studentName || 'Sin alumno')}</strong>
        <span>${fmtDate(sim.date)} · ${esc(sim.zone || 'Sin zona')} · ${result.total} faltas</span>
      </button>
      <div class="history-side">
        <span class="mini-result ${result.noApto ? 'danger' : 'ok'}">${result.result}</span>
        <button class="ghost-button" data-action="duplicate" data-id="${esc(sim.id)}">Duplicar</button>
        <button class="danger ghost-button" data-action="delete" data-id="${esc(sim.id)}">Borrar</button>
      </div>
    </article>
  `;
}

function historyView() {
  return `
    <main class="screen">
      <section class="card">
        <div class="section-head">
          <div>
            <h2>Historial</h2>
            <p class="muted">Guardado en este iPhone/navegador mediante IndexedDB.</p>
          </div>
          <button class="primary" data-action="new-simulation">Nueva</button>
        </div>
        <div class="history-list">
          ${state.history.length ? state.history.map(historyRow).join('') : '<p class="muted">Aún no hay simulaciones guardadas.</p>'}
        </div>
      </section>
    </main>
  `;
}

function settingsView() {
  const counts = catalog.reduce((acc, item) => {
    acc[item.tipo] = (acc[item.tipo] || 0) + 1;
    return acc;
  }, {});
  return `
    <main class="screen">
      <section class="card">
        <h2>Ajustes y datos</h2>
        <p class="muted">Esta versión preliminar guarda todo localmente en el dispositivo. Para uso profesional se puede añadir sincronización en nube más adelante.</p>
        <div class="setting-row">
          <div><strong>Catálogo</strong><span>${catalog.length} faltas: ${counts.L || 0} L, ${counts.D || 0} D, ${counts.E || 0} E.</span></div>
        </div>
        <div class="setting-row">
          <div><strong>Instalación en iPhone</strong><span>Publica la carpeta construida en HTTPS y abre Safari → Compartir → Añadir a pantalla de inicio.</span></div>
        </div>
        <div class="setting-row">
          <div><strong>Copia de seguridad</strong><span>Exporta todas las simulaciones a JSON para conservarlas fuera del navegador.</span></div>
          <button class="secondary" data-action="export-all">Exportar todo</button>
        </div>
        <label class="import-box">Importar copia JSON
          <input type="file" accept="application/json" data-action="import-json" />
        </label>
      </section>

      <section class="card danger-zone">
        <h2>Zona delicada</h2>
        <p class="muted">Borra solamente la simulación activa. El historial seguirá disponible salvo que borres cada simulación.</p>
        <button class="danger" data-action="clear-current">Vaciar faltas de la simulación activa</button>
      </section>
    </main>
  `;
}

function faultSheet() {
  if (!state.openFault) return '';
  const item = catalogById.get(Number(state.openFault));
  if (!item) return '';
  return `
    <div class="sheet-backdrop" data-action="close-sheet"></div>
    <section class="sheet" role="dialog" aria-modal="true" aria-label="Añadir falta">
      <div class="sheet-handle"></div>
      <h2>${badge(item.tipo)}${esc(item.falta)}</h2>
      <p class="muted">${esc(item.bloque)} · ${esc(levelName(item.tipo))}</p>
      <p>${esc(item.obs || '')}</p>
      <label>Observación de esta falta
        <textarea id="fault-note" placeholder="Ej.: ocurrió al salir de la glorieta, obligó a frenar..."></textarea>
      </label>
      <div class="sheet-actions">
        <button class="secondary" data-action="close-sheet">Cancelar</button>
        <button class="primary" data-action="add-fault" data-id="${item.id}">Guardar falta</button>
        <button class="primary light" data-action="add-fault-continue" data-id="${item.id}">Guardar y seguir</button>
      </div>
    </section>
  `;
}

function installHint() {
  if (state.installedHintDismissed) return '';
  return `
    <div class="install-hint">
      <span>Diseñada para iPhone: úsala desde Safari y añádela a la pantalla de inicio cuando esté publicada en HTTPS.</span>
      <button data-action="dismiss-install">Entendido</button>
    </div>
  `;
}

function render() {
  if (!state.current) return;
  const body = {
    sim: simulationView,
    faults: faultsView,
    summary: summaryView,
    history: historyView,
    settings: settingsView
  }[state.tab]();

  app.innerHTML = `
    ${topBar()}
    ${installHint()}
    ${body}
    ${bottomNav()}
    ${faultSheet()}
    ${state.toast ? `<div class="toast">${esc(state.toast)}</div>` : ''}
  `;
}

async function updateField(target, { immediate = false } = {}) {
  const field = target.dataset.field;
  if (!field || !state.current) return;
  state.current[field] = target.value;
  if (['studentName', 'date', 'zone'].includes(field)) updateHeaderSnapshot();
  if (immediate) await persistCurrent();
  else schedulePersistCurrent();
}

function timerObject(key) {
  ensureSimulationShape(state.current);
  return state.current?.timers?.[key];
}

async function startStopwatch(key) {
  const timer = timerObject(key);
  if (!timer || timer.running) return;
  timer.running = true;
  timer.startedAt = currentTimestamp();
  await persistCurrent();
  render();
}

async function pauseStopwatch(key) {
  const timer = timerObject(key);
  if (!timer) return;
  timer.elapsedMs = effectiveElapsed(timer);
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  render();
}

async function resetStopwatch(key) {
  const timer = timerObject(key);
  if (!timer) return;
  timer.elapsedMs = 0;
  timer.running = false;
  timer.startedAt = null;
  await persistCurrent();
  render();
}

async function saveParkingRecord() {
  const timer = timerObject('parking');
  if (!timer) return;
  const elapsedMs = effectiveElapsed(timer);
  if (elapsedMs < 1000) {
    setToast('No hay tiempo suficiente para guardar');
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
}

async function removeTimeRecord(id) {
  const timer = timerObject('parking');
  if (!timer) return;
  timer.records = timer.records.filter((record) => record.id !== id);
  await persistCurrent();
  render();
}

function applyCountdownDuration(minutes) {
  const countdown = timerObject('countdown');
  if (!countdown) return;
  const safeMinutes = Math.min(180, Math.max(1, Number(minutes) || DEFAULT_COUNTDOWN_MINUTES));
  countdown.durationMs = safeMinutes * 60 * 1000;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
}

async function startCountdown() {
  const countdown = timerObject('countdown');
  if (!countdown || countdown.running) return;
  if (effectiveRemaining(countdown) <= 0) {
    countdown.remainingMs = countdown.durationMs;
  }
  countdown.running = true;
  countdown.startedAt = currentTimestamp();
  countdown.endedAt = null;
  await persistCurrent();
  render();
}

async function pauseCountdown() {
  const countdown = timerObject('countdown');
  if (!countdown) return;
  countdown.remainingMs = effectiveRemaining(countdown);
  countdown.running = false;
  countdown.startedAt = null;
  await persistCurrent();
  render();
}

async function resetCountdown() {
  const countdown = timerObject('countdown');
  if (!countdown) return;
  countdown.remainingMs = countdown.durationMs;
  countdown.running = false;
  countdown.startedAt = null;
  countdown.endedAt = null;
  await persistCurrent();
  render();
}

async function handleTimerInput(target, { immediate = false } = {}) {
  if (!state.current) return;
  const kind = target.dataset.timerInput;
  ensureSimulationShape(state.current);
  if (kind === 'parkingLabel') {
    state.current.timers.parking.label = target.value || 'Aparcamiento';
  }
  if (kind === 'countdownMinutes') {
    applyCountdownDuration(target.value);
  }
  if (immediate) await persistCurrent();
  else schedulePersistCurrent();
}

function updateTimerDisplays() {
  if (!state.current) return;
  ensureSimulationShape(state.current);
  const timers = state.current.timers;
  document.querySelectorAll('[data-timer-display]').forEach((node) => {
    const [mode, key] = node.dataset.timerDisplay.split(':');
    const timer = timers[key];
    if (!timer) return;
    node.textContent = mode === 'remaining' ? formatMs(effectiveRemaining(timer)) : formatMs(effectiveElapsed(timer));
  });

  const countdown = timers.countdown;
  if (countdown?.running && effectiveRemaining(countdown) <= 0) {
    countdown.running = false;
    countdown.remainingMs = 0;
    countdown.startedAt = null;
    countdown.endedAt = nowIso();
    persistCurrent().catch((error) => console.warn('No se pudo guardar el temporizador finalizado', error));
    setToast('Temporizador finalizado');
  }
}

async function addFault(id, stayOnFaults = false) {
  const item = catalogById.get(Number(id));
  if (!item || !state.current) return;
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
  if (!stayOnFaults) state.tab = 'summary';
  await persistCurrent();
  setToast('Falta añadida');
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
    const text = await file.text();
    const payload = JSON.parse(text);
    const simulations = Array.isArray(payload) ? payload : payload.simulations;
    if (!Array.isArray(simulations)) throw new Error('Formato no reconocido');
    for (const sim of simulations) {
      if (sim?.id) await putSimulation({ ...sim, updatedAt: nowIso() });
    }
    state.history = await listSimulations();
    setToast('Copia importada');
  } catch (error) {
    setToast(`No se pudo importar: ${error.message}`);
  }
}

async function startNewSimulation() {
  if (state.current?.faults?.length || state.current?.studentName) {
    const ok = window.confirm('¿Crear una simulación nueva? La actual quedará guardada en el historial.');
    if (!ok) return;
  }
  state.current = ensureSimulationShape(emptySimulation());
  state.tab = 'sim';
  await persistCurrent();
  render();
}

async function duplicateSimulation(id) {
  const original = await getSimulation(id);
  if (!original) return;
  const copy = {
    ...original,
    id: makeId('sim'),
    studentName: `${original.studentName || 'Simulación'} (copia)`,
    status: 'draft',
    createdAt: nowIso(),
    updatedAt: nowIso()
  };
  await putSimulation(copy);
  state.current = ensureSimulationShape(copy);
  state.history = await listSimulations();
  state.tab = 'sim';
  await putSetting('currentSimulationId', copy.id);
  render();
}

async function handleAction(target, event) {
  const action = target.dataset.action;
  if (!action) return;

  if (action === 'tab') {
    state.tab = target.dataset.tab;
    render();
  }

  if (action === 'filter') {
    state.filter = target.dataset.filter;
    render();
  }

  if (action === 'search') {
    state.query = target.value;
    render();
    const search = document.querySelector('.search');
    if (search) {
      search.focus();
      search.setSelectionRange(search.value.length, search.value.length);
    }
  }

  if (action === 'open-fault') {
    state.openFault = Number(target.closest('[data-id]')?.dataset.id || target.dataset.id);
    render();
  }

  if (action === 'close-sheet') {
    state.openFault = null;
    render();
  }

  if (action === 'add-fault') await addFault(target.dataset.id, false);
  if (action === 'add-fault-continue') await addFault(target.dataset.id, true);

  if (action === 'remove-fault') {
    const index = Number(target.dataset.index);
    state.current.faults.splice(index, 1);
    await persistCurrent();
    render();
  }


  if (action === 'timer-start') await startStopwatch(target.dataset.timer);
  if (action === 'timer-pause') await pauseStopwatch(target.dataset.timer);
  if (action === 'timer-reset') await resetStopwatch(target.dataset.timer);
  if (action === 'timer-save-record') await saveParkingRecord();
  if (action === 'remove-time-record') await removeTimeRecord(target.dataset.id);

  if (action === 'set-countdown') {
    applyCountdownDuration(target.dataset.minutes);
    await persistCurrent();
    render();
  }

  if (action === 'countdown-start') await startCountdown();
  if (action === 'countdown-pause') await pauseCountdown();
  if (action === 'countdown-reset') await resetCountdown();

  if (action === 'new-simulation') await startNewSimulation();

  if (action === 'load-simulation') {
    const sim = await getSimulation(target.dataset.id);
    if (sim) {
      state.current = ensureSimulationShape(sim);
      await putSetting('currentSimulationId', sim.id);
      state.tab = 'sim';
      render();
    }
  }

  if (action === 'delete') {
    const ok = window.confirm('¿Borrar esta simulación del historial?');
    if (!ok) return;
    await deleteSimulation(target.dataset.id);
    if (state.current?.id === target.dataset.id) state.current = ensureSimulationShape(emptySimulation());
    await persistCurrent();
    state.history = await listSimulations();
    render();
  }

  if (action === 'duplicate') await duplicateSimulation(target.dataset.id);

  if (action === 'pdf') {
    await persistCurrent();
    downloadSimulationPdf(state.current, catalogById);
    setToast('PDF generado');
  }

  if (action === 'print') window.print();

  if (action === 'export-json') {
    downloadJson(state.current, `Simulacion_${state.current.date || today()}.json`);
  }

  if (action === 'export-all') {
    const all = await listSimulations();
    downloadJson({ exportedAt: nowIso(), simulations: all }, `Copia_simulador_permiso_B_${today()}.json`);
  }

  if (action === 'import-json') await handleImport(target);

  if (action === 'finalize') {
    state.current.status = 'finalized';
    await persistCurrent();
    setToast('Simulación marcada como finalizada');
  }

  if (action === 'clear-current') {
    const ok = window.confirm('¿Vaciar todas las faltas de la simulación activa?');
    if (!ok) return;
    state.current.faults = [];
    await persistCurrent();
    render();
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
  if (target.dataset.timerInput) handleTimerInput(target);
  if (target.dataset.action === 'search') handleAction(target, event);
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (target.dataset.field) updateField(target, { immediate: true });
  if (target.dataset.timerInput) handleTimerInput(target, { immediate: true });
  if (target.dataset.action === 'import-json') handleAction(target, event);
});

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  event.preventDefault();
  handleAction(target, event).catch((error) => {
    console.error(error);
    setToast('Ha ocurrido un error');
  });
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
  await openDatabase();
  state.installedHintDismissed = Boolean(await getSetting('installHintDismissed'));
  const currentId = await getSetting('currentSimulationId');
  state.history = await listSimulations();
  state.current = currentId ? ensureSimulationShape(await getSimulation(currentId)) : null;
  if (!state.current) {
    state.current = ensureSimulationShape(emptySimulation());
    await persistCurrent();
  }
  render();
  window.setInterval(updateTimerDisplays, 1000);
  initServiceWorker();
}

init().catch((error) => {
  app.innerHTML = `<main class="screen"><section class="card"><h1>No se pudo iniciar</h1><p>${esc(error.message)}</p></section></main>`;
});
