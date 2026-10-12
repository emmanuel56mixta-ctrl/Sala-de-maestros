import {questionById,type TopicId} from './content';
import {lessons} from './course';
import {makeSession,currentHistoryFor,latestTopic,type State,type Session} from './learning';
// Editorial pairings: both cases exercise the same distinction, never the reserved exam.
export const guidedPlans:Record<TopicId,{ids:[string,string];lesson:string;goal:string}>={
 derechos:{ids:['SD26-P020','SD26-P002'],lesson:'d2',goal:'Distinguir una aportación voluntaria de una condición para acceder al servicio.'},
 nem:{ids:['SD26-P006','SD26-P024'],lesson:'n2',goal:'Distinguir contextualizar un contenido de incorporar uno nuevo.'},
 mejora:{ids:['SD26-P011','SD26-P026'],lesson:'m2',goal:'Precisar el cambio esperado antes de organizar las acciones.'},
 acompanamiento:{ids:['SD26-P028','SD26-P013'],lesson:'a1',goal:'Separar un hecho observado de una conclusión que aún no se puede sostener.'},
 familias:{ids:['SD26-P016','SD26-P032'],lesson:'f2',goal:'Vincular los saberes comunitarios con un propósito de aprendizaje.'},
 alianzas:{ids:['SD26-P009','SD26-P034'],lesson:'i1',goal:'Asignar responsabilidades según las atribuciones de cada órgano.'}
};
export function nextGuidedTopic(state:State):TopicId{
 const completed=currentHistoryFor(state).filter(s=>s.guidedTopic&&s.answers.every(a=>a.selected!==null));
 const available=(Object.keys(guidedPlans) as TopicId[]).filter(t=>!completed.some(s=>s.guidedTopic===t));
 const diagnosis=currentHistoryFor(state).filter(s=>s.mode==='diagnostico').at(-1);
 const priority=diagnosis?learningNeeds(diagnosis).find(n=>available.includes(n.q.topic))?.q.topic:undefined;
 return priority??available[0]??latestTopic(state).id;
}
export function makeGuidedSession(state:State,topic=nextGuidedTopic(state),now=Date.now()):Session{
 return {...makeSession(state,'practica',topic,now),ids:[...guidedPlans[topic].ids],guidedTopic:topic};
}
// Specific lesson links for all 36 study items. Reserved items link to their subarea.
const studyLessons:Record<string,string>={
 'SD26-P001':'d1',
 'SD26-P002':'d2',
 'SD26-P003':'d3',
 'SD26-P004':'n2',
 'SD26-P005':'n1',
 'SD26-P006':'n2',
 'SD26-P007':'f3',
 'SD26-P008':'f1',
 'SD26-P009':'i1',
 'SD26-P010':'n1',
 'SD26-P011':'m2',
 'SD26-P012':'m3',
 'SD26-P013':'a1',
 'SD26-P014':'a3',
 'SD26-P015':'a3',
 'SD26-P016':'f2',
 'SD26-P017':'i2',
 'SD26-P018':'i1',
 'SD26-P019':'d1',
 'SD26-P020':'d2',
 'SD26-P021':'d3',
 'SD26-P022':'n1',
 'SD26-P023':'n3',
 'SD26-P024':'n2',
 'SD26-P025':'m2',
 'SD26-P026':'m2',
 'SD26-P027':'m3',
 'SD26-P028':'a1',
 'SD26-P029':'a2',
 'SD26-P030':'a3',
 'SD26-P031':'f1',
 'SD26-P032':'f2',
 'SD26-P033':'f1',
 'SD26-P034':'i1',
 'SD26-P035':'i2',
 'SD26-P036':'i3'
};
export function lessonForQuestion(id:string){
 const q=questionById(id);
 return lessons.find(l=>l.id===studyLessons[id])??lessons.find(l=>l.topic===q.topic)!;
}
export function learningNeeds(session:Session){
 return session.answers.filter(a=>a.selected!==questionById(a.questionId).correct||a.hint).map(answer=>({answer,q:questionById(answer.questionId),lesson:lessonForQuestion(answer.questionId)}));
}
