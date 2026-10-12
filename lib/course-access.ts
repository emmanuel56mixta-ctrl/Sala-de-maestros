import { env } from 'cloudflare:workers';
import { COURSE_ID } from './catalog';

// Preserve the owner's existing workspace while commercial enrollment is connected.
// An environment value supplied by the server cannot be changed by a visitor.
export function hasCourseAccess(email: string | undefined, courseId: string) {
  const owner = (env as unknown as Record<string, unknown>).COURSE_OWNER_EMAIL;
  return courseId === COURSE_ID && typeof owner === 'string' && owner.length > 0 && email?.trim().toLowerCase() === owner.trim().toLowerCase();
}
