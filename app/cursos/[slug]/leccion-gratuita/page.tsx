import { notFound } from 'next/navigation';
import { offeringBySlug } from '@/lib/course-offerings';
import { lessons, lessonById } from '@/lib/course';
import { sources } from '@/lib/content';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { hasCourseAccess } from '@/lib/course-access';
import CatalogShell from '../../../catalog-shell';
import CourseExplorer from '../course-explorer';
export const dynamic='force-dynamic';
export const metadata={title:'Lección gratuita · Sala de Maestros'};
export default async function PreviewPage({params}:{params:Promise<{slug:string}>}) {
 const course=offeringBySlug((await params).slug);if(!course?.available)notFound();
 const lesson=lessonById(course.previewLessonId);if(!lesson)notFound();
 const user=await getChatGPTUser();
 return <CatalogShell backTo={`/cursos/${course.slug}`} backLabel="Volver al curso"><CourseExplorer course={course} lesson={lesson} source={sources[lesson.source]} outline={lessons.map(item=>({id:item.id,title:item.title,minutes:item.minutes}))} hasAccess={hasCourseAccess(user?.email,course.id)}/></CatalogShell>;
}
