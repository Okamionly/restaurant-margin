"""
RestauMargin Station — Pièces séparées pour impression 3D
Chaque pièce = 1 fichier STL individuel
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

# ══════════════════════════════════════════════════
# PIÈCE 1 : COQUE BASE (la balance)
# ══════════════════════════════════════════════════
def piece_base():
    P = []
    BW, BD, BH, BR = 310, 270, 42, 22
    # Coque principale
    P.append(rbox(BW, BD, BH, BR, (-BW/2, -BD/2, 0)))
    # Surélévation plateau
    P.append(rbox(210, 210, 4, 8, (-105, -105-12, BH)))
    # Plateau inox (surface)
    PW, PD = 190, 190
    pz = BH + 4
    P.append(rbox(PW, PD, 2.5, 6, (-PW/2, -PD/2-12, pz)))
    # Rebords plateau
    for dx,dy,dw,dd in [(-PW/2-6,-PD/2-18, PW+12, 6),
                         (-PW/2-6, PD/2-12+6, PW+12, 6),
                         (-PW/2-6,-PD/2-18, 6, PD+12),
                         ( PW/2,  -PD/2-18, 6, PD+12)]:
        P.append(rbox(dw, dd, 4, 3, (dx, dy, pz-2)))
    # LCD façade
    P.append(box(52, 4, 22, (-BW/2+28, -BD/2-2, 12)))
    P.append(box(46, 1.5, 17, (-BW/2+31, -BD/2-3.5, 14.5)))
    # Boutons
    for bx in [-15, 20, 55]:
        P.append(cyl(bx, -BD/2-2, 22, 7, 3, 14))
    # Patins
    for px,py in [(-BW/2+18,-BD/2+18),(BW/2-18,-BD/2+18),
                  (-BW/2+18,BD/2-18),(BW/2-18,BD/2-18)]:
        P.append(cyl(px, py, -3, 9, 3, 14))
    # USB-C + LED
    P.append(box(12, 4, 6, (-6, BD/2-2, 18)))
    P.append(cyl(-22, BD/2, 20, 2.5, 3, 8))
    # Ventilation
    for vz in range(12, 36, 5):
        P.append(box(30, 2, 2, (40, BD/2-1, vz)))
    # Mount pour le bras (connecteur arrière)
    P.append(rbox(70, 25, 20, 6, (-35, BD/2-40, BH)))
    return combine(P)

# ══════════════════════════════════════════════════
# PIÈCE 2 : BRAS VERTICAL
# ══════════════════════════════════════════════════
def piece_bras():
    P = []
    AW, AT, AH = 48, 16, 220
    # Bras principal
    P.append(rbox(AW, AT, AH, 8, (-AW/2, 0, 0)))
    # Base élargie (renfort)
    P.append(rbox(AW+12, AT+6, 50, 6, (-AW/2-6, -3, 0)))
    # Épaississement haut (transition berceau)
    P.append(rbox(AW+8, AT+4, 20, 6, (-AW/2-4, -2, AH-10)))
    # Connecteur bas (s'insère dans la base)
    P.append(rbox(44, 20, 25, 4, (-22, -2, -25)))
    # Connecteur haut (s'insère dans le berceau)
    P.append(rbox(44, 14, 15, 4, (-22, 1, AH+5)))
    return combine(P)

# ══════════════════════════════════════════════════
# PIÈCE 3 : BERCEAU SILICONE (moule tablette)
# ══════════════════════════════════════════════════
def piece_berceau():
    P = []
    TW, TH = 257, 169
    SP = 10  # épaisseur silicone
    sw = TW + 2*SP
    sh = TH + 2*SP

    # Backplate
    P.append(rbox(sw, SP + 16, sh, 12, (-sw/2, 0, 0)))
    # Lèvre basse
    P.append(rbox(sw, SP+10, SP+4, 5, (-sw/2, -SP, 0)))
    # Lèvre haute
    P.append(rbox(sw, SP+5, SP*0.7, 5, (-sw/2, -SP/2, sh-SP*0.7)))
    # Grip gauche
    P.append(rbox(SP, SP+6, sh*0.6, 5, (-sw/2, -SP/2-3, sh*0.2)))
    # Grip droit
    P.append(rbox(SP, SP+6, sh*0.6, 5, (sw/2-SP, -SP/2-3, sh*0.2)))
    # Bumpers coins
    for cx,cz in [(-sw/2+12, 12), (sw/2-12, 12),
                  (-sw/2+12, sh-12), (sw/2-12, sh-12)]:
        P.append(cyl(cx, -SP, cz, 10, SP, 12))
    # Connecteur bas (s'insère dans le bras)
    P.append(rbox(44, 14, 15, 4, (-22, 2, -15)))
    return combine(P)

# ══════════════════════════════════════════════════
# PIÈCE 4 : PLATEAU INOX (pas imprimé, pour visualisation)
# ══════════════════════════════════════════════════
def piece_plateau():
    P = []
    PW, PD = 190, 190
    P.append(rbox(PW, PD, 2, 6, (-PW/2, -PD/2, 0)))
    # Rebord
    for dx,dy,dw,dd in [(-PW/2, -PD/2, PW, 3),
                         (-PW/2, PD/2-3, PW, 3),
                         (-PW/2, -PD/2, 3, PD),
                         (PW/2-3, -PD/2, 3, PD)]:
        P.append(box(dw, dd, 5, (dx, dy, 2)))
    return combine(P)

# ══════════════════════════════════════════════════
# EXPORT
# ══════════════════════════════════════════════════
if __name__ == '__main__':
    pieces = [
        ('piece_1_base_balance', piece_base, '310x270x48mm', '~350g PETG', '8-10h'),
        ('piece_2_bras', piece_bras, '60x22x245mm', '~80g PETG', '2-3h'),
        ('piece_3_berceau_silicone', piece_berceau, '277x26x189mm', '~120g TPU', '4-5h'),
        ('piece_4_plateau_inox', piece_plateau, '190x190x7mm', 'Achat inox', 'N/A'),
    ]

    for name, gen_fn, dims, weight, time in pieces:
        p = gen_fn()
        path = os.path.join(OUTPUT_DIR, f'{name}.stl')
        p.save(path)
        mn = p.vectors.reshape(-1,3).min(axis=0)
        mx = p.vectors.reshape(-1,3).max(axis=0)
        d = mx - mn
        print(f"  {name}.stl — {d[0]:.0f}x{d[1]:.0f}x{d[2]:.0f}mm — {weight} — {time} — {p.vectors.shape[0]} faces")

    print(f"\n4 fichiers STL générés dans {OUTPUT_DIR}")
