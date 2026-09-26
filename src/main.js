// Akhbaar Rush – main game module: canvas engine, input, HUD and every screen.
// Internal resolution is 380x176 game pixels (see data.js); the UI is an 844x390 stage scaled to fit.
import {VW,VH,SY,LANE_Y,BOY_X,HOUSES,CITIES,BIKES,CAPS,DAILY,NAMES} from './data.js';
import {$,$$,clamp,fmt,rng,weekId,today,el} from './util.js';
import {P,save,totalStars,levelsDone,t,applyLang} from './profile.js';
import {audio,sfx,buzz,setMusicTrack,duck,resumeAudio,unlockAudio,musicPlaying} from './audio.js';
import * as LB from './leaderboard.js';
import {setupPWA,shareGame,toast,iosInstallTip} from './pwa.js';
/* ---------- music routing ---------- */
function musicFor(){return(G.mode==='play'||G.mode==='count'||G.mode==='paused'||G.mode==='crash')?(G.lv===5||G.lv===10?'event':'ride'):'menu';}
function setMusic(on){setMusicTrack(on,musicFor());}
/* ---------- assets ---------- */
const IMG={};const LIST=['boy_ride','boy_lane_up','boy_lane_down','boy_jump','boy_throw','fx_dust_puff','fx_shadow','cow_idle_left','cow_graze_left','dog_run_left','dog_bark_left','car_red_right','car_blue_right','car_white_right','car_silver_right','car_black_right','car_orange_right','auto_rickshaw_left','newspaper_spin','bubble_woof','bubble_honk','bubble_moo','pothole','icon_coin','icon_paper'].concat(CITIES.map(c=>'city_'+c.id));
function loadAll(onProg){let n=0;return Promise.all(LIST.map(k=>new Promise(res=>{const i=new Image();i.onload=i.onerror=()=>{n++;onProg(n/LIST.length);res();};i.src='assets/'+k+'.png';IMG[k]=i;})));}
let BOY={};
function tint(){const bike=BIKES.find(b=>b.id===P.bike)||BIKES[0];const cap=CAPS[P.cap][1];const cr=[1,3,5].map(i=>parseInt(cap.substr(i,2),16));const sh=(c,f)=>c.map(v=>clamp(Math.round(v*f),0,255));
 const map=[[[216,50,42],bike.col],[[45,111,209],cr],[[95,154,245],sh(cr,1.3)],[[29,74,153],sh(cr,.7)],[[26,43,85],sh(cr,.45)]];
 for(const k of['boy_ride','boy_lane_up','boy_lane_down','boy_jump','boy_throw']){const im=IMG[k];if(!im.naturalWidth)continue;const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,c.width,c.height),a=d.data;
  for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;for(const[f,to]of map){if(a[i]===f[0]&&a[i+1]===f[1]&&a[i+2]===f[2]){a[i]=to[0];a[i+1]=to[1];a[i+2]=to[2];break;}}}
  x.putImageData(d,0,0);BOY[k]=c;}}
/* ---------- stage scaling ---------- */
const stage=$('#stage');
function fit(){const a=$('#app'),vv=window.visualViewport;if(vv&&!document.fullscreenElement){a.style.top=Math.round(vv.offsetTop)+'px';a.style.height=Math.round(vv.height)+'px';a.style.bottom='auto';}else{a.style.top=a.style.height=a.style.bottom='';}const cs=getComputedStyle(a);const w=a.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),h=a.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom);stage.style.transform='scale('+Math.min(w/844,h/390)+')';}
addEventListener('resize',fit);if(window.visualViewport){visualViewport.addEventListener('resize',fit);visualViewport.addEventListener('scroll',fit);}document.addEventListener('fullscreenchange',()=>setTimeout(fit,50));fit();
/* ---------- screens ---------- */
let cur='';const SCREENS=['splash','loading','title','name','howto','daily','menu','missions','garage','ranks','settings','hud','countdown','pause','end'];
let backTo='menu';
function show(id,keepHud){cur=id;for(const s of SCREENS){const e=$('#'+s);e.hidden=!(s===id||(keepHud&&s==='hud'));}
 const r={title:rTitle,name:rName,howto:rHow,daily:rDaily,menu:rMenu,missions:rMissions,garage:rGarage,ranks:rRanks,settings:rSettings}[id];if(r)r();applyLang();}
function refreshAll(){tint();if(cur)show(cur,cur==='pause'||cur==='countdown'||cur==='end');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;sfx('click');const g=b.dataset.go;if(g==='settings'){backTo=cur==='pause'?'pause':cur;}if(g==='howto'){howNext=cur==='settings'?backTo:'menu';}show(g,g==='settings'&&backTo==='pause');});
/* ---------- canvas & world ---------- */
const cv=$('#cv'),ctx=cv.getContext('2d');ctx.imageSmoothingEnabled=false;
const G={mode:'attract',d:0,v:70,lv:null,city:0,objs:[],subs:[],flights:[],puffs:[],clock:0,score:0,coins:0,delivered:0,papers:0,hearts:3,hits:0,streak:0,inv:0,slow:1,shake:0,
 lane:1,from:1,laneT:1,laneDir:0,queue:null,jt:-1,throwT:-1,rideT:0,ended:false,contUsed:false,missed:0,crashT:0,honked:new Set()};
const LANE_MS=[50,60,70,70,70,80],LANE_P=[.05,.22,.52,.82,.98,1],JUMP_MS=[70,50,70,100,70,60,70,80],JUMP_Y=[0,4,14,22,18,9,0,0];
function stat(i){const b=BIKES.find(x=>x.id===P.bike)||BIKES[0];return b.st[i];}
function laneDur(){return 400*(1.18-.06*stat(1));}
function jumpDur(){return 570*(1+.04*(stat(2)-3));}
function jumpScale(){return 1+.1*(stat(2)-3);}
function seqFrame(ms,t){let a=0;for(let i=0;i<ms.length;i++){if(t<a+ms[i])return[i,(t-a)/ms[i]];a+=ms[i];}return[ms.length-1,1];}
function laneProg(){if(G.laneT>=1)return 1;const tot=LANE_MS.reduce((a,b)=>a+b),[i,f]=seqFrame(LANE_MS,G.laneT*tot);const p0=i?LANE_P[i-1]:0;return p0+(LANE_P[i]-p0)*f;}
function boyGround(){const p=laneProg();return LANE_Y[G.from]+(LANE_Y[G.lane]-LANE_Y[G.from])*p;}
function jumpY(){if(G.jt<0)return 0;const tot=JUMP_MS.reduce((a,b)=>a+b),[i,f]=seqFrame(JUMP_MS,G.jt/jumpDur()*tot);const y0=JUMP_Y[i],y1=JUMP_Y[Math.min(7,i+1)];return(y0+(y1-y0)*f)*jumpScale();}
function effLane(){return G.laneT<.5?G.from:G.lane;}
function genLevel(ci,lv){const R=rng(ci*1009+lv*131+17),c=CITIES[ci],ev=lv===5?c.ev:lv===10?'finale':null;
 const L=2300+lv*240,base=78+lv*5+ci*4;const subs=[];const hs=HOUSES[c.id];
 for(let tI=0;tI*960<L+200;tI++)for(const hx of hs){const wx=tI*960+hx;if(wx>380&&wx<L+30&&R()<(lv===1?.55:.68))subs.push({wx,done:false,thrown:false,missed:false});}
 const target=clamp(Math.round(subs.length*(.52+lv*.03)),3,Math.max(3,subs.length-1));
 const W={pothole:1,cow:lv===1?.35:.6,car:lv>=2?.8:0,auto:lv>=3?.85:0,dog:lv>=4?.6:0};
 if(ev==='rush')W.auto*=2.4;if(ev==='dogs')W.dog=2;if(ev==='monsoon')W.pothole*=2.6;
 const objs=[];let x=520;const lastTall=[-999,-999];
 const pick=()=>{let s=0;for(const k in W)s+=W[k];let r=R()*s;for(const k in W){r-=W[k];if(r<=0)return k;}return 'pothole';};
 while(x<L-140){const r=R();
  if(r<.15){const ln=R()<.5?0:1,h=R()<.3?16:0;for(let k=0;k<5;k++)objs.push({type:'coin',wx:x+k*14,lane:ln,h,w:10});x+=90;continue;}
  const type=pick();let ln=type==='car'||type==='dog'?0:type==='auto'?1:(R()<.5?0:1);
  const tall=type==='car'||type==='cow'||type==='auto';
  if(tall){if(x-lastTall[1-ln]<120)x=lastTall[1-ln]+120;if(x>L-140)break;lastTall[ln]=x;}
  const o={type,wx:x,lane:ln,tall,w:{pothole:16,cow:24,car:36,auto:30,dog:14}[type],va:type==='auto'?55+R()*40+lv*3:type==='dog'?22:0,var:Math.floor(R()*6),t0:R()*2};
  objs.push(o);let gap=(175-lv*6)*(.75+R()*.55);if(ev==='finale')gap*=.85;x+=Math.max(66,gap);}
 const nb=Math.max(1,Math.ceil((subs.length-target)/7)+(lv>=3?1:0));
 for(let k=1;k<=nb;k++){const bx=Math.round(L*k/(nb+1)),ln=R()<.5?0:1;for(let i=objs.length-1;i>=0;i--){const o=objs[i];if(o.lane===ln&&Math.abs(o.wx-bx)<46)objs.splice(i,1);}objs.push({type:'bundle',wx:bx,lane:ln,h:0,w:14});}
 objs.sort((a,b)=>a.wx-b.wx);
 const bonus=2*(stat(3)-3);const papers=Math.max(target+2,target+3+bonus-(lv>5?1:0));
 let goal='Deliver '+target+' papers';if(ev)goal=(ev==='finale'?c.fin:c.evText)+' · '+goal;else if(lv===4||lv===9)goal+=' · No crashes for 3 stars';
 return{ci,lv,L,base,subs,target,objs,ev,papers,goal};}
