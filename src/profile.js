// Player profile: progress, coins, purchases and settings, saved in this browser (localStorage).
import {CITIES,T} from './data.js';
import {$$,weekId} from './util.js';
const KEY='akhbaar-rush';
export function freshProfile(){const p={v:1,name:'',cap:0,home:0,coins:0,owned:['red'],bike:'red',capsOwned:[0],progress:{},settings:{music:true,sfx:true,vib:true,controls:'swipe',lang:'en'},streak:{last:'',count:0},tutorial:false,best:0,total:0,week:{id:weekId(),papers:0},city:0,updatedAt:0};CITIES.forEach(c=>p.progress[c.id]=Array(10).fill(0));return p;}
/** The one live profile object. Mutate it, then call save(). Never reassign it. */
export const P=freshProfile();
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.v===1){Object.assign(P,s);P.settings=Object.assign(freshProfile().settings,s.settings||{});for(const c of CITIES)if(!Array.isArray(P.progress[c.id]))P.progress[c.id]=Array(10).fill(0);}}catch(e){}
export function save(){P.updatedAt=Date.now();try{localStorage.setItem(KEY,JSON.stringify(P));}catch(e){}}
export function totalStars(){let s=0;for(const c of CITIES)for(const v of P.progress[c.id]||[])s+=v;return s;}
export function levelsDone(){let s=0;for(const c of CITIES)for(const v of P.progress[c.id]||[])if(v>0)s++;return s;}
export function t(k,fallback){return (T[P.settings.lang]||{})[k]||fallback;}
export function applyLang(){$$('[data-t]').forEach(e=>{if(!e.dataset.en)e.dataset.en=e.textContent;e.textContent=t(e.dataset.t,e.dataset.en);});}
