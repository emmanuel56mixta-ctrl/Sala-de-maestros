import type { Metadata } from 'next';
import { promotionSection } from '@/lib/course-sections';
import CatalogPage from '../../catalog-page';

export const metadata: Metadata = {
  title: `${promotionSection.title} · Sala de Maestros`,
  description: promotionSection.description,
};

export default function PromotionCoursesPage() {
  return <CatalogPage section={promotionSection} />;
}