function startLevel(ci,lv){const L=genLevel(ci,lv);Object.assign(G,{mode:'count',lvData:L,city:ci,lv,d:0,v:L.base,objs:L.objs.map(o=>Object.assign({},o)),subs:L.subs.map(s=>Object.assign({},s)),flights:[],puffs:[],score:0,coins:0,delivered:0,papers:L.papers,hearts:3,hits:0,streak:0,inv:0,slow:1,shake:0,lane:1,from:1,laneT:1,queue:null,jt:-1,throwT:-1,ended:false,contUsed:false,missed:0,crashT:0,honked:new Set()});
 P.city=ci;save();tint();hudInit();runCountdown();}
function attract(){Object.assign(G,{mode:'attract',d:0,objs:Array.from({length:90},(_,i)=>i%3===2?{type:'cow',wx:420+i*260,lane:0,w:24,var:i%2,t0:i*.7}:{type:'auto',wx:420+i*260,lane:0,w:30,va:60,var:0,t0:0}),subs:[],flights:[],lane:1,from:1,laneT:1,jt:-1,throwT:-1,v:62,inv:0,hearts:3});G.city=P.city||0;}
/* input */
function laneTo(dir){if(G.mode!=='play')return;const target=clamp((G.laneT<1?G.lane:G.lane)+dir,0,1);if(G.laneT<1){G.queue=dir;return;}if(target===G.lane)return;G.from=G.lane;G.lane=target;G.laneT=0;G.laneDir=dir;}
function jump(){if(G.mode!=='play'||G.jt>=0)return;G.jt=0;sfx('jump');G.puffs.push({x:BOY_X-8,y:boyGround()-9,t:0});}
let ptr=null;
const gl=$('#hud');
gl.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;ptr={x:e.clientX,y:e.clientY,t:performance.now(),used:false};});
gl.addEventListener('pointermove',e=>{if(!ptr||ptr.used||P.settings.controls!=='swipe')return;const k=stage.getBoundingClientRect().height/390;const dy=(e.clientY-ptr.y)/k;if(Math.abs(dy)>26){laneTo(dy<0?-1:1);ptr.used=true;}});
gl.addEventListener('pointerup',e=>{if(!ptr)return;const p=ptr;ptr=null;if(p.used)return;const k=stage.getBoundingClientRect().height/390;const dy=(e.clientY-p.y)/k,dx=(e.clientX-p.x)/k;
 if(P.settings.controls==='swipe'&&Math.abs(dy)>22&&Math.abs(dy)>Math.abs(dx))laneTo(dy<0?-1:1);else if(Math.abs(dy)<22)jump();});
$('#bUp').addEventListener('pointerdown',e=>{e.preventDefault();laneTo(-1);});$('#bDown').addEventListener('pointerdown',e=>{e.preventDefault();laneTo(1);});$('#bJump').addEventListener('pointerdown',e=>{e.preventDefault();jump();});
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;const k=e.key;
 if(G.mode==='play'){if(k==='ArrowUp'||k==='w'||k==='W'){laneTo(-1);e.preventDefault();}else if(k==='ArrowDown'||k==='s'||k==='S'){laneTo(1);e.preventDefault();}else if(k===' '||k==='ArrowRight'){jump();e.preventDefault();}else if(k==='Escape'||k==='p'||k==='P')pauseGame();}
 else if(G.mode==='paused'&&(k==='Escape'||k==='p'||k==='P'))resume();
 else if(cur==='title'&&(k===' '||k==='Enter'))titleTap();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&G.mode==='play')pauseGame();});
/* ---------- update ---------- */
function screenX(o){if(!o.va)return o.wx-G.d;const v=Math.max(30,G.v);return BOY_X+(o.wx-(G.d+BOY_X))*(1+o.va/v);}
function popup(text,x,y,bg,fg){const e=el('div',{class:'pop',text,style:`left:${x*844/VW}px;top:${y*390/VH}px;background:${bg};color:${fg||'#fff'}`});$('#fx').append(e);setTimeout(()=>e.remove(),1200);}
function hit(o){G.hearts--;G.hits++;G.inv=1.6;G.streak=0;G.slow=.55;G.shake=.3;sfx('hit');buzz(150);popup('BUMP! -1',BOY_X+14,boyGround()-58,'#d8322a');const v=el('div',{class:'hitv'});$('#fx').append(v);setTimeout(()=>v.remove(),1300);hudUpd();
 if(G.hearts<=0){G.mode='crash';G.crashT=0;setMusic(false);sfx('lose');}}
