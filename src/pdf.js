import { jsPDF } from 'jspdf';
import { evaluateSimulation, levelName } from './rules.js';

function formatDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('es-ES').format(new Date(value));
  } catch {
    return value;
  }
}

function filenameFor(simulation) {
  const date = simulation.date || new Date().toISOString().slice(0, 10);
  const student = (simulation.studentName || 'alumno')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 40);
  return `Simulacion_${student}_${date}.pdf`;
}

function addWrapped(doc, text, x, y, maxWidth, lineHeight = 6) {
  const lines = doc.splitTextToSize(text || '', maxWidth);
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }
    doc.text(line, x, y);
    y += lineHeight;
  });
  return y;
}

export function downloadSimulationPdf(simulation, catalogById) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const result = evaluateSimulation(simulation.faults || []);
  const margin = 14;
  let y = 16;

  doc.setProperties({
    title: `Simulación permiso B - ${simulation.studentName || ''}`,
    subject: 'Informe de simulación de examen práctico permiso B',
    creator: 'Simulador permiso B'
  });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('Simulación examen práctico permiso B', margin, y);
  y += 8;

  doc.setFontSize(22);
  doc.setTextColor(result.noApto ? 185 : 21, result.noApto ? 28 : 128, result.noApto ? 28 : 61);
  doc.text(result.result, margin, y);
  doc.setTextColor(0, 0, 0);
  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const meta = [
    ['Alumno/a', simulation.studentName || ''],
    ['Fecha', formatDate(simulation.date)],
    ['Zona / recorrido', simulation.zone || ''],
    ['Profesor/a', simulation.teacher || ''],
    ['Vehículo', simulation.vehicle || '']
  ];

  meta.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(String(value || '-'), margin + 34, y);
    y += 6;
  });

  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.text(`Leves: ${result.L}`, margin, y);
  doc.text(`Deficientes: ${result.D}`, margin + 34, y);
  doc.text(`Eliminatorias: ${result.E}`, margin + 80, y);
  doc.text(`Total: ${result.total}`, margin + 132, y);
  y += 8;

  if (result.reasons.length) {
    doc.setFont('helvetica', 'normal');
    y = addWrapped(doc, `Motivo del no apto: ${result.reasons.join(', ')}.`, margin, y, 180, 5);
    y += 3;
  }

  const timers = simulation.timers || {};
  const examElapsed = effectiveElapsed(timers.exam);
  const parkingElapsed = effectiveElapsed(timers.parking);
  const countdownRemaining = effectiveRemaining(timers.countdown);
  const timeRecords = timers.parking?.records || [];
  const hasTimes = examElapsed > 0 || parkingElapsed > 0 || timeRecords.length;

  if (hasTimes) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Tiempos', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Cronómetro examen: ${formatMs(examElapsed)}`, margin, y);
    y += 5;
    doc.text(`${timers.parking?.label || 'Maniobra'}: ${formatMs(parkingElapsed)}`, margin, y);
    y += 5;
    if (timers.countdown) {
      doc.text(`Temporizador restante: ${formatMs(countdownRemaining)}`, margin, y);
      y += 5;
    }
    if (timeRecords.length) {
      y += 2;
      doc.setFont('helvetica', 'bold');
      doc.text('Tiempos guardados:', margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      timeRecords.forEach((record) => {
        if (y > 270) {
          doc.addPage();
          y = 18;
        }
        doc.text(`- ${record.label || 'Maniobra'}: ${formatMs(record.elapsedMs)}`, margin + 4, y);
        y += 5;
      });
    }
    y += 4;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Faltas marcadas', margin, y);
  y += 7;
  doc.setFontSize(10);

  const faults = simulation.faults || [];
  if (!faults.length) {
    doc.setFont('helvetica', 'normal');
    doc.text('No hay faltas marcadas.', margin, y);
    y += 6;
  }

  faults.forEach((item, index) => {
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
    const data = item.snapshot || catalogById.get(item.faultId) || item;
    const tipo = data.tipo || item.tipo || '';
    const title = data.falta || 'Falta';
    const block = data.bloque || '';
    const note = item.note ? `Observación: ${item.note}` : '';

    doc.setFont('helvetica', 'bold');
    y = addWrapped(doc, `${index + 1}. [${tipo}] ${title}`, margin, y, 180, 5);
    doc.setFont('helvetica', 'normal');
    y = addWrapped(doc, `${block} · ${levelName(tipo)}`, margin + 4, y, 176, 5);
    if (data.obs) y = addWrapped(doc, data.obs, margin + 4, y, 176, 5);
    if (note) y = addWrapped(doc, note, margin + 4, y, 176, 5);
    y += 3;
  });

  if (simulation.generalNotes) {
    if (y > 250) {
      doc.addPage();
      y = 18;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('Observaciones generales', margin, y);
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    y = addWrapped(doc, simulation.generalNotes, margin, y, 180, 5);
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(110, 118, 130);
    doc.text(`Página ${i} de ${pageCount}`, 180, 290);
    doc.text('Informe generado desde Simulador permiso B', margin, 290);
  }

  doc.save(filenameFor(simulation));
}
