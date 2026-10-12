import ts from 'typescript';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';
const dir='work/test';fs.mkdirSync(dir,{recursive:true});
function compile(file){const output=path.join(dir,file.replace(/\.ts$/,'.mjs'));fs.mkdirSync(path.dirname(output),{recursive:true});let code=ts.transpileModule(fs.readFileSync(`lib/${file}`,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace(/from (['"])(\.[^'"]+)\1/g,(_,q,p)=>`from ${q}${p}.mjs${q}`);fs.writeFileSync(output,code)}
for(const f of ['guided.ts','content.ts','catalog.ts','learning.ts','workshops.ts','course.ts','progress-schema.ts','revised-questions.ts','legacy-questions.ts','subdirection-questions.ts','bank-builder.ts',...fs.readdirSync('lib/bank').map(f=>'bank/'+f)])compile(f);
const c=await import('../work/test/content.mjs'),l=await import('../work/test/learning.mjs'),w=await import('../work/test/workshops.mjs'),course=await import('../work/test/course.mjs'),{stateSchema}=await import('../work/test/progress-schema.mjs');
assert.equal(c.questions.length,126);assert.equal(c.allQuestions.length,198);assert.equal(new Set(c.allQuestions.map(q=>q.id)).size,198);assert.equal(new Set(c.questions.map(q=>q.stem)).size,126);
for(const q of c.questions){assert.equal(q.options.length,3);assert.equal(q.explanations.length,3);assert.equal(new Set(q.options).size,3);assert.ok(q.correct>=0&&q.correct<3);assert.ok(c.sources[q.source]);assert.ok(q.clue&&q.reason&&q.reference);assert.ok(q.stem.length>70);assert.ok(q.options.every(o=>o.trim().length>0));assert.equal(q.track,'direccion');}
let s=l.initialState();assert.equal(s.role,'subdireccion');assert.equal(l.poolFor('subdireccion').length,36);assert.equal(l.poolFor('subdireccion',true).length,90);assert.equal(l.poolFor('supervision').length,0);assert.throws(()=>l.makeSession({...s,role:'supervision'},'practica'));
for(const t of c.topics){assert.equal(l.poolFor(s.role).filter(q=>q.topic===t.id).length,6);assert.equal(l.poolFor(s.role,true).filter(q=>q.topic===t.id).length,15);assert.equal(course.lessons.filter(x=>x.topic===t.id).length,3);}
const diag=l.makeSession(s,'diagnostico',undefined,100000),exam=l.makeSession(s,'simulacion',undefined,100000);
assert.equal(diag.ids.length,12);assert.equal(exam.ids.length,90);assert.equal(new Set(exam.ids).size,90);assert.equal(exam.deadline-exam.startedAt,14400000);assert.equal(exam.ids.filter(id=>diag.ids.includes(id)).length,0);assert.deepEqual([0,1,2].map(k=>exam.ids.filter(id=>c.questionById(id).correct===k).length),[30,30,30]);
diag.answers=diag.ids.map((id,i)=>({questionId:id,selected:i===0?null:c.questionById(id).correct,confidence:'alta',hint:i===1,seconds:30,at:100000}));s=l.completeSession(s,diag,110000);assert.equal(l.sessionScore(s.history[0]),11);assert.equal(l.independentScore(s.history[0]),10);assert.equal(l.firstAttempts(s).length,12);assert.equal(l.reviewDue(s,100000+86400000).length,2);assert.equal(l.reviewDue(s,100000+7*86400000).length,12);
const revisit={...diag,id:crypto.randomUUID(),answers:diag.ids.map(id=>({questionId:id,selected:c.questionById(id).correct,confidence:'media',hint:false,seconds:20,at:100000+86400000}))};s=l.completeSession(s,revisit);assert.equal(l.firstAttempts(s)[0].selected,null);assert.equal(l.lastAttempts(s).get(diag.ids[0]).selected,c.questionById(diag.ids[0]).correct);assert.equal(l.topicStats(s).reduce((n,t)=>n+t.correct,0),12);
const omitted=l.completeSession(s,{...exam,answers:[],hintIds:[exam.ids[0]]},123456).history.at(-1);assert.equal(omitted.answers.filter(a=>a.selected===null).length,90);assert.equal(omitted.answers[0].hint,true);
const legacy=c.questionById('C01');assert.equal(legacy.correct,1);assert.equal(legacy.options[1],'Acordar formatos accesibles y verificar con ella que pueda utilizarlos.');
const prior={id:crypto.randomUUID(),role:'direccion',mode:'diagnostico',ids:['C01'],index:0,startedAt:1,deadline:null,completedAt:null,answers:[{questionId:'C01',selected:1,confidence:'alta',seconds:20,hint:false,at:2}]};
const normalized=l.normalizeState({version:1,role:'supervision',name:'Prueba',minutes:15,active:prior,history:[{...prior,id:crypto.randomUUID(),completedAt:3}],feedback:[],lessons:['direccion:R2:derechos']});assert.equal(normalized.active,null);assert.equal(normalized.archivedSessions.length,1);assert.deepEqual(normalized.archivedSessions[0].answers,prior.answers);assert.equal(normalized.history.length,1);assert.equal(l.firstAttempts(normalized).length,0);assert.equal(l.normalizeState(normalized).archivedSessions.length,1);assert.equal(l.sessionScore(normalized.history[0]),1);assert.equal(stateSchema.safeParse(normalized).success,true);
assert.equal(stateSchema.safeParse({...s,active:exam}).success,true);assert.equal(stateSchema.safeParse({...s,active:{...exam,ids:[exam.ids[0],exam.ids[0]]}}).success,false);assert.equal(stateSchema.safeParse({...s,active:{...exam,answers:[{...diag.answers[0],questionId:diag.ids[0]}]}}).success,false);assert.equal(stateSchema.safeParse({...s,active:{...exam,hintIds:[diag.ids[0]]}}).success,false);assert.equal(stateSchema.safeParse({...s,active:prior}).success,false);
assert.equal(course.lessons.length,18);assert.equal(w.workshops.length,8);for(const x of w.workshops){assert.ok(x.segments.some(s=>s.tag==='encargo'));assert.ok(x.segments.some(s=>s.tag==='dato'));assert.ok(x.segments.some(s=>s.tag==='actor'));assert.equal(x.options.length,3);assert.equal(x.optionFeedback.length,3);assert.ok(c.sources[x.source]);}
for(const x of course.lessons){assert.ok(w.workshopById(x.workshop));assert.ok(x.paragraphs.join(' ').length>750);assert.equal(x.check.options.length,3);assert.ok(x.check.feedback[x.check.correct]);}
const wd={...w.emptyWorkshop(),step:3,marks:{'0':'actor',criterion:'1'},completed:true,updatedAt:100,choice:0,reason:2};assert.equal(stateSchema.safeParse({...s,workshops:{w78:wd},lessonChecks:{d1:1}}).success,true);assert.equal(stateSchema.safeParse({...s,workshops:{w78:{...wd,step:6}}}).success,false);
console.log('PASS: 126 unique current questions; 36 learning + 90 reserved; balanced keys; 6 subareas; 18 lessons; 8 workshops; role gating; 12-question diagnosis; 4-hour simulation; separate assisted score; spaced-review prioritization; omitted answers; state validation; historical answer keys and unfinished-session preservation.');
console.log('Formats:',Object.fromEntries(['Caso','Completamiento','Ordenamiento','Relación'].map(f=>[f,c.questions.filter(q=>q.format===f).length])));
const prose=c.questions.filter(q=>q.reserve&&q.format==='Caso');
const lengthRanks=[0,1,2].map(rank=>prose.filter(q=>q.options.map((o,i)=>({i,n:o.length})).sort((a,b)=>a.n-b.n).findIndex(x=>x.i===q.correct)===rank).length);
assert.ok(lengthRanks.every(n=>n/prose.length<.5));
console.log('Editorial length check: shortest / middle / longest correct alternatives:',lengthRanks);

const g=await import('../work/test/guided.mjs');
for(const [topic,plan] of Object.entries(g.guidedPlans)){
 const guided=g.makeGuidedSession(l.initialState(),topic,1234);
 assert.equal(stateSchema.safeParse({...l.initialState(),active:guided}).success,true);
 assert.equal(guided.ids.length,2);assert.notEqual(...guided.ids);
 for(const id of guided.ids){assert.equal(c.questionById(id).reserve,false);assert.equal(c.questionById(id).topic,topic);assert.equal(g.lessonForQuestion(id).topic,topic);}
 assert.ok(course.lessons.some(x=>x.id===plan.lesson&&x.topic===topic));
 const first={questionId:guided.ids[0],selected:c.questionById(guided.ids[0]).correct,confidence:'media',seconds:12,hint:false,at:1240};
 const saved=stateSchema.parse({...l.initialState(),active:{...guided,answers:[first]}});
 assert.equal(saved.active.guidedTopic,topic);assert.deepEqual(saved.active.answers,[first]);assert.equal(saved.active.index,0);
 const resumed=l.normalizeState(JSON.parse(JSON.stringify(saved)));assert.equal(resumed.active.guidedTopic,topic);
 const transfer={...resumed.active,index:1};assert.equal(stateSchema.safeParse({...resumed,active:transfer}).success,true);
 const early=l.completeSession(resumed,transfer,1400);assert.equal(early.history[0].answers[1].selected,null);assert.equal(g.learningNeeds(early.history[0]).length,1);
 assert.equal(g.learningNeeds(early.history[0])[0].lesson.topic,topic);
}
for(const q of c.questions.filter(x=>!x.reserve))assert.equal(g.lessonForQuestion(q.id).topic,q.id==='SD26-P010'?'nem':q.topic);
assert.equal(g.lessonForQuestion('SD26-P018').id,'i1');
assert.equal(g.lessonForQuestion('SD26-P010').id,'n1');
assert.equal(stateSchema.safeParse({...l.initialState(),active:{...exam,guidedTopic:'derechos'}}).success,false);
assert.equal(stateSchema.safeParse({...l.initialState(),active:{...g.makeGuidedSession(l.initialState(),'derechos'),guidedTopic:'nem'}}).success,false);
console.log('PASS: six explicit learning/transfer pairs, reserved-bank separation, lesson links for all 36 study cases, guided metadata persistence, resume after first response, transfer stage, early finish and omissions.');
