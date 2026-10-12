import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function CatalogShell({ children, backTo = '/', backLabel = 'Sala de Maestros' }: { children: ReactNode; backTo?: string; backLabel?: string }) {
  return <div className="landing catalog-shell">
    <a className="skip-link" href="#course-content">Ir al contenido</a>
    <header className="landing-header catalog-header"><a href="/" className="catalog-wordmark">SALA DE<br />MAESTROS</a><span className="catalog-provider">NEMC</span><a className="catalog-back" href={backTo}><ArrowLeft size={16} aria-hidden="true" />{backLabel}</a></header>
    <main id="course-content">{children}</main>
    <footer className="landing-footer"><span className="nemc-wordmark">NEMC</span><p>Un espacio propio para encontrarse, aprender y prepararse.</p><a href="/cursos">Ver cursos</a></footer>
  </div>;
}
