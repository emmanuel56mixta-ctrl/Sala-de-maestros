import Home from '../app/page';
import CoursesPage from '../app/cursos/page';
import CatalogShell from '../app/catalog-shell';
import CourseHub from '../app/course-hub';
import CourseExplorer from '../app/cursos/[slug]/course-explorer';
import { courseOfferings, offeringBySlug } from '../lib/course-offerings';
import type { Lesson } from '../lib/course';
import publicData from './public-data.json';

const advisorUrl = 'https://ascenso-docente-laboratorio.mandrakker.chatgpt.site/signin-with-chatgpt?return_to=%2Fasesor';
const publicPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const routes = [
  { path: '/', title: 'Sala de Maestros · NEMC' },
  { path: '/cursos', title: 'Cursos · Sala de Maestros' },
  ...courseOfferings.map(course => ({ path: `/cursos/${course.slug}`, title: `${course.title} · Sala de Maestros` })),
  ...courseOfferings.filter(course => course.available).map(course => ({ path: `/cursos/${course.slug}/leccion-gratuita`, title: `Lección gratuita · ${course.title} · Sala de Maestros` })),
];

function AccountAccess() {
  return <nav className="pages-account-bar" aria-label="Acceso a mi espacio de estudio">
    <span>¿Ya tienes acceso?</span>
    <a href={advisorUrl}>Entrar a mi curso <span aria-hidden="true">↗</span></a>
  </nav>;
}

export function App({ pathname }: { pathname: string }) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
  if (path === '/') return <Home />;
  if (path === '/cursos') return <><AccountAccess /><CoursesPage /></>;

  const match = path.match(/^\/cursos\/([^/]+)(\/leccion-gratuita)?$/);
  const course = match ? offeringBySlug(match[1]) : undefined;
  if (course && (!match?.[2] || course.available)) {
    const preview = Boolean(match?.[2]);
    const modules = course.available ? publicData.modules : (course.modules || []).map((title, index) => ({ id: String(index), title, lessons: [] }));
    return <>
      <AccountAccess />
      <CatalogShell backTo={publicPath(preview ? `/cursos/${course.slug}` : '/cursos')} backLabel={preview ? 'Volver al curso' : 'Todos los cursos'}>
        {preview ? <CourseExplorer course={course} lesson={publicData.freeLesson as Lesson} source={publicData.source} outline={publicData.outline} hasAccess={false} /> : <CourseHub course={course} modules={modules} hasAccess={false} />}
      </CatalogShell>
    </>;
  }

  return <CatalogShell backTo={publicPath('/cursos')} backLabel="Todos los cursos">
    <section className="catalog-intro">
      <p className="eyebrow">SALA DE MAESTROS</p>
      <h1>Vamos a encontrar tu siguiente paso.</h1>
      <p>Esta página no está disponible. Consulta los cursos y encuentra tu ruta de aprendizaje.</p>
      <a className="primary" href={publicPath('/cursos')}>Ver cursos</a>
    </section>
  </CatalogShell>;
}

export default App;
