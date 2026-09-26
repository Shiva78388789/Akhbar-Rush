import math, os
from PIL import Image, ImageDraw
os.makedirs('brand/app_icon/ios',exist_ok=True); os.makedirs('brand/app_icon/android',exist_ok=True)
N=256
def sunburst():
    im=Image.new('RGBA',(N,N)); px=im.load(); cx,cy=128,150
    for y in range(N):
        for x in range(N):
            a=math.atan2(y-cy,x-cx); k=int((a+math.pi)/(2*math.pi)*22)
            d=math.hypot(x-cx,y-cy)
            px[x,y]=((255,211,90,255) if k%2 else (255,180,79,255)) if d>44 else (255,243,184,255)
    return im
def boy():
    s=Image.open('moves/frames/boy_jump_2.png'); b=s.getbbox(); s=s.crop(b)
    return s.resize((s.width*3,s.height*3),Image.NEAREST)
def fg_layer(size=N, dy=0):
    L=Image.new('RGBA',(size,size),(0,0,0,0)); d=ImageDraw.Draw(L)
    b=boy(); bx=(size-b.width)//2+6; by=int(size*0.78)-b.height-4+dy
    d.ellipse([bx+14,int(size*0.78)+dy,bx+b.width-14,int(size*0.78)+10+dy],fill=(20,20,30,90))
    for i,(y,l) in enumerate([(by+70,30),(by+92,44),(by+114,26)]): d.rectangle([bx-l-8,y,bx-8,y+3],fill=(255,255,255,255))
    L.alpha_composite(b,(bx,by))
    p=Image.open('sprites/frames/newspaper_spin_1.png'); p=p.resize((p.width*4,p.height*4),Image.NEAREST); L.alpha_composite(p,(bx+b.width-30,by+4))
    return L
bg=sunburst(); d=ImageDraw.Draw(bg)
d.rectangle([0,200,N,207],fill=(30,30,30,255))
for x in range(0,N,16): d.rectangle([x,200,x+7,207],fill=(242,194,48,255))
d.rectangle([0,208,N,N],fill=(111,110,108,255))
for x in range(8,N,48): d.rectangle([x,230,x+23,233],fill=(244,240,230,255))
icon=bg.copy(); icon.alpha_composite(fg_layer(N,0))
icon.save('brand/app_icon/icon_256_art.png')
big=icon.resize((1024,1024),Image.NEAREST).convert('RGB'); big.save('brand/app_icon/ios/AppStore_1024.png')
for s in [180,167,152,120,87,80,76,60,58,40,29,20]:
    big.resize((s,s),Image.LANCZOS).save(f'brand/app_icon/ios/Icon_{s}.png')
icon.resize((512,512),Image.NEAREST).convert('RGB').save('brand/app_icon/android/PlayStore_512.png')
for n,s in [('mdpi',48),('hdpi',72),('xhdpi',96),('xxhdpi',144),('xxxhdpi',192)]:
    big.resize((s,s),Image.LANCZOS).save(f'brand/app_icon/android/ic_launcher_{n}_{s}.png')
# adaptive: 108dp canvas, safe zone 66dp -> art centered at ~62%
fg=fg_layer(N,0); sc=Image.new('RGBA',(N,N),(0,0,0,0)); f2=fg.resize((168,168),Image.NEAREST); sc.alpha_composite(f2,(44,40))
sc.resize((432,432),Image.NEAREST).save('brand/app_icon/android/adaptive_foreground_432.png')
bg.resize((432,432),Image.NEAREST).convert('RGB').save('brand/app_icon/android/adaptive_background_432.png')
# bike colour variants
src=Image.open('moves/sheets/boy_ride.png').convert('RGBA'); os.makedirs('brand/bikes',exist_ok=True)
cols={'red':(216,50,42),'blue':(45,111,209),'green':(46,139,62),'yellow':(242,194,48),'purple':(122,58,138)}
for n,c in cols.items():
    im=src.copy(); p=im.load()
    for y in range(im.height):
        for x in range(im.width):
            if p[x,y][:3]==(216,50,42) and p[x,y][3]: p[x,y]=c+(255,)
    im.save(f'brand/bikes/ride_{n}.png')
print('ok')
