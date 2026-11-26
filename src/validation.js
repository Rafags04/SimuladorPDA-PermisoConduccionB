import { userError } from './userErrors.js';

const VALID_TYPES = new Set(['L', 'D', 'E']);
const MAX_IMPORT_SIZE_BYTES = 8 * 1024 * 1024;
const DEFAULT_COUNTDOWN_MS = 25 * 60 * 1000;

export function localTodayIso(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseLocalDate(value) {
  if (!value) return null;
  const str = String(value).trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const date = new Date(year, month, day);
    if (date.getFullYear() === year && date.getMonth() === month && date.getDate() === day) {
      return date;
    }
    return null;
  }
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateEs(value, fallback = 'Sin fecha') {
  if (!value) return fallback;
  const date = parseLocalDate(value);
  if (!date) return String(value);
  try {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return String(value);
  }
}

export function validateCountdownMinutes(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes) || minutes < 1) return 1;
  if (minutes > 180) return 180;
  return Math.round(minutes);
}

export function validateCatalog(catalog) {
  const errors = [];
  if (!Array.isArray(catalog)) return ['El catálogo de faltas no es una lista.'];

  const ids = new Set();

  catalog.forEach((item, index) => {
    if (!Number.isInteger(item.id)) {
      errors.push(`Falta ${index + 1}: id inválido.`);
    }

    if (ids.has(item.id)) {
      errors.push(`Falta ${index + 1}: id duplicado ${item.id}.`);
    }

    ids.add(item.id);

    if (!VALID_TYPES.has(item.tipo)) {
      errors.push(`Falta ${item.id}: tipo inválido.`);
    }

    if (!String(item.falta || '').trim()) {
      errors.push(`Falta ${item.id}: falta sin texto.`);
    }

    if (!String(item.bloque || '').trim()) {
      errors.push(`Falta ${item.id}: bloque vacío.`);
    }
  });

  return errors;
}

export function validateSimulationForPdf(simulation) {
  if (!simulation || typeof simulation !== 'object') {
    throw userError('No hay una simulación activa para generar el PDF.', {
      title: 'No hay simulación activa',
      code: 'NO_ACTIVE_SIMULATION'
    });
  }

  const warnings = [];

  if (!String(simulation.studentName || '').trim()) {
    warnings.push('No has indicado el nombre del alumno/a.');
  }

  if (!simulation.date) {
    warnings.push('No has indicado la fecha de la simulación.');
  }

  return warnings;
}

export function validateImportFile(file) {
  if (!file) {
    throw userError('No se ha seleccionado ningún archivo.', {
      title: 'Archivo no seleccionado',
      code: 'NO_FILE_SELECTED'
    });
  }

  if (file.size > MAX_IMPORT_SIZE_BYTES) {
    throw userError('El archivo es demasiado grande. Exporta una copia más pequeña o importa menos simulaciones.', {
      title: 'Archivo demasiado grande',
      code: 'IMPORT_TOO_LARGE'
    });
  }

  const name = String(file.name || '').toLowerCase();

  if (name && !name.endsWith('.json')) {
    throw userError('El archivo debe ser una copia .json exportada desde el simulador.', {
      title: 'Tipo de archivo no válido',
      code: 'IMPORT_NOT_JSON'
    });
  }
}

