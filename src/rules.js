export function countFaults(faults = []) {
  return faults.reduce(
    (acc, item) => {
      const tipo = item.tipo || item.snapshot?.tipo;
      if (tipo === 'L') acc.L += 1;
      if (tipo === 'D') acc.D += 1;
      if (tipo === 'E') acc.E += 1;
      acc.total += 1;
      return acc;
    },
    { L: 0, D: 0, E: 0, total: 0 }
  );
}

export function evaluateSimulation(faults = []) {
  const counts = countFaults(faults);
  const noApto = counts.E >= 1 || counts.D >= 2 || (counts.D >= 1 && counts.L >= 5) || counts.L >= 10;
  const reasons = [];
  if (counts.E >= 1) reasons.push('1 falta eliminatoria');
  if (counts.D >= 2) reasons.push('2 faltas deficientes');
  if (counts.D >= 1 && counts.L >= 5) reasons.push('1 deficiente + 5 leves');
  if (counts.L >= 10) reasons.push('10 faltas leves');
  return {
    ...counts,
    result: noApto ? 'NO APTO' : 'APTO',
    noApto,
    reasons
  };
}

export function levelName(tipo) {
  if (tipo === 'L') return 'Leve';
  if (tipo === 'D') return 'Deficiente';
  if (tipo === 'E') return 'Eliminatoria';
  return 'Sin clasificar';
}