function update(dt){G.clock+=dt;G.rideT+=dt;
 if(G.mode==='attract'){G.d+=G.v*dt;return;}
 if(G.mode==='crash'){G.crashT+=dt;if(G.crashT>1)endLevel(false,'lives');return;}
 if(G.mode!=='play')return;
 const L=G.lvData;G.slow=Math.min(1,G.slow+dt*.6);
 const sp=(L.base*(1+.05*(stat(0)-3)))*(1+.14*G.d/L.L)*G.slow;G.v=sp;G.d+=sp*dt;G.score+=sp*dt*.1;
 if(G.laneT<1){G.laneT=Math.min(1,G.laneT+dt*1000/laneDur());if(G.laneT>=1&&G.queue!=null){const q=G.queue;G.queue=null;laneTo(q);}}
 if(G.jt>=0){G.jt+=dt*1000;if(G.jt>=jumpDur()){G.jt=-1;G.puffs.push({x:BOY_X-6,y:boyGround()-9,t:0});}}
 if(G.throwT>=0){G.throwT+=dt*1000;if(G.throwT>280)G.throwT=-1;}
 if(G.inv>0)G.inv-=dt;if(G.shake>0)G.shake-=dt;
 const jy=jumpY(),ln=effLane(),bx0=BOY_X-2,bx1=BOY_X+26;
 for(const o of G.objs){if(o.done)continue;const sx=screenX(o);if(sx>VW+40||sx<-60)continue;
  if(o.type==='auto'&&sx<BOY_X+230&&!G.honked.has(o)){G.honked.add(o);sfx('honk');}
  if(o.type==='dog'&&sx<BOY_X+170&&!o.barked){o.barked=true;sfx('woof');}
  if(o.lane!==ln)continue;const ox0=sx+2,ox1=sx+o.w-2;if(ox1<bx0||ox0>bx1)continue;
  if(o.type==='coin'){if((o.h===0&&jy<14)||(o.h>0&&jy>=9)){o.done=true;G.coins++;G.score+=5;sfx('coin');}continue;}
  if(o.type==='bundle'){if(jy<14){o.done=true;G.papers+=8;sfx('bundle');popup('+8 PAPERS',BOY_X+14,boyGround()-58,'#2d6fd1');hudUpd();}continue;}
  if(o.hit||G.inv>0)continue;if(!o.tall&&jy>=6)continue;o.hit=true;hit(o);if(G.mode!=='play')return;}
 for(const h of G.subs){if(h.done||h.thrown||h.missed)continue;const sx=h.wx-G.d;
  if(sx<BOY_X-14){h.missed=true;G.missed++;G.streak=0;sfx('miss');popup('MISSED',Math.max(20,sx+10),SY+66,'#5a5f78');hudUpd();continue;}
  if(ln===0&&G.laneT>=.5&&sx>BOY_X+6&&sx<BOY_X+48&&G.papers>0&&G.throwT<0){h.thrown=true;G.papers--;G.throwT=0;sfx('throw');G.flights.push({h,t:0,air:jy>=8,x0:BOY_X+2,y0:boyGround()-46-jy});hudUpd();}}
 for(const f of G.flights){f.t+=dt/.3;if(f.t>=1&&!f.h.done){f.h.done=true;G.delivered++;G.streak++;const mult=Math.min(5,1+Math.floor(G.streak/3));let pts=10*mult,label='+'+pts;if(f.air){pts+=25;label='AIR MAIL +'+pts;}G.score+=pts;sfx('bell');buzz(20);
  popup(label,f.h.wx-G.d,SY+60,f.air?'#ffd35a':'#4fb35e',f.air?'#241610':'#fff');week(1);hudUpd();}}
 G.flights=G.flights.filter(f=>f.t<1);
 for(const p of G.puffs)p.t+=dt;G.puffs=G.puffs.filter(p=>p.t<.3);
 if(G.d>=L.L){endLevel(G.delivered>=L.target,G.delivered>=L.target?'':'route');}
 if(Math.floor(G.clock*6)!==Math.floor((G.clock-dt)*6))hudUpd();}
function week(n){const w=weekId();if(P.week.id!==w)P.week={id:w,papers:0};P.week.papers+=n;P.total+=n;}
/* ---------- render ---------- */
function frame(im,fw,fh,i,x,y){if(!im||!(im.width||im.naturalWidth))return;ctx.drawImage(im,i*fw,0,fw,fh,Math.round(x),Math.round(y),fw,fh);}
const PF={'0':'111101101101111','1':'010110010010111','2':'111001111100111','3':'111001111001111','4':'101101111001001','5':'111100111001111','6':'111100111101111','7':'111001001001001','8':'111101111101111','9':'111101111001111','+':'000010111010000','!':'010010010000010',F:'111100110100100',I:'111010010010111',N:'111101101101101',S:'111100111001111',H:'101101111101101'};
function ptext(s,x,y,c){ctx.fillStyle=c;for(const ch of s){const g=PF[ch];if(g)for(let i=0;i<15;i++)if(g[i]==='1')ctx.fillRect(x+i%3,y+Math.floor(i/3),1,1);x+=4;}}
function render(){const city=IMG['city_'+CITIES[G.city].id];ctx.save();if(G.shake>0)ctx.translate(Math.round((Math.random()-.5)*4),Math.round((Math.random()-.5)*3));
 ctx.fillStyle='#5fb3e3';ctx.fillRect(-4,-4,VW+8,SY+4);const off=((G.d%960)+960)%960;if(city&&city.naturalWidth){ctx.drawImage(city,-Math.floor(off),SY);ctx.drawImage(city,960-Math.floor(off),SY);}
 const bob=Math.floor(G.clock*3)%2;
 for(const h of G.subs){const sx=Math.round(h.wx-G.d);if(sx<-20||sx>VW+20)continue;
  if(h.done){ctx.fillStyle='#241610';ctx.fillRect(sx-3,SY+92,7,4);ctx.fillStyle='#f3f1e6';ctx.fillRect(sx-2,SY+93,5,2);ctx.fillStyle='#b0322a';ctx.fillRect(sx,SY+93,1,2);}
  else if(!h.missed&&!h.thrown){const y=SY+56-bob;ctx.fillStyle='#241610';ctx.fillRect(sx-11,y-1,22,17);ctx.fillStyle='#ffffff';ctx.fillRect(sx-10,y,20,15);ctx.fillRect(sx-2,y+15,4,3);ctx.fillStyle='#241610';ctx.fillRect(sx-1,y+18,2,1);if(IMG.icon_paper.naturalWidth)ctx.drawImage(IMG.icon_paper,sx-8,y+2);}}
 if(G.lvData&&G.mode!=='attract'){const fx=Math.round(G.lvData.L+BOY_X-4-G.d);if(fx>-30&&fx<VW+30){ctx.fillStyle='#241610';ctx.fillRect(fx,SY+100,3,76);ctx.fillRect(fx+54,SY+100,3,76);for(let i=0;i<14;i++)for(let j=0;j<2;j++){ctx.fillStyle=(i+j)%2?'#241610':'#ffffff';ctx.fillRect(fx+1+i*4,SY+100+j*4,4,4);}ctx.fillStyle='#ffd35a';ctx.fillRect(fx+10,SY+110,36,9);ptext('FINISH',fx+16,SY+112,'#241610');}}
 const list=[];for(const o of G.objs){if(o.done)continue;const sx=screenX(o);if(sx<-50||sx>VW+20)continue;list.push({y:LANE_Y[o.lane]+(o.type==='coin'?-.5:0),o,sx});}
 const bg=boyGround();list.push({y:bg+.1,boy:true});list.sort((a,b)=>a.y-b.y);
 for(const it of list){if(it.boy){drawBoy(bg);continue;}const o=it.o,sx=it.sx,gy=LANE_Y[o.lane];
  if(o.type==='pothole'){if(G.lvData&&G.lvData.ev==='monsoon'){ctx.fillStyle='#4f7590';ctx.fillRect(Math.round(sx)-2,gy-6,20,4);}frame(IMG.pothole,22,11,0,sx-3,gy-8);}
  else if(o.type==='cow'){const im=o.var%2?IMG.cow_graze_left:IMG.cow_idle_left;frame(im,31,21,Math.floor(G.clock*1.4+o.t0)%2,sx-4,gy-21);if(Math.floor(G.clock+o.t0)%4===0&&sx<VW-30)frame(IMG.bubble_moo,19,13,0,sx-6,gy-36);}
  else if(o.type==='car'){frame(IMG['car_'+['red','blue','white','silver','black','orange'][o.var]+'_right'],40,22,0,sx-2,gy-21);}
  else if(o.type==='auto'){frame(IMG.auto_rickshaw_left,34,30,Math.floor(G.clock*14)%4,sx-2,gy-29);if(sx<BOY_X+230&&Math.floor(G.clock*4)%2)frame(IMG.bubble_honk,24,13,0,sx+6,gy-44);}
  else if(o.type==='dog'){const near=sx<BOY_X+170;frame(near?IMG.dog_bark_left:IMG.dog_run_left,21,13,Math.floor(G.clock*(near?5:9))%2,sx-3,gy-13);if(near&&Math.floor(G.clock*3)%2)frame(IMG.bubble_woof,25,13,0,sx-10,gy-28);}
  else if(o.type==='coin'){const w=Math.max(2,Math.round(14*Math.abs(Math.cos(G.clock*5+o.wx*.1)))),y=gy-18-o.h;if(IMG.icon_coin.naturalWidth)ctx.drawImage(IMG.icon_coin,Math.round(sx+7-w/2),y,w,14);}
  else if(o.type==='bundle'){const y=gy-20-bob;ctx.fillStyle='#2d6fd1';ctx.fillRect(Math.round(sx)-3,y-8,22,7);ptext('+8',Math.round(sx)+4,y-7,'#fff');if(IMG.icon_paper.naturalWidth){ctx.drawImage(IMG.icon_paper,Math.round(sx),y);ctx.drawImage(IMG.icon_paper,Math.round(sx)+1,y+4);}}}
 for(const f of G.flights){const tx=f.h.wx-G.d,ty=SY+93,t=Math.min(1,f.t);const x=f.x0+(tx-f.x0)*t,y=f.y0+(ty-f.y0)*t-Math.sin(Math.PI*t)*26;frame(IMG.newspaper_spin,9,9,Math.floor(t*12)%4,x-4,y-4);}
 for(const p of G.puffs)frame(IMG.fx_dust_puff,18,10,Math.min(3,Math.floor(p.t/.075)),p.x,p.y);
 const ev=G.lvData&&G.mode!=='attract'?G.lvData.ev:null;
 if(ev==='monsoon'||(ev==='finale'&&G.city===3)){ctx.fillStyle='rgba(40,60,90,.18)';ctx.fillRect(0,0,VW,VH);ctx.fillStyle='rgba(210,230,255,.75)';for(let i=0;i<70;i++){const x=(i*53+G.clock*260*(1+i%3*.2))%(VW+20)-10,y=(i*37+G.clock*420)%VH;ctx.fillRect(Math.round(VW-x),Math.round(y),1,5);}}
 if(ev==='fog'||(ev==='finale'&&G.city===5)){const g=ctx.createLinearGradient(BOY_X+60,0,VW,0);g.addColorStop(0,'rgba(220,225,230,0)');g.addColorStop(.5,'rgba(220,225,230,.75)');g.addColorStop(1,'rgba(220,225,230,.95)');ctx.fillStyle=g;ctx.fillRect(0,0,VW,VH);}
 ctx.restore();}
