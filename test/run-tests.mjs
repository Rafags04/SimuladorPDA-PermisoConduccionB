import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { countFaults, evaluateSimulation, levelName } from '../src/rules.js';
import {
  extractSimulationsFromImport,
  normalizeImportedSimulation,
  validateCatalog,
  validateCountdownMinutes,
  validateSimulationForPdf
} from '../src/validation.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'src/data/faltas.json'), 'utf8'));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`✓ ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`✗ ${name}`);
    console.error(`  ${error.message}`);
  }
}

function assert(condition, message = 'La condición no se cumple') {
  if (!condition) throw new Error(message);
}

function assertEqual(actual, expected, message = 'Los valores no coinciden') {
  if (actual !== expected) throw new Error(`${message}. Esperado: ${expected}. Recibido: ${actual}`);
}

function faults(...types) {
  return types.map((tipo, index) => ({ uid: `f_${index}`, tipo }));
}

console.log('\nComprobando reglas, catálogo, importación y validaciones...\n');

test('Cuenta faltas por tipo', () => {
  const counts = countFaults(faults('L', 'L', 'D', 'E'));
  assertEqual(counts.L, 2, 'Debe contar leves');
  assertEqual(counts.D, 1, 'Debe contar deficientes');
  assertEqual(counts.E, 1, 'Debe contar eliminatorias');
  assertEqual(counts.total, 4, 'Debe contar total');
});

test('APTO sin faltas', () => {
  assertEqual(evaluateSimulation([]).result, 'APTO');
});

test('NO APTO con una eliminatoria', () => {
  const result = evaluateSimulation(faults('E'));
  assert(result.noApto, 'Debe ser no apto');
  assert(result.reasons.includes('1 falta eliminatoria'));
});

test('NO APTO con dos deficientes', () => {
  const result = evaluateSimulation(faults('D', 'D'));
  assert(result.noApto, 'Debe ser no apto');
  assert(result.reasons.includes('2 faltas deficientes'));
});

test('NO APTO con una deficiente y cinco leves', () => {
  const result = evaluateSimulation(faults('D', 'L', 'L', 'L', 'L', 'L'));
  assert(result.noApto, 'Debe ser no apto');
  assert(result.reasons.includes('1 deficiente + 5 leves'));
});

test('NO APTO con diez leves', () => {
  const result = evaluateSimulation(faults('L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'));
  assert(result.noApto, 'Debe ser no apto');
  assert(result.reasons.includes('10 faltas leves'));
});

test('APTO con una deficiente y cuatro leves', () => {
  const result = evaluateSimulation(faults('D', 'L', 'L', 'L', 'L'));
  assertEqual(result.result, 'APTO');
});

test('APTO con nueve leves', () => {
  const result = evaluateSimulation(faults('L', 'L', 'L', 'L', 'L', 'L', 'L', 'L', 'L'));
  assertEqual(result.result, 'APTO');
});

test('Nombres de niveles correctos', () => {
  assertEqual(levelName('L'), 'Leve');
  assertEqual(levelName('D'), 'Deficiente');
  assertEqual(levelName('E'), 'Eliminatoria');
});

test('Catálogo de faltas íntegro', () => {
  const errors = validateCatalog(catalog);
  assertEqual(errors.length, 0, errors.join('\n'));
  assert(catalog.length >= 200, 'El catálogo tiene menos faltas de las esperadas');
});

test('IDs del catálogo sin duplicados', () => {
  const ids = new Set(catalog.map((item) => item.id));
  assertEqual(ids.size, catalog.length, 'Hay IDs duplicados en el catálogo');
});

test('Tipos del catálogo válidos', () => {
  const valid = new Set(['L', 'D', 'E']);
  assert(catalog.every((item) => valid.has(item.tipo)), 'Hay faltas con tipo distinto de L, D o E');
});

test('Validación de temporizador limita valores extremos', () => {
  assertEqual(validateCountdownMinutes('0'), 1);
  assertEqual(validateCountdownMinutes('999'), 180);
  assertEqual(validateCountdownMinutes('25'), 25);
});

test('Validación PDF avisa si falta alumno', () => {
  const warnings = validateSimulationForPdf({ date: '2026-06-25', faults: [] });
  assert(warnings.length >= 1, 'Debe avisar si falta alumno');
});

test('Importación acepta copia con simulations', () => {
  const { simulations } = extractSimulationsFromImport({ simulations: [{ id: 'sim_1', faults: [] }] });
  assertEqual(simulations.length, 1);
});

test('Importación rechaza formato incompatible', () => {
  let thrown = false;
  try {
    extractSimulationsFromImport({ otraCosa: [] });
  } catch {
    thrown = true;
  }
  assert(thrown, 'Debe rechazar formato incompatible');
});

test('Normalización de simulación importada rellena campos mínimos', () => {
  const sim = normalizeImportedSimulation(
    { studentName: 'Alumno', faults: 'mal' },
    { makeId: () => 'sim_test', nowIso: () => '2026-06-25T10:00:00.000Z' }
  );
  assertEqual(sim.id, 'sim_test');
  assert(Array.isArray(sim.faults), 'Las faltas deben quedar como array');
  assertEqual(sim.updatedAt, '2026-06-25T10:00:00.000Z');
});

console.log(`\nResultado: ${passed} tests correctos, ${failed} fallidos.\n`);

if (failed > 0) process.exit(1);