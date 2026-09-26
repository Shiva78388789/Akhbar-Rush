import json, os, zipfile, numpy as np
from PIL import Image, ImageDraw
D='moves'; cfg=json.load(open('moves.json')); raw=json.load(open(f'{D}/raw_manifest.json'))
CW,CH=raw['canvas']; RC=raw['rear_wheel_contact']; FC=raw['front_wheel_contact']
os.makedirs(f'{D}/frames',exist_ok=True); os.makedirs(f'{D}/sheets',exist_ok=True)

def to32(im): a=np.array(im.convert('RGBA')).astype(np.uint32); return (a[...,0]<<24)|(a[...,1]<<16)|(a[...,2]<<8)|a[...,3]
def to_im(u): return Image.fromarray(np.stack([(u>>24)&255,(u>>16)&255,(u>>8)&255,u&255],-1).astype(np.uint8),'RGBA')
def scale2x(a):
    p=np.pad(a,1,mode='edge');B=p[:-2,1:-1];Dd=p[1:-1,:-2];F=p[1:-1,2:];Hh=p[2:,1:-1];E=a
    o=np.empty((a.shape[0]*2,a.shape[1]*2),a.dtype)
    o[0::2,0::2]=np.where((Dd==B)&(B!=F)&(Dd!=Hh),Dd,E); o[0::2,1::2]=np.where((B==F)&(B!=Dd)&(F!=Hh),F,E)
    o[1::2,0::2]=np.where((Dd==Hh)&(Dd!=B)&(Hh!=F),Dd,E); o[1::2,1::2]=np.where((Hh==F)&(Dd!=Hh)&(B!=F),F,E); return o
def rotsprite(im,deg,piv):
    if deg==0: return im
    a=to32(im); big=scale2x(scale2x(scale2x(a))); t=np.radians(deg); c,s=np.cos(t),np.sin(t)
    ys,xs=np.mgrid[0:a.shape[0],0:a.shape[1]]; dx=xs+.5-piv[0]; dy=ys+.5-piv[1]
    sx=piv[0]+c*dx-s*dy; sy=piv[1]+s*dx+c*dy
    bx=np.floor(sx*8).astype(int); by=np.floor(sy*8).astype(int)
    ok=(bx>=0)&(by>=0)&(bx<big.shape[1])&(by<big.shape[0]); out=np.zeros_like(a)
    out[ok]=big[by[ok],bx[ok]]; return to_im(out)

anims={}
def strip(name,imgs,w,h):
    s=Image.new('RGBA',(w*len(imgs),h),(0,0,0,0))
    for k,i in enumerate(imgs): s.paste(i,(k*w,0)); i.save(f'{D}/frames/{name}_{k}.png')
    s.save(f'{D}/sheets/{name}.png'); s.resize((s.width*4,s.height*4),Image.NEAREST).save(f'{D}/sheets/{name}@4x.png')
FR={}
for a,c in cfg.items():
    imgs=[]
    for i,deg in enumerate(c['rot']):
        im=Image.open(f'{D}/raw/{a}_{i}.png'); imgs.append(rotsprite(im,deg,RC if deg>0 else FC))
    FR[a]=imgs; strip('boy_'+a,imgs,CW,CH)
    anims['boy_'+a]={'sheet':f'sheets/boy_{a}.png','frame_w':CW,'frame_h':CH,'frames':len(imgs),'frame_ms':c['ms'],'loop':c.get('loop',False),
        'tilt_deg_baked_in':c['rot']}
    if 'y' in c: anims['boy_'+a]['jump_height_px']=c['y']
    if 'progress' in c: anims['boy_'+a]['lane_progress']=c['progress']
# re-home the earlier throw animation onto the same canvas/anchor
old='sprites/frames'; th=[]
for i in range(4):
    im=Image.new('RGBA',(CW,CH),(0,0,0,0)); im.paste(Image.open(f'{old}/boy_throw_{i}.png'),(RC[0]-9,RC[1]-50)); th.append(im)
FR['throw']=th; strip('boy_throw',th,CW,CH)
anims['boy_throw']={'sheet':'sheets/boy_throw.png','frame_w':CW,'frame_h':CH,'frames':4,'frame_ms':[70,60,50,90],'loop':False,'release_frame':2}

