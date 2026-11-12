import type { Metadata } from 'next';
import CatalogPage from '../catalog-page';
export const metadata: Metadata = { title: 'Cursos · Sala de Maestros', description: 'Rutas de aprendizaje para la práctica docente, el desarrollo profesional y la preparación para promoción.' };
export default function CoursesPage() {
  return <CatalogPage />;
}
