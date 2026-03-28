"""
RestauMargin Station — FINAL DESIGN
Le support EST la balance. Bras solidaire. Moule silicone tablette.
Fidèle au concept Gemini.
"""
import numpy as np
from stl import mesh
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def box(w, d, h, o=(0,0,0)):
    ox,oy,oz = o
    v = np.array([[ox,oy,oz],[ox+w,oy,oz],[ox+w,oy+d,oz],[ox,oy+d,oz],
                  [ox,oy,oz+h],[ox+w,oy,oz+h],[ox+w,oy+d,oz+h],[ox,oy+d,oz+h]])
    f = np.array([[0,3,1],[1,3,2],[0,4,7],[0,7,3],[4,5,6],[4,6,7],
                  [5,1,2],[5,2,6],[2,3,6],[3,7,6],[0,1,5],[0,5,4]])
    m = mesh.Mesh(np.zeros(12, dtype=mesh.Mesh.dtype))
    for i,fa in enumerate(f):
        for j in range(3): m.vectors[i][j] = v[fa[j]]
    return m

def cyl(cx,cy,cz,r,h,s=20):
    pp = []
    a = np.linspace(0,2*np.pi,s+1)[:-1]
    for i in range(s):
        a1,a2 = a[i],a[(i+1)%s]
        x1,y1 = cx+r*np.cos(a1),cy+r*np.sin(a1)
        x2,y2 = cx+r*np.cos(a2),cy+r*np.sin(a2)
        v = np.array([[cx,cy,cz],[x1,y1,cz],[x2,y2,cz],[cx,cy,cz+h],[x1,y1,cz+h],[x2,y2,cz+h]])
        fa = np.array([[0,2,1],[3,4,5],[1,2,5],[1,5,4]])
        t = mesh.Mesh(np.zeros(4, dtype=mesh.Mesh.dtype))
        for fi,f in enumerate(fa):
            for j in range(3): t.vectors[fi][j] = v[f[j]]
        pp.append(t)
    return combine(pp)

def rbox(w,d,h,r,o=(0,0,0)):
    ox,oy,oz = o
    pp = []
    pp.append(box(w-2*r,d,h,(ox+r,oy,oz)))
    pp.append(box(w,d-2*r,h,(ox,oy+r,oz)))
    for cx,cy in [(ox+r,oy+r),(ox+w-r,oy+r),(ox+r,oy+d-r),(ox+w-r,oy+d-r)]:
        pp.append(cyl(cx,cy,oz,r,h,12))
    return combine(pp)

def combine(parts):
    total = sum(m.vectors.shape[0] for m in parts)
    c = mesh.Mesh(np.zeros(total, dtype=mesh.Mesh.dtype))
    idx = 0
    for m in parts:
        n = m.vectors.shape[0]; c.vectors[idx:idx+n] = m.vectors; idx += n
    return c

P = []

# ══════════════════════════════════════════════════
# PIÈCE 1 : SUPPORT-BALANCE (le support EST la balance)
# ══════════════════════════════════════════════════

# Base — forme galet, coins très arrondis, blanche
BW, BD, BH, BR = 310, 270, 42, 22
P.append(rbox(BW, BD, BH, BR, (-BW/2, -BD/2, 0)))

# Surélévation douce autour du plateau
P.append(rbox(210, 210, 4, 8, (-105, -105-12, BH)))

# Plateau inox 304L — encastré, à fleur, accès libre
PW, PD = 190, 190
pz = BH + 4
P.append(rbox(PW, PD, 2.5, 6, (-PW/2, -PD/2-12, pz)))

# Rebord doux enveloppant le plateau (la coque monte juste autour)
for dx,dy,dw,dd in [(-PW/2-6,-PD/2-18, PW+12, 6),    # front
                     (-PW/2-6, PD/2-12+6, PW+12, 6),   # back
                     (-PW/2-6,-PD/2-18, 6, PD+12),      # left
                     ( PW/2,  -PD/2-18, 6, PD+12)]:     # right
    P.append(rbox(dw, dd, 4, 3, (dx, dy, pz-2)))

# LCD vert façade (l'écran de la balance)
lcd_x, lcd_y, lcd_z = -BW/2+28, -BD/2-2, 12
P.append(box(52, 4, 22, (lcd_x, lcd_y, lcd_z)))        # cadre
P.append(box(46, 1.5, 17, (lcd_x+3, lcd_y-1.5, lcd_z+2.5)))  # vitre LCD verte

# Boutons façade (Tare, On/Off)
for bx in [-15, 20, 55]:
    P.append(cyl(bx, -BD/2-2, 22, 7, 3, 14))

# Patins antidérapants
for px,py in [(-BW/2+18,-BD/2+18),(BW/2-18,-BD/2+18),
              (-BW/2+18,BD/2-18),(BW/2-18,BD/2-18)]:
    P.append(cyl(px, py, -3, 9, 3, 14))

# USB-C arrière
P.append(box(12, 4, 6, (-6, BD/2-2, 18)))

# LED power arrière
P.append(cyl(-22, BD/2, 20, 2.5, 3, 8))

# Ventilation arrière
for vz in range(12, 36, 5):
    P.append(box(30, 2, 2, (40, BD/2-1, vz)))

# ══════════════════════════════════════════════════
# BRAS — Solidaire du support, part de l'arrière
# ══════════════════════════════════════════════════
AW, AT, AH = 48, 16, 220  # largeur, épaisseur, hauteur
ax, ay = -AW/2, BD/2-AT-20

