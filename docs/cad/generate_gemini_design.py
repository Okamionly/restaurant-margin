"""
RestauMargin Station — Gemini Concept Exact Replica
Design organique, coins arrondis, monobloc blanc
Fidèle à l'image concept Gemini
"""
import numpy as np
from stl import mesh
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_box(w, d, h, offset=(0, 0, 0)):
    ox, oy, oz = offset
    vertices = np.array([
        [ox, oy, oz], [ox+w, oy, oz], [ox+w, oy+d, oz], [ox, oy+d, oz],
        [ox, oy, oz+h], [ox+w, oy, oz+h], [ox+w, oy+d, oz+h], [ox, oy+d, oz+h],
    ])
    faces = np.array([
        [0,3,1],[1,3,2],[0,4,7],[0,7,3],[4,5,6],[4,6,7],
        [5,1,2],[5,2,6],[2,3,6],[3,7,6],[0,1,5],[0,5,4],
    ])
    box = mesh.Mesh(np.zeros(12, dtype=mesh.Mesh.dtype))
    for i, f in enumerate(faces):
        for j in range(3):
            box.vectors[i][j] = vertices[f[j]]
    return box

def cylinder(cx, cy, cz, r, h, sides=24):
    parts = []
    angles = np.linspace(0, 2*np.pi, sides+1)[:-1]
    for i in range(sides):
        a1, a2 = angles[i], angles[(i+1) % sides]
        x1, y1 = cx + r*np.cos(a1), cy + r*np.sin(a1)
        x2, y2 = cx + r*np.cos(a2), cy + r*np.sin(a2)
        verts = np.array([
            [cx,cy,cz],[x1,y1,cz],[x2,y2,cz],
            [cx,cy,cz+h],[x1,y1,cz+h],[x2,y2,cz+h],
        ])
        fa = np.array([[0,2,1],[3,4,5],[1,2,5],[1,5,4]])
        tri = mesh.Mesh(np.zeros(4, dtype=mesh.Mesh.dtype))
        for fi, f in enumerate(fa):
            for j in range(3):
                tri.vectors[fi][j] = verts[f[j]]
        parts.append(tri)
    return combine(parts)

def rounded_plate(w, d, h, r, cx, cy, cz, segments=8):
    """Create a plate with rounded corners"""
    parts = []
    # Main cross
    parts.append(create_box(w - 2*r, d, h, (cx + r, cy, cz)))
    parts.append(create_box(w, d - 2*r, h, (cx, cy + r, cz)))
    # Corner cylinders
    for (ccx, ccy) in [(cx+r, cy+r), (cx+w-r, cy+r), (cx+r, cy+d-r), (cx+w-r, cy+d-r)]:
        parts.append(cylinder(ccx, ccy, cz, r, h, segments))
    return combine(parts)

def combine(parts):
    total = sum(m.vectors.shape[0] for m in parts)
    c = mesh.Mesh(np.zeros(total, dtype=mesh.Mesh.dtype))
    idx = 0
    for m in parts:
        n = m.vectors.shape[0]
        c.vectors[idx:idx+n] = m.vectors
        idx += n
    return c

# ══════════════════════════════════════════════════
# DIMENSIONS (fidèle à l'image Gemini)
# ══════════════════════════════════════════════════
BASE_W = 320      # largeur base
BASE_D = 280      # profondeur base
BASE_H = 45       # hauteur base (plate comme sur l'image)
BASE_R = 25       # rayon coins arrondis (très rond, galet)

PLATE_W = 190     # plateau inox
PLATE_D = 190
PLATE_INSET = 3   # encastrement dans la coque

ARM_W = 55        # largeur bras
ARM_T = 20        # épaisseur bras
ARM_H = 150       # hauteur bras (court comme sur l'image ~15cm)

TAB_W = 257       # tablette Samsung
TAB_H = 169
CRADLE_PAD = 12   # épaisseur berceau autour tablette

parts = []

