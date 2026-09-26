const fs=require('fs'),zlib=require('zlib');
const W=960,H=160,GY=96,UY=128,LY=157,OL='#241610';
let buf;
function hx(c){if(c.length==4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)];}
function shade(c,f){const[a,b,d]=hx(c);const q=v=>Math.max(0,Math.min(255,Math.round(v*f))).toString(16).padStart(2,'0');return'#'+q(a)+q(b)+q(d);}
function r(a,b,w,h,c){const[R,G,B]=hx(c);for(let j=Math.max(0,b);j<Math.min(H,b+h);j++)for(let i=Math.max(0,a);i<Math.min(W,a+w);i++){const k=(j*W+i)*4;buf[k]=R;buf[k+1]=G;buf[k+2]=B;buf[k+3]=255;}}
function L(x0,y0,x1,y1,c,t){t=t||1;let dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1,e=dx+dy;const o=Math.floor(t/2);while(true){r(x0-o,y0-o,t,t,c);if(x0==x1&&y0==y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
function Lo(x0,y0,x1,y1,c,t){L(x0,y0,x1,y1,OL,t+2);L(x0,y0,x1,y1,c,t);}
function ring(cx,cy,R,t,c){for(let j=-R-1;j<=R+1;j++)for(let i=-R-1;i<=R+1;i++){const d=Math.hypot(i,j);if(d<=R+0.5&&d>=R-t+0.5)r(cx+i,cy+j,1,1,c);}}
function arc(cx,cy,R,t,a0,a1,c){for(let j=-R-1;j<=R+1;j++)for(let i=-R-1;i<=R+1;i++){const d=Math.hypot(i,j);let a=Math.atan2(j,i)*180/Math.PI;if(a<0)a+=360;if(d<=R+0.5&&d>=R-t+0.5&&a>=a0&&a<=a1)r(cx+i,cy+j,1,1,c);}}
function disc(cx,cy,R,c){for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++)if(Math.hypot(i,j)<=R+0.3)r(cx+i,cy+j,1,1,c);}
function ell(cx,cy,rx,ry,c){for(let j=-ry;j<=ry;j++)for(let i=-rx;i<=rx;i++)if((i*i)/(rx*rx+.5)+(j*j)/(ry*ry+.5)<=1)r(cx+i,cy+j,1,1,c);}
function box(a,b,w,h,c,o){r(a-1,b-1,w+2,h+2,o||OL);r(a,b,w,h,c);}
const F={A:["010","101","111","101","101"],B:["110","101","110","101","110"],C:["011","100","100","100","011"],D:["110","101","101","101","110"],E:["111","100","110","100","111"],F:["111","100","110","100","100"],H:["101","101","111","101","101"],I:["111","010","010","010","111"],K:["101","101","110","101","101"],L:["100","100","100","100","111"],M:["10001","11011","10101","10001","10001"],N:["1001","1101","1011","1001","1001"],O:["010","101","101","101","010"],P:["110","101","110","100","100"],R:["110","101","110","101","101"],S:["011","100","010","001","110"],T:["111","010","010","010","010"],W:["10001","10001","10101","11011","10001"],"!":["1","1","1","0","1"]," ":["0","0","0","0","0"],"0":["111","101","101","101","111"],"1":["01","11","01","01","01"],"2":["110","001","010","100","111"],"3":["110","001","010","001","110"],"4":["101","101","111","001","001"],"5":["111","100","110","001","110"],"6":["011","100","111","101","111"],"7":["111","001","010","010","010"],"8":["111","101","111","101","111"],"9":["111","101","111","001","110"]};
function tw(s){let w=0;for(const ch of s)w+=F[ch][0].length+1;return w-1;}
function text(s,x,y,c){for(const ch of s){const g=F[ch];g.forEach((row,j)=>{[...row].forEach((v,i)=>{if(v=='1')r(x+i,y+j,1,1,c);});});x+=g[0].length+1;}}
const papers=[];

function tank(x,top){box(x,top-10,9,8,'#1c1c1c');r(x+1,top-9,2,6,'#3a3a3a');r(x,top-7,9,1,'#2c2c2c');r(x,top-4,9,1,'#2c2c2c');box(x+3,top-12,3,1,'#1c1c1c');}
function win(x,y,w,h,trim){r(x-2,y-3,w+4,2,trim);r(x-2,y-1,w+4,1,shade(trim,.7));box(x,y,w,h,'#5a8fb0');r(x+1,y+1,2,2,'#bfe3f5');for(let i=1;i<w;i+=2)r(x+i,y,1,h,'#2e3440');r(x,y+Math.floor(h/2),w,1,'#2e3440');}
function wall(x,top,w,h,c){box(x,top,w,h,c);for(let j=4;j<h;j+=6)r(x,top+j,w,1,shade(c,.93));r(x,top,2,h,shade(c,.85));}
function house(x,w,h,c,trim,num,o){o=o||{};const top=GY-h;tank(x+w-14,top-2);
 if(o.mumty){wall(x+4,top-11,15,11,c);r(x+9,top-8,5,8,'#6b4a2b');r(x+3,top-13,17,2,trim);}
 wall(x,top,w,h,c);box(x-1,top-3,w+2,3,trim);for(let i=1;i<w;i+=4)r(x+i,top-3,2,1,shade(trim,1.15));
 const mid=top+Math.floor(h/2)-2;
 r(x-2,mid,w+4,2,trim);r(x-2,mid+2,w+4,1,shade(trim,.7));
 win(x+6,top+7,10,9,trim);win(x+w-17,top+7,10,9,trim);
 if(o.balcony){const bx=x+20,bw=w-40;r(bx-1,mid-9,bw+2,9,shade(c,.8));r(bx+2,mid-9,bw-4,9,'#6b4a2b');r(bx+bw/2-1,mid-9,1,9,'#4a3020');
  r(bx-2,mid-5,bw+4,1,'#3c3c46');for(let i=0;i<bw+3;i+=2)r(bx-2+i,mid-5,1,5,'#3c3c46');
  [[bx,'#d8322a'],[bx+bw-3,'#e0a020']].forEach(([px,pc])=>{r(px,mid-8,3,3,'#4f9a4a');r(px,mid-6,3,1,pc);});
  L(bx,mid-8,bx+bw,mid-8,'#888');r(bx+3,mid-8,3,4,'#e05a8a');r(bx+8,mid-8,3,5,'#3a7fd0');}
 else win(x+Math.floor(w/2)-5,top+7,10,9,trim);
 if(o.ac){box(x+w-9,mid+5,7,5,'#e9e9e9');for(let i=0;i<5;i++)r(x+w-8+i,mid+6,1,3,i%2?'#bbb':'#e9e9e9');}
 win(x+6,mid+6,10,9,trim);
 const gx=x+w-24;
 r(gx+2,GY-15,10,15,'#7a4a2b');r(gx+3,GY-14,8,5,'#8a5a33');r(gx+9,GY-8,1,1,'#ffd35a');
 box(gx,GY-16,14,16,'#3c3c46');r(gx,GY-16,14,16,'#7a4a2b');r(gx+3,GY-14,8,5,'#8a5a33');
 for(let i=0;i<14;i+=2)r(gx+i,GY-16,1,16,'#3c3c46');r(gx,GY-16,14,1,'#3c3c46');r(gx,GY-9,14,1,'#3c3c46');r(gx,GY-2,14,1,'#3c3c46');
 for(let i=0;i<14;i+=2)r(gx+i,GY-18,1,2,'#3c3c46');
 box(gx-4,GY-20,3,20,trim);box(gx+15,GY-20,3,20,trim);r(gx-5,GY-22,5,2,shade(trim,.7));r(gx+14,GY-22,5,2,shade(trim,.7));
 r(gx-4,GY-24,3,2,'#ffe27a');r(gx+15,GY-24,3,2,'#ffe27a');
 box(x+12,GY-12,tw(num)+2,7,'#f4f0e6');text(num,x+13,GY-11,'#2a3550');
 r(gx-2,GY-1,18,1,'#9a958a');
 if(o.plant){r(x+4,GY-5,5,5,'#b5452f');disc(x+6,GY-8,3,'#4f9a4a');r(x+5,GY-10,1,1,'#e05a8a');}
 const p={x:gx+5,y:GY-3};papers.push(p);return p;}
function shop(x,w,h,c,trim,name,sc,tc,a1,a2,type){const top=GY-h;tank(x+4,top-2);wall(x,top,w,h,c);box(x-1,top-3,w+2,3,trim);
 if(h>40){win(x+5,top+7,10,8,trim);win(x+w-15,top+7,10,8,trim);}
 const st=GY-31;box(x+2,st,w-4,8,sc);text(name,x+Math.floor((w-tw(name))/2),st+2,tc);r(x+2,st,w-4,1,shade(sc,1.25));
 const ay=st+9;for(let i=0;i<w;i+=4){const cc=(i/4)%2?a2:a1;r(x+i,ay,Math.min(4,w-i),5,cc);r(x+i+1,ay+5,2,1,cc);}r(x,ay,w,1,shade(a1,.7));r(x-1,ay,1,6,OL);r(x+w,ay,1,6,OL);
 const iy=ay+6;box(x+3,iy,w-6,GY-iy,'#3a2a1f');for(let i=0;i<3;i++)r(x+3,iy+i,w-6,1,i%2?'#8a8a8a':'#a6a6a6');
 const X=x+4,Wd=w-8,b=GY;
 if(type=='chai'||type=='dhaba'){r(X,b-5,Wd,5,'#8a5e2c');r(X,b-5,Wd,1,'#b0804a');box(X+3,b-10,5,4,'#c8ccd0');r(X+8,b-9,2,1,'#c8ccd0');r(X+4,b-11,3,1,'#555');r(X+2,b-6,7,1,'#e05a1a');
  for(let i=0;i<4;i++){r(X+12+i*3,b-8,2,3,'#e8d9b0');r(X+12+i*3,b-7,2,2,'#b86a2a');}
  r(X+4,b-14,1,1,'#fff');r(X+5,b-16,1,1,'#fff');r(X+4,b-18,1,1,'#fff');
  if(type=='dhaba'){disc(X+Wd-6,b-8,3,'#b5452f');r(X+Wd-8,b-11,5,1,'#d06a3a');}
  box(x+w+2,b+1,10,2,'#8a5e2c');r(x+w+3,b+3,1,2,'#5a3a1a');r(x+w+10,b+3,1,2,'#5a3a1a');}
 if(type=='kirana'){r(X,b-11,Wd,1,'#8a5e2c');r(X,b-6,Wd,1,'#8a5e2c');const pc=['#e0201a','#ffd35a','#2d6fd1','#4f9a4a','#f39c2b','#e05a8a'];
  for(let i=0;i<Wd-1;i+=3){r(X+i,b-14,2,3,pc[(i/3)%6]);r(X+i+1,b-9,2,3,pc[(i/3+2)%6]);}
  for(let i=2;i<Wd;i+=5)r(X+i,iy+3,2,4,pc[(i+1)%6]);
  [0,7,Wd-7].forEach(dx=>{box(X+dx+1,b-4,5,4,'#d8c49a');r(X+dx+2,b-5,3,1,'#b8a47a');r(X+dx+2,b-4,3,1,'#f2e6a0');});}
 if(type=='sweets'){r(X,b-13,Wd,1,'#8a5e2c');for(let i=0;i<Wd;i+=4)box(X+i+1,b-16,2,2,'#f4f0e6');
  box(X+1,b-9,Wd-2,9,'#bfe3f5');r(X+1,b-5,Wd-2,1,'#8fb8cf');const sc2=['#f39c2b','#ffe27a','#f4f0e6','#8ad07a','#e05a8a'];
  for(let i=0;i<Wd-3;i+=3){r(X+2+i,b-8,2,2,sc2[(i/3)%5]);r(X+2+i,b-4,2,2,sc2[(i/3+2)%5]);}r(X+2,b-9,Wd-4,1,'#e8f6ff');}
 if(type=='medical'){r(X,b-11,Wd,1,'#8a5e2c');r(X,b-6,Wd,1,'#8a5e2c');for(let i=0;i<Wd-1;i+=3){r(X+i,b-14,2,3,i%2?'#f4f4f4':'#6fa8e8');r(X+i+1,b-9,2,3,i%2?'#f4f4f4':'#e8e8e8');}
  const cx=x+Math.floor(w/2)-4,cy=top+5;box(cx,cy,9,9,'#f4f4f4');r(cx+3,cy+1,3,7,'#2eaa4a');r(cx+1,cy+3,7,3,'#2eaa4a');}
 if(type=='tailor'){r(X,iy+4,Wd,1,'#c8ccd0');const cc=['#e0201a','#2d6fd1','#ffd35a','#e05a8a','#4f9a4a','#f39c2b'];for(let i=1;i<Wd-3;i+=5){r(X+i+1,iy+4,1,1,'#555');box(X+i,iy+5,3,6,cc[(i/5|0)%6]);}
  r(X,b-4,Wd,4,'#8a5e2c');box(X+3,b-8,6,3,'#2a2a2a');r(X+4,b-7,1,1,'#ffd35a');}
}
function tree(x){box(x,GY-22,4,24,'#6b4a2b');r(x+1,GY-20,1,20,'#8a5e3a');box(x-3,GY-6,10,6,'#b5452f');for(let i=0;i<10;i+=3)r(x-3+i,GY-4,2,1,'#f4f0e6');
 [[0,-30,9,'#2f6e2c'],[-7,-26,7,'#3f8a3c'],[8,-27,7,'#3f8a3c'],[2,-36,7,'#4f9a4a'],[-4,-31,6,'#4f9a4a'],[5,-31,6,'#5fb257'],[1,-33,4,'#5fb257']].forEach(([dx,dy,R,c])=>disc(x+2+dx,GY+dy,R,c));
 r(x,GY-38,2,1,'#8ad07a');r(x+6,GY-35,2,1,'#8ad07a');r(x-6,GY-30,2,1,'#8ad07a');}
function thela(x){L(x-6,GY-9,x,GY-7,'#6b4a2b',2);box(x,GY-8,26,3,'#8a5e2c');for(let i=2;i<26;i+=5)r(x+i,GY-8,1,3,'#6b4a2b');
 const vc=['#4f9a4a','#e0201a','#f39c2b','#8ad07a','#7a3a8a','#ffd35a'];for(let i=0;i<24;i+=3){disc(x+2+i,GY-10,1,vc[(i/3)%6]);if(i%6==0)disc(x+3+i,GY-12,1,vc[(i/3+3)%6]);}
 [x+5,x+21].forEach(cx=>{ring(cx,GY+1,3,1,'#2a2a2a');r(cx,GY+1,1,1,'#888');});
 L(x+13,GY-9,x+13,GY-24,'#6b4a2b');for(let i=0;i<9;i++)r(x+13-i*1.6|0,GY-25+Math.floor(i/3),Math.ceil(i*3.2)+1,1,i%2?'#d8322a':'#f4f0e6');}
function pole(x,tangle){box(x,GY-62,3,66,'#7d7d7d');r(x,GY-62,1,66,'#a0a0a0');box(x-7,GY-59,17,2,'#5a5a5a');[x-6,x+1,x+8].forEach(px=>r(px,GY-61,1,2,'#f4f4f4'));
 L(x+3,GY-48,x+11,GY-52,'#5a5a5a',1);box(x+9,GY-53,5,2,'#3a3a3a');r(x+10,GY-51,3,1,'#fff3b8');
 for(let i=0;i<10;i+=3)r(x,GY-40+i,3,1,'#f2c230');
 if(tangle){[[1,-44,4],[3,-42,3],[-1,-40,3],[2,-37,2]].forEach(([dx,dy,R])=>ring(x+dx,GY+dy,R,1,'#1c1c1c'));L(x-3,GY-41,x-5,GY-20,'#1c1c1c');L(x+5,GY-39,x+6,GY-22,'#1c1c1c');box(x+4,GY-34,5,6,'#6a6a6a');}}
function wires(xs){for(let k=0;k<xs.length-1;k++)[[-6,9],[1,11],[8,8]].forEach(([dx,sag])=>{const a=xs[k]+dx,b=xs[k+1]+dx;for(let px=a;px<=b;px++){const t=(px-a)/(b-a);r(px,GY-60+Math.round(Math.sin(Math.PI*t)*sag),1,1,'#262626');}});}
function background(){
 const bands=['#5fb3e3','#6bbbe7','#78c3ea','#86cbed','#94d3f0'];bands.forEach((c,i)=>r(0,i*10,W,10,c));r(0,50,W,50,'#a2d9f2');
 disc(890,18,9,'#ffe27a');disc(890,18,6,'#fff3b8');
 [[40,12],[210,8],[380,16],[560,10],[700,20],[820,6]].forEach(([cx,cy])=>{r(cx,cy,26,4,'#fff');r(cx+5,cy-3,14,3,'#fff');r(cx+2,cy+4,22,1,'#dcefff');});
 [[130,22],[136,20],[610,14],[616,16],[622,13]].forEach(([bx,by])=>{r(bx,by,2,1,'#2a3550');r(bx+2,by+1,1,1,'#2a3550');r(bx+3,by,2,1,'#2a3550');});
 const kx=470,ky=18;for(let j=0;j<7;j++){const hw=j<4?j:6-j;r(kx-hw,ky+j,hw*2+1,1,j<3?'#e0201a':'#ffd35a');}r(kx,ky+7,1,2,'#2a3550');for(let i=0;i<40;i++)r(kx+i,ky+8+Math.round(i*i/40),1,1,'#555');
 const hz='#b7d4de',hz2='#a6c6d3',hw='#d2e5eb';
 [[10,30],[60,44],[150,26],[240,50],[300,34],[420,46],[500,28],[590,52],[660,36],[760,48],[850,30],[900,42]].forEach(([tx,th],i)=>{const w=18+(i*7)%16,c=i%3==0?hz2:hz;r(tx,GY-th-24,w,th+24,c);for(let j=GY-th-20;j<GY-4;j+=4)for(let q=tx+2;q<tx+w-2;q+=4)r(q,j,2,2,hw);if(i%4==1){r(tx+w/2-1|0,GY-th-30,2,6,c);}});
 L(340,40,340,GY,'#9fbfcc',2);L(310,40,380,40,'#9fbfcc',1);L(340,40,318,48,'#9fbfcc');r(376,40,1,10,'#9fbfcc');r(373,50,6,3,'#9fbfcc');
 house(4,62,58,'#e9a6a0','#b5452f','12',{balcony:1,ac:1,plant:1});
 shop(70,44,44,'#f2e2c4','#8a5e2c','CHAI','#d8322a','#fff3b8','#d8322a','#f4f0e6','chai');
 house(122,60,64,'#9fd0c7','#3c7a70','14',{mumty:1,ac:1});
 shop(186,58,60,'#f0d27a','#a0782a','KIRANA','#2d6fd1','#ffffff','#2d6fd1','#ffe27a','kirana');
 tree(252);
 house(266,62,54,'#c9b6e4','#6a4a9a','18',{balcony:1,plant:1});
 shop(334,56,62,'#f2c9a0','#b5452f','SWEETS','#f39c2b','#7a1f16','#e05a8a','#f4f0e6','sweets');
 house(394,58,66,'#a9cde8','#3c5874','20',{mumty:1,ac:1});
 tree(462);
 house(480,62,58,'#e8b877','#8a5e2c','22',{balcony:1,ac:1,plant:1});
 shop(546,54,58,'#e9ece4','#3c7a70','MEDICAL','#2eaa4a','#ffffff','#2eaa4a','#f4f0e6','medical');
 house(606,60,62,'#f2a6c0','#a03a60','24',{mumty:1,plant:1});
 tree(676);
 shop(690,52,56,'#d8e8b0','#6a8a3a','TAILOR','#7a3a8a','#fff3b8','#7a3a8a','#ffe27a','tailor');
 house(754,64,60,'#f0d27a','#a0782a','26',{balcony:1,ac:1});
 house(824,58,54,'#b0d8a8','#3f7a3c','28',{mumty:1,plant:1});
 shop(886,48,48,'#f2e2c4','#b5452f','DHABA','#e0782a','#fff3b8','#e0782a','#ffe27a','dhaba');
 tree(946);
 thela(462-34);
 r(0,GY,W,6,'#cfc7b3');for(let i=0;i<W;i+=8)r(i,GY,1,6,'#b8af99');r(0,GY,W,1,'#e2dccb');
 for(let i=0;i<W;i+=8)r(i,GY+6,8,3,(i/8)%2?'#f2c230':'#1e1e1e');r(0,GY+9,W,1,'#3a3a38');
 r(0,GY+10,W,H-GY-10,'#6f6e6c');r(0,GY+10,W,2,'#5c5b59');r(0,H-2,W,2,'#5c5b59');
 for(let i=0;i<260;i++)r((i*37+i*i)%W,GY+12+(i*13)%46,1,1,i%3?'#7c7b78':'#62615f');
 [[60,110,26,5],[300,140,30,6],[640,113,22,4],[780,145,28,5]].forEach(([a,b,w,h])=>{r(a,b,w,h,'#5e5d5b');r(a,b,w,1,'#555452');});
 for(let i=6;i<W;i+=26)r(i,UY+3,14,2,'#f4f0e6');
 [[122,147,8],[334,146,9],[548,150,7],[750,147,8],[868,149,6],[250,118,6]].forEach(([cx,cy,rx])=>{ell(cx,cy,rx+1,4,'#8a8986');ell(cx,cy,rx,3,'#2f2e2c');ell(cx,cy+1,rx-2,2,'#4f7590');r(cx-2,cy,3,1,'#9cc3dd');L(cx+rx+1,cy,cx+rx+4,cy-2,'#4a4947');L(cx-rx-1,cy+1,cx-rx-4,cy+3,'#4a4947');});
 const PX=[112,328,546,740,932];PX.forEach((x,i)=>pole(x,i==2));wires(PX);
}
function paperRoll(x,y){box(x,y,5,2,'#f3f1e6');r(x+2,y,1,2,'#b0322a');}
function flipper(x,gy,wd,hh,dir){return(lx,ly,w,h,c)=>r(dir>0?x+lx:x+wd-lx-w,gy-hh+ly,w,h,c);}
function cow(x,gy,dir,graze){const R=flipper(x,gy,30,20,dir),cr='#f2efe6',hy=graze?6:0;
 R(2,6,1,7,'#d8d2c2');R(1,12,2,2,'#3a2a20');
 [5,9,17,20].forEach((lx,i)=>{R(lx-1,13,4,7,OL);R(lx,13,2,6,i%2?shade(cr,.9):cr);R(lx,19,2,1,'#3a2a20');});
 R(3,5,20,10,OL);R(4,6,18,8,cr);R(4,12,18,2,'#d8d2c2');R(17,3,6,4,OL);R(18,4,4,3,cr);R(7,7,4,3,'#8a5a3a');R(12,9,3,2,'#8a5a3a');R(8,7,2,1,'#a8764a');
 R(21,5+hy/2,4,6,OL);R(22,6+hy/2,3,5,cr);R(22,10+hy/2,3,2,'#e6e0d0');
 R(24,4+hy,6,7,OL);R(25,5+hy,4,5,cr);R(27,8+hy,3,3,'#e7a9a0');R(29,9+hy,1,1,'#7a3a30');R(26,6+hy,1,1,'#111');
 R(25,2+hy,1,2,'#e0782a');R(24,1+hy,1,1,'#e0782a');R(28,2+hy,1,2,'#e0782a');R(29,1+hy,1,1,'#e0782a');R(23,6+hy,2,1,'#d8d2c2');
 R(22,10,3,1,'#d8322a');R(23,11,1,2,'#ffd35a');}
function dog(x,gy,dir,word){const R=flipper(x,gy,16,12,dir),c='#b07a3c';
 R(1,2,1,3,c);R(0,1,1,1,c);[3,5,9,11].forEach(lx=>R(lx,8,1,4,'#7a4a20'));
 R(2,4,10,5,OL);R(3,5,8,3,c);R(4,7,6,1,'#d9a86a');R(10,1,6,5,OL);R(11,2,4,3,c);R(14,3,2,2,'#d9a86a');R(14,5,2,1,'#7a1f16');R(15,4,1,1,'#ffffff');R(11,0,2,2,'#7a4a20');R(13,2,1,1,'#111');
 R(17,1,1,1,'#fff');R(18,3,2,1,'#fff');R(17,5,1,1,'#fff');
 if(word){const bx=dir>0?x+12:x-tw(word)-2,by=gy-24;bubble(bx,by,word);}}
function bubble(x,y,s){const w=tw(s)+4;box(x,y,w,9,'#ffffff');text(s,x+2,y+2,'#b0322a');r(x+3,y+9,3,1,OL);r(x+4,y+9,1,1,'#fff');r(x+4,y+10,1,1,OL);}
function wheelS(cx,cy,R){disc(cx,cy,R,'#1b1b1b');disc(cx,cy,R-2,'#9aa0a6');disc(cx,cy,1,'#e0e0e0');r(cx-1,cy-R+1,2,1,'#3a3a3a');}
function car(x,gy,col){const d=shade(col,.72),li=shade(col,1.25);
 for(let t=0;t<=6;t++){const y=gy-18+t,lx=x+10-t,rx=x+26+t;r(lx-1,y,rx-lx+2,1,OL);r(lx,y,rx-lx,1,col);}r(x+9,gy-19,18,1,OL);
 for(let t=0;t<5;t++){const y=gy-17+t;r(x+10-t,y,8+t,1,'#9fd3ef');r(x+20,y,6+t,1,'#9fd3ef');}r(x+11,gy-16,2,1,'#e8f6ff');r(x+21,gy-16,2,1,'#e8f6ff');
 box(x,gy-11,38,7,col);r(x,gy-11,38,1,li);r(x,gy-6,38,2,d);r(x+19,gy-11,1,6,d);r(x+22,gy-10,2,1,'#e0e0e0');r(x+12,gy-10,2,1,'#e0e0e0');
 r(x+36,gy-10,2,2,'#fff6b0');r(x,gy-10,2,2,'#e0201a');r(x+27,gy-13,2,2,col);r(x+30,gy-6,6,1,'#ffffff');
 [x+8,x+30].forEach(cx=>{disc(cx,gy-4,5,OL);wheelS(cx,gy-4,4);});}
function auto(x,gy){const G='#2e8b3e',Y='#f2c230';
 r(x+34,gy-22,6,1,'#fff');r(x+36,gy-16,8,1,'#fff');r(x+34,gy-10,5,1,'#fff');disc(x+32,gy-2,2,'#9a9994');disc(x+36,gy-3,1,'#b0afaa');
 box(x+3,gy-9,27,3,'#1a1a1a');box(x+13,gy-20,17,11,G);r(x+13,gy-20,17,1,'#4fb35e');r(x+15,gy-18,10,7,'#1c3a22');r(x+19,gy-17,3,3,'#c98d5c');r(x+19,gy-18,3,1,'#2a1a10');r(x+18,gy-14,5,3,'#d05a8a');
 r(x+29,gy-15,2,6,'#1f6a2d');r(x+27,gy-11,3,2,'#f4f0e6');
 box(x+7,gy-27,24,5,Y);r(x+7,gy-27,24,1,'#ffe27a');r(x+7,gy-23,24,1,'#c99a18');r(x+6,gy-25,1,3,Y);r(x+12,gy-22,1,3,'#1a1a1a');r(x+29,gy-22,1,2,'#1a1a1a');
 box(x+2,gy-18,6,10,G);r(x+2,gy-18,6,1,'#4fb35e');r(x,gy-15,2,2,'#fff6b0');r(x+3,gy-11,4,2,'#f4f0e6');r(x+7,gy-22,2,6,'#bfe3f5');
 r(x+9,gy-20,4,4,'#c98d5c');r(x+9,gy-21,4,1,'#2a1a10');r(x+9,gy-16,4,6,'#9a8f6a');r(x+6,gy-15,3,1,'#111');
 wheelS(x+4,gy-3,3);wheelS(x+24,gy-4,4);arc(x+24,gy-4,5,1,190,350,'#1a1a1a');}
function boy(ox,gy){
 [[-16,-30,8],[-19,-24,10],[-14,-14,6]].forEach(([dx,dy,w])=>r(ox+dx,gy+dy,w,1,'#ffffff'));disc(ox-10,gy-3,2,'#d7cfbf');disc(ox-14,gy-4,1,'#e4ddce');
 const wh=(cx,cy)=>{ring(cx,cy,7,2,'#1b1b1b');ring(cx,cy,5,1,'#c8ccd0');for(let a=0;a<8;a++){const t=a*Math.PI/4+.3;L(cx,cy,cx+Math.round(Math.cos(t)*4),cy+Math.round(Math.sin(t)*4),'#9aa0a6');}r(cx,cy,1,1,'#e0e0e0');};
 wh(ox,gy-7);wh(ox+23,gy-7);arc(ox,gy-7,9,1,190,300,'#d8322a');arc(ox+23,gy-7,9,1,200,340,'#d8322a');
 Lo(ox+10,gy-17,ox+7,gy-8,'#28334d',1);r(ox+6,gy-8,3,2,'#8a2020');
 const B=[ox+10,gy-6],R=[ox,gy-7],S=[ox+7,gy-18],HT=[ox+19,gy-18],HB=[ox+20,gy-14],Fh=[ox+23,gy-7];
 [[R,B],[B,S],[R,S],[[ox+8,gy-16],HT],[B,HB],[HT,Fh]].forEach(([a,b])=>L(a[0],a[1],b[0],b[1],OL,3));
 [[R,B],[B,S],[R,S],[[ox+8,gy-16],HT],[B,HB],[HT,Fh]].forEach(([a,b])=>L(a[0],a[1],b[0],b[1],'#d8322a',1));
 ring(ox+10,gy-6,2,1,'#5a5a5a');L(ox,gy-8,ox+10,gy-8,'#444');
 r(ox-6,gy-15,10,1,'#c8ccd0');L(ox-4,gy-14,ox-1,gy-8,'#9aa0a6');box(ox-6,gy-19,9,3,'#f3f1e6');r(ox-2,gy-19,1,3,'#b0322a');r(ox-7,gy-15,1,2,'#e0201a');
 r(ox+7,gy-19,1,2,'#c8ccd0');box(ox+4,gy-21,6,1,'#2a2a2a');
 L(ox+19,gy-18,ox+18,gy-22,'#c8ccd0');box(ox+15,gy-23,4,1,'#1a1a1a');
 box(ox+21,gy-20,7,5,'#a6763a','#5a3a1a');for(let i=0;i<7;i+=2)r(ox+21+i,gy-19,1,4,'#7e5626');r(ox+22,gy-23,2,3,'#f3f1e6');r(ox+25,gy-24,2,4,'#eceadd');
 for(let y=gy-32;y<=gy-22;y++){const lx=ox+5+Math.round((gy-22-y)*.35);r(lx-1,y,8,1,OL);r(lx,y,6,1,'#f39c2b');r(lx,y,1,1,'#c9731a');}r(ox+8,gy-33,7,1,OL);
 box(ox+3,gy-27,5,5,'#7a5230');r(ox+3,gy-27,5,2,'#8f6238');r(ox+5,gy-25,1,1,'#ffd35a');r(ox+4,gy-29,2,2,'#f3f1e6');L(ox+5,gy-28,ox+11,gy-32,'#5a3a1a');
 Lo(ox+8,gy-22,ox+14,gy-19,'#3b4a6b',2);Lo(ox+14,gy-19,ox+13,gy-11,'#f1c18e',1);box(ox+12,gy-10,4,2,'#e23b3b');r(ox+12,gy-8,4,1,'#f4f4f4');
 r(ox+11,gy-34,3,1,'#d4945f');box(ox+9,gy-41,8,7,'#f1c18e');r(ox+9,gy-40,3,5,'#2a1a10');r(ox+11,gy-38,2,2,'#e0a878');
 box(ox+9,gy-44,8,3,'#2d6fd1','#1a2b55');r(ox+10,gy-44,5,1,'#5f9af5');r(ox+17,gy-42,3,1,'#1d4a99');r(ox+13,gy-43,1,1,'#ffd35a');
 r(ox+14,gy-40,2,1,'#2a1a10');r(ox+15,gy-39,1,2,'#111');r(ox+14,gy-36,3,1,'#7a1f16');r(ox+15,gy-36,1,1,'#fff');r(ox+13,gy-37,1,1,'#f08a7a');r(ox+18,gy-40,1,2,'#bfe8ff');
 r(ox+11,gy-32,3,2,'#f39c2b');Lo(ox+12,gy-30,ox+16,gy-24,'#f1c18e',1);
 r(ox+7,gy-33,3,2,'#f39c2b');Lo(ox+8,gy-31,ox+4,gy-36,'#f1c18e',1);Lo(ox+4,gy-36,ox+3,gy-42,'#f1c18e',1);box(ox+2,gy-44,2,2,'#f1c18e');box(ox-1,gy-47,7,2,'#f3f1e6');r(ox+2,gy-47,1,2,'#b0322a');
 return[ox+2,gy-47];}
function actors(){
 paperRoll(papers[0].x,papers[0].y);
 [[150,UY],[400,UY],[640,UY],[880,UY]].forEach(([x,g])=>auto(x,g));
 bubble(376,UY-38,'PEEP PEEP');
 const hand=boy(40,LY);
 const tgt=papers[1],p0=hand,p2=[tgt.x,tgt.y],p1=[(p0[0]+p2[0])/2,62];
 for(let t=0.08;t<1;t+=0.07){const u=1-t,px=Math.round(u*u*p0[0]+2*u*t*p1[0]+t*t*p2[0]),py=Math.round(u*u*p0[1]+2*u*t*p1[1]+t*t*p2[1]);if(t<.62)r(px,py,1,1,'#ffffff');else if(t<.7)paperRoll(px-2,py-1);}
 cow(160,LY,-1);dog(214,LY,-1,'WOOF!');car(262,LY,'#d8322a');
 cow(370,LY,1);car(424,LY,'#2d6fd1');dog(504,LY,-1,'WOOF WOOF');
 cow(580,LY,1,1);cow(622,LY,-1);car(676,LY,'#e9e9e9');dog(784,LY,-1,'WOOF!');cow(812,LY,-1,1);car(900,LY,'#f39c2b');
}
function png(file,scale,withActors){buf=new Uint8Array(W*H*4);papers.length=0;background();if(withActors)actors();
 const w=W*scale,h=H*scale,raw=Buffer.alloc((w*4+1)*h);for(let y=0;y<h;y++){raw[y*(w*4+1)]=0;for(let x=0;x<w;x++){const s=((y/scale|0)*W+(x/scale|0))*4,d=y*(w*4+1)+1+x*4;raw[d]=buf[s];raw[d+1]=buf[s+1];raw[d+2]=buf[s+2];raw[d+3]=255;}}
 const crcT=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;crcT[n]=c>>>0;}
 const crc=b=>{let c=0xffffffff;for(const v of b)c=crcT[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
 const chunk=(t,d)=>{const l=Buffer.alloc(4);l.writeUInt32BE(d.length);const td=Buffer.concat([Buffer.from(t),d]);const c=Buffer.alloc(4);c.writeUInt32BE(crc(td));return Buffer.concat([l,td,c]);};
 const ih=Buffer.alloc(13);ih.writeUInt32BE(w,0);ih.writeUInt32BE(h,4);ih[8]=8;ih[9]=6;
 fs.writeFileSync(file,Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ih),chunk('IDAT',zlib.deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]));}
png('paperboy_level_full_4x.png',4,true);png('paperboy_level_full_1x.png',1,true);png('paperboy_level_background_4x.png',4,false);
