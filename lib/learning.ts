import {questions,questionById,isCurrentQuestion,topics,type Role,type TopicId} from './content';
import {COURSE_ID,EXAM_MINUTES} from './catalog';
export type Mode='diagnostico'|'practica'|'simulacion';
export type Answer={questionId:string;selected:number|null;confidence:'baja'|'media'|'alta';seconds:number;hint:boolean;at:number};
export type Session={id:string;mode:Mode;role:Role;ids:string[];index:number;answers:Answer[];startedAt:number;deadline:number|null;completedAt:number|null;courseId?:string;assisted?:boolean;hintIds?:string[];guidedTopic?:TopicId};
export type Feedback={id:string;questionId:string|null;view:string;text:string;createdAt:number};
export type WorkshopRecord={step:number;marks:Record<string,string>;choice:number|null;reason:number|null;checked:boolean;completed:boolean;attempts:number;updatedAt:number};
export type State={version:1;role:Role;name:string;minutes:number;history:Session[];active:Session|null;lessons:string[];feedback:Feedback[];courseId:string;onboarded:boolean;archivedSessions:Session[];workshops:Record<string,WorkshopRecord>;lessonChecks:Record<string,number>};
export const initialState=():State=>({version:1,role:'subdireccion',courseId:COURSE_ID,name:'',minutes:20,history:[],active:null,lessons:[],feedback:[],onboarded:false,archivedSessions:[],workshops:{},lessonChecks:{}});
export function normalizeState(input:Partial<State>):State{
 const state={...initialState(),...input,role:'subdireccion' as Role,courseId:COURSE_ID};
 if(state.active&&!state.active.ids.every(isCurrentQuestion)){
   if(!state.archivedSessions.some(s=>s.id===state.active!.id))state.archivedSessions=[...state.archivedSessions,state.active];
   state.active=null;
 }
 return state;
}
export const poolFor=(role:Role,reserve=false)=>role==='subdireccion'?questions.filter(q=>q.reserve===reserve):[];
export function historyFor(state:State){return state.history.filter(s=>s.courseId===COURSE_ID&&s.role==='subdireccion');}
export function currentHistoryFor(state:State){return historyFor(state).filter(s=>s.ids.every(isCurrentQuestion));}
export function firstAttempts(state:State){const map=new Map<string,Answer>();for(const s of currentHistoryFor(state))for(const a of s.answers)if(!map.has(a.questionId))map.set(a.questionId,a);return [...map.values()];}
export function lastAttempts(state:State){return new Map(currentHistoryFor(state).flatMap(s=>s.answers).map(a=>[a.questionId,a]));}
export function topicStats(state:State){const list=[...lastAttempts(state).values()];return topics.map(t=>{const a=list.filter(a=>questionById(a.questionId)?.topic===t.id);const correct=a.filter(a=>questionById(a.questionId).correct===a.selected&&!a.hint).length;return {topic:t,attempted:a.length,correct,percent:a.length?Math.round(correct/a.length*100):null,priority:a.length?(a.length-correct)/a.length+.05:1};});}
export function reviewDue(state:State,now=Date.now()){
 return [...lastAttempts(state).values()].filter(a=>!questionById(a.questionId).reserve).map(a=>{const correct=a.selected===questionById(a.questionId).correct;const days=!correct||a.hint?1:a.confidence==='alta'?7:3;return {answer:a,due:a.at+days*86400000,days};}).filter(r=>r.due<=now).sort((a,b)=>a.due-b.due);
}
export function selectQuestions(state:State,mode:Mode,topic?:TopicId,now=Date.now()){
 if(state.courseId!==COURSE_ID||state.role!=='subdireccion')throw new Error('Este recorrido no está habilitado.');
 const pool=poolFor(state.role,mode==='simulacion');
 if(mode==='diagnostico')return topics.flatMap(t=>pool.filter(q=>q.topic===t.id).slice(0,2).map(q=>q.id));
 if(mode==='simulacion'){
   // Interleave areas; subsequent attempts rotate the same reserved form, never claim it is unseen.
   return Array.from({length:15},(_,i)=>topics.map(t=>pool.filter(q=>q.topic===t.id)[i].id)).flat();
 }
 const last=lastAttempts(state),due=new Set(reviewDue(state,now).map(r=>r.answer.questionId)),stats=topicStats(state);
 return pool.filter(q=>!topic||q.topic===topic).map(q=>({id:q.id,score:(due.has(q.id)?6:!last.has(q.id)?4:last.get(q.id)!.selected!==q.correct||last.get(q.id)!.hint?2:0)+(stats.find(s=>s.topic.id===q.topic)?.priority??0)})).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id)).slice(0,6).map(q=>q.id);
}
export function makeSession(state:State,mode:Mode,topic?:TopicId,now=Date.now(),assisted=false):Session{return {id:crypto.randomUUID(),mode,role:state.role,courseId:COURSE_ID,assisted:mode==='practica'||assisted,hintIds:[],ids:selectQuestions(state,mode,topic,now),index:0,answers:[],startedAt:now,deadline:mode==='simulacion'?now+EXAM_MINUTES*60000:null,completedAt:null};}
export const sessionScore=(s:Session)=>s.answers.filter(a=>a.selected===questionById(a.questionId)?.correct).length;
export const independentScore=(s:Session)=>s.answers.filter(a=>!a.hint&&a.selected===questionById(a.questionId)?.correct).length;
export const modeLabels:Record<Mode,string>={diagnostico:'Diagnóstico',practica:'Práctica guiada',simulacion:'Simulador completo'};
export function completeSession(state:State,session:Session,now=Date.now()):State {const complete={...session,completedAt:now,answers:session.ids.map(id=>session.answers.find(a=>a.questionId===id)??{questionId:id,selected:null,confidence:'baja' as const,seconds:0,hint:session.hintIds?.includes(id)??false,at:now})};return {...state,active:null,history:[...state.history.filter(s=>s.id!==session.id),complete].slice(-250)};}
export function latestTopic(state:State){return [...topicStats(state)].sort((a,b)=>b.priority-a.priority)[0].topic;}
