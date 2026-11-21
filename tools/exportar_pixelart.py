"""Exporta los sprites pixel art de js/pixelart.js a PNG (transparente) y JPG (fondo sólido).
Uso: python tools/exportar_pixelart.py   (requiere Node.js y Pillow)"""
import json, subprocess, os
from PIL import Image
RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
js = os.path.join(RAIZ, 'js', 'pixelart.js')
datos = json.loads(subprocess.check_output(['node', '-e',
    "const fs=require('fs');eval(fs.readFileSync(process.argv[1],'utf8').replace(/const /g,'var '));"
    "console.log(JSON.stringify({PALETA,SPRITES,OBJETOS}))", js]))
pal, spr = datos['PALETA'], datos['SPRITES']
def hexrgb(h): return tuple(int(h[i:i+2], 16) for i in (1, 3, 5))
png, jpg = os.path.join(RAIZ, 'assets/pixelart/png'), os.path.join(RAIZ, 'assets/pixelart/jpg')
os.makedirs(png, exist_ok=True); os.makedirs(jpg, exist_ok=True)
hoja = Image.new('RGBA', (16 * len(spr), 16), (0, 0, 0, 0))
for k, (nombre, grid) in enumerate(spr.items()):
    im = Image.new('RGBA', (16, 16), (0, 0, 0, 0))
    for y, fila in enumerate(grid):
        for x in range(16):
            c = pal.get(fila[x] if x < len(fila) else '.')
            if c: im.putpixel((x, y), hexrgb(c) + (255,))
    hoja.paste(im, (16 * k, 0))
    im.save(f'{png}/{nombre}.png')                                      # original 16x16
    grande = im.resize((256, 256), Image.NEAREST); grande.save(f'{png}/{nombre}_x16.png')
    fondo = Image.new('RGB', (256, 256), hexrgb('#f4efe1')); fondo.paste(grande, mask=grande)
    fondo.save(f'{jpg}/{nombre}_x16.jpg', quality=95)
hoja.save(f'{png}/hoja_sprites.png')
h2 = hoja.resize((hoja.width * 8, 128), Image.NEAREST); h2.save(f'{png}/hoja_sprites_x8.png')
f = Image.new('RGB', h2.size, hexrgb('#1a1220')); f.paste(h2, mask=h2); f.save(f'{jpg}/hoja_sprites_x8.jpg', quality=95)
print('Exportados', len(spr), 'sprites')
