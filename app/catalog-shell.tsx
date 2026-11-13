/* eslint-disable @next/next/no-html-link-for-pages -- Shared by Worker and static Pages. */
import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import PublicFooter from './public-footer';

export default function CatalogShell({ children, backTo = '/', backLabel = 'Sala de Maestros' }: { children: ReactNode; backTo?: string; backLabel?: string }) {
  return <div className="landing catalog-shell">
    <a className="skip-link" href="#course-content">Ir al contenido</a>
    <header className="landing-header catalog-header"><a href="/" className="catalog-wordmark">SALA DE<br />MAESTROS</a><nav className="public-account-nav" aria-label="Navegación principal"><a className="catalog-back" href={backTo}><ArrowLeft size={16} aria-hidden="true" />{backLabel}</a><a className="public-account-link" href="/signin-with-chatgpt?return_to=%2Fasesor">Entrar a mi curso</a></nav></header>
    <main id="course-content">{children}</main>
    <PublicFooter />
  </div>;
}
