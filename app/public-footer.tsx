/* eslint-disable @next/next/no-html-link-for-pages -- Shared by Worker and static Pages. */
export default function PublicFooter() {
  return <footer className="landing-footer public-footer">
    <div><strong>Sala de Maestros</strong><p>Un espacio propio para encontrarse, aprender y prepararse.</p></div>
    <nav aria-label="Enlaces al pie de página">
      <a href="/cursos/">Todos los cursos</a>
      <a href="/signin-with-chatgpt?return_to=%2Fasesor">Entrar a mi curso</a>
    </nav>
  </footer>;
}