function drawBoy(g){const jy=jumpY();if(G.mode!=='attract'&&G.inv>0&&Math.floor(G.inv*12)%2)return;
 const sh=IMG.fx_shadow;frame(sh,32,5,Math.min(4,Math.floor(jy/5)),BOY_X-5,g-3);
 let im=BOY.boy_ride,i=Math.floor(G.rideT/.08)%4;
 if(G.mode==='crash'){im=BOY.boy_ride;i=0;}
 else if(G.jt>=0){im=BOY.boy_jump;const tot=JUMP_MS.reduce((a,b)=>a+b);i=seqFrame(JUMP_MS,G.jt/jumpDur()*tot)[0];}
 else if(G.laneT<1){im=G.laneDir<0?BOY.boy_lane_up:BOY.boy_lane_down;const tot=LANE_MS.reduce((a,b)=>a+b);i=seqFrame(LANE_MS,G.laneT*tot)[0];}
 else if(G.throwT>=0){im=BOY.boy_throw;i=Math.min(3,Math.floor(G.throwT/70));}
 frame(im,60,66,i,BOY_X-18,g-60-jy);}
let last=performance.now();
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);render();requestAnimationFrame(loop);}
/* ---------- HUD ---------- */
const HEART='<svg width="21" height="18" viewBox="0 0 7 6" shape-rendering="crispEdges"><path d="M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z" fill="FILL"/></svg>';
function hudInit(){$('#hAv').className='av';$('#hAv').style.backgroundImage=`url(assets/avatar_${P.cap}.png)`;$('#hBtns').hidden=P.settings.controls!=='buttons';$('#fx').innerHTML='';hudUpd();}
function hudUpd(){const L=G.lvData;if(!L)return;$('#hScore').textContent=String(Math.floor(G.score)).padStart(6,'0').replace(/(\d{3})$/,',$1');
 $('#hHearts').innerHTML=[0,1,2].map(i=>HEART.replace('FILL',i<G.hearts?'#e0201a':'#5a5f78')).join('');
 const m=Math.min(5,1+Math.floor(G.streak/3));$('#hCombo').hidden=m<2;$('#hCombo').textContent='x'+m+' COMBO';
 $('#hProg').style.width=clamp(G.d/L.L*100,0,100)+'%';$('#hPapers').textContent=G.papers;$('#hCoins').textContent=G.coins;
 const need=L.target-G.delivered,low=G.papers<=3&&need>0;$('#hPapersBox').classList.toggle('low',low);$('#hLow').hidden=!low;$('#hDeliv').hidden=low;
 $('#hDeliv').innerHTML='';$('#hDeliv').append(CITIES[G.city][P.settings.lang==='hi'?'hi':'name']+' · L'+G.lv+' · ',el('b',{style:'color:#ffd35a',text:G.delivered+' / '+L.target}),' '+(P.settings.lang==='hi'?'डिलीवर':'delivered'));}
/* ---------- countdown / pause / end ---------- */
let cdTimer=0;
function runCountdown(){duck(false);setMusic(false);show('countdown',true);$('#hud').hidden=false;$('#cdGoal').textContent=G.lvData.goal;
 $('#cdHints').innerHTML='';const hints=P.settings.controls==='swipe'?[['↑',P.settings.lang==='hi'?'ऊपर स्वाइप':'Swipe up'],['↓',P.settings.lang==='hi'?'नीचे स्वाइप':'Swipe down'],['●',P.settings.lang==='hi'?'कूदने के लिए टैप':'Tap to jump']]:[['↑↓',P.settings.lang==='hi'?'बटन से लेन बदलें':'Lane buttons'],['●',P.settings.lang==='hi'?'कूदें':'Jump button']];
 hints.forEach(h=>$('#cdHints').append(el('span',{class:'pill',text:h[0]+'  '+h[1]})));
 $('#cdHints').append(el('span',{class:'pill',text:P.settings.lang==='hi'?'घरों के पास ऊपरी लेन में रहें':'Stay in the top lane to deliver'}));
 let n=3;const step=()=>{$('#cdNum').innerHTML='';if(n>0){$('#cdNum').append(el('span',{class:'cdnum',text:String(n)}));sfx('tick');n--;cdTimer=setTimeout(step,800);}else{$('#cdNum').append(el('span',{class:'cdnum',style:'color:#8ad07a',text:P.settings.lang==='hi'?'चलो!':'GO!'}));sfx('go');cdTimer=setTimeout(()=>{G.mode='play';show('hud');setMusic(true);},500);}};step();}
function pauseGame(){if(G.mode!=='play')return;G.mode='paused';duck(true);
 const L=G.lvData,ps=$('#pStats');ps.innerHTML='';const hi=P.settings.lang==='hi';
 ps.append(el('span',{class:'px',style:'font-size:9px;color:#5a4a3a',text:hi?'यह राइड':'THIS RUN'}));
 [[hi?'स्कोर':'Score',fmt(G.score)],[hi?'डिलीवर':'Papers delivered',G.delivered+' / '+L.target],[hi?'बचे अख़बार':'Papers left',G.papers],[hi?'सिक्के':'Coins',G.coins],[hi?'रूट':'Route',Math.round(G.d/L.L*100)+'%']].forEach(r=>ps.append(el('div',{style:'display:flex;justify-content:space-between;font-size:16px'},[el('span',{text:r[0]}),el('b',{class:'px',style:'font-size:11px',text:String(r[1])})])));
 const pg=$('#pGoals');pg.innerHTML='';pg.append(el('span',{class:'px',style:'font-size:9px;color:#5a4a3a',text:(hi?'लेवल ':'LEVEL ')+G.lv+(hi?' लक्ष्य':' GOALS')}));
 const goal=(done,txt,right)=>el('div',{style:'display:flex;align-items:center;gap:8px;font-size:15px'},[done?el('span',{style:'width:18px;height:18px;flex-shrink:0;background:#4fb35e;border:3px solid #241610;box-sizing:border-box'}):el('span',{style:'width:18px;height:18px;flex-shrink:0;box-sizing:border-box;border:3px solid #241610;background:#fff'}),el('span',{text:txt}),right?el('b',{style:'margin-left:auto;color:#2d6fd1',text:right}):null]);
 pg.append(goal(G.delivered>=L.target,'Deliver '+L.target+' papers',G.delivered+'/'+L.target),goal(G.delivered>=L.subs.length*.85,'Serve 85% of subscribers (★2)'),goal(G.hits===0,'No crashes (★3)'));
 pg.append(el('div',{style:'margin-top:4px;padding:6px 8px;background:#fff3b8;border:2px dashed #e0a020;font-size:14px',text:'Tip: houses with a paper sign are subscribers. Ride in the top lane to throw.'}));
 show('pause',true);}