# ══════════════════════════════════════════════════
# 1. BASE — Forme galet, coins très arrondis
# ══════════════════════════════════════════════════
parts.append(rounded_plate(BASE_W, BASE_D, BASE_H, BASE_R, -BASE_W/2, -BASE_D/2, 0))

# Légère surélévation centrale (là où le plateau va)
parts.append(rounded_plate(PLATE_W + 30, PLATE_D + 30, 3, 10,
             -(PLATE_W+30)/2, -(PLATE_D+30)/2 - 10, BASE_H))

# ══════════════════════════════════════════════════
# 2. PLATEAU INOX — Enveloppé, légèrement en retrait
# ══════════════════════════════════════════════════
plate_z = BASE_H + 3 - PLATE_INSET
plate_cx = -PLATE_W/2
plate_cy = -PLATE_D/2 - 10  # légèrement vers l'avant

# Plateau inox (surface visible)
parts.append(rounded_plate(PLATE_W, PLATE_D, 2, 8, plate_cx, plate_cy, plate_z))

# Rebord doux enveloppant (la coque monte autour du plateau)
rim_w = 8
# Front rim
parts.append(rounded_plate(PLATE_W + 2*rim_w, rim_w, 5, 4,
             plate_cx - rim_w, plate_cy - rim_w, plate_z - 3))
# Back rim
parts.append(rounded_plate(PLATE_W + 2*rim_w, rim_w, 5, 4,
             plate_cx - rim_w, plate_cy + PLATE_D, plate_z - 3))
# Left rim
parts.append(rounded_plate(rim_w, PLATE_D + 2*rim_w, 5, 4,
             plate_cx - rim_w, plate_cy - rim_w, plate_z - 3))
# Right rim
parts.append(rounded_plate(rim_w, PLATE_D + 2*rim_w, 5, 4,
             plate_cx + PLATE_W, plate_cy - rim_w, plate_z - 3))

# ══════════════════════════════════════════════════
# 3. BOL DE DÉMO (sur le plateau)
# ══════════════════════════════════════════════════
bowl_cx = 0
bowl_cy = -10
bowl_z = plate_z + 2
parts.append(cylinder(bowl_cx, bowl_cy, bowl_z, 55, 6, 32))
parts.append(cylinder(bowl_cx, bowl_cy, bowl_z + 6, 50, 30, 32))

# ══════════════════════════════════════════════════
# 4. LCD — Petit écran en façade bas-gauche
# ══════════════════════════════════════════════════
lcd_x = -BASE_W/2 + 30
lcd_y = -BASE_D/2 - 2
lcd_z = 15
# Fenêtre LCD
parts.append(create_box(50, 3, 20, (lcd_x, lcd_y, lcd_z)))
# Écran LCD (vert)
parts.append(create_box(44, 1, 16, (lcd_x + 3, lcd_y - 1, lcd_z + 2)))

# ══════════════════════════════════════════════════
# 5. BRAS — Part du centre arrière, court et épais
# ══════════════════════════════════════════════════
arm_x = -ARM_W/2
arm_y = BASE_D/2 - ARM_T - 15  # Centre arrière

# Base du bras (transition douce depuis la base)
parts.append(rounded_plate(ARM_W + 30, ARM_T + 15, 25, 10,
             arm_x - 15, arm_y - 5, BASE_H))

# Bras vertical (arrondi)
parts.append(rounded_plate(ARM_W, ARM_T, ARM_H, 10,
             arm_x, arm_y, BASE_H + 20))

# Épaississement bas du bras (triangle de renfort)
parts.append(rounded_plate(ARM_W + 15, ARM_T + 8, 40, 8,
             arm_x - 7, arm_y - 4, BASE_H + 15))

# ══════════════════════════════════════════════════
# 6. BERCEAU TABLETTE — Enveloppe la tablette
# ══════════════════════════════════════════════════
cradle_w = TAB_W + 2*CRADLE_PAD
cradle_h = TAB_H + 2*CRADLE_PAD
cradle_z = BASE_H + 20 + ARM_H - cradle_h + 10
cradle_x = -cradle_w/2

