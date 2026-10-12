import LearningSteps from './learning-steps';
import DepthHero from './depth-hero';
import TeacherCommunity from './teacher-community';
import InstitutionResources from './institution-resources';
import WordReveal from './word-reveal';


export default function Home() {
  return (
    <div className="landing">
      <a className="skip-link" href="#presentacion">Ir al contenido</a>
      <main id="presentacion">
        <DepthHero />
        <section id="bienvenida" className="landing-welcome" aria-label="Bienvenida a Sala de Maestros">
          <p className="landing-tagline"><WordReveal text="Un espacio propio para encontrarse, aprender y prepararse." /></p>
          <div>
            <p className="landing-description">Formación para tu práctica docente y tu desarrollo profesional, con lecciones, actividades y una ruta que puedes retomar a tu ritmo.</p>
          </div>
        </section>
        <LearningSteps />
        <TeacherCommunity />
        <InstitutionResources />
      </main>
      <footer className="landing-footer">
        <p>Sala de Maestros</p>
      </footer>
    </div>
  );
}
