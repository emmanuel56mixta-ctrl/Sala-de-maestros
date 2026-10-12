import type { Metadata } from 'next';
import LearningApp from '../learning-app';
import { redirect } from 'next/navigation';
import { getChatGPTUser } from '../chatgpt-auth';
import { hasCourseAccess } from '@/lib/course-access';
import { COURSE_ID } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Subdirección de secundaria · Sala de Maestros',
  description: 'Tu espacio de preparación para subdirección de secundaria: estudio, preguntas con explicación, simulador y avance.',
};

export default async function AdvisorPage() {
  const user = await getChatGPTUser();
  if (!hasCourseAccess(user?.email, COURSE_ID)) redirect('/cursos/subdireccion-secundaria');
  return <LearningApp />;
}
