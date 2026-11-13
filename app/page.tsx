import LearningSteps from './learning-steps';
import DepthHero from './depth-hero';
import TeacherCommunity from './teacher-community';
import InstitutionResources from './institution-resources';
import LearningPhoto from './learning-photo';
import PublicFooter from './public-footer';
import PublicMotion from './public-motion';
import { ArrowRight } from 'lucide-react';


export default function Home() {
  return (
    <div className="landing">
      <PublicMotion />
      <a className="skip-link" href="#presentacion">Ir al contenido</a>
      <main id="presentacion">
        <DepthHero />
        <section id="bienvenida" className="landing-welcome" aria-labelledby="welcome-title">
          <div className="welcome-copy">
            <p className="eyebrow">FORMACIÓN DOCENTE</p>
            <h2 id="welcome-title" className="landing-tagline">Un espacio propio para encontrarse, aprender y prepararse entre docentes.</h2>
            <p className="landing-description">Formación para tu práctica docente y tu desarrollo profesional, con lecciones, actividades y una ruta que puedes retomar a tu ritmo.</p>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a className="welcome-primary" href="/cursos/subdireccion-secundaria/leccion-gratuita/">Probar una lección gratuita<ArrowRight size={18} aria-hidden="true" /></a>
          </div>
          <LearningPhoto
            className="welcome-learning-photo"
            src="/assets/learning/aprendizaje-entre-colegas.webp"
            alt="Dos docentes revisan una actividad en la computadora y comparten sus ideas."
          />
        </section>
        <LearningSteps />
        <TeacherCommunity />
        <InstitutionResources />
      </main>
      <PublicFooter />
    </div>
  );
}
