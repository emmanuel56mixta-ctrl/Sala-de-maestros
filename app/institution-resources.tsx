'use client';

import { useState } from 'react';
import { Pause, Play } from 'lucide-react';

const institutions = [
  { id:'sep', label:'SEP · México', name:'Secretaría de Educación Pública', image:'sep-federal.svg', url:'https://www.gob.mx/sep' },
  { id:'jalisco', label:'Jalisco', name:'Secretaría de Educación Jalisco', image:'jalisco-educacion.png', url:'https://apprende.jalisco.gob.mx/' },
  { id:'nuevo-leon', label:'Nuevo León', name:'Gobierno de Nuevo León · Educación', image:'nuevo-leon-gobierno.svg', url:'https://www.nl.gob.mx/es/educacion' },
  { id:'puebla', label:'Puebla', name:'Gobierno de Puebla · Secretaría de Educación', image:'puebla-gobierno.svg', url:'https://sep.puebla.gob.mx/' },
  { id:'edomex', label:'Estado de México', name:'Gobierno del Estado de México · Educación', image:'edomex-gobierno.png', url:'https://seduc.edomex.gob.mx/' },
];

export default function InstitutionResources() {
  const [paused, setPaused] = useState(false);
  const [reading, setReading] = useState(false);
  return <section className="institution-section" aria-labelledby="institutions-heading">
    <div className="institution-heading"><div><h2 id="institutions-heading">Portales oficiales de educación</h2><p>Enlaces de consulta. Sala de Maestros, de NEMC, es independiente de estas instituciones.</p></div><button className="voices-pause institution-pause" type="button" aria-pressed={paused} aria-label={paused?'Reanudar desplazamiento de portales':'Pausar desplazamiento de portales'} onClick={()=>{setPaused(!paused);setReading(false);}}>{paused?<Play size={16} aria-hidden="true"/>:<Pause size={16} aria-hidden="true"/>}<span>{paused?'Reanudar':'Pausar'}</span></button></div>
    <div className="institution-window" data-paused={paused} data-reading={reading} tabIndex={0} role="region" aria-label="Portales oficiales; puedes detener el movimiento y recorrer los enlaces" onTouchStart={()=>{setPaused(true);setReading(true);}} onFocusCapture={event=>{const target=event.target as HTMLElement;if(target.matches(':focus-visible')){setReading(true);requestAnimationFrame(()=>target.scrollIntoView({block:'nearest',inline:'nearest'}));}}} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget as Node|null))setReading(false);}}>
      <div className="institution-track">{[false,true].map(duplicate=><ul className="institution-logos" key={String(duplicate)} aria-hidden={duplicate||undefined}>{institutions.map(item=><li key={item.id} className={`logo-${item.id}`}><a href={item.url} target="_blank" rel="noreferrer" tabIndex={duplicate?-1:undefined} aria-label={`Abrir ${item.name}`}><img src={`/assets/institutions/${item.image}`} alt={item.name} loading="lazy" width={210} height={80}/><span>{item.label}</span></a></li>)}</ul>)}</div>
    </div>
  </section>;
}
