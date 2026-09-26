import json,os,zipfile
from PIL import Image,ImageOps,ImageDraw,ImageFont
B='sprites';M=json.load(open(f'{B}/manifest.json'))
os.makedirs(f'{B}/sheets',exist_ok=True)
# native facing: boy/cow/dog/car face right, auto faces left
flipset=lambda a:a.startswith(('cow','dog','car','auto'))
out={}
for a,m in M.items():
    fr=[Image.open(f'{B}/frames/{n}.png') for n in m['frames']]
    native='left' if a.startswith('auto') else 'right'
    for face,imgs in [(native,fr)]+([('left' if native=='right' else 'right',[ImageOps.mirror(i) for i in fr])] if flipset(a) else []):
        name=a if not flipset(a) else f'{a}_{face}'
        s=Image.new('RGBA',(m['w']*len(imgs),m['h']),(0,0,0,0))
        for k,i in enumerate(imgs): s.paste(i,(k*m['w'],0))
        s.save(f'{B}/sheets/{name}.png'); s.resize((s.width*4,s.height*4),Image.NEAREST).save(f'{B}/sheets/{name}@4x.png')
        out[name]={'file':f'sheets/{name}.png','frame_w':m['w'],'frame_h':m['h'],'frames':len(imgs),'facing':face}
json.dump(out,open(f'{B}/spritesheets.json','w'),indent=1)
# preview
rows=[k for k in out if not (k.endswith('_left') and k.startswith('car'))]
S=4;pad=16;lab=260
try: font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
except: font=ImageFont.load_default()
H=sum(out[k]['frame_h']*S+pad for k in rows)+pad
Wd=lab+max(out[k]['frame_w']*S*out[k]['frames']+ (out[k]['frames']-1)*8 for k in rows)+pad
P=Image.new('RGBA',(Wd,H),(42,46,58,255));d=ImageDraw.Draw(P);y=pad
for k in rows:
    o=out[k];s=Image.open(f"{B}/{o['file']}")
    d.text((pad,y+o['frame_h']*S//2-10),k,fill=(235,235,235),font=font)
    for f in range(o['frames']):
        c=s.crop((f*o['frame_w'],0,(f+1)*o['frame_w'],o['frame_h'])).resize((o['frame_w']*S,o['frame_h']*S),Image.NEAREST)
        x=lab+f*(o['frame_w']*S+8); d.rectangle([x,y,x+c.width-1,y+c.height-1],fill=(58,63,78)); P.alpha_composite(c,(x,y))
    y+=o['frame_h']*S+pad
P.save(f'{B}/preview_all_sprites.png')
with zipfile.ZipFile('paperboy_sprites.zip','w',zipfile.ZIP_DEFLATED) as z:
    for root,_,fs in os.walk(B):
        for f in fs: z.write(os.path.join(root,f))
print(len(out),P.size)
