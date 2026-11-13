import { ArrowRight, BookOpen, Check, Clock3, LockKeyhole } from 'lucide-react';
import { coursePrice, type CourseOffering } from '@/lib/course-offerings';
import CourseStart from './course-start';
import LearningPhoto from './learning-photo';

type Module = { id: string; title: string; lessons: {id:string;title:string;minutes:number}[] };
const courseActivities = [
  { label: 'Responde una pregunta', title: 'Preguntas con explicación', view: 'inicio', text: 'Explicación de cada opción de respuesta.' },
  { label: 'Lee las lecciones', title: 'Lecciones', view: 'ruta', text: 'Temas de estudio y ejemplos.' },
  { label: 'Practica', title: 'Práctica', view: 'practica', text: 'Preguntas para repasar lo estudiado.' },
  { label: 'Simula el examen', title: 'Simulador', view: 'simulacion', text: 'Práctica en formato de examen.' },
];
export default function CourseHub({course, modules, hasAccess}: {course:CourseOffering; modules:Module[]; hasAccess:boolean}) {
  const preview = `/cursos/${course.slug}/leccion-gratuita/`;
  return <>
    <section className="hub-heading"><p className="eyebrow">{course.category} · {course.edition}</p><h1>{course.title}</h1><p>{course.description}</p><div className="hub-tags"><span><BookOpen size={15}/>{course.available ? '18 lecciones · 6 bloques' : 'Ruta de aprendizaje'}</span><span><Clock3 size={15}/>A tu ritmo</span><span>{course.available ? (hasAccess ? 'Curso disponible' : 'Lección gratuita disponible') : 'Próximamente'}</span></div></section>
    <div className="hub-layout"><div>
      {course.available ? <CourseStart slug={course.slug} hasAccess={hasAccess} /> : <section className="hub-next"><p className="eyebrow">CONOCE LA PROPUESTA</p><h2>Una nueva ruta para tu desarrollo</h2><p>Este curso está en preparación. Aquí puedes conocer su enfoque y los bloques previstos; las actividades se habilitarán cuando esté disponible.</p></section>}
      {course.available && <section className="hub-course-contents" aria-labelledby="hub-contents-title">
        <h2 id="hub-contents-title">En el curso</h2>
        <ol className="hub-sequence" role="list">
          {courseActivities.map((step, index) => {
            const content = <><b aria-hidden="true">0{index + 1}</b><strong>{hasAccess ? step.label : step.title}</strong><span>{step.text}</span></>;
            return <li key={step.view}>{hasAccess
              ? <a className="hub-sequence-item" href={`/asesor?seccion=${step.view}`}>{content}</a>
              : <div className="hub-sequence-item">{content}</div>}</li>;
          })}
        </ol>
      </section>}
      <section className="hub-modules" aria-labelledby="hub-route-title"><div className="section-title"><h2 id="hub-route-title">{course.available ? 'Tu ruta de estudio' : 'Bloques previstos'}</h2><span>{modules.length} bloques</span></div>{modules.map((module,index) => <details key={module.id} open={index===0}><summary><span className="hub-module-number">{String(index+1).padStart(2,'0')}</span><span><strong>{module.title}</strong><small>{module.lessons.length ? `${module.lessons.length} lecciones · ${module.lessons.reduce((sum,lesson)=>sum+lesson.minutes,0)} min de estudio estimado` : 'Contenido en preparación'}</small></span></summary>{module.lessons.length ? <ol>{module.lessons.map((lesson,i) => <li key={lesson.id}><span>{index+1}.{i+1}</span><div><strong>{lesson.title}</strong><small>{lesson.minutes} minutos</small></div>{hasAccess ? <a href={`/asesor?seccion=ruta&leccion=${lesson.id}`} aria-label={`Estudiar ${lesson.title}`}>Estudiar <ArrowRight size={14}/></a> : lesson.id===course.previewLessonId ? <a href={preview}>Lección gratuita <ArrowRight size={14}/></a> : <span className="hub-locked"><LockKeyhole size={14}/>Acceso completo</span>}</li>)}</ol> : <p className="hub-coming">Las lecciones y actividades de este bloque estarán disponibles con la apertura del curso.</p>}</details>)}</section>
    </div><aside className="hub-sidebar"><LearningPhoto className="hub-learning-photo" src="/assets/learning/asesoria-individual.webp" alt="Una asesora y un docente revisan juntos un cuaderno durante una sesión individual." /><section className="hub-advice"><p className="eyebrow">CÓMO ESTUDIAR</p><h2>Lee, practica y repasa</h2><ul><li>Reserva un momento tranquilo para estudiar.</li><li>Responde las preguntas antes de ver la explicación.</li><li>Revisa por qué acertaste o te equivocaste.</li><li>Vuelve a las lecturas cuando tengas dudas.</li></ul>{course.available && <p>Alterna lectura y práctica. El simulador te ayudará a identificar qué necesitas reforzar.</p>}</section><section className="course-price-panel"><span>ACCESO COMPLETO</span>{course.available ? <><strong>{coursePrice(course)}</strong><p>Precio por curso</p></> : <><strong className="course-price-upcoming">Próximamente</strong><p>Precio previsto: {coursePrice(course)}</p></>}<ul className="hub-includes">{course.features.map(feature => <li key={feature}><Check size={14}/>{feature}</li>)}</ul>{course.available ? <>
      {!hasAccess && <p className="hub-enrollment-note">La inscripción y el pago en línea aún no están habilitados.</p>}
      <a className="primary" href={hasAccess ? '/asesor' : preview}>{hasAccess ? 'Entrar a mi preparación' : 'Probar lección gratuita'}<ArrowRight size={16}/></a>
    </> : <p className="hub-coming">Inscripciones aún no disponibles.</p>}</section></aside></div>
  </>;
}
