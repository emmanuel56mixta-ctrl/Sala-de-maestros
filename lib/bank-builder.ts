import type {Question, SourceId, TopicId} from './content';
import {COURSE_ID} from './catalog';
export type Seed = [string,string,string,string,string,string,string,string,SourceId,string,number[]?,Question['format']?];
// Authored alternatives are stored with the grounded answer first, then assigned
// to a stable, shuffled position. Positions are balanced across the complete exam.
const positions = Array.from({length:90},(_,i)=>i%3);
let rng=20260916;
for(let i=positions.length-1;i>0;i--){rng=(Math.imul(rng,1664525)+1013904223)>>>0;const j=rng%(i+1);[positions[i],positions[j]]=[positions[j],positions[i]];}
export function buildBank(seeds:Seed[],topic:TopicId,offset:number,reserve=true):Question[]{
 return seeds.map((s,i)=>{const n=offset+i;const correct=positions[n%90];const options=[s[2],s[3]];options.splice(correct,0,s[1]);const explanations=[s[5],s[6]];explanations.splice(correct,0,s[4]);return {
 id:`SD26-${reserve?'E':'P'}${String(n+1).padStart(3,'0')}`,profileId:COURSE_ID,track:'direccion',topic,reserve,
 format:s[11]??'Caso',stem:s[0],options:options as Question['options'],correct,
 explanations:explanations as Question['explanations'],reason:s[4],clue:s[7],source:s[8],reference:s[9],sample:s[10]??[],
 skill:'Distinguir el encargo, el dato decisivo y el alcance de cada alternativa.',
 distinction:`${s[5]} ${s[6]}`
 };});
}