# Backplate du berceau (arrondi)
parts.append(rounded_plate(cradle_w, CRADLE_PAD + ARM_T, cradle_h, 15,
             cradle_x, arm_y, cradle_z))

# Bord gauche berceau
parts.append(rounded_plate(CRADLE_PAD, CRADLE_PAD + 5, cradle_h, 6,
             cradle_x, arm_y - 5, cradle_z))

# Bord droit berceau
parts.append(rounded_plate(CRADLE_PAD, CRADLE_PAD + 5, cradle_h, 6,
             cradle_x + cradle_w - CRADLE_PAD, arm_y - 5, cradle_z))

# Lèvre basse (tient la tablette)
parts.append(rounded_plate(cradle_w, CRADLE_PAD + 8, CRADLE_PAD, 6,
             cradle_x, arm_y - 8, cradle_z))

# Lèvre haute (petite)
parts.append(rounded_plate(cradle_w, CRADLE_PAD + 3, CRADLE_PAD * 0.6, 6,
             cradle_x, arm_y - 3, cradle_z + cradle_h - CRADLE_PAD * 0.6))

# ══════════════════════════════════════════════════
# 7. TABLETTE — Enveloppée dans le berceau
# ══════════════════════════════════════════════════
tab_x = -TAB_W/2
tab_z = cradle_z + CRADLE_PAD
tab_y = arm_y - 3

# Corps tablette (noir)
parts.append(rounded_plate(TAB_W, 7, TAB_H, 5, tab_x, tab_y, tab_z))

# Écran (légèrement en avant)
screen_margin = 8
parts.append(rounded_plate(TAB_W - 2*screen_margin, 1, TAB_H - 2*screen_margin, 3,
             tab_x + screen_margin, tab_y - 1, tab_z + screen_margin))

# Contenu écran — Titre recette
parts.append(create_box(120, 0.5, 15, (-60, tab_y - 1.5, tab_z + TAB_H - 35)))

# Affichage poids (gros)
parts.append(create_box(80, 0.5, 30, (-40, tab_y - 1.5, tab_z + 40)))

# Jauge couleur (barre)
parts.append(create_box(TAB_W - 40, 0.5, 6, (tab_x + 20, tab_y - 1.5, tab_z + 25)))

# Photo recette (carré en haut droite)
parts.append(create_box(50, 0.5, 50, (tab_x + TAB_W - 70, tab_y - 1.5, tab_z + TAB_H - 75)))

# ══════════════════════════════════════════════════
# 8. DÉTAILS
# ══════════════════════════════════════════════════
# Patins antidérapants (4 coins)
for px, py in [(-BASE_W/2+20, -BASE_D/2+20), (BASE_W/2-20, -BASE_D/2+20),
               (-BASE_W/2+20, BASE_D/2-20), (BASE_W/2-20, BASE_D/2-20)]:
    parts.append(cylinder(px, py, -3, 8, 3, 16))

# USB-C arrière
parts.append(create_box(12, 4, 6, (-6, BASE_D/2 - 2, 20)))

# LED power
parts.append(cylinder(-25, BASE_D/2, 22, 2.5, 3, 8))

# ══════════════════════════════════════════════════
# EXPORT
# ══════════════════════════════════════════════════
product = combine(parts)
out = os.path.join(OUTPUT_DIR, 'station_gemini_design.stl')
product.save(out)

mn = product.vectors.reshape(-1, 3).min(axis=0)
mx = product.vectors.reshape(-1, 3).max(axis=0)
dims = mx - mn
print(f"RestauMargin Station — Gemini Design")
print(f"Dimensions: {dims[0]:.0f} x {dims[1]:.0f} x {dims[2]:.0f} mm")
print(f"Faces: {product.vectors.shape[0]}")
print(f"Saved: {out}")
