const fs=require('fs');
let src=fs.readFileSync(__dirname+'/level.js','utf8').replace('const W=960,H=160,','let W=960,H=160;const ').split('\n').filter(l=>!l.startsWith("png('")).join('\n');
eval(src+`
const out=__dirname+'/sprites/frames';fs.mkdirSync(out,{recursive:true});
function save(name,w,h,draw){W=w;H=h;buf=new Uint8Array(w*h*4);draw();
 const raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;buf.slice(y*w*4,(y+1)*w*4).forEach((v,i)=>raw[y*(w*4+1)+1+i]=v);}
 const crcT=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcT[n]=c>>>0;}
 const crc=b=>{let c=0xffffffff;for(const v of b)c=crcT[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
 const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;
 fs.writeFileSync(out+'/'+name+'.png',Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));}

function wheelS(cx,cy,R,f){disc(cx,cy,R,'#1b1b1b');disc(cx,cy,R-2,'#9aa0a6');disc(cx,cy,1,'#e0e0e0');const m=[[-1,-R+1,2,1],[R-2,-1,1,2],[-1,R-2,2,1],[-R+1,-1,1,2]][(f||0)%4];r(cx+m[0],cy+m[1],m[2],m[3],'#3a3a3a');}
function carS(x,gy,col,f){const d=shade(col,.72),li=shade(col,1.25);
 for(let t=0;t<=6;t++){const y=gy-18+t,lx=x+10-t,rx=x+26+t;r(lx-1,y,rx-lx+2,1,OL);r(lx,y,rx-lx,1,col);}r(x+9,gy-19,18,1,OL);
 for(let t=0;t<5;t++){const y=gy-17+t;r(x+10-t,y,8+t,1,'#9fd3ef');r(x+20,y,6+t,1,'#9fd3ef');}r(x+11,gy-16,2,1,'#e8f6ff');r(x+21,gy-16,2,1,'#e8f6ff');
 box(x,gy-11,38,7,col);r(x,gy-11,38,1,li);r(x,gy-6,38,2,d);r(x+19,gy-11,1,6,d);r(x+22,gy-10,2,1,'#e0e0e0');r(x+12,gy-10,2,1,'#e0e0e0');
 r(x+36,gy-10,2,2,'#fff6b0');r(x,gy-10,2,2,'#e0201a');r(x+27,gy-13,2,2,col);r(x+30,gy-6,6,1,'#ffffff');
 [x+8,x+30].forEach(cx=>{disc(cx,gy-4,5,OL);wheelS(cx,gy-4,4,f);});}
function autoS(x,gy,f){const G='#2e8b3e',Y='#f2c230',b=f%2;const by=gy-b;
 box(x+3,by-9,27,3,'#1a1a1a');box(x+13,by-20,17,11,G);r(x+13,by-20,17,1,'#4fb35e');r(x+15,by-18,10,7,'#1c3a22');r(x+19,by-17,3,3,'#c98d5c');r(x+19,by-18,3,1,'#2a1a10');r(x+18,by-14,5,3,'#d05a8a');
 r(x+29,by-15,2,6,'#1f6a2d');r(x+27,by-11,3,2,'#f4f0e6');
 box(x+7,by-27,24,5,Y);r(x+7,by-27,24,1,'#ffe27a');r(x+7,by-23,24,1,'#c99a18');r(x+6,by-25,1,3,Y);r(x+12,by-22,1,3,'#1a1a1a');r(x+29,by-22,1,2,'#1a1a1a');
 box(x+2,by-18,6,10,G);r(x+2,by-18,6,1,'#4fb35e');r(x,by-15,2,2,'#fff6b0');r(x+3,by-11,4,2,'#f4f0e6');r(x+7,by-22,2,6,'#bfe3f5');
 r(x+9,by-20,4,4,'#c98d5c');r(x+9,by-21,4,1,'#2a1a10');r(x+9,by-16,4,6,'#9a8f6a');r(x+6,by-15,3,1,'#111');
 wheelS(x+4,gy-3,3,f);wheelS(x+24,gy-4,4,f);arc(x+24,gy-4,5,1,190,350,'#1a1a1a');}
function cowS(x,gy,o){const R=(lx,ly,w,h,c)=>r(x+lx,gy-20+ly,w,h,c),cr='#f2efe6',hy=o.graze?6:0;
 const tt=o.tail?[0,11]:[1,12];R(2,6,1,6,'#d8d2c2');R(o.tail?1:2,11,1,1,'#d8d2c2');R(tt[0],tt[1],2,2,'#3a2a20');
 (o.legs||[5,9,17,20]).forEach((lx,i)=>{R(lx-1,13,4,7,OL);R(lx,13,2,6,i%2?shade(cr,.9):cr);R(lx,19,2,1,'#3a2a20');});
 R(3,5,20,10,OL);R(4,6,18,8,cr);R(4,12,18,2,'#d8d2c2');R(17,3,6,4,OL);R(18,4,4,3,cr);R(7,7,4,3,'#8a5a3a');R(12,9,3,2,'#8a5a3a');R(8,7,2,1,'#a8764a');
 R(21,5+hy/2,4,6,OL);R(22,6+hy/2,3,5,cr);R(22,10+hy/2,3,2,'#e6e0d0');
 R(24,4+hy,6,7,OL);R(25,5+hy,4,5,cr);R(27,8+hy,3,3,'#e7a9a0');R(29,9+hy,1,1,'#7a3a30');R(26,6+hy,1,o.blink?0:1,'#111');if(o.chew)R(28,10+hy,2,1,'#4f9a4a');
 R(25,2+hy,1,2,'#e0782a');R(24,1+hy,1,1,'#e0782a');R(28,2+hy,1,2,'#e0782a');R(29,1+hy,1,1,'#e0782a');R(23,6+hy,2,1,'#d8d2c2');
 R(22,10,3,1,'#d8322a');R(23,11,1,2,'#ffd35a');}
function dogS(x,gy,o){const R=(lx,ly,w,h,c)=>r(x+lx,gy-12+ly,w,h,c),c='#b07a3c',b=o.bob||0;
 R(1,2+b,1,3,c);R(o.wag?1:0,1+b,1,1,c);
 (o.legs||[[3,0],[5,0],[9,0],[11,0]]).forEach(([lx,s])=>{R(lx,8,1,2,'#7a4a20');R(lx+s,10,1,2,'#7a4a20');});
 R(2,4+b,10,5,OL);R(3,5+b,8,3,c);R(4,7+b,6,1,'#d9a86a');R(10,1+b,6,5,OL);R(11,2+b,4,3,c);R(14,3+b,2,2,'#d9a86a');
 if(o.bark){R(14,5+b,2,1,'#7a1f16');R(15,4+b,1,1,'#ffffff');R(17,1,1,1,'#ffffff');R(18,3,2,1,'#ffffff');R(17,5,1,1,'#ffffff');}else R(14,5+b,2,1,'#8a5a2a');
 R(11,0+b,2,2,'#7a4a20');R(13,2+b,1,1,'#111');}
function knee(hx,hy,fx,fy,a,b){const dx=fx-hx,dy=fy-hy,d=Math.min(Math.hypot(dx,dy),a+b-.01),ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);const p=(a*a-b*b+d*d)/(2*d),h=Math.sqrt(Math.max(0,a*a-p*p));return[Math.round(hx+ux*p+uy*h*-1*-1),Math.round(hy+uy*p-ux*h)];}
function boyS(ox,gy,ph,arm){
 const wh=(cx,cy)=>{ring(cx,cy,7,2,'#1b1b1b');ring(cx,cy,5,1,'#c8ccd0');for(let a=0;a<4;a++){const t=a*Math.PI/4+ph/2;L(cx-Math.round(Math.cos(t)*4),cy-Math.round(Math.sin(t)*4),cx+Math.round(Math.cos(t)*4),cy+Math.round(Math.sin(t)*4),'#9aa0a6');}r(cx,cy,1,1,'#e0e0e0');};
 wh(ox,gy-7);wh(ox+23,gy-7);arc(ox,gy-7,9,1,190,300,'#d8322a');arc(ox+23,gy-7,9,1,200,340,'#d8322a');
 const Bx=ox+10,By=gy-6,Hx=ox+8,Hy=gy-22,cr=3;
 const f2=[Math.round(Bx+Math.cos(ph+Math.PI)*cr),Math.round(By+Math.sin(ph+Math.PI)*cr)],k2=knee(Hx,Hy,f2[0],f2[1],9,10);
 Lo(Hx,Hy,k2[0],k2[1],'#28334d',1);Lo(k2[0],k2[1],f2[0],f2[1],'#a8703f',1);r(f2[0]-1,f2[1]-1,4,2,'#8a2020');
 const B=[Bx,By],R=[ox,gy-7],S=[ox+7,gy-18],HT=[ox+19,gy-18],HB=[ox+20,gy-14],Fh=[ox+23,gy-7];
 const seg=[[R,B],[B,S],[R,S],[[ox+8,gy-16],HT],[B,HB],[HT,Fh]];seg.forEach(([a,b])=>L(a[0],a[1],b[0],b[1],OL,3));seg.forEach(([a,b])=>L(a[0],a[1],b[0],b[1],'#d8322a',1));
 ring(Bx,By,2,1,'#5a5a5a');L(ox,gy-8,ox+10,gy-8,'#444');
 r(ox-6,gy-15,10,1,'#c8ccd0');L(ox-4,gy-14,ox-1,gy-8,'#9aa0a6');box(ox-6,gy-19,9,3,'#f3f1e6');r(ox-2,gy-19,1,3,'#b0322a');r(ox-7,gy-15,1,2,'#e0201a');
 r(ox+7,gy-19,1,2,'#c8ccd0');box(ox+4,gy-21,6,1,'#2a2a2a');L(ox+19,gy-18,ox+18,gy-22,'#c8ccd0');box(ox+15,gy-23,4,1,'#1a1a1a');
 box(ox+21,gy-20,7,5,'#a6763a','#5a3a1a');for(let i=0;i<7;i+=2)r(ox+21+i,gy-19,1,4,'#7e5626');r(ox+22,gy-23,2,3,'#f3f1e6');r(ox+25,gy-24,2,4,'#eceadd');
 for(let y=gy-32;y<=gy-22;y++){const lx=ox+5+Math.round((gy-22-y)*.35);r(lx-1,y,8,1,OL);r(lx,y,6,1,'#f39c2b');r(lx,y,1,1,'#c9731a');}r(ox+8,gy-33,7,1,OL);
 box(ox+3,gy-27,5,5,'#7a5230');r(ox+3,gy-27,5,2,'#8f6238');r(ox+5,gy-25,1,1,'#ffd35a');r(ox+4,gy-29,2,2,'#f3f1e6');L(ox+5,gy-28,ox+11,gy-32,'#5a3a1a');
 const f1=[Math.round(Bx+Math.cos(ph)*cr),Math.round(By+Math.sin(ph)*cr)],k1=knee(Hx,Hy,f1[0],f1[1],9,10);
 Lo(Hx,Hy,k1[0],k1[1],'#3b4a6b',2);Lo(k1[0],k1[1],f1[0],f1[1]-1,'#f1c18e',1);box(f1[0]-1,f1[1]-2,4,2,'#e23b3b');r(f1[0]-1,f1[1],4,1,'#f4f4f4');
 r(ox+11,gy-34,3,1,'#d4945f');box(ox+9,gy-41,8,7,'#f1c18e');r(ox+9,gy-40,3,5,'#2a1a10');r(ox+11,gy-38,2,2,'#e0a878');
 box(ox+9,gy-44,8,3,'#2d6fd1','#1a2b55');r(ox+10,gy-44,5,1,'#5f9af5');r(ox+17,gy-42,3,1,'#1d4a99');r(ox+13,gy-43,1,1,'#ffd35a');
 r(ox+14,gy-40,2,1,'#2a1a10');r(ox+15,gy-39,1,2,'#111');r(ox+14,gy-36,3,1,'#7a1f16');r(ox+15,gy-36,1,1,'#fff');r(ox+13,gy-37,1,1,'#f08a7a');
 r(ox+11,gy-32,3,2,'#f39c2b');Lo(ox+12,gy-30,ox+16,gy-24,'#f1c18e',1);
 r(ox+7,gy-33,3,2,'#f39c2b');
 if(arm=='ride'){Lo(ox+8,gy-31,ox+15,gy-25,'#f1c18e',1);}
 if(arm=='windup'){Lo(ox+8,gy-31,ox+3,gy-33,'#f1c18e',1);Lo(ox+3,gy-33,ox,gy-38,'#f1c18e',1);box(ox-3,gy-41,7,2,'#f3f1e6');r(ox,gy-41,1,2,'#b0322a');}
 if(arm=='raise'){Lo(ox+8,gy-31,ox+4,gy-36,'#f1c18e',1);Lo(ox+4,gy-36,ox+3,gy-42,'#f1c18e',1);box(ox+2,gy-44,2,2,'#f1c18e');box(ox-1,gy-47,7,2,'#f3f1e6');r(ox+2,gy-47,1,2,'#b0322a');}
 if(arm=='release'){Lo(ox+8,gy-31,ox+6,gy-39,'#f1c18e',1);Lo(ox+6,gy-39,ox+9,gy-44,'#f1c18e',1);box(ox+9,gy-45,2,2,'#f1c18e');box(ox+11,gy-48,6,2,'#f3f1e6');r(ox+14,gy-48,1,2,'#b0322a');}
 if(arm=='follow'){Lo(ox+8,gy-31,ox+14,gy-33,'#f1c18e',1);Lo(ox+14,gy-33,ox+19,gy-32,'#f1c18e',1);box(ox+19,gy-33,2,2,'#f1c18e');}}
const M={};function S(anim,name,w,h,fn){save(name,w,h,fn);(M[anim]=M[anim]||{w,h,frames:[]}).frames.push(name);}
for(let i=0;i<4;i++)S('boy_ride','boy_ride_'+i,40,51,()=>boyS(9,50,i*Math.PI/2,'ride'));
['windup','raise','release','follow'].forEach((a,i)=>S('boy_throw','boy_throw_'+i,40,51,()=>boyS(9,50,i*Math.PI/2,a)));
[[5,2],[4,2],[2,5],[4,4]].forEach(([w,h],i)=>S('newspaper_spin','newspaper_spin_'+i,9,9,()=>{if(i<2||i==2){box(4-Math.floor(w/2),4-Math.floor(h/2),w,h,'#f3f1e6');if(i==2)r(3,4,2,1,'#b0322a');else r(4,3,1,2,'#b0322a');}if(i==1){r(0,0,9,9,'#000000');buf.fill(0);[[1,6],[2,5],[3,4],[4,3],[5,2]].forEach(([a,b])=>{r(a-1,b,3,3,OL);});[[1,6],[2,5],[3,4],[4,3],[5,2]].forEach(([a,b])=>r(a,b+1,2,1,'#f3f1e6'));r(3,5,2,1,'#b0322a');}if(i==3){buf.fill(0);[[1,2],[2,3],[3,4],[4,5],[5,6]].forEach(([a,b])=>r(a-1,b-1,3,3,OL));[[1,2],[2,3],[3,4],[4,5],[5,6]].forEach(([a,b])=>r(a,b,2,1,'#f3f1e6'));r(3,4,2,1,'#b0322a');}}));
S('newspaper_doorstep','newspaper_doorstep',7,4,()=>{box(1,1,5,2,'#f3f1e6');r(3,1,1,2,'#b0322a');});
S('cow_idle','cow_idle_0',31,21,()=>cowS(0,21,{}));S('cow_idle','cow_idle_1',31,21,()=>cowS(0,21,{tail:1,blink:1}));
S('cow_walk','cow_walk_0',31,21,()=>cowS(0,21,{legs:[4,10,16,21]}));S('cow_walk','cow_walk_1',31,21,()=>cowS(0,21,{legs:[6,8,18,19],tail:1}));
S('cow_graze','cow_graze_0',31,21,()=>cowS(0,21,{graze:1}));S('cow_graze','cow_graze_1',31,21,()=>cowS(0,21,{graze:1,chew:1,tail:1}));
S('dog_idle','dog_idle_0',21,13,()=>dogS(0,13,{}));S('dog_idle','dog_idle_1',21,13,()=>dogS(0,13,{wag:1}));
S('dog_bark','dog_bark_0',21,13,()=>dogS(0,13,{}));S('dog_bark','dog_bark_1',21,13,()=>dogS(0,13,{bark:1,bob:-1}));
S('dog_run','dog_run_0',21,13,()=>dogS(0,13,{legs:[[2,-1],[4,-1],[10,1],[12,1]],wag:1}));S('dog_run','dog_run_1',21,13,()=>dogS(0,13,{legs:[[4,1],[6,1],[8,-1],[10,-1]],bob:-1}));
[['red','#d8322a'],['blue','#2d6fd1'],['white','#e9e9e9'],['orange','#f39c2b'],['black','#3a3a44'],['silver','#b9bec3']].forEach(([n,c])=>{for(let f=0;f<4;f++)S('car_'+n,'car_'+n+'_'+f,40,22,()=>carS(1,21,c,f));});
for(let f=0;f<4;f++)S('auto_rickshaw','auto_rickshaw_'+f,34,30,()=>autoS(2,29,f));
['WOOF!','WOOF WOOF','PEEP PEEP','HONK!','MOO'].forEach(s=>{const n='bubble_'+s.toLowerCase().replace(/[^a-z]+/g,'_').replace(/_$/,'');S(n,n,tw(s)+6,13,()=>bubble(1,1,s));});
S('pothole','pothole',22,11,()=>{const cx=11,cy=5,rx=7;ell(cx,cy,rx+1,4,'#8a8986');ell(cx,cy,rx,3,'#2f2e2c');ell(cx,cy+1,rx-2,2,'#4f7590');r(cx-2,cy,3,1,'#9cc3dd');L(cx+rx+1,cy,cx+rx+3,cy-2,'#4a4947');L(cx-rx-1,cy+1,cx-rx-3,cy+3,'#4a4947');});
fs.writeFileSync(__dirname+'/sprites/manifest.json',JSON.stringify(M,null,1));
`);
