'use client';
import { useEffect, useRef, type CSSProperties } from 'react';
export default function WordReveal({text,start=0,className=''}:{text:string;start?:number;className?:string}) {
 const ref=useRef<HTMLSpanElement>(null);
 useEffect(()=>{const node=ref.current;if(!node)return;const media=window.matchMedia('(prefers-reduced-motion: reduce)');if(media.matches)return;node.dataset.ready='true';const observer=new IntersectionObserver(([entry])=>{if(entry.isIntersecting){node.dataset.visible='true';observer.disconnect();}},{threshold:.12});observer.observe(node);return()=>observer.disconnect();},[]);
 const words=text.split(/\s+/);
 return <span ref={ref} className={`word-reveal ${className}`}><span className="word-accessible">{text}</span>{words.map((word,index)=><span className="word-mask" key={`${word}-${index}`} aria-hidden="true"><span className="word-piece" style={{'--word-index':index+start} as CSSProperties}>{word}</span>{index<words.length-1?' ':null}</span>)}</span>;
}