# Transition douce base → bras (renfort triangulaire)
P.append(rbox(AW+30, AT+12, 28, 8, (ax-15, ay-6, BH)))

# Bras vertical principal
P.append(rbox(AW, AT, AH, 8, (ax, ay, BH+25)))

# Épaississement bas du bras
P.append(rbox(AW+12, AT+6, 50, 6, (ax-6, ay-3, BH+22)))

# Arrondi haut du bras (transition vers le moule silicone)
P.append(rbox(AW+8, AT+4, 20, 6, (ax-4, ay-2, BH+25+AH-10)))

# ══════════════════════════════════════════════════
# PIÈCE 2 : MOULE SILICONE (en haut du bras)
# ══════════════════════════════════════════════════
TW, TH, TD = 257, 169, 7   # tablette dimensions
SP = 10                      # épaisseur silicone autour

sleeve_w = TW + 2*SP
sleeve_h = TH + 2*SP
sleeve_z = BH + 25 + AH + 5
sleeve_x = -sleeve_w/2

# Backplate silicone (épaisse, souple)
P.append(rbox(sleeve_w, SP + AT, sleeve_h, 12, (sleeve_x, ay-SP/2, sleeve_z)))

# Lèvre basse (retient la tablette)
P.append(rbox(sleeve_w, SP+10, SP+4, 5, (sleeve_x, ay-SP, sleeve_z)))

# Lèvre haute (plus petite)
P.append(rbox(sleeve_w, SP+5, SP*0.7, 5, (sleeve_x, ay-SP/2, sleeve_z+sleeve_h-SP*0.7)))

# Grip gauche
P.append(rbox(SP, SP+6, sleeve_h*0.6, 5, (sleeve_x, ay-SP/2-3, sleeve_z+sleeve_h*0.2)))

# Grip droit
P.append(rbox(SP, SP+6, sleeve_h*0.6, 5, (sleeve_x+sleeve_w-SP, ay-SP/2-3, sleeve_z+sleeve_h*0.2)))

# Coins arrondis silicone (bumpers)
for cx,cz in [(sleeve_x+12, sleeve_z+12),
              (sleeve_x+sleeve_w-12, sleeve_z+12),
              (sleeve_x+12, sleeve_z+sleeve_h-12),
              (sleeve_x+sleeve_w-12, sleeve_z+sleeve_h-12)]:
    P.append(cyl(cx, ay-SP, cz, 10, SP, 12))

# ══════════════════════════════════════════════════
# PIÈCE 3 : TABLETTE (glissée dans le moule)
# ══════════════════════════════════════════════════
tab_x = -TW/2
tab_z = sleeve_z + SP
tab_y = ay - 4

# Corps tablette noir
P.append(rbox(TW, TD, TH, 5, (tab_x, tab_y, tab_z)))

# Écran
sm = 7  # bezel
P.append(rbox(TW-2*sm, 1, TH-2*sm, 3, (tab_x+sm, tab_y-1, tab_z+sm)))

# Contenu écran — barre navigation haut
P.append(box(TW-30, 0.5, 8, (tab_x+15, tab_y-1.5, tab_z+TH-25)))

# Titre recette
P.append(box(110, 0.5, 14, (-55, tab_y-1.5, tab_z+TH-50)))

# Photo recette (carré droite)
P.append(box(55, 0.5, 55, (tab_x+TW-75, tab_y-1.5, tab_z+TH-85)))

# Affichage poids (gros, centre-gauche)
P.append(box(75, 0.5, 28, (tab_x+20, tab_y-1.5, tab_z+35)))

# Jauge couleur (verte→rouge)
P.append(box(TW-35, 0.5, 5, (tab_x+17, tab_y-1.5, tab_z+22)))

# Boutons bas écran
for bx in [tab_x+30, tab_x+90, tab_x+150, tab_x+210]:
    P.append(box(35, 0.5, 12, (bx, tab_y-1.5, tab_z+5)))

# Caméra haut
P.append(cyl(0, tab_y-1, tab_z+TH-10, 3, 1, 8))

# ══════════════════════════════════════════════════
# BOL DÉMO sur le plateau
# ══════════════════════════════════════════════════
P.append(cyl(0, -12, pz+2.5, 52, 5, 28))
P.append(cyl(0, -12, pz+7.5, 48, 28, 28))

# ══════════════════════════════════════════════════
# EXPORT
# ══════════════════════════════════════════════════
product = combine(P)
out = os.path.join(OUTPUT_DIR, 'restaumargin_station_final.stl')
product.save(out)

mn = product.vectors.reshape(-1,3).min(axis=0)
mx = product.vectors.reshape(-1,3).max(axis=0)
d = mx - mn
print(f"RestauMargin Station — FINAL DESIGN")
print(f"Dimensions: {d[0]:.0f} x {d[1]:.0f} x {d[2]:.0f} mm")
print(f"Faces: {product.vectors.shape[0]}")
print(f"Saved: {out}")
print(f"\nPièces:")
print(f"  1. Support-Balance (base + bras): {BW}x{BD}x{BH}mm base, bras {AH}mm")
print(f"  2. Moule silicone: {sleeve_w:.0f}x{sleeve_h:.0f}mm")
print(f"  3. Tablette: {TW}x{TH}x{TD}mm")