function resume(){if(G.mode!=='paused')return;show('hud');G.mode='play';last=performance.now();duck(false);setMusic(true);}
/* In-game buttons act on finger-up. iPhones can drop the 'click' of a tap while the game is animating,
   so we don't wait for it; touchend is cancelled so the late click can't hit the next screen. Keyboard still uses click. */
function tap(b,fn){let down=false,last=0;b.addEventListener('pointerdown',()=>{down=true;});b.addEventListener('pointercancel',()=>{down=false;});
 b.addEventListener('pointerup',e=>{if(!down)return;down=false;last=performance.now();fn(e);});b.addEventListener('touchend',e=>{if(e.cancelable)e.preventDefault();},{passive:false});
 b.addEventListener('click',e=>{if(performance.now()-last<800)return;fn(e);});}
tap($('#hPause'),pauseGame);tap($('#pResume'),resume);
tap($('#pRestart'),()=>{clearTimeout(cdTimer);startLevel(G.city,G.lv);});
tap($('#pQuit'),()=>{toMenu();});
tap($('#pSettings'),()=>{backTo='pause';show('settings',true);});
function toMenu(){clearTimeout(cdTimer);duck(false);attract();show('menu');setMusic(true);}
let endInfo=null;
function endLevel(ok,why){if(G.ended)return;G.ended=true;G.mode='end';setMusic(false);const L=G.lvData,c=CITIES[G.city];
 let stars=0,earned=G.coins;if(ok){stars=1+(G.delivered>=L.subs.length*.85?1:0)+(G.hits===0?1:0);G.score+=100+G.hearts*50;earned+=20+10*stars;sfx('win');}else if(why==='route')sfx('lose');
 P.coins+=earned;const prev=P.progress[c.id][G.lv-1]||0;if(stars>prev)P.progress[c.id][G.lv-1]=stars;const newBest=Math.floor(G.score)>(P.best||0);if(newBest)P.best=Math.floor(G.score);save();pushBoard();
 endInfo={ok,why,stars,earned,newBest};const hi=P.settings.lang==='hi';
 $('#eRibbon').textContent=ok?(hi?'रूट पूरा!':'ROUTE COMPLETE!'):why==='lives'?(hi?'जान खत्म!':'OUT OF LIVES'):(hi?'रूट अधूरा':'ROUTE INCOMPLETE');$('#eRibbon').style.background=ok?'#4fb35e':'#d8322a';
 const es=$('#eStars');es.innerHTML='';for(let i=0;i<3;i++)es.append(el('span',{class:'ico i-star'+(i<stars?'':' off'),style:`width:${i===1?48:40}px;height:${i===1?44:37}px`}));
 $('#eSub').textContent=ok?(stars===3?(hi?'परफ़ेक्ट डिलीवरी!':'Perfect delivery!'):c.name+' · Level '+G.lv):why==='lives'?(hi?'बहुत टक्करें। फिर से कोशिश करें!':'Too many bumps. Try again!'):(hi?'लक्ष्य से कम अख़बार बँटे।':'Not enough papers delivered.');
 const st=$('#eStats');st.innerHTML='';[[hi?'स्कोर':'Score',fmt(G.score)+(newBest?' ★':'')],[hi?'डिलीवर':'Delivered',G.delivered+' / '+L.target],[hi?'सिक्के मिले':'Coins earned','+'+earned],[hi?'छूटे घर':'Houses missed',G.missed]].forEach(r=>st.append(el('div',{style:'display:flex;justify-content:space-between;font-size:16px;border-bottom:2px dashed #cfc7b3;padding-bottom:4px'},[el('span',{text:r[0]}),el('b',{class:'px',style:'font-size:11px',text:String(r[1])})])));
 const main=$('#eMain'),alt=$('#eAlt');
 if(ok){const nxt=G.lv<10?[G.city,G.lv+1]:(G.city<5&&totalStars()>=CITIES[G.city+1].need?[G.city+1,1]:null);main.textContent=nxt?(hi?'अगला लेवल':'NEXT LEVEL'):(hi?'मिशन':'MISSIONS');main.act=()=>{nxt?startLevel(nxt[0],nxt[1]):(toMenu(),show('missions'));};alt.textContent=hi?'फिर से':'REPLAY';alt.act=()=>startLevel(G.city,G.lv);alt.className='pbtn';}
 else{main.textContent=hi?'फिर कोशिश':'RETRY';main.act=()=>startLevel(G.city,G.lv);
  if(why==='lives'&&!G.contUsed&&P.coins>=100){alt.textContent=hi?'जारी रखें · 100':'CONTINUE · 100';alt.className='pbtn';alt.act=()=>{P.coins-=100;save();G.contUsed=true;G.ended=false;G.hearts=1;G.inv=2;G.mode='play';show('hud');hudUpd();setMusic(true);};}
  else{alt.textContent=hi?'मिशन':'MISSIONS';alt.className='pbtn cream';alt.act=()=>{toMenu();show('missions');};}}
 setTimeout(()=>show('end',true),ok?400:100);}
tap($('#eMenu'),toMenu);tap($('#eMain'),()=>$('#eMain').act&&$('#eMain').act());tap($('#eAlt'),()=>$('#eAlt').act&&$('#eAlt').act());
/* ---------- leaderboard ---------- */
function pushBoard(){if(!P.name)return;const w=weekId();if(P.week.id!==w)P.week={id:w,papers:0};
 LB.submit({name:P.name,cap:P.cap,city:CITIES[P.home].id,week:w,weekPapers:P.week.papers,total:P.total,best:P.best||0});}
/* ---------- screens: renderers ---------- */
function rTitle(){$('#bestVal').textContent=fmt(P.best||0);}
let nm={name:'',cap:0,home:0,first:false};
function rName(){$('#pname').value=nm.name;$('#nmAv').style.backgroundImage=`url(assets/avatar_${nm.cap}.png)`;
 const cg=$('#nmCaps');cg.innerHTML='';CAPS.forEach((c,i)=>cg.append(el('button',{type:'button','aria-label':c[0]+' cap','aria-pressed':String(i===nm.cap),style:`height:48px;padding:0;border:${i===nm.cap?'4px solid #ffd35a':'3px solid #241610'};background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center`,onclick:()=>{nm.cap=i;rName();}},el('span',{class:'av',style:`width:36px;height:36px;background-image:url(assets/avatar_${i}.png)`}))));
 const cc=$('#nmCities');cc.innerHTML='';CITIES.forEach((c,i)=>cc.append(el('button',{type:'button','aria-pressed':String(i===nm.home),class:'px',style:`height:32px;border:3px solid #241610;background:${i===nm.home?'#ffd35a':'#fff'};cursor:pointer;font-size:8px;color:#241610`,text:c.name.toUpperCase(),onclick:()=>{nm.home=i;rName();}})));}
$('#pname').addEventListener('input',e=>{nm.name=e.target.value.slice(0,12);$('#pname').classList.remove('bad');const h=$('#nmHelp');h.className='';h.style.color='#5a4a3a';h.textContent=t('nameHelp','3–12 letters or numbers. Use a nickname, not your real full name.');});
$('#nmDice').addEventListener('click',()=>{nm.name=NAMES[Math.floor(Math.random()*NAMES.length)]+Math.floor(10+Math.random()*90);$('#pname').value=nm.name;$('#pname').classList.remove('bad');});
$('#nameForm').addEventListener('submit',e=>{e.preventDefault();const n=nm.name.trim().toUpperCase();let err='';if(n.length<3)err='Name needs at least 3 characters.';else if(!/^[A-Z0-9_.]+$/.test(n))err='Use only letters, numbers, _ or .';
 if(err){$('#pname').classList.add('bad');const h=$('#nmHelp');h.textContent=err;h.style.color='#b0322a';h.setAttribute('role','alert');$('#pname').focus();return;}
 P.name=n;P.cap=nm.cap;if(!P.capsOwned.includes(nm.cap))P.capsOwned.push(nm.cap);P.home=nm.home;save();tint();pushBoard();sfx('bell');
 if(!P.tutorial){howNext='play';show('howto');}else show('menu');});
