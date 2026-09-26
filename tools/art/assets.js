const fs=require('fs');
let src=fs.readFileSync(__dirname+'/level.js','utf8').replace('const W=960,H=160,','let W=960,H=160;const ').split('\n').filter(l=>!l.startsWith("png('")).join('\n');
const sp=fs.readFileSync(__dirname+'/sprites.js','utf8');
const saveSrc=sp.slice(sp.indexOf('function save'),sp.indexOf('function wheelS')).replace("out+'/'+name+'.png'","__dirname+'/ui/'+name+'.png'");
eval(src+saveSrc+`
fs.mkdirSync(__dirname+'/ui',{recursive:true});
save('bg_street',960,160,()=>{papers.length=0;background();});
const G={A:[".###.","#...#","#...#","#####","#...#","#...#","#...#"],K:["#...#","#..#.","#.#..","##...","#.#..","#..#.","#...#"],H:["#...#","#...#","#...#","#####","#...#","#...#","#...#"],B:["####.","#...#","#...#","####.","#...#","#...#","####."],R:["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],U:["#...#","#...#","#...#","#...#","#...#","#...#",".###."],S:[".####","#....","#....",".###.","....#","....#","####."]};
function big(word,x0,y0,s,bands,sh){const cells=[];let x=x0;for(const ch of word){G[ch].forEach((row,j)=>[...row].forEach((v,i)=>{if(v=='#')cells.push([x+i*s+(6-j),y0+j*s,j]);}));x+=7*s-1;}
 const sk=(y)=>0;
 const blk=(dx,dy,c,pad)=>cells.forEach(([cx,cy])=>{for(let yy=cy-pad;yy<cy+s+pad;yy++)r(cx-pad+dx+sk(yy),yy+dy,s+pad*2,1,c);});
 blk(2,3,sh,2);blk(0,0,'#241610',2);
 cells.forEach(([cx,cy,j])=>{for(let yy=cy;yy<cy+s;yy++){const b=bands[Math.min(bands.length-1,Math.floor((yy-y0)/(7*s)*bands.length))];r(cx+sk(yy),yy,s,1,b);}});
 cells.forEach(([cx,cy,j])=>{if(j==0)r(cx+sk(cy),cy,s,1,'#ffffff');});}
save('logo',200,78,()=>{
 for(let i=0;i<6;i++)r(150+i*3,40+i*5,26-i*2,2,'#ffffff');
 big("AKHBAAR",10,4,3,['#ffffff','#fff3b8','#f4f0e6','#e6dcc6'],'#2d6fd1');
 big("RUSH",36,34,4,['#fff3b8','#ffd35a','#f39c2b','#e0782a'],'#b0322a');
 const px=6,py=48;for(let yy=0;yy<9;yy++){r(px-1,py+yy-1,24,1,'#241610');}
 box(px,py,22,8,'#f3f1e6');r(px,py+3,22,1,'#cfcbbb');r(px+7,py,2,8,'#b0322a');r(px+14,py,2,8,'#b0322a');r(px+1,py+1,5,1,'#ffffff');for(let i=18;i<21;i++)r(i,py+5,1,1,'#8a877c');
 box(px+22,py+1,3,6,'#e6dcc6');r(px+23,py+3,1,2,'#8a877c');
 r(px-5,py+1,4,1,'#ffffff');r(px-7,py+4,6,1,'#ffffff');r(px-4,py+7,3,1,'#ffffff');});
save('icon_coin',14,14,()=>{disc(7,7,6,'#241610');disc(7,7,5,'#e0a020');disc(7,7,4,'#ffd35a');ring(7,7,3,1,'#f2c230');r(6,4,2,6,'#e0a020');r(7,4,1,6,'#b07010');r(5,3,2,2,'#fff3b8');});
save('icon_paper',16,12,()=>{box(1,6,13,4,'#f3f1e6');r(6,6,2,4,'#b0322a');box(3,2,11,4,'#eceadd');r(8,2,2,4,'#b0322a');r(4,3,3,1,'#ffffff');});
save('icon_gift',14,14,()=>{box(1,5,12,8,'#d8322a');box(0,3,14,3,'#e84a3a');r(6,3,2,10,'#ffd35a');r(0,4,14,1,'#ff7060');r(3,0,3,3,'#ffd35a');r(8,0,3,3,'#ffd35a');r(4,1,1,1,'#241610');r(9,1,1,1,'#241610');r(2,6,2,5,'#e84a3a');});
save('icon_flame',12,14,()=>{const f=[[5,0,2],[4,1,4],[3,3,6],[2,5,8],[1,7,10],[1,9,10],[2,11,8],[3,12,6]];f.forEach(([x,y,w])=>{r(x-1,y,w+2,2,'#241610');});f.forEach(([x,y,w])=>r(x,y,w,2,'#e0482a'));[[5,5,2],[4,7,4],[4,9,4],[5,11,2]].forEach(([x,y,w])=>r(x,y,w,2,'#f39c2b'));r(5,9,2,2,'#ffe27a');});
save('icon_trophy',14,14,()=>{box(3,1,8,6,'#ffd35a');r(0,2,3,1,'#241610');r(0,2,1,3,'#241610');r(0,4,3,1,'#241610');r(11,2,3,1,'#241610');r(13,2,1,3,'#241610');r(11,4,3,1,'#241610');r(5,7,4,2,'#e0a020');box(4,9,6,1,'#e0a020');box(3,11,8,2,'#8a5e2c');r(4,2,2,3,'#fff3b8');});
save('icon_cycle',20,13,()=>{ring(4,8,4,1,'#241610');ring(15,8,4,1,'#241610');L(4,8,8,8,'#d8322a');L(8,8,6,3,'#d8322a');L(4,8,6,3,'#d8322a');L(6,3,13,3,'#d8322a');L(8,8,13,4,'#d8322a');L(13,2,15,8,'#d8322a');r(4,2,4,1,'#241610');r(12,1,3,1,'#241610');});
save('icon_star',13,12,()=>{const s=[[6,0,1],[5,2,3],[0,4,13],[2,5,9],[3,6,7],[2,8,9],[1,10,4],[8,10,4]];s.forEach(([x,y,w])=>r(x,y,w,2,'#ffd35a'));r(6,0,1,1,'#241610');r(5,5,1,1,'#fff3b8');});
`);
