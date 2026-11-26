import { jsPDF } from 'jspdf';
import { evaluateSimulation, levelName } from './rules.js';
import { formatDateEs, localTodayIso } from './validation.js';

function nowMs() {
  return Date.now();
}

function effectiveElapsed(timer) {
  const base = Number(timer?.elapsedMs || 0);
  if (!timer?.running || !timer.startedAt) return base;
  return Math.max(0, base + (nowMs() - Number(timer.startedAt)));
}

function effectiveRemaining(timer) {
  const base = Number(timer?.remainingMs ?? timer?.durationMs ?? 0);
  if (!timer?.running || !timer.startedAt) return Math.max(0, base);
  return Math.max(0, base - (nowMs() - Number(timer.startedAt)));
}

function formatMs(ms) {
  const safe = Math.max(0, Math.floor(Number(ms || 0)));
  const tenths = Math.floor((safe % 1000) / 100);
  const totalSeconds = Math.floor(safe / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const ss = String(seconds).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  if (hours > 0) return `${hours}:${mm}:${ss}.${tenths}`;
  return `${mm}:${ss}.${tenths}`;
}

function filenameFor(simulation) {
  const date = simulation.date || localTodayIso();
  const student = (simulation.studentName || 'alumno')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `Simulacion_${student || 'alumno'}_${date}.pdf`;
}

function addWrapped(doc, text, x, y, maxWidth, lineHeight = 5.5) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth);
  lines.forEach((line) => {
    if (y > 278) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

function addLabelValue(doc, label, value, margin, y) {
  if (y > 278) {
    doc.addPage();
    y = 18;
  }
  doc.setFont('helvetica', 'bold');
  doc.text(`${label}:`, margin, y);
  doc.setFont('helvetica', 'normal');
  const lines = doc.splitTextToSize(String(value || '-'), 146);
  lines.forEach((line, idx) => {
    if (idx > 0 && y > 278) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, margin + 36, y);
    y += 5.5;
  });
  return y;
}

function drawSectionTitle(doc, title, margin, y) {
  if (y > 265) {
    doc.addPage();
    y = 18;
  }
  doc.setDrawColor(210, 216, 224);
  doc.line(margin, y, 196, y);
  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text(title.toUpperCase(), margin, y);
  doc.setTextColor(0, 0, 0);
  return y + 6.5;
}

export function createSimulationPdfDoc(simulation, catalogById) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const result = evaluateSimulation(simulation.faults || []);
  const margin = 14;
  let y = 16;

  doc.setProperties({
    title: `Informe simulación permiso B - ${simulation.studentName || ''}`,
    subject: 'Informe de simulación de prueba práctica de circulación - Permiso B',
    creator: 'Registro PDA Permiso B'
  });

  // Cabecera institucional sobria
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text('FICHA DE EVALUACIÓN · PRUEBA PRÁCTICA PERMISO B', margin, y);
  y += 6;

  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text('Informe de simulación de circulación', margin, y);

  // Etiqueta de calificación a la derecha
  doc.setFillColor(result.noApto ? 254 : 226, result.noApto ? 226 : 252, result.noApto ? 226 : 231);
  doc.roundedRect(152, y - 6, 44, 9.5, 1.5, 1.5, 'F');
  doc.setFontSize(12);
  doc.setTextColor(result.noApto ? 153 : 22, result.noApto ? 27 : 101, result.noApto ? 27 : 52);
  doc.text(result.result, 174, y + 0.3, { align: 'center' });
  doc.setTextColor(0, 0, 0);
  y += 9;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const meta = [
    ['Alumno/a', simulation.studentName || '-'],
    ['Fecha', formatDateEs(simulation.date, '-')],
    ['Zona / recorrido', simulation.zone || '-'],
    ['Profesor/a', simulation.teacher || '-'],
    ['Vehículo', simulation.vehicle || '-']
  ];

  meta.forEach(([label, value]) => {
    y = addLabelValue(doc, label, value, margin, y);
  });

  y += 2;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y - 4, 182, 9, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(`Leves (L): ${result.L}`, margin + 4, y + 1.8);
  doc.text(`Deficientes (D): ${result.D}`, margin + 46, y + 1.8);
  doc.text(`Eliminatorias (E): ${result.E}`, margin + 96, y + 1.8);
  doc.text(`Total faltas: ${result.total}`, margin + 146, y + 1.8);
  y += 10;

  if (result.reasons.length) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(153, 27, 27);
    y = addWrapped(doc, `Causa de NO APTO: ${result.reasons.join(', ')}.`, margin, y, 182, 5);
    doc.setTextColor(0, 0, 0);
    y += 2;
  }

  const timers = simulation.timers || {};
  const examElapsed = effectiveElapsed(timers.exam);
  const parkingElapsed = effectiveElapsed(timers.parking);
  const countdownDuration = Number(timers.countdown?.durationMs || 0);
  const countdownRemaining = effectiveRemaining(timers.countdown);
  const countdownUsed = countdownDuration > 0 && countdownRemaining < countdownDuration;
  const timeRecords = timers.parking?.records || [];
  const hasTimes = examElapsed > 0 || parkingElapsed > 0 || timeRecords.length > 0 || countdownUsed;

  if (hasTimes) {
    y = drawSectionTitle(doc, 'Registro de tiempos', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    if (examElapsed > 0) {
      doc.text(`Duración examen: ${formatMs(examElapsed)}`, margin, y);
      y += 5;
    }
    if (parkingElapsed > 0) {
      y = addWrapped(doc, `${timers.parking?.label || 'Maniobra'}: ${formatMs(parkingElapsed)}`, margin, y, 182, 5);
    }
    if (countdownUsed) {
      doc.text(`Cuenta atrás restante: ${formatMs(countdownRemaining)}`, margin, y);
      y += 5;
    }
    if (timeRecords.length) {
      y += 1.5;
      doc.setFont('helvetica', 'bold');
      doc.text('Maniobras registradas:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      timeRecords.forEach((record) => {
        y = addWrapped(doc, `- ${record.label || 'Maniobra'}: ${formatMs(record.elapsedMs)}`, margin + 4, y, 178, 5);
      });
    }
    y += 3;
  }

  y = drawSectionTitle(doc, 'Desglose de faltas calificadas', margin, y);
  doc.setFontSize(10);

  const faults = simulation.faults || [];
  if (!faults.length) {
    doc.setFont('helvetica', 'normal');
    doc.text('Sin faltas registradas durante la prueba.', margin, y);
    y += 6;
  }

  faults.forEach((item, index) => {
    if (y > 268) {
      doc.addPage();
      y = 18;
    }
    const data = catalogById.get(item.faultId) || item.snapshot || item;
    const tipo = data.tipo || item.tipo || 'L';
    const codePrefix = data.code ? `${data.code} ` : '';
    const title = data.falta || 'Falta';
    const block = data.bloque || '';
    const note = item.note ? `Nota del profesor: ${item.note}` : '';

    doc.setFont('helvetica', 'bold');
    y = addWrapped(doc, `${index + 1}. [${codePrefix}${tipo}] ${title}`, margin, y, 182, 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    y = addWrapped(doc, `${block} - ${levelName(tipo)}`, margin + 5, y, 177, 4.5);
    if (data.obs) y = addWrapped(doc, data.obs, margin + 5, y, 177, 4.5);
    if (note) {
      doc.setTextColor(15, 23, 42);
      y = addWrapped(doc, note, margin + 5, y, 177, 4.5);
    }
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    y += 2.5;
  });

  if (simulation.generalNotes) {
    y = drawSectionTitle(doc, 'Observaciones generales', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = addWrapped(doc, simulation.generalNotes, margin, y, 182, 5);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Página ${i} de ${pageCount}`, 196, 290, { align: 'right' });
    doc.text('Registro de Evaluación Práctica · Permiso B', margin, 290);
  }

  return { doc, filename: filenameFor(simulation) };
}

export function downloadSimulationPdf(simulation, catalogById) {
  const { doc, filename } = createSimulationPdfDoc(simulation, catalogById);
  doc.save(filename);
}

export async function shareSimulationPdf(simulation, catalogById) {
  const { doc, filename } = createSimulationPdfDoc(simulation, catalogById);
  const blob = doc.output('blob');
  const file = new File([blob], filename, { type: 'application/pdf' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      title: filename.replace(/\.pdf$/i, ''),
      text: `Informe de evaluación práctica (${simulation.studentName || 'Permiso B'})`,
      files: [file]
    });
    return 'shared';
  }
  doc.save(filename);
  return 'downloaded';
}