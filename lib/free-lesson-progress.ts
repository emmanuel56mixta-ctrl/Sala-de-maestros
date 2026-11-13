/** Visit-only practice history; never written to account progress or storage. */
export type PracticeAttempt = {
  selected: number | null;
  firstAnswer: number | null;
  checked: boolean;
  attempts: number;
};
export const emptyAttempt = (): PracticeAttempt => ({ selected: null, firstAnswer: null, checked: false, attempts: 0 });
export function selectAnswer(previous: PracticeAttempt, answer: number, optionCount: number): PracticeAttempt {
  if (!Number.isInteger(answer) || answer < 0 || answer >= optionCount || answer === previous.selected) return previous;
  return { ...previous, selected: answer, checked: false };
}
export function submitAnswer(previous: PracticeAttempt): PracticeAttempt {
  if (previous.selected === null || previous.checked) return previous;
  return { ...previous, checked: true, firstAnswer: previous.firstAnswer ?? previous.selected, attempts: previous.attempts + 1 };
}
export function resultForAttempt(attempt: PracticeAttempt, correct: number): string {
  if (!attempt.checked) return attempt.attempts ? 'Respuesta cambiada; falta comprobarla' : 'Pendiente de responder';
  if (attempt.selected !== correct) return 'Por reforzar';
  return attempt.attempts === 1 ? 'Correcto en el primer intento' : 'Correcto después de revisar la explicación';
}
