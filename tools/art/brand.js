const fs=require('fs');
let src=fs.readFileSync(__dirname+'/level.js','utf8').replace('const W=960,H=160,','let W=960,H=160;const ').split('\n').filter(l=>!l.startsWith("png('")).join('\n');
const sp=fs.readFileSync(__dirname+'/sprites.js','utf8');
const saveSrc=sp.slice(sp.indexOf('function save'),sp.indexOf('function wheelS')).replace("out+'/'+name+'.png'","__dirname+'/brand/'+name+'.png'");
eval(src+saveSrc+`
fs.mkdirSync(__dirname+'/brand',{recursive:true});
const G={S:[".####","#....","#....",".###.","....#","....#","####."],H:["#...#","#...#","#...#","#####","#...#","#...#","#...#"],I:["#####","..#..","..#..","..#..","..#..","..#..","#####"],
V:["#...#","#...#","#...#","#...#",".#.#.",".#.#.","..#.."],A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],G:[".####","#....","#....","#.###","#...#","#...#",".###."],
M:["#...#","##.##","#.#.#","#.#.#","#...#","#...#","#...#"],E:["#####","#....","#....","####.","#....","#....","#####"]};
function word(wd,x0,y0,s,adv,bands,sh,out){const cells=[];let x=x0;for(const ch of wd){G[ch].forEach((row,j)=>[...row].forEach((v,i)=>{if(v=='#')cells.push([x+i*s,y0+j*s]);}));x+=adv;}
 const blk=(dx,dy,c,p)=>cells.forEach(([cx,cy])=>r(cx-p+dx,cy-p+dy,s+2*p,s+2*p,c));
 if(sh)blk(0,out+1,sh,out);blk(0,0,'#0b0f1e',out);
 cells.forEach(([cx,cy])=>{for(let yy=cy;yy<cy+s;yy++)r(cx,yy,s,1,bands[Math.min(bands.length-1,Math.floor((yy-y0)/(7*s)*bands.length))]);});}
function badge(cx,cy){disc(cx,cy,27,'#0b0f1e');disc(cx,cy,25,'#ffd35a');disc(cx,cy,22,'#1b2340');disc(cx,cy,21,'#232d52');
 for(let j=-21;j<=21;j+=3)for(let i=-21;i<=21;i+=5)if(Math.hypot(i,j)<20&&((i+j)%2==0))r(cx+i+((j/3)%2?2:0),cy+j,1,1,'#2e3a66');
 disc(cx-3,cy+1,14,'#fff3b8');disc(cx+4,cy-4,12,'#232d52');r(cx-13,cy-2,2,6,'#ffffff');r(cx-12,cy+7,3,2,'#ffe27a');
 const sparkle=(x,y,s)=>{r(x-s,y,2*s+1,1,'#ffd35a');r(x,y-s,1,2*s+1,'#ffd35a');r(x,y,1,1,'#ffffff');};sparkle(cx+9,cy-8,3);sparkle(cx+13,cy+6,2);sparkle(cx+3,cy+12,1);
 r(cx-25,cy-1,3,3,'#f39c2b');r(cx+23,cy-1,3,3,'#f39c2b');r(cx-1,cy-25,3,3,'#f39c2b');r(cx-1,cy+23,3,3,'#f39c2b');}
const SB=['#ffffff','#ffffff','#e8ecff','#c9d2f5'],GB=['#fff3b8','#ffd35a','#f39c2b'];
save('studio_logo_horizontal',236,66,()=>{badge(32,33);word('SHIVA',72,6,4,30,SB,null,2);word('GAMES',74,44,2,31,GB,null,2);});
save('studio_logo_stacked',180,120,()=>{badge(90,30);word('SHIVA',20,64,4,30,SB,null,2);word('GAMES',40,102,2,23,GB,null,2);});
save('studio_badge',60,60,()=>badge(30,30));
const av=[['#2d6fd1','#f1c18e','#2a1a10',0],['#d8322a','#c98d5c','#1a1008',1],['#2e8b3e','#e0a878','#3a2010',0],['#7a3a8a','#f1c18e','#1a1008',1],['#f39c2b','#a8703f','#1a1008',0],['#3a3a44','#e0a878','#5a3a1a',1],['#e05a8a','#c98d5c','#1a1008',1],['#2ab5b5','#f1c18e','#2a1a10',0]];
av.forEach(([cap,skin,hair,girl],i)=>save('avatar_'+i,18,18,()=>{r(0,0,18,18,'#f4f0e6');r(0,0,18,1,'#241610');r(0,17,18,1,'#241610');r(0,0,1,18,'#241610');r(17,0,1,18,'#241610');
 box(4,6,10,9,skin);r(4,7,3,6,hair);if(girl){r(3,8,2,7,hair);r(13,8,2,5,hair);r(2,13,2,2,'#e05a8a');}r(6,9,2,2,shade(skin,.9));
 box(4,3,10,4,cap);r(5,3,6,1,shade(cap,1.3));r(14,5,3,2,shade(cap,.7));r(9,4,1,1,'#ffd35a');r(11,8,1,2,'#111');r(10,12,3,1,'#7a1f16');r(11,12,1,1,'#fff');r(9,11,1,1,'#f08a7a');}));
`);
