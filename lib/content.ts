import {subdirectionQuestions} from './subdirection-questions';
import {revisedQuestions} from './revised-questions';
import {legacyQuestions} from './legacy-questions';
export type TopicId='derechos'|'nem'|'mejora'|'acompanamiento'|'familias'|'alianzas';
export type Track='direccion'|'supervision';
export type Role=Track|'subdireccion';
export const roleLabels:Record<Role,string>={direccion:'Dirección',subdireccion:'Subdirección',supervision:'Supervisión'};
export const trackFor=(role:Role):Track=>role==='supervision'?'supervision':'direccion';
export const sources={
 fase6:{title:'Programa Sintético · Fase 6 (SEP, 2024)',url:'https://educacionbasica.sep.gob.mx/wp-content/uploads/2024/06/Programa_Sintetico_Fase_6.pdf',detail:'Programa Analítico, planos de elaboración y evaluación formativa. Páginas 121–127.'},
 nna:{title:'Ley General de los Derechos de Niñas, Niños y Adolescentes',url:'https://www.diputados.gob.mx/LeyesBiblio/pdf/LGDNNA.pdf',detail:'Aviso a autoridades competentes y restitución de derechos: artículos 12, 122 y 123.'},
 marco:{title:'Marco para la excelencia · 2026–2027',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/EB/Marco_EB.pdf',detail:'Perfiles, criterios e indicadores de dirección y supervisión.'},
 lge:{title:'Ley General de Educación',url:'https://www.diputados.gob.mx/LeyesBiblio/pdf/LGE.pdf',detail:'Gratuidad, inclusión y atribuciones de CTE, comités y participación escolar: arts. 7, 61–64, 106, 108–109 y 128–132. Coteja la edición de tu convocatoria.'},
 constitucion:{title:'Constitución Política · artículo 3.º',url:'https://www.diputados.gob.mx/LeyesBiblio/pdf/CPEUM.pdf',detail:'Derecho a la educación y principios que orientan el servicio educativo.'},
 direccion:{title:'Guía oficial · Funciones directivas en secundaria',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/EB/GUIAS/Guia_Educacion_Secundaria_EB.pdf',detail:'Áreas, bibliografía y formatos del instrumento 2026–2027.'},
 supervision:{title:'Guía oficial · Supervisión',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/EB/GUIAS/Guia_Supervision_EB.pdf',detail:'Áreas, bibliografía y formatos del instrumento 2026–2027.'},
 acuerdo:{title:'Acuerdo de promoción vertical · 2026–2027',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/EB/Acuerdo_PromocionVertical_EB.pdf',detail:'Requisitos, elementos multifactoriales y asignación de plazas. Consulta también las adendas.'},
 adenda:{title:'Adenda del acuerdo · 2026–2027',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/EB/Adenda_Acuerdo_PV_EB_2026-2027_2.pdf',detail:'Modificaciones al acuerdo del ciclo de referencia.'},
 manual:{title:'Manual de aplicación · 2026',url:'https://usicamm.sep.gob.mx/usicamm_dsk08/2026-2027/compilacion/Manual-USICAMM-2026.pdf',detail:'Aplicación, simulador técnico y atención de incidencias.'}
};
export type SourceId=keyof typeof sources;
export const topics:{id:TopicId;area:string;code:string;title:string;description:string;minutes:number;lesson:{lead:string;steps:string[];example:string;trap:string;source:SourceId;reference:string}}[]=[
  {
    "id": "derechos",
    "area": "Aspectos normativos",
    "code": "1.1",
    "title": "Derechos, inclusión y protección",
    "description": "Distingue ajustes de acceso, gratuidad, aviso y restitución de derechos.",
    "minutes": 6,
    "lesson": {
      "lead": "Una decisión normativa exige identificar el derecho afectado, la obligación concreta y la autoridad competente. Una intención favorable no basta para resolver un caso.",
      "steps": [
        "En inclusión, distingue la barrera del aprendizaje: cambiar el medio de respuesta puede conservar la demanda cognitiva. LGE, arts. 61 y 62, fracción V.",
        "En gratuidad, revisa si una aportación produce una ventaja educativa a cambio. LGE, art. 7, fracción IV. La voluntariedad del pago no autoriza una contraprestación.",
        "Ante una vulneración de derechos, distingue el aviso inmediato a las autoridades competentes (LGDNNA, art. 12) del procedimiento de restitución de la Procuraduría (art. 123). La actuación concreta se sujeta también al protocolo aplicable."
      ],
      "example": "Si una alumna puede explicar un procedimiento, pero el instrumento exige una acción motriz que no puede realizar, pregunta qué se pretende evaluar antes de modificar el aprendizaje esperado.",
      "trap": "Elegir una acción protectora sin comprobar si corresponde al actor, al momento o al derecho del caso.",
      "source": "lge",
      "reference": "Arts. 7, fracción IV, 61 y 62. Consulta también la LGDNNA, arts. 12 y 123, en Documentos."
    }
  },
  {
    "id": "nem",
    "area": "Aspectos normativos",
    "code": "1.2",
    "title": "Programa Analítico y evaluación",
    "description": "Diferencia planos, documentos y usos de la evidencia en Fase 6.",
    "minutes": 7,
    "lesson": {
      "lead": "Fija la edición documental antes de memorizar nombres. La edición SEP 2024 del Programa Sintético de Fase 6 distingue lectura de la realidad, contextualización y formulación del Programa Analítico.",
      "steps": [
        "La lectura de la realidad aporta el análisis de condiciones; la contextualización permite tomar decisiones sobre contenidos.",
        "La formulación organiza los contenidos delimitados. El Programa Analítico orienta la planeación didáctica, sin convertirse en el detalle de todas las sesiones.",
        "Para reconocer un uso formativo de la evaluación, pregunta qué decisiones u oportunidades de revisión produce la evidencia durante el aprendizaje."
      ],
      "example": "Elegir un problema local para estudiar un contenido existente no demuestra que se haya agregado un contenido curricular nuevo.",
      "trap": "Mezclar la nomenclatura de distintas ediciones o confundir disponer de instrumentos con utilizar la evidencia para mejorar.",
      "source": "fase6",
      "reference": "Edición 2024, pp. 121–127."
    }
  },
  {
    "id": "mejora",
    "area": "Gestión escolar",
    "code": "2.1",
    "title": "Planeación y seguimiento de la mejora",
    "description": "Relaciona instrumentos, etapas, metas e indicadores pertinentes.",
    "minutes": 6,
    "lesson": {
      "lead": "Antes de elegir una acción, identifica qué acuerdos ya existen. El diagnóstico, la meta, la estrategia y su seguimiento cumplen funciones diferentes.",
      "steps": [
        "Distingue el programa de mejora continua, que aborda condiciones y metas institucionales, del Programa Analítico, que concreta el currículo.",
        "Ubica la etapa descrita. Si el problema y la prioridad están establecidos, determina qué acuerdo permite desarrollar la intervención.",
        "Separa indicadores de actividad y de resultado. Para una meta de argumentación, contar entregas no equivale a valorar la calidad de los argumentos."
      ],
      "example": "Una zona puede mejorar su promedio de asistencia mientras un grupo conserva dificultades. Revisa la distribución del resultado antes de cerrar el apoyo.",
      "trap": "Volver a diagnosticar por costumbre o dar por cumplida una meta de aprendizaje porque se realizaron las actividades.",
      "source": "lge",
      "reference": "Arts. 108 y 109. Aplicaciones profesionales: Marco para la excelencia, dirección 3.3 y supervisión 3.1–3.2."
    }
  },
  {
    "id": "acompanamiento",
    "area": "Gestión escolar",
    "code": "2.2",
    "title": "Asesoría y juicio profesional",
    "description": "Distingue evidencia, interpretación y apoyos para capacidades específicas.",
    "minutes": 6,
    "lesson": {
      "lead": "El acompañamiento requiere precisar qué capacidad se busca fortalecer y qué evidencia permitiría observar su desarrollo.",
      "steps": [
        "Separa el registro de lo ocurrido de una interpretación sobre sus causas. Una única observación no autoriza cualquier conclusión.",
        "Elige el apoyo según la necesidad: comprender conceptos, aplicar criterios o conducir acuerdos requieren actividades distintas.",
        "Comprueba quién ejerce la capacidad durante el apoyo y cómo se revisará su aplicación. En supervisión, el SAAE articula mejora de prácticas e inducción de docentes de nuevo ingreso."
      ],
      "example": "Si el foco es que los estudiantes expliquen procedimientos, contar manos levantadas aporta información de participación; hay que revisar también qué expresan sus respuestas.",
      "trap": "Confundir entregar formatos o producir un acta con desarrollar una capacidad profesional.",
      "source": "marco",
      "reference": "Dirección: 3.4, p. 47. Supervisión: 3.2.5 y 3.3, p. 55."
    }
  },
  {
    "id": "familias",
    "area": "Escuela y comunidad",
    "code": "3.1",
    "title": "Participación y corresponsabilidad",
    "description": "Diferencia información, diálogo y atribuciones de participación escolar.",
    "minutes": 6,
    "lesson": {
      "lead": "La participación tiene distintos propósitos y límites. Identifica si el caso pide informar, construir acuerdos, integrar saberes o decidir sobre una atribución.",
      "steps": [
        "Para responder a una solicitud sobre evaluación, distingue criterios y resultados de una simple lista de actividades. LGE, art. 128, fracción VII.",
        "El consejo de participación puede coadyuvar en integridad, derechos y protección civil. No sustituye automáticamente decisiones técnico-pedagógicas o laborales. LGE, art. 132.",
        "Cuando interviene la comunidad en un proyecto, verifica qué aprendizaje permite la actividad. Asistencia, difusión e indagación no son indicadores intercambiables."
      ],
      "example": "Si las familias reciben los informes, pero solicitan conversar y no pueden acudir por la mañana, enviar más informes no resuelve la necesidad documentada.",
      "trap": "Considerar que cualquier propuesta participativa cumple el encargo, sin revisar su propósito o atribución.",
      "source": "lge",
      "reference": "Arts. 128 y 132; contraste con art. 108. Marco: dirección 4.1–4.2 y supervisión dominio IV."
    }
  },
  {
    "id": "alianzas",
    "area": "Escuela y comunidad",
    "code": "3.2",
    "title": "Órganos escolares y colaboración",
    "description": "Distingue CTE, comités y coordinación de apoyos externos.",
    "minutes": 7,
    "lesson": {
      "lead": "Para resolver casos de gestión, relaciona una atribución con su instancia. Compartir el propósito de mejora no hace equivalentes a todos los órganos.",
      "steps": [
        "CTE: decisión técnico-pedagógica del plantel. Comité de Planeación y Evaluación: formulación del programa de mejora y evaluación de objetivos y metas. LGE, arts. 108–109.",
        "CEAP o equivalente: dignificación y recursos para mejoras, mantenimiento o equipamiento conforme a los lineamientos. Los aportes de infraestructura del comité de planeación se ponen a su consideración. LGE, arts. 106 y 109.",
        "En una colaboración externa, precisa qué necesidad se atenderá, acuerda condiciones y responsabilidades y revisa el resultado según su propósito. La oferta disponible no determina por sí sola la pertinencia."
      ],
      "example": "El consejo de participación escolar puede coadyuvar en la dignificación a través del CEAP. Eso no lo convierte en el Comité de Planeación y Evaluación.",
      "trap": "Resolver por una palabra familiar —consejo, comité, participación— sin verificar la función completa.",
      "source": "lge",
      "reference": "Arts. 106, 108–109 y 132, inciso g. Marco: dirección 4.3 y supervisión 4.1."
    }
  }
];
export type Question={id:string;profileId?:string;track:Track|'comun';topic:TopicId;format:'Caso'|'Completamiento'|'Ordenamiento'|'Relación';reserve:boolean;stem:string;options:[string,string,string];correct:number;explanations:[string,string,string];clue:string;reason:string;source:SourceId;reference:string;skill?:string;sample?:number[];distinction?:string};
export const questions:Question[]=subdirectionQuestions;
export const allQuestions:Question[]=[...questions,...revisedQuestions,...legacyQuestions];
export const isCurrentQuestion=(id:string)=>questions.some(q=>q.id===id);
export const questionById=(id:string)=>allQuestions.find(q=>q.id===id)!;
export const topicById=(id:TopicId)=>topics.find(t=>t.id===id)!;
export const method=[
{title:'Ubica el encargo',text:'Identifica quién decide y qué pide exactamente la pregunta: una acción inicial, un criterio, una secuencia o una relación.'},
{title:'Separa datos de suposiciones',text:'Recupera los hechos del caso. No inventes causas, recursos ni intenciones que el enunciado no proporciona.'},
{title:'Activa el criterio',text:'Relaciona el caso con el documento y el ámbito de responsabilidad. Formula qué debería conseguir la decisión.'},
{title:'Contrasta las alternativas',text:'Revisa qué resuelve cada opción, en qué momento y con qué consecuencias. La extensión y las palabras atractivas no determinan la respuesta.'},
{title:'Comprueba tu decisión',text:'Verifica que responda al encargo y puedas justificarla con los datos. Si dos opciones siguen siendo defendibles, reporta la ambigüedad para revisar el reactivo.'}
];
