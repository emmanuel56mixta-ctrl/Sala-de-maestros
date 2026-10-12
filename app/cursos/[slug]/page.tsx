import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { offeringBySlug } from '@/lib/course-offerings';
import { lessons } from '@/lib/course';
import { topics } from '@/lib/content';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { hasCourseAccess } from '@/lib/course-access';
import CatalogShell from '../../catalog-shell';
import CourseHub from '../../course-hub';

type Props = { params: Promise<{ slug: string }> };
export const dynamic = 'force-dynamic';
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const course = offeringBySlug((await params).slug);
  return { title: course ? `${course.title} · Cursos · Sala de Maestros` : 'Curso no encontrado · Sala de Maestros' };
}
export default async function CoursePage({ params }: Props) {
  const course = offeringBySlug((await params).slug);
  if (!course) notFound();
  const user = await getChatGPTUser();
  const modules = course.available ? topics.map(topic => ({id:topic.id,title:topic.title,lessons:lessons.filter(item=>item.topic===topic.id).map(item=>({id:item.id,title:item.title,minutes:item.minutes}))})) : (course.modules||[]).map((title,index)=>({id:String(index),title,lessons:[]}));
  return <CatalogShell backTo="/cursos" backLabel="Todos los cursos"><CourseHub course={course} modules={modules} hasAccess={hasCourseAccess(user?.email,course.id)}/></CatalogShell>;
}
