const institutions = [
  { id:'sep', label:'SEP · México', name:'Secretaría de Educación Pública', url:'https://www.gob.mx/sep' },
  { id:'jalisco', label:'Jalisco', name:'Secretaría de Educación Jalisco', url:'https://apprende.jalisco.gob.mx/' },
  { id:'nuevo-leon', label:'Nuevo León', name:'Gobierno de Nuevo León · Educación', url:'https://www.nl.gob.mx/es/educacion' },
  { id:'puebla', label:'Puebla', name:'Gobierno de Puebla · Secretaría de Educación', url:'https://sep.puebla.gob.mx/' },
  { id:'edomex', label:'Estado de México', name:'Gobierno del Estado de México · Educación', url:'https://seduc.edomex.gob.mx/' },
];

/* Plain text links: government logos read as endorsement, and a moving band is hard to follow. */
export default function InstitutionResources() {
  return <section className="institution-section institution-section-links" aria-labelledby="institutions-heading">
    <div className="institution-heading"><div><h2 id="institutions-heading">Portales oficiales de consulta</h2><p>Sala de Maestros es independiente de estas instituciones; los enlaces son solo de referencia.</p></div></div>
    <ul className="institution-link-list">{institutions.map(item => <li key={item.id}><a href={item.url} target="_blank" rel="noreferrer"><strong>{item.label}</strong><span>{item.name}</span><span className="sr-only"> (abre en otra pestaña)</span></a></li>)}</ul>
  </section>;
}
