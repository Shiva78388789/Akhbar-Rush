const fs=require('fs');
const lvl=fs.readFileSync(__dirname+'/level.js','utf8').replace('const W=960,H=160,','let W=960,H=160;const ').split('\n').filter(l=>!l.startsWith("png('")).join('\n');
const sp=fs.readFileSync(__dirname+'/sprites.js','utf8');
const helpers=sp.slice(sp.indexOf('const out='),sp.indexOf('function wheelS')).replace("'/sprites/frames'","'/moves/raw'")+sp.slice(sp.indexOf('function knee'),sp.indexOf('function boyS'));
eval(lvl+helpers+`
// Rider with body offsets: lift (+ stands up / - crouches), lean (+ forward), ph pedal phase, wp wheel phase
function boyM(ox,gy,o){const ph=o.ph||0,lift=o.lift||0,lean=o.lean||0,u=gy-lift,sx=v=>Math.round(v);
 const wh=(cx,cy)=>{ring(cx,cy,7,2,'#1b1b1b');ring(cx,cy,5,1,'#c8ccd0');for(let a=0;a<4;a++){const t=a*Math.PI/4+(o.wp!=null?o.wp:ph/2);L(cx-sx(Math.cos(t)*4),cy-sx(Math.sin(t)*4),cx+sx(Math.cos(t)*4),cy+sx(Math.sin(t)*4),'#9aa0a6');}r(cx,cy,1,1,'#e0e0e0');};
 wh(ox,gy-7);wh(ox+23,gy-7);arc(ox,gy-7,9,1,190,300,'#d8322a');arc(ox+23,gy-7,9,1,200,340,'#d8322a');
 const Bx=ox+10,By=gy-6,Hx=ox+8+sx(lean*.3),Hy=u-22,cr=3;
 const f2=[sx(Bx+Math.cos(ph+Math.PI)*cr),sx(By+Math.sin(ph+Math.PI)*cr)],k2=knee(Hx,Hy,f2[0],f2[1],9,10);
 Lo(Hx,Hy,k2[0],k2[1],'#28334d',1);Lo(k2[0],k2[1],f2[0],f2[1],'#a8703f',1);r(f2[0]-1,f2[1]-1,4,2,'#8a2020');
 const B=[Bx,By],R=[ox,gy-7],S=[ox+7,gy-18],HT=[ox+19,gy-18],HB=[ox+20,gy-14],Fh=[ox+23,gy-7];
 const seg=[[R,B],[B,S],[R,S],[[ox+8,gy-16],HT],[B,HB],[HT,Fh]];seg.forEach(([a,b])=>L(a[0],a[1],b[0],b[1],OL,3));seg.forEach(([a,b])=>L(a[0],a[1],b[0],b[1],'#d8322a',1));
 ring(Bx,By,2,1,'#5a5a5a');L(ox,gy-8,ox+10,gy-8,'#444');
 r(ox-6,gy-15,10,1,'#c8ccd0');L(ox-4,gy-14,ox-1,gy-8,'#9aa0a6');box(ox-6,gy-19,9,3,'#f3f1e6');r(ox-2,gy-19,1,3,'#b0322a');r(ox-7,gy-15,1,2,'#e0201a');
 r(ox+7,gy-19,1,2,'#c8ccd0');box(ox+4,gy-21,6,1,'#2a2a2a');L(ox+19,gy-18,ox+18,gy-22,'#c8ccd0');box(ox+15,gy-23,4,1,'#1a1a1a');
 box(ox+21,gy-20,7,5,'#a6763a','#5a3a1a');for(let i=0;i<7;i+=2)r(ox+21+i,gy-19,1,4,'#7e5626');r(ox+22,gy-23,2,3,'#f3f1e6');r(ox+25,gy-24,2,4,'#eceadd');
 const tl=h=>sx(lean*h/10);
 for(let y=u-32;y<=u-22;y++){const h=u-22-y,lx=ox+5+sx(h*.35)+tl(h)+sx(lean*.3);r(lx-1,y,8,1,OL);r(lx,y,6,1,'#f39c2b');r(lx,y,1,1,'#c9731a');}
 const hx=ox+tl(10)+sx(lean*.3);r(hx+8,u-33,7,1,OL);
 box(ox+3+sx(lean*.5),u-27,5,5,'#7a5230');r(ox+3+sx(lean*.5),u-27,5,2,'#8f6238');r(ox+5+sx(lean*.5),u-25,1,1,'#ffd35a');r(ox+4+sx(lean*.5),u-29,2,2,'#f3f1e6');L(ox+5+sx(lean*.5),u-28,hx+11,u-32,'#5a3a1a');
 const f1=[sx(Bx+Math.cos(ph)*cr),sx(By+Math.sin(ph)*cr)],k1=knee(Hx,Hy,f1[0],f1[1],9,10);
 Lo(Hx,Hy,k1[0],k1[1],'#3b4a6b',2);Lo(k1[0],k1[1],f1[0],f1[1]-1,'#f1c18e',1);box(f1[0]-1,f1[1]-2,4,2,'#e23b3b');r(f1[0]-1,f1[1],4,1,'#f4f4f4');
 const hy=u+(o.nod||0);
 r(hx+11,hy-34,3,1,'#d4945f');box(hx+9,hy-41,8,7,'#f1c18e');r(hx+9,hy-40,3,5,'#2a1a10');r(hx+11,hy-38,2,2,'#e0a878');
 box(hx+9,hy-44,8,3,'#2d6fd1','#1a2b55');r(hx+10,hy-44,5,1,'#5f9af5');r(hx+17,hy-42,3,1,'#1d4a99');r(hx+13,hy-43,1,1,'#ffd35a');
 const face=o.face||'grin';
 r(hx+14,hy-40,2,1,'#2a1a10');r(hx+15,hy-39,1,2,'#111');
 if(face=='grin'){r(hx+14,hy-36,3,1,'#7a1f16');r(hx+15,hy-36,1,1,'#fff');}
 if(face=='focus'){r(hx+14,hy-36,3,1,'#9a4a3a');r(hx+13,hy-41,3,1,'#2a1a10');}
 if(face=='whee'){r(hx+14,hy-37,3,2,'#7a1f16');r(hx+15,hy-37,1,1,'#fff');}
 r(hx+13,hy-37,1,1,'#f08a7a');
 if(o.sweat)r(hx+18,hy-40,1,2,'#bfe8ff');
 r(hx+11,u-32,3,2,'#f39c2b');Lo(hx+12,u-30,ox+16,gy-24,'#f1c18e',1);
 r(hx+7,u-33,3,2,'#f39c2b');Lo(hx+8,u-31,ox+15,gy-25,'#f1c18e',1);}
const M={};function S(anim,name,w,h,fn){save(name,w,h,fn);(M[anim]=M[anim]||[]).push(name);}
const CW=60,CH=66,OX=18,GYc=60,sets=${JSON.stringify(require(__dirname+'/moves.json'))};
for(const [anim,cfg] of Object.entries(sets)){cfg.frames.forEach((f,i)=>S(anim,anim+'_'+i,CW,CH,()=>boyM(OX,GYc,{ph:(cfg.ph0||0)+i*Math.PI/2*(cfg.pedal==null?1:cfg.pedal),wp:i*0.8,lift:f.lift,lean:f.lean,face:f.face,sweat:f.sweat,nod:f.nod})));}
fs.writeFileSync(__dirname+'/moves/raw_manifest.json',JSON.stringify({canvas:[CW,CH],rear_wheel_contact:[OX,GYc],front_wheel_contact:[OX+23,GYc],frames:M},null,1));
`);
