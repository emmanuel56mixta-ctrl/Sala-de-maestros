import type { Metadata } from 'next';
import { digitalSection } from '@/lib/course-sections';
import CatalogPage from '../../catalog-page';

export const metadata: Metadata = {
  title: `${digitalSection.title} · Sala de Maestros`,
  description: digitalSection.description,
};

export default function DigitalCoursesPage() {
  return <CatalogPage section={digitalSection} />;
}
