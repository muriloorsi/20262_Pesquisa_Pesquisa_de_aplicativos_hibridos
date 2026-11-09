export type Turno = 'manha' | 'tarde' | 'noite';

export type Plantao = {
  id: string;
  sala: string;
  turno: Turno;
  enfermeiro: string;
  funcao: string;
};

export type Escala = {
  data: string; // AAAA-MM-DD
  plantoes: Plantao[];
};

export type EscalaEmCache = {
  salvoEm: string; // ISO 8601
  escala: Escala;
};

const TURNOS: Turno[] = ['manha', 'tarde', 'noite'];

/** Confere se o JSON que veio da API tem o formato esperado. */
export function ehEscalaValida(valor: unknown): valor is Escala {
  if (typeof valor !== 'object' || valor === null) return false;
  const v = valor as Record<string, unknown>;
  if (typeof v.data !== 'string' || !Array.isArray(v.plantoes)) return false;
  return v.plantoes.every((p) => {
    if (typeof p !== 'object' || p === null) return false;
    const q = p as Record<string, unknown>;
    return (
      typeof q.id === 'string' &&
      typeof q.sala === 'string' &&
      typeof q.enfermeiro === 'string' &&
      typeof q.funcao === 'string' &&
      TURNOS.includes(q.turno as Turno)
    );
  });
}
