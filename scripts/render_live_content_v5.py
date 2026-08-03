#!/usr/bin/env python3
"""Render posts 001-003 in Buzzer Klip web branding with image-led educational copy."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parents[1]
SRC=ROOT/'production-sources'/'live-repost-v3'
OUT=ROOT/'posts'/'buzzer-klip-100d'
LOGO=ROOT/'brand-audit'/'buzzer-klip-logo-instagram-crop.png'
FONT=ROOT/'assets'/'fonts'/'PlusJakartaSans-Variable.ttf'
W,H=1080,1350
INK=(10,10,10); CREAM=(253,251,247); WHITE=(255,255,255)
LIME=(212,255,0); PINK=(255,42,122); CYAN=(0,229,255); LAVENDER=(185,162,255)
RED=(255,61,0); ACCENTS=[LIME,CYAN,PINK,LAVENDER]

CONTENT={
 'day-001/slide-01':{'type':'cover','lines':['4 ELEMEN','BIKIN CLIP','SUSAH DI-SKIP'],'sub':'Bukan soal efek ramai. Ini struktur dasarnya.','accent':LIME},
 'day-001/slide-02':{'type':'detail','kicker':'01 / CLIP CHECK','title':'HOOK JELAS','bad':'Mulai dari konteks yang kepanjangan.','good':'Buka dengan konflik, hasil, atau momen terkuat.','accent':CYAN},
 'day-001/slide-03':{'type':'detail','kicker':'02 / CLIP CHECK','title':'VISUAL BERGERAK','bad':'Satu frame diam terlalu lama.','good':'Ubah ukuran, arah, atau fokus saat energi turun.','accent':PINK},
 'day-001/slide-04':{'type':'detail','kicker':'03 / CLIP CHECK','title':'RITME TERJAGA','bad':'Semua potongan dibuat sama cepat.','good':'Percepat buildup, beri jeda di momen penting.','accent':LAVENDER},
 'day-001/slide-05':{'type':'detail','kicker':'04 / CLIP CHECK','title':'SUBTITLE ENAK','bad':'Teks kecil, panjang, dan menutup visual.','good':'Pakai frasa pendek, lalu sorot kata kunci.','cta':'Simpan buat checklist edit berikutnya.','accent':LIME},
 'day-002':{'type':'cover','lines':['HOOK BAGUS','BUKAN YANG','PALING KERAS'],'sub':'Yang paling jelas biasanya paling lama ditonton.','cta':'Hasil dulu atau konflik dulu?','accent':PINK},
 'day-003/slide-01':{'type':'cover','lines':['CLIP RAMAI','BELUM TENTU','MENARIK'],'sub':'Cek tiga tanda sebelum kamu upload.','accent':CYAN},
 'day-003/slide-02':{'type':'detail','kicker':'01 / CLIP CHECK','title':'SEMUA DITONJOLKAN','bad':'Teks, efek, dan visual berebut perhatian.','good':'Tentukan satu elemen yang jadi pusat perhatian.','accent':CYAN},
 'day-003/slide-03':{'type':'detail','kicker':'02 / CLIP CHECK','title':'EFEK TANPA ALASAN','bad':'Transisi hadir hanya supaya terlihat ramai.','good':'Pakai efek untuk menegaskan perubahan cerita.','accent':PINK},
 'day-003/slide-04':{'type':'detail','kicker':'03 / CLIP CHECK','title':'TANPA RUANG NAPAS','bad':'Semua detik dipenuhi suara dan gerakan.','good':'Sisakan jeda agar momen penting terasa kuat.','accent':LAVENDER},
 'day-003/slide-05':{'type':'detail','kicker':'FIX / CLIP CHECK','title':'SATU IDE UTAMA','bad':'Mencoba menjelaskan semuanya sekaligus.','good':'Pilih satu pesan, lalu bangun semua elemen ke sana.','cta':'Simpan sebelum revisi berikutnya.','accent':LIME},
}

def fnt(size,weight='Regular'):
 f=ImageFont.truetype(str(FONT),size=size)
 f.set_variation_by_name(weight)
 return f

def textw(d,text,f):
 b=d.textbbox((0,0),text,font=f);return b[2]-b[0]

def fit(d,text,maxw,start,minimum,weight='ExtraBold'):
 for s in range(start,minimum-1,-2):
  f=fnt(s,weight)
  if textw(d,text,f)<=maxw:return f
 return fnt(minimum,weight)

def dark_gradient(im,start,end,max_alpha=238,reverse=False):
 layer=Image.new('RGBA',(W,H),(0,0,0,0)); d=ImageDraw.Draw(layer)
 for y in range(start,end):
  t=(y-start)/max(1,end-start-1)
  if reverse:t=1-t
  a=int(max_alpha*(t**1.35))
  d.line((0,y,W,y),fill=(5,5,8,a))
 return Image.alpha_composite(im.convert('RGBA'),layer)

def add_brand(im,index,total):
 logo=Image.open(LOGO).convert('RGBA');logo.thumbnail((175,72),Image.Resampling.LANCZOS)
 im.alpha_composite(logo,(50,44))
 d=ImageDraw.Draw(im)
 label=f'{index:02d} / {total:02d}' if total>1 else 'SINGLE POST'
 d.text((1025,62),label,font=fnt(20,'SemiBold'),fill=(253,251,247,225),anchor='ra')

def shadow_text(d,xy,text,font,fill,anchor=None):
 x,y=xy;d.text((x+3,y+5),text,font=font,fill=(0,0,0,205),anchor=anchor);d.text((x,y),text,font=font,fill=fill,anchor=anchor)

def card(d,y,kind,text,accent):
 x=62;w=956;h=82
 d.rounded_rectangle((x,y,x+w,y+h),radius=24,fill=(10,10,10,220),outline=(253,251,247,75),width=2)
 circle=RED if kind=='bad' else accent
 d.ellipse((x+18,y+17,x+66,y+65),fill=circle)
 if kind=='bad':
  sf=fnt(34,'ExtraBold');d.text((x+42,y+40),'×',font=sf,fill=WHITE,anchor='mm')
 else:
  d.line((x+29,y+41,x+39,y+51),fill=INK,width=5)
  d.line((x+39,y+51,x+56,y+31),fill=INK,width=5)
 tf=fit(d,text,815,27,21,'SemiBold');d.text((x+84,y+41),text,font=tf,fill=CREAM,anchor='lm')

def cover(im,cfg,index,total):
 im=dark_gradient(im,690,H,244)
 add_brand(im,index,total);d=ImageDraw.Draw(im)
 x=64;y=930
 for i,line in enumerate(cfg['lines']):
  ff=fit(d,line,950,78,58,'ExtraBold')
  fill=cfg['accent'] if i==len(cfg['lines'])-1 else CREAM
  shadow_text(d,(x,y),line,ff,fill);y+=82
 subf=fit(d,cfg['sub'],930,29,22,'Medium');d.text((x,y+20),cfg['sub'],font=subf,fill=(253,251,247,235))
 if total>1:
  d.text((1010,1292),'SWIPE  →',font=fnt(24,'Bold'),fill=cfg['accent'],anchor='ra')
 elif cfg.get('cta'):
  d.rounded_rectangle((x,y+78,x+620,y+130),radius=20,fill=(*cfg['accent'],235))
  d.text((x+22,y+104),cfg['cta'],font=fnt(22,'Bold'),fill=INK,anchor='lm')
 return im

def detail(im,cfg,index,total):
 im=dark_gradient(im,0,285,205,reverse=True);im=dark_gradient(im,790,H,245)
 add_brand(im,index,total);d=ImageDraw.Draw(im)
 d.text((62,142),cfg['kicker'],font=fnt(22,'Bold'),fill=cfg['accent'])
 titlef=fit(d,cfg['title'],956,68,48,'ExtraBold');shadow_text(d,(62,176),cfg['title'],titlef,CREAM)
 card(d,1080,'bad',cfg['bad'],cfg['accent']);card(d,1176,'good',cfg['good'],cfg['accent'])
 if cfg.get('cta'):
  d.text((1018,1312),cfg['cta'],font=fnt(20,'Bold'),fill=cfg['accent'],anchor='ra')
 return im

def render(key,source,target,index,total):
 im=Image.open(source).convert('RGB').resize((W,H),Image.Resampling.LANCZOS)
 cfg=CONTENT[key];im=cover(im,cfg,index,total) if cfg['type']=='cover' else detail(im,cfg,index,total)
 target.parent.mkdir(parents=True,exist_ok=True)
 im.convert('RGB').save(target,'JPEG',quality=94,subsampling=0,optimize=True)

for day in (1,3):
 for i,p in enumerate(sorted((SRC/f'day-{day:03d}').glob('slide-*.png')),1):
  key=f'day-{day:03d}/{p.stem}';render(key,p,OUT/f'day-{day:03d}'/(p.stem+'.jpg'),i,5)
render('day-002',SRC/'day-002.png',OUT/'day-002.jpg',1,1)
print('Rendered 11 Buzzer Klip website-brand creatives (v5).')