let howNext='menu';
function rHow(){const c=$('#howCards');if(c.childElementCount)return;const hi=()=>P.settings.lang==='hi';
 const card=(cls,arrow,title,txt,extra)=>el('div',{style:'height:250px;box-sizing:border-box;background:#f4f0e6;border:3px solid #241610;box-shadow:0 5px 0 #0f1428;display:flex;flex-direction:column;overflow:hidden;color:#241610'},[
  el('div',{style:'position:relative;height:158px;background:#6f6e6c;border-bottom:3px solid #241610;overflow:hidden'},[el('div',{style:'position:absolute;left:0;top:0;width:100%;height:8px;background:#cfc7b3'}),el('div',{style:'position:absolute;left:0;top:8px;width:100%;height:4px;background:repeating-linear-gradient(90deg,#1e1e1e 0 12px,#f2c230 12px 24px)'}),el('div',{style:'position:absolute;left:0;top:96px;width:100%;height:3px;background:repeating-linear-gradient(90deg,#f4f0e6 0 18px,transparent 18px 36px)'}),extra,el('div',{class:'demo '+cls,style:'position:absolute;left:46px;top:32px'}),el('div',{style:'position:absolute;right:12px;top:40px;width:44px;height:70px;border:3px solid #f4f0e6;box-sizing:border-box;display:flex;align-items:center;justify-content:center;color:#ffd35a;font-family:var(--px);font-size:22px',text:arrow})]),
  el('div',{style:'padding:10px 14px;display:flex;flex-direction:column;gap:6px'},[el('span',{class:'px',style:'font-size:12px',text:title}),el('span',{style:'font-size:15px',text:txt})])]);
 c.append(card('up','↑','SWIPE UP','Ride the top lane past houses with a paper sign – papers fly automatically.'),card('down','↓','SWIPE DOWN','Drop to the lower lane to dodge parked cars and cows.'),card('jmp','●','TAP','Jump potholes and barking dogs. Jump while throwing for AIR MAIL points.',el('div',{style:'position:absolute;left:70px;top:140px;width:36px;height:10px;border-radius:50%;background:#2f2e2c'})));}
$('#howGo').addEventListener('click',()=>{if(howNext==='play'||!P.tutorial){P.tutorial=true;save();audio();startLevel(0,1);}else{show(howNext==='settings'?'menu':howNext);}});
function dailyState(){const td=today(),y=today(new Date(Date.now()-864e5));if(P.streak.last===td)return{claimed:true,day:P.streak.count};const next=P.streak.last===y?(P.streak.count%7)+1:1;return{claimed:false,day:next};}
function rDaily(){const s=dailyState();const hi=P.settings.lang==='hi';$('#dStreak').innerHTML='';$('#dStreak').append(el('b',{text:(s.claimed?s.day:Math.max(0,s.day-1))+(hi?' दिन की लगातार राइड! ':'-day streak! ')}),hi?'हर सुबह आएँ और बोनस बढ़ाएँ।':'Ride every morning to keep it going.');
 const tl=$('#dTiles');tl.innerHTML='';DAILY.forEach((amt,i)=>{const d=i+1,claimedDay=d<s.day||(s.claimed&&d===s.day),todayT=!s.claimed&&d===s.day;
  tl.append(el('div',{class:todayT?'pulse':'',style:`height:118px;box-sizing:border-box;border:${todayT?4:3}px solid #241610;background:${todayT?'#ffd35a':claimedDay?'#cfc7b3':d===7?'#c9b6e4':'#fff'};${todayT?'box-shadow:0 4px 0 #e0782a;':''}display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:8px 0;color:#241610;${claimedDay?'opacity:.7':''}`},[el('span',{class:'px',style:'font-size:9px',text:todayT?(hi?'आज':'TODAY'):'DAY '+d}),claimedDay?el('span',{class:'px',style:'font-size:20px;color:#2e8b3e',text:'✓'}):el('span',{class:'ico '+(d===7?'i-gift':'i-coin'),style:d===7?'width:40px;height:40px':''}),el('span',{style:'font-size:15px;font-weight:600',text:String(amt)})]));});
 const b=$('#dClaim');$('#dClaimTxt').textContent=s.claimed?(hi?'कल फिर आएँ':'COME BACK TOMORROW'):(hi?'लें ':'CLAIM ')+DAILY[s.day-1];b.className='pbtn '+(s.claimed?'cream':'green pulse');}
$('#dClaim').addEventListener('click',()=>{const s=dailyState();if(!s.claimed){P.coins+=DAILY[s.day-1];P.streak={last:today(),count:s.day};save();sfx('bundle');rDaily();setTimeout(()=>show('menu'),700);}else show('menu');});
function nextLevelFor(ci){const pr=P.progress[CITIES[ci].id];const i=pr.findIndex(v=>v===0);return i<0?10:i+1;}
function rMenu(){const ts=totalStars();$('#mLv').textContent='LV '+(1+Math.floor(ts/3));$('#mXp').style.width=((ts%3)/3*100)+'%';$('#mNameTxt').textContent=P.name||'PLAYER';
 $$('.mCoins').forEach(e=>e.textContent=fmt(P.coins));$('#mStreak').textContent=dailyState().claimed?P.streak.count:Math.max(0,dailyState().day-1);
 const ci=P.city||0,c=CITIES[ci],lv=nextLevelFor(ci);$('#mThumb').style.backgroundImage=`url(assets/city_${c.id}.png)`;
 $('#mRouteA').textContent=c.name.toUpperCase()+' · LEVEL '+lv;$('#mRouteB').textContent=c.route;const st=P.progress[c.id].filter(v=>v>0).length;$('#mRouteC').textContent=st+' / 10 levels · '+P.progress[c.id].reduce((a,b)=>a+b,0)+' stars';}
$('#mRoute').addEventListener('click',()=>show('missions'));$('#mName').addEventListener('click',()=>{nm={name:P.name,cap:P.cap,home:P.home};show('name');});
$('#mStart').addEventListener('click',()=>{audio();const ci=P.city||0;startLevel(ci,Math.min(10,nextLevelFor(ci)));});
let ms={ci:null,li:null};
function rMissions(){const ts=totalStars();if(ms.ci==null)ms.ci=P.city||0;const c=CITIES[ms.ci],locked=c.need>ts,pr=P.progress[c.id],done=pr.filter(v=>v>0).length,curL=Math.min(9,pr.findIndex(v=>v===0)<0?9:pr.findIndex(v=>v===0));
 if(ms.li==null)ms.li=locked?0:curL;$('#msStars').textContent=ts+' / 180';
 const cl=$('#msCities');cl.innerHTML='';CITIES.forEach((x,i)=>{const lk=x.need>ts,sel=i===ms.ci;cl.append(el('button',{'aria-pressed':String(sel),style:`height:47px;box-sizing:border-box;border:3px solid #241610;background:${sel?'#ffd35a':lk?'#8a90b0':'#f4f0e6'};box-shadow:0 3px 0 #0b0f1e;cursor:pointer;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:3px;padding:0 10px;color:#241610;text-align:left`,onclick:()=>{ms={ci:i,li:null};sfx('click');rMissions();}},[el('span',{class:'px',style:'font-size:10px',text:(P.settings.lang==='hi'?x.hi:x.name.toUpperCase())}),el('span',{style:'font-size:13px;color:'+(lk?'#2a3050':'#5a4a3a'),text:lk?'Locked · '+x.need+' stars':x.name===c.name||true?P.progress[x.id].filter(v=>v>0).length+' / 10 levels':''})]));});
 $('#msStrip').style.backgroundImage=`url(assets/city_${c.id}.png)`;$('#msRoute').textContent=c.name.toUpperCase()+' · '+c.route.toUpperCase();$('#msMarks').textContent=c.marks;
 $('#msLock').hidden=!locked;$('#msLockTxt').textContent='COLLECT '+c.need+' STARS TO UNLOCK · YOU HAVE '+ts;
 const lg=$('#msLevels');lg.innerHTML='';for(let i=0;i<10;i++){const dn=pr[i]>0&&!locked,open=!locked&&i<=done,isCur=open&&pr[i]===0,sel=i===ms.li;
  lg.append(el('button',{class:'lvl'+(isCur?' pulse':''),'aria-label':'Level '+(i+1),'aria-pressed':String(sel),style:`border:${sel?'4px solid #ffffff':'3px solid #241610'};background:${isCur?'#ffd35a':dn?'#f4f0e6':'#2a3050'};color:${open?'#241610':'#8a90b0'}`,onclick:()=>{ms.li=i;sfx('click');rMissions();}},[el('span',{text:open?String(i+1):'–'}),el('span',{class:'st'},[0,1,2].map(k=>el('i',{class:k<pr[i]&&!locked?'on':''})))]));}
 const L=genLevel(ms.ci,ms.li+1);$('#msLvNo').textContent='LEVEL '+(ms.li+1);const tg=$('#msTag');tg.hidden=!(ms.li===4||ms.li===9);tg.textContent=ms.li===9?'CITY FINALE':'CITY EVENT';tg.style.background=ms.li===9?'#d8322a':'#2d6fd1';$('#msObj').textContent=L.goal;
 const can=!locked&&ms.li<=done;const r=$('#msRide');r.className='pbtn'+(can?' pulse':' grey');r.textContent=can?t('ride','RIDE!'):'LOCKED';r.onclick=can?()=>{audio();startLevel(ms.ci,ms.li+1);}:null;}
