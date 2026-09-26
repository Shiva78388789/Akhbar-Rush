const fs=require('fs');
let src=fs.readFileSync(__dirname+'/level.js','utf8').replace('const W=960,H=160,','let W=960,H=160;const ').split('\n').filter(l=>!l.startsWith("png('")).join('\n');
const sp=fs.readFileSync(__dirname+'/sprites.js','utf8');
const saveSrc=sp.slice(sp.indexOf('function save'),sp.indexOf('function wheelS')).replace("out+'/'+name+'.png'","require('path').join(__dirname,'../../assets/'+name+'.png')");
eval(src+saveSrc+`
fs.mkdirSync(__dirname+'/cities',{recursive:true});
Object.assign(F,{G:["011","100","101","101","011"],J:["001","001","001","101","010"],Q:["010","101","101","110","011"],U:["101","101","101","101","111"],V:["101","101","101","101","010"],X:["101","101","010","101","101"],Y:["101","101","010","010","010"],Z:["111","001","010","100","111"],".":["0","0","0","0","1"],"-":["00","00","11","00","00"]});
const HZ='#b7d4de',HZ2='#a6c6d3',HW='#d2e5eb';
function sky(sunX){['#5fb3e3','#6bbbe7','#78c3ea','#86cbed','#94d3f0'].forEach((c,i)=>r(0,i*10,W,10,c));r(0,50,W,50,'#a2d9f2');
 disc(sunX,18,9,'#ffe27a');disc(sunX,18,6,'#fff3b8');
 [[40,12],[250,8],[430,16],[600,10],[760,20],[880,6]].forEach(([cx,cy])=>{r(cx,cy,26,4,'#fff');r(cx+5,cy-3,14,3,'#fff');r(cx+2,cy+4,22,1,'#dcefff');});}
function towers(list,c1,c2){list.forEach(([tx,th,w],i)=>{const c=i%3==0?(c2||HZ2):(c1||HZ);r(tx,GY-th,w,th,c);for(let j=GY-th+3;j<GY-4;j+=4)for(let q=tx+2;q<tx+w-2;q+=4)r(q,j,2,2,HW);});}
function road(){r(0,GY,W,6,'#cfc7b3');for(let i=0;i<W;i+=8)r(i,GY,1,6,'#b8af99');r(0,GY,W,1,'#e2dccb');
 for(let i=0;i<W;i+=8)r(i,GY+6,8,3,(i/8)%2?'#f2c230':'#1e1e1e');r(0,GY+9,W,1,'#3a3a38');
 r(0,GY+10,W,H-GY-10,'#6f6e6c');r(0,GY+10,W,2,'#5c5b59');r(0,H-2,W,2,'#5c5b59');
 for(let i=0;i<260;i++)r((i*37+i*i)%W,GY+12+(i*13)%46,1,1,i%3?'#7c7b78':'#62615f');
 [[60,110,26,5],[300,140,30,6],[640,113,22,4],[780,145,28,5]].forEach(([a,b,w,h])=>{r(a,b,w,h,'#5e5d5b');r(a,b,w,1,'#555452');});
 for(let i=6;i<W;i+=26)r(i,UY+3,14,2,'#f4f0e6');
 [].forEach(([cx,cy,rx])=>{ell(cx,cy,rx+1,4,'#8a8986');ell(cx,cy,rx,3,'#2f2e2c');ell(cx,cy+1,rx-2,2,'#4f7590');r(cx-2,cy,3,1,'#9cc3dd');});}
function metro(y,body,stripe,trainX,cars,pier){const P=pier||'#bdb6a6';r(0,y-2,W,2,shade(P,1.1));r(0,y,W,5,P);r(0,y+5,W,2,shade(P,.75));
 for(let px=40;px<W;px+=130){r(px-3,y+7,12,3,shade(P,.9));box(px,y+10,6,GY-y-10,P);r(px,y+10,2,GY-y-10,shade(P,1.1));}
 for(let k=0;k<cars;k++){const x=trainX+k*46;box(x,y-13,44,11,body);r(x,y-13,44,1,shade(body,1.15));r(x,y-6,44,2,stripe);for(let i=4;i<40;i+=6)r(x+i,y-11,4,4,'#2a3a50');r(x+21,y-11,3,8,shade(body,.8));r(x+6,y-2,3,2,'#333');r(x+35,y-2,3,2,'#333');}
 const hx=trainX+cars*46-2;r(hx,y-11,2,8,body);r(hx+2,y-9,1,5,body);r(hx,y-9,2,2,'#fff6b0');}
function park(x,w){r(x,GY-6,w,6,'#6fae5a');for(let i=x;i<x+w;i+=3)r(i,GY-7,1,1,'#8ad07a');r(x,GY-8,w,2,'#b5452f');for(let i=x;i<x+w;i+=6)r(i,GY-12,1,4,'#3c3c46');r(x,GY-12,w,1,'#3c3c46');}
function hanuman(cx){const O='#e8742a',Os='#c85a1a',Y='#f2c230',Gd='#ffd35a';
 box(cx-16,GY-22,32,22,'#d6c8a8');r(cx-16,GY-22,32,2,'#efe4c8');for(let i=cx-14;i<cx+14;i+=4)r(i,GY-16,2,10,'#bfae8a');
 r(cx+6,GY-74,3,6,O);L(cx+8,GY-70,cx+16,GY-66,O,2);L(cx+16,GY-66,cx+18,GY-78,O,2);L(cx+18,GY-78,cx+14,GY-84,O,2);
 box(cx-9,GY-48,7,26,O);box(cx+2,GY-48,7,26,O);r(cx-9,GY-48,2,26,Os);r(cx+2,GY-48,2,26,Os);
 box(cx-11,GY-58,22,11,Y);for(let i=cx-10;i<cx+10;i+=3)r(i,GY-52,1,5,'#c99a18');r(cx-11,GY-58,22,1,Gd);
 box(cx-10,GY-78,20,20,O);r(cx-10,GY-78,3,20,Os);r(cx-5,GY-70,4,1,Os);r(cx+1,GY-70,4,1,Os);r(cx-1,GY-68,2,8,Os);
 for(let i=cx-7;i<cx+8;i+=3)r(i,GY-76,2,2,Gd);r(cx-8,GY-74,16,1,Gd);
 box(cx-16,GY-76,5,18,O);r(cx-16,GY-60,5,3,Os);r(cx-19,GY-86,2,30,'#b8860b');disc(cx-18,GY-88,5,Gd);disc(cx-18,GY-88,3,'#e0a020');r(cx-20,GY-91,2,2,'#fff3b8');
 box(cx+11,GY-76,5,10,O);box(cx+11,GY-88,5,12,O);r(cx+11,GY-88,5,1,shade(O,1.2));
 box(cx-6,GY-90,12,12,O);r(cx-4,GY-86,2,2,'#fff');r(cx+2,GY-86,2,2,'#fff');r(cx-3,GY-86,1,1,'#241610');r(cx+3,GY-86,1,1,'#241610');r(cx-3,GY-82,6,2,Os);r(cx-2,GY-81,4,1,'#8a3010');
 box(cx-6,GY-96,12,6,Gd);r(cx-5,GY-95,10,1,'#fff3b8');r(cx-1,GY-99,2,3,Gd);for(let i=cx-5;i<cx+6;i+=3)r(i,GY-93,1,2,'#d8322a');}
function indiaGate(cx){const c='#d8b98a',s='#bfa070',sk='#a2d9f2';box(cx-18,GY-56,36,56,c);r(cx-18,GY-56,3,56,s);box(cx-7,GY-40,14,40,sk,s);disc(cx,GY-40,7,sk);r(cx-7,GY-40,14,1,sk);
 box(cx-21,GY-60,42,4,c);r(cx-20,GY-58,40,1,s);box(cx-14,GY-66,28,6,c);box(cx-8,GY-71,16,5,c);ell(cx,GY-73,5,3,c);r(cx-12,GY-54,24,2,s);text('INDIA',cx-9,GY-53,'#8a6a40');}
function gateway(cx){const c='#d9bc7a',s='#b89a58',sk='#a2d9f2';box(cx-26,GY-58,52,58,c);r(cx-26,GY-58,3,58,s);box(cx-10,GY-42,20,42,sk,s);disc(cx,GY-42,10,sk);
 [cx-26,cx-14,cx+9,cx+21].forEach(tx=>{box(tx,GY-72,5,14,c);ell(tx+2,GY-73,3,3,c);r(tx+2,GY-78,1,3,s);});
 for(let i=cx-22;i<cx+22;i+=4){r(i,GY-52,2,2,s);}r(cx-24,GY-60,48,2,s);for(let i=cx-20;i<cx+20;i+=5)r(i,GY-64,3,4,c);r(cx-20,GY-18,6,18,s);r(cx+14,GY-18,6,18,s);}
function seaLink(cx){const c='#9fb6c2';r(cx-160,GY-40,320,40,'#6ea6c4');for(let i=cx-158;i<cx+158;i+=7)r(i,GY-36+(i%3),4,1,'#a6d0e4');
 r(cx-160,GY-34,320,3,c);L(cx-8,GY-34,cx,GY-96,c,2);L(cx+8,GY-34,cx,GY-96,c,2);r(cx-2,GY-60,5,2,c);
 for(let i=1;i<=9;i++){L(cx,GY-92+i*4,cx-i*14,GY-34,'#c8d8e0');L(cx,GY-92+i*4,cx+i*14,GY-34,'#c8d8e0');}}
function wada(x,w){const c='#b58a5a',s='#946a3e';box(x,GY-40,w,40,c);for(let i=0;i<w;i+=8){r(x+i,GY-44,5,4,c);}for(let j=GY-36;j<GY;j+=6)r(x,j,w,1,s);
 [x-4,x+w-14].forEach(bx=>{box(bx,GY-52,18,52,c);for(let i=0;i<18;i+=6)r(bx+i,GY-56,4,4,c);r(bx+2,GY-52,2,52,s);});
 const cx=x+Math.floor(w/2);box(cx-16,GY-66,32,66,c);for(let i=0;i<32;i+=6)r(cx-16+i,GY-70,4,4,c);box(cx-9,GY-44,18,44,'#6b4a2b');disc(cx,GY-44,9,'#6b4a2b');r(cx-9,GY-44,18,1,'#6b4a2b');
 for(let j=GY-40;j<GY;j+=6)for(let i=cx-7;i<cx+8;i+=5)r(i,j,1,1,'#c8ccd0');r(cx,GY-50,1,50,'#4a3020');r(cx-12,GY-62,24,3,'#ffd35a');}
function hill(cx,top){for(let y=top;y<GY;y++){const hw=Math.round((y-top)*2.2+4);r(cx-hw,y,hw*2,1,y<top+6?'#8aa878':'#9fb88c');}box(cx-4,top-10,8,8,'#e8e2d6');r(cx-1,top-14,2,4,'#ffd35a');r(cx-6,top-3,12,1,'#bfae8a');}
function soudha(cx){const c='#e8e2d6',s='#c9c1b0';box(cx-70,GY-42,140,42,c);r(cx-70,GY-42,140,3,s);for(let i=cx-66;i<cx+66;i+=6)r(i,GY-38,2,30,s);
 box(cx-24,GY-54,48,12,c);for(let i=cx-22;i<cx+22;i+=5)r(i,GY-52,2,10,s);r(cx-26,GY-56,52,2,s);box(cx-10,GY-66,20,10,c);ell(cx,GY-68,12,9,c);r(cx-12,GY-68,24,1,s);r(cx,GY-80,1,5,s);disc(cx,GY-81,1,'#e0a020');
 [cx-66,cx+56].forEach(tx=>{box(tx,GY-52,10,10,c);ell(tx+5,GY-53,5,4,c);});}
function glass(tx,th,w,c1,c2){box(tx,GY-th,w,th,c1);for(let j=GY-th+2;j<GY;j+=4)r(tx,j,w,1,c2);r(tx+w-3,GY-th,3,th,shade(c1,.8));for(let j=GY-th+4;j<GY-th+th/2;j+=9)r(tx+2,j,3,2,'#e8f6ff');}
function crane(x,top){L(x,GY,x,top,'#e0a020',2);for(let y=top;y<GY;y+=6)L(x-2,y,x+2,y+6,'#e0a020');r(x-20,top,56,2,'#e0a020');L(x,top-8,x-20,top,'#e0a020');L(x,top-8,x+34,top,'#e0a020');r(x+26,top+2,1,14,'#555');r(x+24,top+16,5,3,'#555');box(x-18,top+2,6,4,'#777');}
function flyway(y){r(0,y,W,4,'#a8a296');r(0,y+4,W,2,'#8f897c');r(0,y-2,W,2,'#d6d0c2');for(let px=90;px<W;px+=150){box(px,y+6,8,GY-y-6,'#a8a296');r(px-4,y+6,16,3,'#8f897c');}
 [[60,'#d8322a'],[210,'#e9e9e9'],[380,'#2d6fd1'],[520,'#3a3a44'],[700,'#f39c2b'],[850,'#e9e9e9']].forEach(([x,c])=>{r(x,y-6,14,4,c);r(x+3,y-8,7,2,c);r(x+4,y-7,5,1,'#9fd3ef');r(x+2,y-2,2,1,'#111');r(x+10,y-2,2,1,'#111');});}
function chawl(x,w,h,c,trim){const top=GY-h;tank(x+w-14,top-2);wall(x,top,w,h,c);box(x-1,top-3,w+2,3,trim);
 for(let f=0;f<4;f++){const fy=top+4+f*Math.floor((h-18)/4);r(x-2,fy+12,w+4,2,trim);for(let i=x+3;i<x+w-8;i+=12){box(i,fy+2,8,8,'#5a8fb0');r(i+1,fy+3,2,2,'#bfe3f5');for(let k=i;k<i+8;k+=2)r(k,fy+2,1,8,'#2e3440');}
  L(x+2,fy+11,x+w-2,fy+11,'#666');[['#e05a8a',6],['#3a7fd0',15],['#ffd35a',26],['#4f9a4a',40]].forEach(([cc,dx])=>{if(dx<w-6)r(x+dx,fy+11,3,3,cc);});}
 const gx=x+Math.floor(w/2)-5;box(gx,GY-12,10,12,'#6b4a2b');r(gx+4,GY-12,1,12,'#4a3020');const p={x:gx+2,y:GY-3};papers.push(p);return p;}
function modern(x,w,h,c,glassC,num){const top=GY-h;wall(x,top,w,h,c);box(x-1,top-2,w+2,2,'#3a3a44');
 for(let f=0;f<3;f++){const fy=top+4+f*Math.floor((h-20)/3);r(x+3,fy,w-6,Math.floor((h-20)/3)-4,glassC);r(x+3,fy,w-6,1,'#e8f6ff');r(x+2,fy+Math.floor((h-20)/3)-4,w-4,2,'#9aa0a6');for(let i=x+4;i<x+w-4;i+=3)r(i,fy+Math.floor((h-20)/3)-7,1,3,'#c8ccd0');}
 const gx=x+w-22;box(gx,GY-14,16,14,'#3a3a44');for(let i=gx;i<gx+16;i+=3)r(i,GY-14,2,14,'#6a6a74');box(x+5,GY-12,tw(num)+2,7,'#f4f0e6');text(num,x+6,GY-11,'#2a3550');
 const p={x:gx+6,y:GY-3};papers.push(p);return p;}
function highrise(tx,th,w,c){box(tx,GY-th,w,th,c);for(let j=GY-th+3;j<GY-2;j+=5)for(let q=tx+2;q<tx+w-2;q+=5){r(q,j,3,3,'#8fb8cf');r(q,j+3,3,1,'#c8ccd0');}box(tx+w/2-4|0,GY-th-5,8,5,'#1c1c1c');}
function street(list){list.forEach(it=>{const [t,...a]=it;({house,shop,tree,chawl,modern,park,thela}[t])(...a);});}
const CITIES={
 delhi:()=>{sky(880);towers([[20,30,20],[330,26,16],[600,34,22],[900,28,18]]);indiaGate(610);hanuman(150);
  metro(GY-60,'#dfe3e8','#2d6fd1',420,3,'#c4bdae');
  street([['house',4,58,56,'#e9a6a0','#b5452f','12',{balcony:1,ac:1,plant:1}],['park',64,126],['tree',96],['tree',182],['shop',192,52,46,'#f2e2c4','#8a5e2c','CHOLE','#d8322a','#fff3b8','#d8322a','#f4f0e6','chai'],
  ['house',248,60,60,'#9fd0c7','#3c7a70','14',{mumty:1,ac:1}],['shop',312,56,58,'#f0d27a','#a0782a','KIRANA','#2d6fd1','#ffffff','#2d6fd1','#ffe27a','kirana'],['house',372,62,54,'#c9b6e4','#6a4a9a','16',{balcony:1,plant:1}],
  ['shop',438,54,50,'#f2c9a0','#b5452f','PARATHA','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','dhaba'],['house',496,58,48,'#a9cde8','#3c5874','18',{ac:1}],['park',556,90],['tree',580],['tree',630],
  ['house',650,60,62,'#f2a6c0','#a03a60','20',{mumty:1,plant:1}],['shop',714,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],['house',772,62,58,'#e8b877','#8a5e2c','22',{balcony:1,ac:1}],
  ['shop',838,50,48,'#f2e2c4','#b5452f','SWEETS','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','sweets'],['tree',900],['house',912,48,56,'#b0d8a8','#3f7a3c','24',{plant:1}]]);},
 mumbai:()=>{sky(80);seaLink(505);towers([[30,40,18],[120,48,16],[250,36,20],[420,44,18],[880,50,20]],'#b7cbd6','#a6bccb');gateway(440);
  street([['chawl',4,70,78,'#e9d9b0','#8a5e2c'],['shop',76,58,46,'#f2e2c4','#8a5e2c','VADA PAV','#f39c2b','#7a1f16','#f39c2b','#f4f0e6','chai'],['chawl',138,58,74,'#a9cde8','#3c5874'],
  ['shop',200,52,58,'#f0d27a','#a0782a','KIRANA','#2d6fd1','#ffffff','#2d6fd1','#ffe27a','kirana'],['chawl',256,66,80,'#f2c9a0','#b5452f'],['shop',326,46,44,'#e9ece4','#3c5874','IRANI','#3c5874','#ffffff','#3c5874','#f4f0e6','chai'],
  ['tree',380],['park',392,138],['tree',520],['chawl',530,64,76,'#e9a6a0','#b5452f'],['shop',598,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],
  ['chawl',656,70,84,'#c9b6e4','#6a4a9a'],['shop',730,44,44,'#f2e2c4','#b5452f','PAN','#2eaa4a','#fff3b8','#2eaa4a','#f4f0e6','kirana'],['chawl',778,66,78,'#b0d8a8','#3f7a3c'],['tree',850],['chawl',866,62,74,'#e8b877','#8a5e2c'],['tree',944]]);},
 pune:()=>{sky(860);hill(170,14);hill(760,20);towers([[330,24,16],[560,30,18],[880,26,20]]);wada(410,130);
  street([['house',4,58,52,'#f2c9a0','#b5452f','101',{balcony:1,plant:1}],['shop',66,50,46,'#f2e2c4','#8a5e2c','MISAL','#d8322a','#fff3b8','#d8322a','#f4f0e6','dhaba'],['house',120,60,58,'#9fd0c7','#3c7a70','103',{mumty:1,ac:1}],
  ['shop',184,54,54,'#f0d27a','#a0782a','BAKERY','#8a5e2c','#fff3b8','#8a5e2c','#f4e0b0','sweets'],['house',242,58,50,'#e9a6a0','#b5452f','105',{ac:1}],['tree',308],['park',320,80],['tree',360],['park',400,150],['tree',556],
  ['house',570,60,56,'#c9b6e4','#6a4a9a','107',{balcony:1,plant:1}],['shop',634,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],['house',692,62,60,'#e8b877','#8a5e2c','109',{mumty:1,ac:1}],
  ['shop',758,48,44,'#f2e2c4','#b5452f','CHAI','#d8322a','#fff3b8','#d8322a','#f4f0e6','chai'],['house',810,60,54,'#a9cde8','#3c5874','111',{balcony:1}],['shop',874,52,52,'#f2c9a0','#b5452f','SWEETS','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','sweets'],['tree',940]]);},
 bengaluru:()=>{sky(80);[[640,70,26,'#5a8fb0','#7ab0d0'],[672,86,20,'#4a7f9a','#6aa0c0'],[700,60,24,'#6aa8b8','#8ac8d8'],[120,64,22,'#5a8fb0','#7ab0d0'],[850,74,24,'#4a7f9a','#6aa0c0']].forEach(g=>glass(...g));soudha(390);
  metro(GY-62,'#7a3a8a','#e8e2d6',60,3,'#c4bdae');
  street([['tree',6],['house',16,58,54,'#f2e2c4','#3f7a3c','2',{balcony:1,plant:1}],['shop',80,56,48,'#f2e2c4','#8a5e2c','DARSHINI','#2eaa4a','#fff3b8','#2eaa4a','#f4f0e6','chai'],['tree',146],
  ['house',160,60,58,'#a9cde8','#3c5874','4',{mumty:1,ac:1}],['shop',226,54,54,'#f0d27a','#a0782a','COFFEE','#6b4a2b','#fff3b8','#6b4a2b','#f4e0b0','chai'],['tree',290],['park',300,180],['tree',330],['tree',450],
  ['house',484,60,56,'#e9a6a0','#b5452f','6',{balcony:1}],['tree',552],['shop',566,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],['house',626,62,54,'#c9b6e4','#6a4a9a','8',{ac:1,plant:1}],
  ['tree',696],['shop',708,48,46,'#f2e2c4','#b5452f','IDLI','#e0782a','#fff3b8','#e0782a','#f4f0e6','dhaba'],['house',762,60,60,'#b0d8a8','#3f7a3c','10',{mumty:1}],['tree',830],['shop',844,54,52,'#f2c9a0','#b5452f','BAKERY','#8a5e2c','#fff3b8','#8a5e2c','#f4e0b0','sweets'],['tree',906],['house',918,42,50,'#e8b877','#8a5e2c','12',{}]]);},
 gurugram:()=>{sky(860);[[40,78,26,'#5a8fb0','#7ab0d0'],[70,92,22,'#3f6f8a','#5f8faa'],[300,84,28,'#6aa8b8','#8ac8d8'],[334,96,20,'#4a7f9a','#6aa0c0'],[520,70,26,'#5a8fb0','#7ab0d0'],[560,88,24,'#2f5f7a','#4f7f9a'],[760,80,28,'#6aa8b8','#8ac8d8'],[800,94,22,'#4a7f9a','#6aa0c0']].forEach(g=>glass(...g));
  r(334,GY-102,20,6,'#2f5f7a');r(340,GY-110,8,8,'#2f5f7a');crane(640,20);crane(900,26);metro(GY-58,'#dfe3e8','#e0782a',600,3,'#c4bdae');
  street([['modern',4,60,58,'#e6e6e6','#7ab0d0','A-1'],['shop',68,50,46,'#f2e2c4','#8a5e2c','CAFE','#3a3a44','#ffffff','#3a3a44','#f4f0e6','chai'],['modern',122,62,62,'#d8d0c0','#6aa8b8','A-3'],
  ['shop',188,54,54,'#f0d27a','#a0782a','KIRANA','#2d6fd1','#ffffff','#2d6fd1','#ffe27a','kirana'],['tree',248],['modern',262,60,56,'#cfd8dc','#7ab0d0','A-5'],['shop',326,50,48,'#f2e2c4','#b5452f','MOMOS','#d8322a','#fff3b8','#d8322a','#f4f0e6','dhaba'],
  ['modern',380,64,60,'#e6e6e6','#6aa8b8','A-7'],['tree',450],['modern',462,60,54,'#d8d0c0','#7ab0d0','A-9'],['shop',526,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],['modern',584,62,60,'#cfd8dc','#6aa8b8','A-11'],
  ['shop',650,48,46,'#f2e2c4','#b5452f','CHAI','#d8322a','#fff3b8','#d8322a','#f4f0e6','chai'],['modern',702,62,56,'#e6e6e6','#7ab0d0','A-13'],['tree',770],['modern',782,60,62,'#d8d0c0','#6aa8b8','A-15'],['shop',846,54,52,'#f2c9a0','#b5452f','SWEETS','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','sweets'],['tree',910],['modern',922,38,50,'#cfd8dc','#7ab0d0','A-17']]);},
 noida:()=>{sky(80);[[20,70,26],[52,70,26],[84,70,26],[600,76,24],[630,76,24],[660,76,24],[840,66,26],[872,66,26]].forEach(([x,h,w],i)=>highrise(x,h+12,w,i%2?'#e8d9b0':'#f2e2c4'));
  glass(336,50,56,'#5a8fb0','#7ab0d0');r(336,GY-57,56,7,'#d8322a');text('MALL',356,GY-56,'#ffffff');flyway(GY-68);metro(GY-83,'#e8f4f4','#2ab5b5',180,3,'#c4bdae');
  street([['house',4,58,54,'#f2e2c4','#8a5e2c','B-2',{balcony:1,plant:1}],['shop',66,50,46,'#f2e2c4','#8a5e2c','MOMOS','#d8322a','#fff3b8','#d8322a','#f4f0e6','dhaba'],['house',120,60,58,'#9fd0c7','#3c7a70','B-4',{mumty:1,ac:1}],
  ['shop',184,54,50,'#f0d27a','#a0782a','CHAAT','#e0782a','#fff3b8','#e0782a','#ffe27a','chai'],['house',242,60,56,'#e9a6a0','#b5452f','B-6',{ac:1}],['park',304,138],['tree',312],['tree',428],['shop',444,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical'],['house',502,60,54,'#a9cde8','#3c5874','B-10',{mumty:1}],
  ['tree',570],['house',582,60,62,'#e8b877','#8a5e2c','B-12',{balcony:1,ac:1}],['shop',646,48,46,'#f2e2c4','#b5452f','CHAI','#d8322a','#fff3b8','#d8322a','#f4f0e6','chai'],['house',698,62,56,'#b0d8a8','#3f7a3c','B-14',{plant:1}],
  ['shop',764,54,52,'#f2c9a0','#b5452f','SWEETS','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','sweets'],['tree',826],['house',840,58,58,'#f2a6c0','#a03a60','B-16',{mumty:1,ac:1}],['tree',906],['house',918,42,50,'#9fd0c7','#3c7a70','B-18',{}]]);}
};
const HOUSES={};for(const [name,fn] of Object.entries(CITIES)){save('city_'+name,960,160,()=>{papers.length=0;fn();road();const PX=name=='mumbai'?[66,300,560,740,932]:[112,328,546,740,932];PX.forEach((x,i)=>pole(x,i==2));wires(PX);});HOUSES[name]=papers.map(p=>p.x).sort((a,b)=>a-b);}
fs.writeFileSync(__dirname+'/houses.json',JSON.stringify(HOUSES));console.log('Paste into src/data.js as HOUSES: '+JSON.stringify(HOUSES));
`);
