export const COURSE_ID = 'subdireccion-secundaria-2026';
export const COURSE_TITLE = 'Subdirección de secundaria';
export const EXAM_MINUTES = 240;
export const levels = ['preescolar', 'primaria', 'secundaria'] as const;
export const positions = ['subdireccion', 'direccion', 'supervision', 'jefatura'] as const;
export const positionNames = {subdireccion:'Subdirección',direccion:'Dirección',supervision:'Supervisión',jefatura:'Jefatura de sector'};
export const catalog = positions.flatMap(position => levels.map(level => ({
  id:`${position}-${level}-2026`,position,level,
  title:`${positionNames[position]} · ${level.charAt(0).toUpperCase()+level.slice(1)}`,
  available:position==='subdireccion'&&level==='secundaria'
})));