# effects
def px(d,pts,col):
    for x,y in pts: d.point((x,y),fill=col)
dust=[]
for f in range(4):
    im=Image.new('RGBA',(18,10),(0,0,0,0)); d=ImageDraw.Draw(im)
    R=[(1,2),(2,3),(3,3),(2,4)][f]; cols=[(228,221,206,255),(215,207,191,255),(228,221,206,200),(228,221,206,120)]
    for (cx,cy,k) in [(4,7,1.0),(9,6,1.3),(14,7,0.9)]:
        rr=max(1,round(R[0]*k)) if f<3 else 1
        ox=cx+(f*(-1 if cx<9 else 1 if cx>9 else 0)); oy=cy-f
        d.ellipse([ox-rr,oy-rr,ox+rr,oy+rr],fill=cols[f])
        if f<2: d.point((ox-rr+1,oy-rr+1),fill=(245,241,232,255))
    dust.append(im)
strip('fx_dust_puff',dust,18,10)
anims['fx_dust_puff']={'sheet':'sheets/fx_dust_puff.png','frame_w':18,'frame_h':10,'frames':4,'frame_ms':[50,60,70,80],'loop':False,'spawn':'behind rear wheel on jump takeoff and landing'}
sh=[]
for w in [30,26,22,18,14]:
    im=Image.new('RGBA',(32,5),(0,0,0,0)); d=ImageDraw.Draw(im); d.ellipse([16-w//2,0,16+w//2-1,4],fill=(20,20,30,95)); sh.append(im)
strip('fx_shadow',sh,32,5)
anims['fx_shadow']={'sheet':'sheets/fx_shadow.png','frame_w':32,'frame_h':5,'frames':5,'usage':'stays on the lane ground under the bike; pick frame = min(4, jump_height_px // 5)'}
sw=[]
for f in range(3):
    im=Image.new('RGBA',(20,16),(0,0,0,0)); d=ImageDraw.Draw(im); a=[255,190,110][f]
    for (y,l) in [(3,10),(8,14),(13,8)]: d.line([(19-l+f*2,y),(19,y)],fill=(255,255,255,a))
    sw.append(im)
strip('fx_speed_lines',sw,20,16)
anims['fx_speed_lines']={'sheet':'sheets/fx_speed_lines.png','frame_w':20,'frame_h':16,'frames':3,'frame_ms':[60,60,60],'usage':'behind the rider during lane changes'}

meta={'pixel_scale_note':'1 sprite pixel = 1 game pixel; scale the whole game by an integer (x3/x4) with nearest-neighbour filtering',
 'anchor':{'point':RC,'meaning':'rear-wheel ground contact inside every boy frame; place this point on the lane ground line'},
 'lanes_in_level_1x':{'upper_lane_ground_y':128,'lower_lane_ground_y':157},
 'controls':{'swipe_up':'boy_lane_up','swipe_down':'boy_lane_down','tap':'boy_jump','auto':'boy_throw near a house'},
 'how_to_play_back':['lane change: y = lerp(from_lane_y, to_lane_y, lane_progress[frame])',
   'jump: draw sprite at lane_y - jump_height_px[frame]; shadow stays at lane_y',
   'tilt is already drawn into the frames - do not rotate the sprite in code',
   'return to boy_ride after the last frame; keep the ride frame counter running so pedalling stays continuous'],
 'animations':anims}
json.dump(meta,open(f'{D}/animations.json','w'),indent=1)

# preview sheet
S=4; rows=['ride','lane_up','lane_down','jump','throw']; pad=16; lab=0
P=Image.new('RGBA',(pad+8*(CW*S+6),pad+len(rows)*(CH*S+pad)+ (10*S+pad)*1),(42,46,58,255)); d=ImageDraw.Draw(P); y=pad
for r_ in rows:
    for k,im in enumerate(FR[r_]):
        x=pad+k*(CW*S+6); d.rectangle([x,y,x+CW*S-1,y+CH*S-1],fill=(58,63,78)); d.line([x,y+RC[1]*S,x+CW*S-1,y+RC[1]*S],fill=(90,96,112),width=2)
        P.alpha_composite(im.resize((CW*S,CH*S),Image.NEAREST),(x,y))
    y+=CH*S+pad
x=pad
for im in dust+sw: P.alpha_composite(im.resize((im.width*S,im.height*S),Image.NEAREST),(x,y)); x+=im.width*S+12
P.save(f'{D}/preview_movement.png')

# demo gif on the street
bg=Image.open('paperboy_level_background_4x.png').resize((960,160),Image.NEAREST).convert('RGBA')
spr=lambda n:Image.open(f'sprites/frames/{n}.png').convert('RGBA')
VW,VH,Y0=200,100,60; LOW,UP=157-Y0,128-Y0; BX=40
seq=[]
def add(anim,frames,ms,**kw):
    for i,f in enumerate(frames): seq.append(dict(anim=anim,img=f,ms=ms[i],i=i,**kw))
rc=cfg['ride']
for _ in range(3): add('ride',FR['ride'],rc['ms'],lane=LOW)
add('lane_up',FR['lane_up'],cfg['lane_up']['ms'],lane=(LOW,UP,cfg['lane_up']['progress']))
for _ in range(2): add('ride',FR['ride'],rc['ms'],lane=UP)
add('jump',FR['jump'],cfg['jump']['ms'],lane=UP,jy=cfg['jump']['y'])
for _ in range(2): add('ride',FR['ride'],rc['ms'],lane=UP)
add('lane_down',FR['lane_down'],cfg['lane_down']['ms'],lane=(UP,LOW,cfg['lane_down']['progress']))
add('ride',FR['ride'],rc['ms'],lane=LOW)
add('throw',FR['throw'],[70,60,50,90],lane=LOW)
for _ in range(2): add('ride',FR['ride'],rc['ms'],lane=LOW)
SPD=3; wx=lambda k:k*SPD+BX+RC[0]+11
k_lu=next(k for k,s in enumerate(seq) if s['anim']=='lane_up'); k_j=[k for k,s in enumerate(seq) if s['anim']=='jump'][3]
cow=spr('cow_idle_0'); cowx=wx(k_lu)+42; pot=spr('pothole'); potx=wx(k_j)-11
dogs=[spr('dog_bark_0'),spr('dog_bark_1')]; dogx=wx(k_j)+150
gifs=[]; dust_on=[]
for k,s in enumerate(seq):
    off=k*SPD; fr=Image.new('RGBA',(VW,VH))
    for tx in (-(off%960),960-(off%960)): fr.alpha_composite(bg.crop((0,Y0,960,160)),(tx,0)) if tx<VW else None
    if isinstance(s['lane'],tuple): a,b,p=s['lane']; gy=round(a+(b-a)*p[s['i']])
    else: gy=s['lane']
    jy=s['jy'][s['i']] if 'jy' in s else 0
    fr.alpha_composite(pot,(potx-off-11,UP-5)) if -30<potx-off<VW+30 else None
    fr.alpha_composite(cow,(cowx-off,LOW-21)) if -40<cowx-off<VW+40 else None
    if -30<dogx-off<VW+30: dg=dogs[k%2].transpose(Image.FLIP_LEFT_RIGHT); fr.alpha_composite(dg,(dogx-off,UP-13))
    shf=sh[min(4,jy//5)]; fr.alpha_composite(shf,(BX+RC[0]+11-16,gy-3))
    if s['anim']=='jump' and s['i'] in (1,6): dust_on.append([k,0])
    fr.alpha_composite(s['img'],(BX,gy-RC[1]-jy))
    for dd in dust_on:
        if 0<=k-dd[0]<4: fr.alpha_composite(dust[k-dd[0]],(BX+RC[0]-14,gy-9))
    if s['anim'] in('lane_up','lane_down') and 1<=s['i']<=3: fr.alpha_composite(sw[s['i']-1],(BX-8,gy-RC[1]-jy+36))
    gifs.append(fr.resize((VW*4,VH*4),Image.NEAREST).convert('RGB'))
gifs[0].save(f'{D}/demo_controls.gif',save_all=True,append_images=gifs[1:],duration=[s['ms'] for s in seq],loop=0)
with zipfile.ZipFile('paperboy_movement_sprites.zip','w',zipfile.ZIP_DEFLATED) as z:
    for root,_,fs in os.walk(D):
        if root.endswith('raw'): continue
        for f in fs:
            if f!='raw_manifest.json': z.write(os.path.join(root,f))
print('ok',len(seq))
