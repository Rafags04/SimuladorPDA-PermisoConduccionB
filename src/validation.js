import { userError } from './userErrors.js';

const VALID_TYPES = new Set(['L', 'D', 'E']);
const MAX_IMPORT_SIZE_BYTES = 8 * 1024 * 1024;

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

  if (!Array.isArray(simulations)) {
    throw userError('La copia no tiene el formato esperado. Debe contener una lista de simulaciones.', {
      title: 'Copia no compatible',
      code: 'IMPORT_BAD_SHAPE'
    });
  }

  if (!simulations.length) {
    throw userError('La copia está vacía y no contiene simulaciones para importar.', {
      title: 'Copia vacía',
      code: 'IMPORT_EMPTY'
    });
  }

  const valid = [];
  const invalidIndexes = [];

  simulations.forEach((sim, index) => {
    if (sim && typeof sim === 'object') {
      valid.push(sim);
    } else {
      invalidIndexes.push(index + 1);
    }
  });

  if (!valid.length) {
    throw userError('No se ha encontrado ninguna simulación válida dentro del archivo.', {
      title: 'Copia no válida',
      code: 'IMPORT_NO_VALID_ROWS'
    });
  }

  return { simulations: valid, invalidIndexes };
}

export function normalizeImportedSimulation(simulation, { makeId, nowIso }) {
  const now = nowIso();
  const id = String(simulation.id || '').trim() || makeId('sim');

  return {
    ...simulation,
    id,
    studentName: String(simulation.studentName || '').slice(0, 120),
    date: String(simulation.date || '').slice(0, 20),
    zone: String(simulation.zone || '').slice(0, 160),
    teacher: String(simulation.teacher || '').slice(0, 120),
    vehicle: String(simulation.vehicle || '').slice(0, 120),
    generalNotes: String(simulation.generalNotes || '').slice(0, 4000),
    faults: Array.isArray(simulation.faults) ? simulation.faults : [],
    status: simulation.status === 'finalized' ? 'finalized' : 'draft',
    createdAt: simulation.createdAt || now,
    updatedAt: now
  };
}