let gs={tab:'cycles',sel:null,cap:null};
function rGarage(){if(gs.sel==null)gs.sel=P.bike;if(gs.cap==null)gs.cap=P.cap;$$('.mCoins').forEach(e=>e.textContent=fmt(P.coins));const hi=P.settings.lang==='hi';
 $$('#gTabs button').forEach(b=>b.classList.toggle('sel',b.dataset.tab===gs.tab));
 const b=BIKES.find(x=>x.id===gs.sel);$('#gBig').style.backgroundImage=gs.tab==='caps'?`url(assets/boy_ride.png)`:'';gBigPaint(b);
 $('#gName').textContent=gs.tab==='caps'?CAPS[gs.cap][0].toUpperCase()+' CAP':b.name.toUpperCase();$('#gTag').textContent=gs.tab==='caps'?'Shows on your rider and on the leaderboard.':b.tag;
 const sg=$('#gStats');sg.innerHTML='';['Speed','Handling','Jump','Basket'].forEach((l,i)=>sg.append(el('div',{style:'display:flex;flex-direction:column;gap:4px'},[el('span',{style:'font-size:14px;font-weight:600',text:l}),el('div',{style:'display:flex;gap:3px'},[1,2,3,4,5].map(k=>el('span',{style:`width:28px;height:10px;border:2px solid #241610;background:${k<=b.st[i]?'#ffd35a':'#2a3050'}`})))])));
 const gg=$('#gGrid');gg.innerHTML='';const done=levelsDone();
 if(gs.tab==='cycles'){gg.style.gridTemplateColumns='repeat(3,minmax(0,1fr))';BIKES.forEach(x=>{const own=P.owned.includes(x.id),lk=x.need&&done<x.need;
   gg.append(el('button',{class:'card'+(x.id===gs.sel?' sel':''),style:`height:104px;background:${lk?'#b8bccc':'#f4f0e6'}`,'aria-pressed':String(x.id===gs.sel),onclick:()=>{gs.sel=x.id;sfx('click');rGarage();}},[thumb(x),el('span',{style:'font-size:14px;font-weight:600;font-family:var(--body)',text:x.name}),el('span',{class:'px',style:`font-size:8px;margin-top:3px;color:${P.bike===x.id?'#2e8b3e':'#7a5a1a'}`,text:P.bike===x.id?'EQUIPPED':own?'OWNED':lk?'AFTER '+x.need+' LEVELS':fmt(x.price)})]));});}
 else{gg.style.gridTemplateColumns='repeat(4,minmax(0,1fr))';CAPS.forEach((c,i)=>gg.append(el('button',{class:'card'+(i===gs.cap?' sel':''),style:'height:104px;padding:6px 0;justify-content:space-between','aria-pressed':String(i===gs.cap),onclick:()=>{gs.cap=i;sfx('click');rGarage();}},[el('span',{class:'av',style:`width:54px;height:54px;background-image:url(assets/avatar_${i}.png)`}),el('span',{style:'font-size:14px;font-weight:600;font-family:var(--body)',text:c[0]}),el('span',{class:'px',style:'font-size:8px;color:#7a5a1a',text:P.cap===i?'WEARING':P.capsOwned.includes(i)?'OWNED':String(c[2])})])));}
 const a=$('#gAct');let lab,can=true,fn=null,cls='pbtn';
 if(gs.tab==='caps'){const c=CAPS[gs.cap];if(P.cap===gs.cap){lab='WEARING';can=false;}else if(P.capsOwned.includes(gs.cap)){lab='WEAR CAP';cls+=' green';fn=()=>{P.cap=gs.cap;};}else if(P.coins>=c[2]){lab='BUY '+c[2];fn=()=>{P.coins-=c[2];P.capsOwned.push(gs.cap);P.cap=gs.cap;};}else{lab='NEED '+fmt(c[2]-P.coins)+' MORE';can=false;}}
 else{const own=P.owned.includes(b.id);if(P.bike===b.id){lab='EQUIPPED';can=false;}else if(own){lab='EQUIP';cls+=' green';fn=()=>{P.bike=b.id;};}else if(b.need&&done<b.need){lab='UNLOCKS AFTER '+b.need+' LEVELS';can=false;}else if(P.coins>=b.price){lab='BUY '+fmt(b.price);fn=()=>{P.coins-=b.price;P.owned.push(b.id);P.bike=b.id;};}else{lab='NEED '+fmt(b.price-P.coins)+' MORE';can=false;}}
 a.textContent=lab;a.className=can?cls:'pbtn grey';a.onclick=can?()=>{fn();save();tint();pushBoard();sfx('bundle');rGarage();}:null;}
function tintedSheet(bikeId,capIdx){const bike=BIKES.find(b=>b.id===bikeId);const im=IMG.boy_ride;if(!im.naturalWidth)return'';const c=document.createElement('canvas');c.width=240;c.height=66;const x=c.getContext('2d');x.drawImage(im,0,0);const d=x.getImageData(0,0,240,66),a=d.data;const cap=CAPS[capIdx][1],cr=[1,3,5].map(i=>parseInt(cap.substr(i,2),16));const sh=(q,f)=>q.map(v=>clamp(Math.round(v*f),0,255));
 const map=[[[216,50,42],bike.col],[[45,111,209],cr],[[95,154,245],sh(cr,1.3)],[[29,74,153],sh(cr,.7)],[[26,43,85],sh(cr,.45)]];for(let i=0;i<a.length;i+=4){if(!a[i+3])continue;for(const[f,to]of map)if(a[i]===f[0]&&a[i+1]===f[1]&&a[i+2]===f[2]){a[i]=to[0];a[i+1]=to[1];a[i+2]=to[2];break;}}x.putImageData(d,0,0);return c.toDataURL();}
