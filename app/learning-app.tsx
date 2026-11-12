"use client";
import { visualAssets, topicAssets } from '@/lib/visual-assets';
import { useEffect, useRef, useState, type CSSProperties, type ButtonHTMLAttributes } from 'react';
import { ArrowUpRight, ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Clock3, Compass, Flag, GraduationCap, LayoutDashboard, Lightbulb, Link2, LoaderCircle, MessageSquare, Play, RotateCcw, Settings2, ShieldCheck, Target, TrendingUp, X, CheckCircle2, Bookmark, FileText, Pause, Copy } from 'lucide-react';
import { Sidebar, SidebarProvider, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog';
import { questions, topics, topicById, questionById, isCurrentQuestion, sources, method, roleLabels, trackFor, type Question, type Role, type TopicId } from '@/lib/content';
import { initialState, normalizeState, historyFor, currentHistoryFor, firstAttempts, topicStats, makeSession, sessionScore, modeLabels, completeSession, latestTopic, type State, type Session, type Mode, type Answer } from '@/lib/learning';
import {lessons} from '@/lib/course';
import {COURSE_ID,COURSE_TITLE} from '@/lib/catalog';
import {workshops} from '@/lib/workshops';
import {PreparationHome,StudyRoute,LessonReader,Workshop,QuestionTip,ReviewQueue,SimulatorIntro,CourseCatalog,ResearchNotes} from './course-components';
import {guidedPlans,makeGuidedSession,learningNeeds,lessonForQuestion} from '@/lib/guided';
type View = 'inicio' | 'taller' | 'catalogo' | 'ruta' | 'practica' | 'simulacion' | 'avance' | 'fuentes' | 'session' | 'resultado';
const labels: Record<View, string> = { taller:'Cómo resolver preguntas', catalogo:'Perfiles', inicio: 'Mi preparación', ruta: 'Ruta de estudio', practica: 'Practica con explicación', simulacion: 'Simulación', avance: 'Mi avance', fuentes: 'Documentos y método', session: 'Sesión de estudio', resultado: 'Revisión de resultados' };
const nav = [{ id: 'inicio' as View, label: 'Mi preparación', icon: LayoutDashboard }, { id: 'ruta' as View, label: 'Ruta de estudio', icon: Compass }, {id:'taller' as View,label:'Cómo resolver preguntas',icon:Lightbulb}, { id: 'practica' as View, label: 'Practica con explicación', icon: BookOpen }, { id: 'simulacion' as View, label: 'Simulador completo', icon: Clock3 }, { id: 'avance' as View, label: 'Mi avance', icon: TrendingUp }, { id: 'fuentes' as View, label: 'Documentos y método', icon: FileText }];
const fmtTime = (n: number) => `${Math.floor(Math.max(0, n) / 60).toString().padStart(2, '0')}:${(Math.max(0, n) % 60).toString().padStart(2, '0')}`;
function Menu({ view, go }: {
    view: View;
    go: (v: View) => void;
}) { const { setOpenMobile } = useSidebar(); const render=(items:typeof nav)=><SidebarMenu>{items.map(n=><SidebarMenuItem key={n.id}><SidebarMenuButton isActive={view===n.id} onClick={()=>{go(n.id);setOpenMobile(false);}} className="nav-item"><n.icon size={19}/><span>{n.id==='inicio'?'Empieza aquí / Continúa':n.label}</span></SidebarMenuButton></SidebarMenuItem>)}</SidebarMenu>;return <>{render(nav.filter(n=>['inicio','ruta','avance'].includes(n.id)))}<details className="advanced-menu" open={['taller','practica','simulacion','fuentes'].includes(view)||undefined}><summary>Más herramientas</summary>{render(nav.filter(n=>!['inicio','ruta','avance'].includes(n.id)))}</details></>; }

function SideAction({onClick,...props}:ButtonHTMLAttributes<HTMLButtonElement>){const {setOpenMobile}=useSidebar();return <button {...props} onClick={e=>{onClick?.(e);setOpenMobile(false);}}/>;}
function SourceLink({ q }: {
    q: Question;
}) { return <a className="source-link" target="_blank" rel="noreferrer" href={sources[q.source].url}><FileText size={17}/><span>{sources[q.source].title}<small>{q.reference}</small></span><ArrowUpRight size={17}/></a>; }
function Explanation({ q, answer }: {
    q: Question;
    answer: Answer;
}) { return <div className="explanation"><div className="explanation-head"><span className="round-icon"><Lightbulb size={22}/></span><div><p className="eyebrow">ENTIENDE LA DECISIÓN</p><h3>{answer.selected === q.correct ? 'Tu respuesta tiene fundamento.' : 'Revisemos el criterio del caso.'}</h3></div></div><div className="reason-box"><strong>El dato que cambia la decisión</strong><p>{q.clue}</p><strong>Cómo razonarlo</strong><p>{q.reason}</p></div><div className="option-reasons">{q.explanations.map((text, i) => <div key={i} className={i === q.correct ? 'correct-reason' : ''}><span className="letter">{'ABC'[i]}</span><p><strong>{i === q.correct ? 'Opción fundamentada' : answer.selected === i ? 'La opción que elegiste' : 'Otra alternativa'}</strong>{text}</p>{i === q.correct && <Check size={18}/>}</div>)}</div><div className="reason-box">{q.skill && <><strong>Qué se pone a prueba</strong><p>{q.skill}</p></>}{q.distinction && <><strong>La distinción que debes conservar</strong><p>{q.distinction}</p></>}</div><SourceLink q={q}/>{q.sample&&q.sample.length>0&&<p className="footnote">Referencia temática en el compendio: {q.sample.join(', ')}. Planteamiento y alternativas de práctica.</p>}</div>; }
export default function LearningApp() {
    const [state, setState] = useState<State>(initialState);
    const [revision, setRevision] = useState(0);
    const stateRef = useRef(state);
    stateRef.current = state;
    const revRef = useRef(revision);
    revRef.current = revision;
    const [loaded, setLoaded] = useState(false);
    const [auth, setAuth] = useState(false);
    const [error, setError] = useState('');
    const [conflict, setConflict] = useState(false);
    const [busy, setBusy] = useState(false);
    const busyRef = useRef(false);
    const pending = useRef<{
        state: State;
        revision: number;
        mutationId: string;
    } | null>(null);
    const [view, setView] = useState<View>('inicio');
    useEffect(() => {
      const query = new URLSearchParams(window.location.search);
      const requested = query.get('seccion');
      if (requested && ['inicio','ruta','practica','simulacion'].includes(requested)) setView(requested as View);
      const requestedLesson = query.get('leccion');
      if (requested === 'ruta' && requestedLesson && lessons.some(item => item.id === requestedLesson)) setLesson(requestedLesson);
    }, []);

    const [selected, setSelected] = useState('');
    const [confidence, setConfidence] = useState<'baja' | 'media' | 'alta'>('media');
    const [hint, setHint] = useState(false);
    const [tick, setTick] = useState(Date.now());
    const entered = useRef(Date.now());
    const [result, setResult] = useState<Session | null>(null);
    const [review, setReview] = useState(0);
    const [lesson, setLesson] = useState<string | null>(null);
    const [workshopId,setWorkshopId]=useState('w78');
    function showLesson(id:string){setLesson(lessons.find(l=>l.id===id||l.topic===id)?.id??null);}
    function openWorkshop(id='w78'){setWorkshopId(id);navigate('taller');}
    const [settings, setSettings] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profileMinutes, setProfileMinutes] = useState('15');
    const [report, setReport] = useState(false);
    const [reportText, setReportText] = useState('');
    const [reportSaved, setReportSaved] = useState(false);
    const [notes, setNotes] = useState(false);
    const [copied, setCopied] = useState(false);
    const [reset, setReset] = useState(false);
    const [finish, setFinish] = useState(false);
    const stats = topicStats(state);
    const attempts = firstAttempts(state);
    const hist = state.history;
    const nextTopic = latestTopic(state);
    const q = state.active ? questionById(state.active.ids[state.active.index]) : null;
    const currentAnswer = state.active && q ? state.active.answers.find(a => a.questionId === q.id) : undefined;
    const isPractice = state.active?.mode === 'practica';
    const revealed = !!currentAnswer && isPractice;
    const resultQ = result ? questionById(result.ids[review]) : null;
    async function load() { setError(''); setAuth(false); try {
        const r = await fetch('/api/progress', { cache: 'no-store' });
        const data = await r.json() as {
            state: State;
            revision: number;
            error?: string;
        };
        if (r.status === 401) {
            setAuth(true);
            throw new Error(data.error);
        }
        if (!r.ok)
            throw new Error(data.error || 'No pudimos cargar el avance.');
        const normalized=normalizeState(data.state);
        setState(normalized);
        const lastWorkshop=Object.entries(normalized.workshops).sort((a,b)=>b[1].updatedAt-a[1].updatedAt)[0];
        if(lastWorkshop)setWorkshopId(lastWorkshop[0]);
        setRevision(data.revision);
        setLoaded(true);
        setConflict(false);
        pending.current = null;
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'No pudimos cargar el avance.');
    } }
    useEffect(() => { void load(); }, []);
    useEffect(() => { const timer = setInterval(() => setTick(Date.now()), 1000); return () => clearInterval(timer); }, []);
    async function save(next: State, retry = false) { if (busyRef.current)
        return false; busyRef.current = true; setBusy(true); setError(''); const payload = retry && pending.current ? pending.current : { state: next, revision: revRef.current, mutationId: crypto.randomUUID() }; pending.current = payload; try {
        const r = await fetch('/api/progress', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const d = await r.json() as {
            revision: number;
            error?: string;
        };
        if (!r.ok) {
            setConflict(r.status === 409);
            throw new Error(d.error || 'No pudimos guardar el avance.');
        }
        setState(payload.state);
        stateRef.current = payload.state;
        setRevision(d.revision);
        revRef.current = d.revision;
        pending.current = null;
        return true;
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'No pudimos guardar. Intenta de nuevo.');
        return false;
    }
    finally {
        busyRef.current = false;
        setBusy(false);
    } }
    function navigate(v: View) { setView(v); window.scrollTo({ top: 0, behavior: 'instant' }); }
    useEffect(() => { const a = state.active; if (!a)
        return; const existing = a.answers.find(x => x.questionId === a.ids[a.index]); setSelected(existing?.selected != null ? String(existing.selected) : ''); setConfidence(existing?.confidence ?? 'media'); setHint(existing?.hint || !!a.hintIds?.includes(a.ids[a.index])); entered.current = Date.now(); }, [state.active?.id, state.active?.index]);
    async function start(mode: Mode, topic?: TopicId, assisted=false) { if (state.active) {
        navigate('session');
        return;
    } const s = makeSession(state, mode, topic, Date.now(), assisted); if (await save({ ...state, active: s })) {
        setResult(null);
        setSelected('');
        setConfidence('media');
        setHint(false);
        navigate('session');
    } }
    async function startGuided(topic?:TopicId){if(state.active){navigate('session');return;}const session=makeGuidedSession(state,topic);if(await save({...state,active:session})){setResult(null);setSelected('');setHint(false);navigate('session');}}
    async function submit() { const a = state.active; if (!a || !q || selected === '' || busyRef.current)
        return; const answer: Answer = { questionId: q.id, selected: Number(selected), confidence, seconds: Math.min(86400, Math.max(1, Math.round((Date.now() - entered.current) / 1000))), hint: hint || !!a.hintIds?.includes(q.id), at: Date.now() }; const next = { ...a, answers: [...a.answers.filter(x => x.questionId !== q.id), answer] }; if (a.mode === 'practica') {
        await save({ ...state, active: next });
        return;
    } if (a.index === a.ids.length - 1) {
        await end(next);
        return;
    } if (await save({ ...state, active: { ...next, index: a.index + 1 } }))
        window.scrollTo({ top: 0, behavior: 'instant' }); }
    async function end(s = stateRef.current.active!) { if (!s)
        return; const next = completeSession(stateRef.current, s); if (await save(next)) {
        setResult(next.history[next.history.length - 1]);
        setReview(0);
        setFinish(false);
        navigate('resultado');
    } }
    async function next() { if (!state.active)
        return; if (state.active.index === state.active.ids.length - 1) {
        await end();
        return;
    } if (await save({ ...state, active: { ...state.active, index: state.active.index + 1 } }))
        window.scrollTo({ top: 0, behavior: 'instant' }); }
    async function back() { if (!state.active || state.active.index === 0)
        return; await save({ ...state, active: { ...state.active, index: state.active.index - 1 } }); }
    const remaining = state.active?.deadline ? Math.max(0, Math.ceil((state.active.deadline - tick) / 1000)) : null;
    useEffect(() => { if (loaded && state.active?.deadline && remaining === 0 && !busyRef.current && !error)
        void end(state.active); }, [remaining, loaded, state.active?.id, busy, error]);
    useEffect(() => { if (!state.active)
        return; const warn = (e: BeforeUnloadEvent) => { if (busyRef.current || selected !== '' && !currentAnswer) {
        e.preventDefault();
        e.returnValue = '';
    } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [state.active, selected, currentAnswer]);
    useEffect(() => {
        const ctx = (document as unknown as {
            modelContext?: {
                registerTool: (tool: unknown, options: {
                    signal: AbortSignal;
                }) => Promise<void> | void;
            };
        }).modelContext;
        if (!ctx?.registerTool)
            return;
        const lifecycle = new AbortController();
        const register = (tool: unknown) => { try {
            void Promise.resolve(ctx.registerTool(tool, { signal: lifecycle.signal })).catch(() => { });
        }
        catch { } };
        register({ name: 'read_learning_progress', title: 'Leer avance de preparación', description: 'Lee el recorrido seleccionado y el avance guardado. No inicia ni responde evaluaciones.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: false }, execute: (input: unknown) => { if (!input || typeof input !== 'object' || Object.keys(input).length)
                throw new Error('Se espera un objeto vacío'); const s = stateRef.current; return { role: s.role, courseId:s.courseId, workshops:Object.entries(s.workshops).filter(([,v])=>v.completed).length, lessons:s.lessons.filter(x=>x.startsWith(COURSE_ID+':')).length, sessions: historyFor(s).length, topics: topicStats(s).map(t => ({ topic: t.topic.title, firstAttempts: t.attempted, correct: t.correct })), active: s.active ? { mode: s.active.mode, questionId: s.active.ids[s.active.index] } : null }; } });
        register({ name: 'read_development_feedback', title: 'Leer notas de estudio', description: 'Lee las notas guardadas por el usuario para revisar el material de estudio.', inputSchema: { type: 'object', properties: {}, additionalProperties: false }, annotations: { readOnlyHint: true, untrustedContentHint: true }, execute: (input: unknown) => { if (!input || typeof input !== 'object' || Object.keys(input).length)
                throw new Error('Se espera un objeto vacío'); return { feedback: stateRef.current.feedback }; } });
        return () => lifecycle.abort();
    }, []);
    async function saveReport() { if (!reportText.trim())
        return; const feedback = { id: crypto.randomUUID(), questionId: (view === 'session' ? q : view === 'resultado' ? resultQ : null)?.id ?? null, view, text: reportText.trim(), createdAt: Date.now() }; if (await save({ ...state, feedback: [...state.feedback, feedback].slice(-200) })) {
        setReportSaved(true);
        setReportText('');
    } }
    async function copyNotes() { try {
        await navigator.clipboard.writeText(state.feedback.map(f => `Sala de Maestros · ${f.questionId ?? f.view} · ${new Date(f.createdAt).toLocaleDateString('es-MX')}\n${f.text}`).join('\n\n'));
        setCopied(true);
    }
    catch {
        setError('No se pudo copiar. Puedes seleccionar el texto de tus observaciones.');
    } }
    const accuracy = attempts.length ? Math.round(attempts.filter(a => a.selected === questionById(a.questionId).correct).length / attempts.length * 100) : null;
    const completedLessons = lessons.filter(l=>state.lessons.includes(COURSE_ID+':'+l.id)).length;
    const currentHist = currentHistoryFor(state);
    const locked=!loaded||busy||!!error;
    const strictExam=state.active?.mode==='simulacion'&&!state.active.assisted;
    const beginButton = (mode: Mode, label: string, topic?: TopicId) => <button className="primary" disabled={!loaded || busy || !!error} onClick={() => void start(mode, topic)}>{state.active ? 'Continuar sesión' : label}<ArrowRight size={18}/></button>;
    return <SidebarProvider style={{ '--sidebar-width': '272px' } as CSSProperties}><a className="skip-link" href="#main-content">Ir al contenido</a><Sidebar className="app-sidebar"><SidebarHeader className="brand-header"><div className="brand"><span className="brand-name">SALA DE<br />MAESTROS<span className="brand-caption">FORMACIÓN DOCENTE</span></span></div></SidebarHeader><SidebarContent className="side-body"><div className="provider-line"><span>SUBDIRECCIÓN · SECUNDARIA</span></div><div className="side-caption">MI ESPACIO</div><Menu view={view} go={navigate}/></SidebarContent><SidebarFooter className="side-footer"><button onClick={() => { setProfileName(state.name); setProfileMinutes(String(state.minutes)); setSettings(true); }} disabled={!loaded}><Settings2 size={18}/>Mi preparación y ajustes</button><button onClick={() => setNotes(true)} disabled={!loaded}><MessageSquare size={18}/>Mis notas <span className="count">{state.feedback.length}</span></button></SidebarFooter></Sidebar><SidebarInset className="app-main"><header className="topbar"><div className="topbar-left"><SidebarTrigger aria-label="Abrir menú" className="mobile-menu"/><span>Subdirección de secundaria <span className="top-divider">/</span> <strong>{labels[view]}</strong></span></div><a className="back-to-cover" href="/cursos"><ChevronLeft size={16} aria-hidden="true"/>Volver a cursos</a></header><main id="main-content" className="page-content">
 {error && <div role="alert" className="error-bar"><div><strong>{error}</strong>{conflict && <p>Antes de recargar, copia cualquier observación que estés escribiendo.</p>}</div>{auth ? <a className="secondary" href="/signin-with-chatgpt?return_to=%2Fasesor" target="_top">Entrar con ChatGPT</a> : <button className="secondary" disabled={busy} onClick={() => void (pending.current && !conflict ? save(pending.current.state, true) : load())}>{busy ? 'Guardando…' : conflict ? 'Recargar avance' : 'Reintentar'}</button>}</div>}
 {!loaded && !error ? <div className="loading-state" role="status"><LoaderCircle className="spin"/><h2>Preparando tu espacio de estudio</h2><p>Estamos recuperando tu avance.</p></div> : <>
 {view === 'inicio' && <PreparationHome state={state} disabled={locked} start={m=>void start(m)} openLesson={showLesson} startGuided={()=>void startGuided()}/>}
 {view==='ruta'&&<StudyRoute state={state} openLesson={showLesson} openWorkshop={openWorkshop} start={(m,t)=>void start(m,t)} disabled={locked}/>}
 {view==='taller'&&<Workshop id={workshopId} setId={setWorkshopId} state={state} save={save} disabled={locked} practice={t=>void start('practica',t)}/>}
 {view==='catalogo'&&<CourseCatalog/>}
 {view === 'practica' && <><div className="page-heading"><div><h1>Practica con explicación</h1><p>Responde seis preguntas a tu ritmo. Si necesitas ayuda, pide una pista. Después de cada respuesta podrás leer por qué una opción corresponde y las otras se descartan.</p></div></div><section className="practice-banner"><div><h2>{state.active?'Tienes una sesión pendiente':'Practica con preguntas de varios temas'}</h2><p>{state.active?`Antes de iniciar otra práctica, continúa tu ${modeLabels[state.active.mode].toLowerCase()}. Puedes terminarla desde la misma sesión.`:'Seleccionaremos preguntas que todavía no has respondido y otras que te conviene repasar según tus resultados.'}</p>{beginButton('practica', 'Comenzar 6 preguntas')}</div><img className="practice-art" src={visualAssets.practica} alt="" width={1536} height={1024}/></section><div className="section-title"><h2>Practicar un tema específico</h2></div><div className="topic-grid">{stats.map((s, i) => <button className="topic-card" key={s.topic.id} disabled={busy || !loaded} onClick={() => void start('practica', s.topic.id)}><div className="topic-card-top"><img className="topic-emblem" src={topicAssets[s.topic.id].icon} alt="" width={72} height={72} loading="lazy"/><Play size={18}/></div><h3>{s.topic.title}</h3><p>{s.topic.description}</p><div className="topic-status">Práctica con explicación<ArrowRight size={17}/></div></button>)}</div><ReviewQueue state={state} start={(m,t)=>void start(m,t)} disabled={locked}/></>}
 {view==='simulacion'&&<SimulatorIntro state={state} disabled={locked} start={assisted=>void start('simulacion',undefined,assisted)}/>}
 {view === 'session' && state.active && q && <><div className="session-top"><button className="text-button" disabled={busy} onClick={() => navigate('inicio')}><ChevronLeft size={18}/>Mi preparación</button><span className="session-timer"><Clock3 size={17}/>{remaining === null ? 'A tu ritmo' : fmtTime(remaining)}</span></div>{state.active.guidedTopic&&<section className="guided-orientation" aria-live="polite"><p className="eyebrow">RECORRIDO GUIADO · PASO {state.active.index===0?revealed?2:1:revealed?4:3} DE 4</p><h2>{state.active.index===0?revealed?'Comprende por qué':'Decide: intenta el primer caso':revealed?'Revisa cómo aplicaste el criterio':'Aplica el criterio a otro caso'}</h2><p>{state.active.index===0?revealed?'Lee el dato decisivo y compara las alternativas. Después aplicarás la distinción a otra situación.':guidedPlans[state.active.guidedTopic].goal:revealed?'Compara esta decisión con la anterior. Al continuar verás el siguiente paso recomendado.':'Responde sin pistas en este intento. La explicación aparecerá después de comprobar tu respuesta.'}</p>{state.active.index===1&&currentHistoryFor(state).some(s=>s.ids.includes(q.id))&&<p className="footnote">Ya trabajaste este caso antes: es un repaso, no evidencia de transferencia a un caso nunca visto.</p>}</section>}<div className="session-layout"><section className="question-panel"><div className="question-heading"><span className="pill">{state.active.guidedTopic?'Recorrido guiado':modeLabels[state.active.mode]}</span><span>{state.active.index + 1} de {state.active.ids.length}</span></div><Progress value={state.active.answers.length / state.active.ids.length * 100} aria-label="Respuestas guardadas"/><div className="question-labels"><span>{topicById(q.topic).title}</span><span>{q.format==='Caso'?'Cuestionamiento directo':q.format}</span><span>{q.id}</span></div><h1 className="question-title">{q.stem}</h1><p className="instruction">Selecciona la opción que responde al caso.</p><RadioGroup value={selected} onValueChange={setSelected} disabled={busy || revealed || remaining === 0} aria-label="Opciones de respuesta" className="answer-options">{q.options.map((o, i) => <label key={i} className={`answer-option ${selected === String(i) ? 'selected' : ''} ${revealed && i === q.correct ? 'is-correct' : ''} ${revealed && selected === String(i) && i !== q.correct ? 'is-wrong' : ''}`} htmlFor={`answer-${q.id}-${i}`}><span className="answer-letter">{'ABC'[i]}</span><span>{o}</span><RadioGroupItem id={`answer-${q.id}-${i}`} value={String(i)}/>{revealed && i === q.correct && <CheckCircle2 size={19}/>}</label>)}</RadioGroup>
 {!revealed && <div className="confidence"><label id="confidence-label">¿Qué tan segura es tu elección?</label><RadioGroup value={confidence} onValueChange={v => setConfidence(v as typeof confidence)} aria-labelledby="confidence-label" className="confidence-options" disabled={busy}>{(['baja', 'media', 'alta'] as const).map((c, i) => <label htmlFor={'conf-' + c} key={c}><RadioGroupItem id={'conf-' + c} value={c}/>{['Tengo dudas', 'Algo seguro/a', 'Muy seguro/a'][i]}</label>)}</RadioGroup><small>Esta percepción ayuda a revisar tu aprendizaje; no cambia tus aciertos.</small></div>}
 {(isPractice||state.active?.assisted)&&!(state.active.guidedTopic&&state.active.index===1)&&!revealed&&<QuestionTip q={q} used={hint||!!state.active?.hintIds?.includes(q.id)} disabled={locked} onUse={async()=>{if(!state.active)return false;const ok=await save({...state,active:{...state.active,hintIds:[...new Set([...(state.active.hintIds??[]),q.id])]}});if(ok)setHint(true);return ok;}}/>}
 {revealed && currentAnswer && <Explanation q={q} answer={currentAnswer}/>}
 <div className="question-actions">{!isPractice && !strictExam && <button className="secondary" disabled={busy || state.active.index === 0} onClick={() => void back()}><ChevronLeft size={17}/>Anterior</button>}<button className="primary" disabled={busy || (!revealed && selected === '') || remaining === 0 || !!error} onClick={() => void (revealed ? next() : submit())}>{busy ? <><LoaderCircle size={17} className="spin"/>Guardando…</> : revealed ? (state.active.index === state.active.ids.length - 1 ? state.active.guidedTopic?'Ver mi siguiente paso':'Ver resultados' : state.active.guidedTopic?'Aplicar a otro caso':'Siguiente caso') : isPractice ? 'Comprobar y comprender' : state.active.index === state.active.ids.length - 1 ? 'Terminar y revisar' : 'Guardar y continuar'}{!busy && <ArrowRight size={18}/>}</button></div><p className="save-note" aria-live="polite">{busy ? 'Guardando tu respuesta…' : currentAnswer ? 'Respuesta guardada en tu avance.' : 'Tu selección se guarda al continuar.'}</p></section><aside className="session-aside"><p className="eyebrow">{isPractice ? 'GUÍA DE RAZONAMIENTO' : 'TU SESIÓN'}</p>{isPractice ? state.active.guidedTopic&&state.active.index===1&&!revealed?<p>Esta vez decide por tu cuenta. Después compararemos el razonamiento de las opciones.</p>:method.map((m, i) => <div className="mini-step" key={m.title}><span>{i + 1}</span><div><strong>{m.title}</strong><p>{m.text}</p></div></div>) : <><h3>{state.active.answers.length} respuestas guardadas</h3><p>Lee el encargo completo y utiliza los datos del caso.</p><div className="question-map">{state.active.ids.map((id, i) => <button aria-label={`Ir a pregunta ${i + 1}`} className={`${state.active!.answers.some(a => a.questionId === id) ? 'answered' : ''} ${state.active!.index === i ? 'current' : ''}`} key={id} disabled={busy||strictExam} onClick={() => void save({ ...state, active: { ...state.active!, index: i } })}>{i + 1}</button>)}</div><p className="footnote">{strictExam?'Ensayo sin ayudas: confirma cada respuesta antes de avanzar. No se regresa a reactivos anteriores.':'Guarda tu respuesta antes de cambiar de pregunta.'}</p></>}<button className="aside-action" onClick={() => { setReportSaved(false); setReport(true); }}><Flag size={17}/>Reportar este reactivo</button><button className="aside-action" onClick={() => navigate('inicio')}><Pause size={17}/>{remaining === null ? 'Salir y continuar después' : 'Salir · el reloj continúa'}</button><button className="aside-action" onClick={() => setFinish(true)}>Terminar sesión ahora</button></aside></div></>}
 {view === 'session' && !state.active && <section className="empty-state"><img className="state-art" src={visualAssets.completa} alt="" width={160} height={160}/><h2>No tienes una sesión pendiente.</h2><button className="primary" onClick={() => navigate('inicio')}>Ir a mi preparación</button></section>}
 {view === 'resultado' && result && resultQ && <><div className="page-heading"><div><p className="eyebrow">{result.guidedTopic?'Recorrido guiado':modeLabels[result.mode]} · SESIÓN FINALIZADA</p><h1>Aprende de cada decisión.</h1><p>Revisa el fundamento y utiliza tus resultados para elegir el siguiente paso.</p></div></div>{!result.ids.every(isCurrentQuestion) && <p className="info-note">Resultado del recorrido anterior. Conserva su clave original y no se incorpora a los indicadores del recorrido actual.</p>}<section className="result-summary"><img className="result-art" src={visualAssets.resultados} alt="" width={120} height={120}/><div className="score-circle"><strong>{sessionScore(result)}<small>/{result.ids.length}</small></strong><span>aciertos</span></div><div><h2>{sessionScore(result) === result.ids.length ? 'Un buen punto para seguir avanzando.' : 'Ya tienes un punto de partida concreto.'}</h2><p>{result.mode === 'practica' || result.assisted ? 'Estos resultados incluyen práctica y posibles pistas.' : 'Esta sesión aporta evidencia de tu desempeño en estos casos.'} No equivalen a una calificación oficial ni predicen la asignación de una plaza.</p><div className="result-meta"><span>{result.answers.filter(a => a.selected === null).length} omisiones</span><span>{result.answers.filter(a => a.hint).length} respuestas con pista</span></div><button className="text-button" onClick={() => navigate('ruta')}>Ir a mi ruta de estudio <ArrowRight size={17}/></button></div></section>{result.guidedTopic&&<section className="guided-orientation"><h2>Lo que muestra este recorrido</h2><p>Primer caso: {result.answers[0]?.selected===null?'sin responder':result.answers[0]?.selected===questionById(result.ids[0]).correct?'respuesta acertada':'criterio por reforzar'}{result.answers[0]?.hint?' con pista':''}. Segundo caso: {result.answers[1]?.selected===null?'sin responder':result.answers[1]?.selected===questionById(result.ids[1]).correct?'aplicaste el criterio correctamente':'necesitas volver a contrastar el criterio'}.</p><p>El segundo caso se responde después de estudiar el primero. Es una comprobación cercana, no una prueba de dominio sostenido.</p></section>}<section className="panel next-learning"><p className="eyebrow">TU SIGUIENTE PASO</p><h2>{learningNeeds(result).length?'Trabaja el criterio que necesitas reforzar':'Consolida lo que acabas de practicar'}</h2>{learningNeeds(result).length?<ul className="learning-needs">{learningNeeds(result).slice(0,3).map(({answer,q:rq,lesson:rl})=><li key={rq.id}><strong>{rl.title}</strong><p>{answer.selected===null?'No respondiste este caso.':answer.hint?'Usaste apoyo en este caso.':`Elegiste ${'ABC'[answer.selected!]}. ${rq.explanations[answer.selected!]}`}</p><button className="text-button" disabled={locked} onClick={()=>showLesson(rl.id)}>Abrir lección y ejemplo <ArrowRight size={16}/></button></li>)}</ul>:<><p>Acertar estos casos no demuestra dominio del tema. Revisa el fundamento y prueba situaciones diferentes.</p><button className="text-button" onClick={()=>showLesson(lessonForQuestion(result.ids.at(-1)!).id)}>Ampliar el fundamento de este tema <ArrowRight size={16}/></button></>}{learningNeeds(result).length>3&&<p>Hay más puntos por repasar; usa la revisión de abajo para recorrer todas tus respuestas.</p>}<button className="primary" disabled={locked} onClick={()=>void startGuided()}>Continuar aprendiendo <ArrowRight size={18}/></button></section><div className="result-topic-grid">{topics.map(t=>{const list=result.answers.filter(a=>questionById(a.questionId).topic===t.id);return <div key={t.id}><strong>{t.code} · {t.title}</strong><span>{list.filter(a=>a.selected===questionById(a.questionId).correct).length}/{list.length}</span><small>{list.filter(a=>a.hint).length} con apoyo · {list.filter(a=>a.selected===null).length} omisiones</small></div>})}</div><div className="section-title"><h2>Revisión de la sesión</h2><div className="review-nav"><button className="icon-button" aria-label="Revisar pregunta anterior" disabled={review === 0} onClick={() => setReview(review - 1)}><ChevronLeft size={19}/></button><span>{review + 1} de {result.ids.length}</span><button className="icon-button" aria-label="Revisar siguiente pregunta" disabled={review === result.ids.length - 1} onClick={() => setReview(review + 1)}><ChevronRight size={19}/></button></div></div><section className="review-panel"><div className="question-labels"><span>{resultQ.id}</span><span>{resultQ.format==='Caso'?'Cuestionamiento directo':resultQ.format}</span><span>{topicById(resultQ.topic).title}</span></div><h2 className="review-stem">{resultQ.stem}</h2><div className="review-options">{resultQ.options.map((o, i) => <p key={i}><strong>{'ABC'[i]}.</strong> {o}</p>)}</div><p className="your-answer">Tu respuesta: <strong>{result.answers.find(a => a.questionId === resultQ.id)?.selected == null ? 'Sin responder' : 'ABC'[result.answers.find(a => a.questionId === resultQ.id)!.selected!]}</strong></p><Explanation q={resultQ} answer={result.answers.find(a => a.questionId === resultQ.id)!}/><button className="secondary" onClick={()=>showLesson(lessonForQuestion(resultQ.id).id)}>Estudiar este criterio: {lessonForQuestion(resultQ.id).title}</button><button className="text-button" onClick={() => { setReportSaved(false); setReport(true); }}><Flag size={17}/>Reportar una duda sobre este reactivo</button></section></>}
 {view === 'avance' && <><ReviewQueue state={state} start={(m,t)=>void start(m,t)} disabled={locked}/><div className="page-heading"><div><p className="eyebrow">EVIDENCIA DE TU APRENDIZAJE</p><h1>Observa cómo vas.</h1><p>Reconoce tus aciertos y elige qué conviene repasar.</p></div><img className="heading-art" src={visualAssets.avance} alt="" width={1536} height={1024}/></div><section className="evidence-summary"><div><strong>{completedLessons} / 18</strong><span>Lecciones con actividad completada</span></div><div><strong>{currentHist.flatMap(s=>s.answers).filter(a=>a.hint).length}</strong><span>Respuestas con pistas</span></div><div><strong>{currentHist.flatMap(s=>s.answers).filter(a=>!a.hint&&a.selected!==null).length}</strong><span>Respuestas sin pistas en ese intento</span></div></section><p className="footnote">Completar una actividad, practicar con apoyo y responder sin pistas son evidencias distintas. Los intentos pueden incluir casos ya vistos; estos datos no certifican dominio.</p><div className="advance-grid"><section className="panel"><h2>Aciertos independientes por tema</h2><p className="muted">Última respuesta de cada reactivo. Los aciertos que usaron pista no cuentan como independientes.</p>{stats.map(s => <div className="progress-row" key={s.topic.id}><div><strong>{s.topic.title}</strong><span>{s.attempted ? `${s.correct} / ${s.attempted}` : 'Sin datos'}</span></div><Progress value={s.percent ?? 0} aria-label={s.topic.title}/><small>{s.attempted < 3 ? 'Evidencia inicial: sigue explorando este tema.' : `${s.percent}% de aciertos sin apoyo en las respuestas más recientes.`}</small></div>)}</section><section className="panel"><p className="eyebrow">PRÓXIMO PASO</p><h2>{nextTopic.title}</h2><p>{nextTopic.description}</p><button className="primary" disabled={!loaded || busy} onClick={() => showLesson(nextTopic.id)}>Revisar el criterio <ArrowRight size={17}/></button><hr /><h3>Tu seguridad al responder</h3><p>{attempts.filter(a => a.confidence === 'alta' && a.selected !== questionById(a.questionId).correct).length} respuestas iniciales incorrectas con seguridad alta.</p><small>Conviene revisar su fundamento. Este dato no constituye un diagnóstico personal.</small></section></div>{state.archivedSessions.length>0&&<section className="panel"><h2>Sesiones anteriores conservadas</h2><p>Estas sesiones quedaron sin terminar y no se suman a tus resultados actuales.</p>{state.archivedSessions.map(s=><details key={s.id}><summary>{roleLabels[s.role]} · {s.answers.length} respuestas guardadas</summary>{s.answers.map(a=><div className="archive-answer" key={a.questionId}><strong>{a.questionId}</strong><p>{questionById(a.questionId).stem}</p><p>Tu elección: {a.selected===null?'Sin responder':questionById(a.questionId).options[a.selected]}</p></div>)}</details>)}</section>}<div className="section-title"><h2>Historial de sesiones</h2><span className="muted">{hist.length} sesiones</span></div>{hist.length ? <div className="history-list">{[...hist].reverse().map(s => <button className="history-row" key={s.id} onClick={() => { setResult(s); setReview(0); navigate('resultado'); }}><span className="round-icon">{s.mode === 'simulacion' ? <Clock3 size={20}/> : <BookOpen size={20}/>}</span><div><strong>{s.guidedTopic?'Recorrido guiado':modeLabels[s.mode]}{!s.ids.every(isCurrentQuestion) && " · Recorrido anterior"}</strong><small>{new Date(s.completedAt ?? s.startedAt).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })} · {roleLabels[s.role]}</small></div><span className="history-score">{sessionScore(s)}/{s.ids.length}<small>aciertos</small></span><ChevronRight size={18}/></button>)}</div> : <section className="empty-state"><img className="state-art" src={visualAssets.sinHistorial} alt="" width={160} height={160}/><h3>Tu avance aparecerá aquí.</h3><p>Completa una primera sesión para comenzar a reunir evidencia.</p>{beginButton('diagnostico', 'Comenzar diagnóstico')}</section>}</>}
 {view === 'fuentes' && <><div className="page-heading"><div><p className="eyebrow">ESTUDIA CON FUNDAMENTO</p><h1>De la fuente al criterio.</h1><p>Consulta el documento, identifica la regla y vuelve al caso para aplicarla.</p></div><img className="heading-art square" src={visualAssets.fuentes} alt="" width={1024} height={1024}/></div><section className="panel method-panel"><h2>Cinco pasos para analizar un caso</h2><div className="method-grid">{method.map((m,i)=><div key={m.title}><span>{i+1}</span><h3>{m.title}</h3><p>{m.text}</p></div>)}</div><button className="primary" onClick={()=>navigate('taller')}>Practicar cómo resolver preguntas <ArrowRight size={17}/></button><p className="footnote">Procedimiento de estudio. El fundamento de cada decisión se encuentra en el documento correspondiente.</p></section><div className="section-title"><h2>Biblioteca de consulta</h2></div><a className="bibliography-link" href="https://guias.usicamm.gob.mx/2026-2027/PVEB/direccion_secundaria" target="_blank" rel="noreferrer"><BookOpen size={28}/><div><h3>Bibliografía oficial de funciones directivas · Secundaria</h3><p>Abre la colección de estudio de USICAMM indicada en la guía 2026–2027.</p></div><ArrowUpRight size={21}/></a><div className="source-grid">{Object.entries(sources).filter(([id])=>id!=='supervision').map(([id,source])=><a href={source.url} target="_blank" rel="noreferrer" className="document-card" key={id}><span className="document-icon"><FileText size={24}/></span><div><h3>{source.title}</h3><p>{source.detail}</p><small>Abrir documento <ArrowUpRight size={14}/></small></div></a>)}</div><ResearchNotes/><section className="scope-panel"><h2>Cómo se construyó tu recorrido</h2><p>18 lecciones, 8 ejemplos interactivos, 36 reactivos de estudio y un formulario de 90 reactivos reservado para el simulador. Los casos se sitúan en funciones directivas de secundaria; el perfil habilitado es subdirección.</p><p>El compendio aportado orienta los temas y los contrastes. Los ejercicios del curso desarrollan o adaptan los planteamientos con alternativas y explicaciones propias. Las referencias del compendio aparecen en los ejemplos y en la revisión de los reactivos cuando corresponde.</p><p>La ruta trabaja distinciones normativas, curriculares y de gestión. Amplía tu preparación con la bibliografía oficial enlazada. Un resultado de práctica describe estos casos; no equivale a un puntaje oficial ni garantiza una plaza.</p><details><summary>¿Qué se revisó respecto del compendio?</summary><p>La matriz numerada hasta 90 contiene abreviaciones y repeticiones. No se presentó como una transcripción de 90 preguntas completas. Para los planos del Programa Analítico se fijó la edición SEP 2024 de Fase 6. Las actuaciones de protección se fundamentan en las leyes y en la necesidad de consultar el protocolo aplicable; no se atribuyen facultades de investigación o revisión corporal a partir de un resumen.</p></details></section></>}

 </>}
 <footer className="app-footer"><span>Material de práctica independiente de SEP y USICAMM.</span><button onClick={() => { setReportSaved(false); setReport(true); }} disabled={!loaded}><MessageSquare size={15}/>Dejar una observación</button></footer>
 </main></SidebarInset>
 <LessonReader id={lesson} state={state} disabled={locked} save={save} close={()=>setLesson(null)} practice={id=>void start('practica',id)} workshop={openWorkshop}/>
 <Dialog open={settings} onOpenChange={setSettings}><DialogContent><DialogHeader><DialogTitle>Tu preparación</DialogTitle><DialogDescription>Personaliza tu espacio y el tiempo que quieres dedicar a cada sesión.</DialogDescription></DialogHeader><label className="field-label" htmlFor="name">¿Cómo te llamamos?</label><input id="name" maxLength={60} value={profileName} onChange={e => setProfileName(e.target.value)} className="text-input" placeholder="Tu nombre"/><label className="field-label" id="minutes-label">Tiempo disponible por sesión</label><Select value={profileMinutes} onValueChange={setProfileMinutes}><SelectTrigger aria-labelledby="minutes-label"><SelectValue /></SelectTrigger><SelectContent>{[10, 15, 20, 30, 45, 60].map(m => <SelectItem value={String(m)} key={m}>{m} minutos</SelectItem>)}</SelectContent></Select><p className="footnote">Es una referencia para organizarte. Las sesiones de práctica no tienen límite; el simulador completo tiene un límite de cuatro horas.</p><button className="primary" disabled={busy || !loaded} onClick={async () => { if (await save({ ...state, name: profileName.trim(), minutes: Number(profileMinutes) }))
        setSettings(false); }}>Guardar ajustes</button><hr /><button className="secondary" onClick={()=>{setSettings(false);navigate('catalogo');}}>Ver perfiles de preparación</button><button className="danger-link" onClick={() => { setSettings(false); setReset(true); }}><RotateCcw size={16}/>Reiniciar mi avance</button></DialogContent></Dialog>
 <Dialog open={report} onOpenChange={setReport}><DialogContent><DialogHeader><DialogTitle>{reportSaved ? 'Observación guardada' : 'Guarda una duda u observación'}</DialogTitle><DialogDescription>{reportSaved ? 'La encontrarás en Mis notas, junto con la referencia del reactivo.' : `Describe qué ocurrió o qué explicación revisarías. Referencia: ${view === 'session' ? q?.id : view === 'resultado' ? resultQ?.id : labels[view]}.`}</DialogDescription></DialogHeader>{reportSaved ? <><CheckCircle2 size={36} className="success-icon"/><button className="secondary" onClick={() => { setReport(false); setNotes(true); }}>Ver mis observaciones</button></> : <><label className="field-label" htmlFor="feedback">Tu observación</label><textarea id="feedback" className="text-input" rows={5} maxLength={2000} value={reportText} onChange={e => setReportText(e.target.value)} placeholder="Por ejemplo: considero que la opción B también es defendible porque…"/><small>Evita incluir datos personales de estudiantes.</small><button className="primary" disabled={busy || !reportText.trim()} onClick={() => void saveReport()}>Guardar observación</button></>}</DialogContent></Dialog>
 <Dialog open={notes} onOpenChange={setNotes}><DialogContent className="notes-dialog"><DialogHeader><DialogTitle>Mis notas</DialogTitle><DialogDescription>Conserva tus dudas y observaciones para volver a ellas durante el estudio.</DialogDescription></DialogHeader>{state.feedback.length ? <><button className="secondary" onClick={() => void copyNotes()}><Copy size={17}/>{copied ? 'Copiadas' : 'Copiar observaciones'}</button><div className="notes-list">{[...state.feedback].reverse().map(f => <article key={f.id}><small>{f.questionId ?? f.view} · {new Date(f.createdAt).toLocaleDateString('es-MX')}</small><p>{f.text}</p></article>)}</div></> : <p>Aún no hay observaciones. Puedes registrar una desde cualquier pantalla o al revisar un reactivo.</p>}</DialogContent></Dialog>
 <AlertDialog open={reset} onOpenChange={setReset}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Reiniciar tu avance?</AlertDialogTitle><AlertDialogDescription>Se eliminarán el historial, la sesión pendiente, las lecturas y tus observaciones guardadas de tu cuenta. Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Conservar mis datos</AlertDialogCancel><AlertDialogAction onClick={async (e) => { e.preventDefault(); if (await save(initialState())) {
        setReset(false);
        setResult(null);
        navigate('inicio');
    } }} disabled={busy}>Reiniciar datos</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
 <AlertDialog open={finish} onOpenChange={setFinish}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Terminar esta sesión?</AlertDialogTitle><AlertDialogDescription>Las respuestas que no hayas guardado se registrarán como omisiones. Podrás revisar el fundamento de todos los reactivos al terminar.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Seguir resolviendo</AlertDialogCancel><AlertDialogAction disabled={busy} onClick={e => { e.preventDefault(); void end(); }}>Terminar y revisar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
 </SidebarProvider>;
}