export function extractSimulationsFromImport(payload) {
  const simulations = Array.isArray(payload) ? payload : payload?.simulations;
  const students = !Array.isArray(payload) && Array.isArray(payload?.students) ? payload.students : [];

  if (!Array.isArray(simulations) && !students.length) {
    throw userError('La copia no tiene el formato esperado. Debe contener simulaciones o alumnos.', {
      title: 'Copia no compatible',
      code: 'IMPORT_BAD_SHAPE'
    });
  }

  const simList = Array.isArray(simulations) ? simulations : [];

  if (!simList.length && !students.length) {
    throw userError('La copia está vacía y no contiene datos para importar.', {
      title: 'Copia vacía',
      code: 'IMPORT_EMPTY'
    });
  }

  const valid = [];
  const invalidIndexes = [];

  simList.forEach((sim, index) => {
    if (sim && typeof sim === 'object' && !Array.isArray(sim)) {
      valid.push(sim);
    } else {
      invalidIndexes.push(index + 1);
    }
  });

  if (!valid.length && !students.length) {
    throw userError('No se ha encontrado ninguna simulación válida dentro del archivo.', {
      title: 'Copia no válida',
      code: 'IMPORT_NO_VALID_ROWS'
    });
  }

  return { simulations: valid, students, invalidIndexes };
}

export function sanitizeFaults(faults, { makeId, nowIso, catalogById = null }) {
  if (!Array.isArray(faults)) return [];
  const now = nowIso();
  return faults
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item))
    .map((item) => {
      const rawId = Number(item.faultId ?? item.id);
      const faultId = Number.isInteger(rawId) ? rawId : null;
      const catalogItem = faultId !== null && catalogById ? catalogById.get(faultId) : null;
      const rawTipo = item.tipo || item.snapshot?.tipo || catalogItem?.tipo || 'L';
      const tipo = VALID_TYPES.has(rawTipo) ? rawTipo : 'L';
      const snapshotSource = (item.snapshot && typeof item.snapshot === 'object') ? item.snapshot : (catalogItem || item);
      return {
        uid: String(item.uid || '').trim() || makeId('fault'),
        faultId,
        tipo,
        note: String(item.note || '').slice(0, 1000),
        snapshot: {
          id: faultId ?? snapshotSource.id ?? 0,
          bloque: String(snapshotSource.bloque || 'General').slice(0, 160),
          tipo,
          nivel: String(snapshotSource.nivel || '').slice(0, 40),
          falta: String(snapshotSource.falta || 'Falta registrada').slice(0, 400),
          obs: String(snapshotSource.obs || '').slice(0, 600)
        },
        createdAt: String(item.createdAt || now).slice(0, 40)
      };
    });
}