const sheetCache={};function sheetUrl(b,c){const k=b+'_'+c;return sheetCache[k]||(sheetCache[k]=tintedSheet(b,c));}
function gBigPaint(b){const u=sheetUrl(gs.tab==='caps'?P.bike:b.id,gs.tab==='caps'?gs.cap:P.cap);const g=$('#gBig');g.style.backgroundImage=u?`url(${u})`:'';g.style.backgroundSize='720px 198px';}
function thumb(x){const u=sheetUrl(x.id,P.cap);return el('div',{class:'thumb',style:`background-image:url(${u});background-size:480px 132px;background-position:-4px -38px`});}
$$('#gTabs button').forEach(b=>b.addEventListener('click',()=>{gs.tab=b.dataset.tab;sfx('click');rGarage();}));
let rs={tab:'city',rows:null,loading:false};
async function loadRanks(){if(!LB.enabled()){rs.rows=null;return;}rs.loading=true;rs.rows=await LB.fetchWeek(weekId());rs.loading=false;}
function rRanks(){const hi=P.settings.lang==='hi';$('#rTabCity').textContent=(CITIES[P.home][hi?'hi':'name']).toUpperCase();$$('#rTabs button').forEach(b=>b.classList.toggle('sel',b.dataset.rt===rs.tab));
 const now=new Date(),day=(now.getDay()+6)%7,left=7-day;$('#rReset').textContent=(hi?'रीसेट: ':'Resets in ')+left+'d';
 if(LB.enabled()&&rs.rows==null&&!rs.loading){loadRanks().then(()=>{if(cur==='ranks')rRanks();});}
 let rows=(rs.rows||[]).filter(r=>typeof r.name==='string'&&typeof r.weekPapers==='number');const mine={id:LB.playerId(),name:P.name||'YOU',cap:P.cap,city:CITIES[P.home].id,weekPapers:P.week.id===weekId()?P.week.papers:0};
 if(!rows.find(r=>r.id===mine.id))rows.push(mine);else rows=rows.map(r=>r.id===mine.id?Object.assign({},r,mine):r);
 if(rs.tab==='city')rows=rows.filter(r=>r.city===CITIES[P.home].id);rows.sort((a,b)=>b.weekPapers-a.weekPapers);
 const pd=$('#rPodium');pd.innerHTML='';const top=[rows[1],rows[0],rows[2]],hs=[76,104,58],bgs=['#c8ccd0','#ffd35a','#d9a06a'],nums=[2,1,3];
 top.forEach((r,i)=>pd.append(el('div',{style:'flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;min-width:0'},[i===1?el('span',{class:'ico i-trophy bob'}):null,r?el('span',{class:'av',style:`width:${i===1?62:54}px;height:${i===1?62:54}px;background-image:url(assets/avatar_${(r.cap|0)%8}.png)`}):el('span',{style:'height:54px'}),el('span',{style:'font-size:14px;font-weight:600;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',text:r?r.name:'—'}),el('span',{class:'px',style:'font-size:9px;color:#ffd35a',text:r?fmt(r.weekPapers):''}),el('div',{style:`width:100%;height:${hs[i]}px;box-sizing:border-box;border:3px solid #241610;background:${bgs[i]};display:flex;justify-content:center;padding-top:10px;font-family:var(--px);font-size:20px;color:#241610`,text:String(nums[i])})])));
 const ls=$('#rList');ls.innerHTML='';rows.slice(3,8).forEach((r,i)=>ls.append(el('div',{class:'lbrow'},[el('span',{class:'px',style:'width:34px;font-size:11px',text:'#'+(i+4)}),el('span',{class:'av',style:`width:28px;height:28px;background-image:url(assets/avatar_${(r.cap|0)%8}.png)`}),el('span',{style:'flex-grow:1;font-size:16px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap',text:r.name}),el('span',{style:'font-size:13px;color:#5a4a3a',text:(CITIES.find(c=>c.id===r.city)||{name:''}).name}),el('span',{class:'px',style:'width:70px;text-align:right;font-size:10px',text:fmt(r.weekPapers)})])));
 if(rows.length<=3)ls.append(el('div',{class:'muted',style:'font-size:15px;padding:8px 2px',text:hi?'अभी और खिलाड़ी नहीं हैं। दोस्तों को बुलाएँ!':'No other riders here yet this week. Invite your friends!'}));
 const myRank=rows.findIndex(r=>r.id===mine.id)+1;const me=$('#rMe');me.innerHTML='';me.append(el('span',{class:'px',style:'width:54px;font-size:11px',text:'#'+myRank}),el('span',{class:'av',style:`width:30px;height:30px;background-image:url(assets/avatar_${P.cap}.png)`}),el('span',{style:'flex-grow:1;font-size:16px;font-weight:600',text:(P.name||'YOU')+(hi?' (आप)':' (you)')}),el('span',{class:'px',style:'width:70px;text-align:right;font-size:10px',text:fmt(mine.weekPapers)}));
 $('#rNote').textContent=LB.enabled()?(rs.loading?'Loading riders…':(hi?'हर हफ़्ते सोमवार को नई रैंकिंग।':'Weekly ranking by papers delivered. Resets every Monday.')):'Leaderboard is offline. Showing your own score.';}
$$('#rTabs button').forEach(b=>b.addEventListener('click',()=>{rs.tab=b.dataset.rt;sfx('click');rRanks();}));
function rSettings(){const s=P.settings;$$('.tog').forEach(b=>{const on=!!s[b.dataset.set];b.classList.toggle('on',on);b.setAttribute('aria-pressed',String(on));});
 $$('#sLang button').forEach(b=>b.classList.toggle('sel',b.dataset.v===s.lang));$$('#sCtl button').forEach(b=>b.classList.toggle('sel',b.dataset.v===s.controls));}
$$('.tog').forEach(b=>b.addEventListener('click',()=>{const k=b.dataset.set;P.settings[k]=!P.settings[k];save();rSettings();if(k==='music')setMusic(P.settings.music);sfx('click');}));
$$('#sLang button').forEach(b=>b.addEventListener('click',()=>{P.settings.lang=b.dataset.v;save();rSettings();applyLang();}));
$$('#sCtl button').forEach(b=>b.addEventListener('click',()=>{P.settings.controls=b.dataset.v;save();rSettings();$('#hBtns').hidden=P.settings.controls!=='buttons';}));
function closeSettings(){if(backTo==='pause'){show('pause',true);}else show(backTo&&backTo!=='settings'?backTo:'menu');}
tap($('#sClose'),closeSettings);tap($('#sDone'),closeSettings);
$('#sName').addEventListener('click',()=>{if(backTo==='pause')return;nm={name:P.name,cap:P.cap,home:P.home};show('name');});
/* ---------- boot ---------- */
/* Full screen hides the browser's address bar. Android allows it from any tap; iPhone only in the home-screen app. */
const standalone=()=>matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches||navigator.standalone;
function goFull(){const d=document.documentElement,req=d.requestFullscreen||d.webkitRequestFullscreen;if(!req||/iphone|ipod/i.test(navigator.userAgent)||standalone()||document.fullscreenElement||document.webkitFullscreenElement||!matchMedia('(pointer:coarse)').matches||document.activeElement===$('#pname'))return;
 try{const r=req.call(d,{navigationUI:'hide'});if(r&&r.then)r.then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape').catch(()=>{})).catch(()=>{});}catch(e){}}
let iosHint=false;
function titleTap(){unlockAudio();sfx('bell');goFull();if(!iosHint&&/iphone|ipod/i.test(navigator.userAgent)&&!standalone()){iosHint=true;setTimeout(()=>toast(iosInstallTip(),null,7000),800);}
 setMusic(true);if(!P.name){nm={name:'',cap:0,home:0};show('name');}else if(!dailyState().claimed)show('daily');else show('menu');}
$('#titleTap').addEventListener('click',titleTap);
for(const ev of ['pointerup','touchend','click','keydown'])addEventListener(ev,()=>{unlockAudio();if(ev!=='keydown')goFull();},true);
addEventListener('pointerdown',()=>{audio();resumeAudio();if(!musicPlaying()&&P.settings.music&&G.mode!=='count'&&G.mode!=='end'&&G.mode!=='crash')setMusic(true);},true);
function boot(){applyLang();show('splash');const loadP=loadAll(p=>{$('#loadbar').style.width=Math.round(p*100)+'%';});
 const go=()=>{if(cur!=='splash')return;show('loading');loadP.then(()=>{tint();attract();requestAnimationFrame(loop);setTimeout(()=>show('title'),350);});};
 setTimeout(go,1900);$('#splash').addEventListener('click',go);
 setupPWA();}
boot();
$('#btnShare').addEventListener('click',()=>shareGame());$('#rShare').addEventListener('click',()=>shareGame());