export function sanitizeTimers(timers, { makeId, nowIso }) {
  const src = timers && typeof timers === 'object' ? timers : {};
  const examSrc = src.exam && typeof src.exam === 'object' ? src.exam : {};
  const parkingSrc = src.parking && typeof src.parking === 'object' ? src.parking : {};
  const countdownSrc = src.countdown && typeof src.countdown === 'object' ? src.countdown : {};

  const safeMs = (val, fallback = 0) => {
    const n = Number(val);
    return Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback;
  };
  const safeStartedAt = (running, val) => {
    if (!running) return null;
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  const durationMs = safeMs(countdownSrc.durationMs, DEFAULT_COUNTDOWN_MS) || DEFAULT_COUNTDOWN_MS;
  const remainingRaw = countdownSrc.remainingMs !== undefined ? safeMs(countdownSrc.remainingMs, durationMs) : durationMs;

  const examRunning = Boolean(examSrc.running);
  const parkingRunning = Boolean(parkingSrc.running);
  const countdownRunning = Boolean(countdownSrc.running);

  const records = Array.isArray(parkingSrc.records)
    ? parkingSrc.records
        .filter((rec) => rec && typeof rec === 'object')
        .map((rec) => ({
          id: String(rec.id || '').trim() || makeId('time'),
          label: String(rec.label || 'Maniobra').slice(0, 80),
          elapsedMs: safeMs(rec.elapsedMs, 0),
          note: String(rec.note || '').slice(0, 240),
          createdAt: String(rec.createdAt || rec.date || nowIso()).slice(0, 40)
        }))
    : [];

  return {
    exam: {
      label: String(examSrc.label || 'Examen completo').slice(0, 80),
      elapsedMs: safeMs(examSrc.elapsedMs, 0),
      running: examRunning && safeStartedAt(examRunning, examSrc.startedAt) !== null,
      startedAt: safeStartedAt(examRunning, examSrc.startedAt)
    },
    parking: {
      label: String(parkingSrc.label || 'Maniobra').slice(0, 80),
      elapsedMs: safeMs(parkingSrc.elapsedMs, 0),
      running: parkingRunning && safeStartedAt(parkingRunning, parkingSrc.startedAt) !== null,
      startedAt: safeStartedAt(parkingRunning, parkingSrc.startedAt),
      records
    },
    countdown: {
      label: String(countdownSrc.label || 'Examen temporizado').slice(0, 80),
      durationMs,
      remainingMs: Math.min(durationMs * 2, remainingRaw),
      running: countdownRunning && safeStartedAt(countdownRunning, countdownSrc.startedAt) !== null,
      startedAt: safeStartedAt(countdownRunning, countdownSrc.startedAt),
      endedAt: countdownSrc.endedAt ? String(countdownSrc.endedAt).slice(0, 40) : null
    }
  };
}

export function pauseAllTimers(timers, nowMs = Date.now()) {
  if (!timers || typeof timers !== 'object') return false;
  let changed = false;

  for (const key of ['exam', 'parking']) {
    const t = timers[key];
    if (t?.running) {
      const base = Number(t.elapsedMs || 0);
      const delta = t.startedAt ? Math.max(0, nowMs - Number(t.startedAt)) : 0;
      t.elapsedMs = Math.max(0, base + delta);
      t.running = false;
      t.startedAt = null;
      changed = true;
    }
  }

  const cd = timers.countdown;
  if (cd?.running) {
    const base = Number(cd.remainingMs ?? cd.durationMs ?? 0);
    const delta = cd.startedAt ? Math.max(0, nowMs - Number(cd.startedAt)) : 0;
    cd.remainingMs = Math.max(0, base - delta);
    cd.running = false;
    cd.startedAt = null;
    changed = true;
  }

  return changed;
}

export function hasRunningTimers(timers) {
  if (!timers || typeof timers !== 'object') return false;
  return Boolean(timers.exam?.running || timers.parking?.running || timers.countdown?.running);
}

export function normalizeImportedStudent(student, { makeId, nowIso }) {
  if (!student || typeof student !== 'object') return null;
  const now = nowIso();
  const name = String(student.name || student.studentName || '').trim().slice(0, 120);
  if (!name) return null;
  return {
    id: String(student.id || '').trim() || makeId('stu'),
    name,
    phone: String(student.phone || '').trim().slice(0, 60),
    email: String(student.email || '').trim().slice(0, 120),
    notes: String(student.notes || '').slice(0, 4000),
    createdAt: String(student.createdAt || now).slice(0, 40),
    updatedAt: String(student.updatedAt || now).slice(0, 40)
  };
}

export function normalizeImportedSimulation(simulation, { makeId, nowIso, catalogById = null }) {
  const now = nowIso();
  const id = String(simulation.id || '').trim() || makeId('sim');
  const status = simulation.status === 'finalized' ? 'finalized' : 'draft';
  const timers = sanitizeTimers(simulation.timers, { makeId, nowIso });
  if (status === 'finalized') {
    pauseAllTimers(timers);
  }

  return {
    id,
    studentId: simulation.studentId ? String(simulation.studentId).trim() : null,
    studentName: String(simulation.studentName || '').trim().slice(0, 120),
    date: String(simulation.date || '').trim().slice(0, 20),
    zone: String(simulation.zone || '').trim().slice(0, 160),
    teacher: String(simulation.teacher || '').trim().slice(0, 120),
    vehicle: String(simulation.vehicle || '').trim().slice(0, 120),
    generalNotes: String(simulation.generalNotes || '').slice(0, 4000),
    faults: sanitizeFaults(simulation.faults, { makeId, nowIso, catalogById }),
    timers,
    status,
    createdAt: String(simulation.createdAt || now).slice(0, 40),
    updatedAt: now
  };
}