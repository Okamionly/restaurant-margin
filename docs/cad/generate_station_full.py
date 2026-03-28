"""
RestauMargin Station — Full Product 3D Model
With tablet, scale, and all visible components integrated
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
    box = mesh.Mesh(np.zeros(faces.shape[0], dtype=mesh.Mesh.dtype))
    for i, f in enumerate(faces):
        for j in range(3):
            box.vectors[i][j] = vertices[f[j]]
    return box

def combine(parts):
    total = sum(m.vectors.shape[0] for m in parts)
    c = mesh.Mesh(np.zeros(total, dtype=mesh.Mesh.dtype))
    idx = 0
    for m in parts:
        n = m.vectors.shape[0]
        c.vectors[idx:idx+n] = m.vectors
        idx += n
    return c

def create_cylinder_approx(cx, cy, cz, radius, height, sides=16):
    """Approximate cylinder with polygonal prism"""
    parts = []
    angles = np.linspace(0, 2*np.pi, sides+1)[:-1]
    for i in range(sides):
        a1, a2 = angles[i], angles[(i+1) % sides]
        x1, y1 = cx + radius * np.cos(a1), cy + radius * np.sin(a1)
        x2, y2 = cx + radius * np.cos(a2), cy + radius * np.sin(a2)

        verts = np.array([
            [cx, cy, cz], [x1, y1, cz], [x2, y2, cz],
            [cx, cy, cz+height], [x1, y1, cz+height], [x2, y2, cz+height],
        ])
        faces_arr = np.array([
            [0,2,1], [3,4,5],  # top/bottom caps
            [1,2,5], [1,5,4],  # side
        ])
        tri = mesh.Mesh(np.zeros(4, dtype=mesh.Mesh.dtype))
        for fi, f in enumerate(faces_arr):
            for j in range(3):
                tri.vectors[fi][j] = verts[f[j]]
        parts.append(tri)
    return combine(parts)

# ══════════════════════════════════════════════════════════
# DIMENSIONS
# ══════════════════════════════════════════════════════════
BASE_W, BASE_D, BASE_H = 350, 300, 60
WALL = 4
PLATE_W, PLATE_D = 200, 200
TAB_W, TAB_D, TAB_H = 257, 7, 169  # Samsung Tab A9+ landscape

parts = []

# ══════════════════════════════════════════════════════════
# 1. BASE SHELL — White casing
# ══════════════════════════════════════════════════════════

# Bottom plate
parts.append(create_box(BASE_W, BASE_D, WALL))
# Left wall
parts.append(create_box(WALL, BASE_D, BASE_H))
# Right wall
parts.append(create_box(WALL, BASE_D, BASE_H, (BASE_W - WALL, 0, 0)))
# Front wall
parts.append(create_box(BASE_W, WALL, BASE_H))
# Back wall
parts.append(create_box(BASE_W, WALL, BASE_H, (0, BASE_D - WALL, 0)))

# Top shell (with cutout for plate) - front section
parts.append(create_box((BASE_W - PLATE_W) / 2 - 5, BASE_D - 2*WALL, WALL,
                        (WALL, WALL, BASE_H - WALL)))
# Top shell right section
parts.append(create_box((BASE_W - PLATE_W) / 2 - 5, BASE_D - 2*WALL, WALL,
                        (BASE_W - (BASE_W - PLATE_W) / 2 + 5, WALL, BASE_H - WALL)))
# Top shell front strip
plate_x = (BASE_W - PLATE_W) / 2
plate_y = (BASE_D - PLATE_D) / 2 - 15
parts.append(create_box(BASE_W - 2*WALL, plate_y - WALL, WALL,
                        (WALL, WALL, BASE_H - WALL)))
# Top shell back strip
parts.append(create_box(BASE_W - 2*WALL, BASE_D - WALL - (plate_y + PLATE_D + 10), WALL,
                        (WALL, plate_y + PLATE_D + 10, BASE_H - WALL)))

# Front panel details — LCD window
lcd_x, lcd_w, lcd_h = 25, 55, 22
parts.append(create_box(lcd_w + 4, 2, lcd_h + 4, (lcd_x - 2, -2, 18)))
# LCD screen (dark, recessed)
parts.append(create_box(lcd_w, 1, lcd_h, (lcd_x, -1, 20)))

# Buttons — Tare and On/Off
for bx in [100, 135, 170]:
    parts.append(create_box(22, 3, 10, (bx, -3, 25)))

# Anti-slip feet (4 corners)
for px, py in [(15, 15), (BASE_W-25, 15), (15, BASE_D-25), (BASE_W-25, BASE_D-25)]:
    parts.append(create_cylinder_approx(px+5, py+5, -4, 8, 4, 12))

# ══════════════════════════════════════════════════════════
# 2. STEEL PLATE — Inox 304L weighing surface
# ══════════════════════════════════════════════════════════

plate_z = BASE_H - WALL + 1  # slightly above top shell

# Main plate
parts.append(create_box(PLATE_W, PLATE_D, 2, (plate_x, plate_y, plate_z)))
# Rim - front
parts.append(create_box(PLATE_W, 2, 6, (plate_x, plate_y, plate_z)))
# Rim - back
parts.append(create_box(PLATE_W, 2, 6, (plate_x, plate_y + PLATE_D - 2, plate_z)))
# Rim - left
parts.append(create_box(2, PLATE_D, 6, (plate_x, plate_y, plate_z)))
# Rim - right
parts.append(create_box(2, PLATE_D, 6, (plate_x + PLATE_W - 2, plate_y, plate_z)))

# ══════════════════════════════════════════════════════════
# 3. FOOD BOWL on plate (demo item)
# ══════════════════════════════════════════════════════════

bowl_cx = plate_x + PLATE_W / 2
bowl_cy = plate_y + PLATE_D / 2
bowl_z = plate_z + 2
# Simple bowl shape — cylinder
parts.append(create_cylinder_approx(bowl_cx, bowl_cy, bowl_z, 65, 8, 24))
parts.append(create_cylinder_approx(bowl_cx, bowl_cy, bowl_z + 8, 60, 35, 24))

# ══════════════════════════════════════════════════════════
# 4. TABLET ARM — Vertical support
# ══════════════════════════════════════════════════════════

arm_w = 50
arm_t = 12
arm_h = 200
arm_x = BASE_W / 2 - arm_w / 2
arm_y = BASE_D - 20

# Hinge base (thick block)
hinge_w = arm_w + 30
hinge_x = BASE_W / 2 - hinge_w / 2
parts.append(create_box(hinge_w, 25, 20, (hinge_x, arm_y - 5, BASE_H)))
# Hinge cylinders (left and right)
for hx in [hinge_x + 5, hinge_x + hinge_w - 15]:
    parts.append(create_cylinder_approx(hx + 5, arm_y + 7, BASE_H + 5, 8, 10, 12))

# Vertical arm
parts.append(create_box(arm_w, arm_t, arm_h, (arm_x, arm_y, BASE_H + 20)))

# Arm taper (wider at base, narrower at top)
parts.append(create_box(arm_w + 10, arm_t + 4, 30, (arm_x - 5, arm_y - 2, BASE_H + 20)))

# ══════════════════════════════════════════════════════════
# 5. TABLET CRADLE — Holds the Samsung Tab A9+
# ══════════════════════════════════════════════════════════

cradle_z = BASE_H + 20 + arm_h - TAB_H - 20
cradle_x = BASE_W / 2 - (TAB_W + 20) / 2
cradle_total_w = TAB_W + 20
cradle_total_h = TAB_H + 20

# Cradle backplate (white shell)
parts.append(create_box(cradle_total_w, 15, cradle_total_h,
                        (cradle_x, arm_y, cradle_z)))

# Rounded corners/bumpers (simplified as blocks at corners)
bump = 12
for cx, cz in [(cradle_x, cradle_z),
               (cradle_x + cradle_total_w - bump, cradle_z),
               (cradle_x, cradle_z + cradle_total_h - bump),
               (cradle_x + cradle_total_w - bump, cradle_z + cradle_total_h - bump)]:
    parts.append(create_box(bump, 18, bump, (cx, arm_y - 3, cz)))

# Bottom lip (holds tablet from falling)
parts.append(create_box(cradle_total_w, 20, 12, (cradle_x, arm_y - 5, cradle_z)))

# Top lip (smaller)
parts.append(create_box(cradle_total_w, 12, 8,
                        (cradle_x, arm_y - 2, cradle_z + cradle_total_h - 8)))

# Side grips
grip_h = cradle_total_h * 0.5
grip_z = cradle_z + cradle_total_h * 0.25
for gx in [cradle_x - 6, cradle_x + cradle_total_w]:
    parts.append(create_box(6, 18, grip_h, (gx, arm_y - 3, grip_z)))

# ══════════════════════════════════════════════════════════
# 6. TABLET — Samsung Galaxy Tab A9+ (dark screen)
# ══════════════════════════════════════════════════════════

tab_x = BASE_W / 2 - TAB_W / 2
tab_z = cradle_z + 10  # offset inside cradle
tab_y = arm_y - 2

# Tablet body (dark)
parts.append(create_box(TAB_W, TAB_D, TAB_H, (tab_x, tab_y, tab_z)))

# Screen bezel (slightly recessed)
bezel = 6
parts.append(create_box(TAB_W - 2*bezel, 1, TAB_H - 2*bezel,
                        (tab_x + bezel, tab_y - 1, tab_z + bezel)))

# Camera dot (top center)
cam_x = tab_x + TAB_W / 2
cam_z = tab_z + TAB_H - 8
parts.append(create_cylinder_approx(cam_x, tab_y - 1.5, cam_z, 3, 1, 8))

# ══════════════════════════════════════════════════════════
# 7. ELECTRONICS visible on back
# ══════════════════════════════════════════════════════════

# USB-C port (back of base)
usb_x = BASE_W / 2 - 6
parts.append(create_box(12, 4, 6, (usb_x, BASE_D - 2, 25)))

# Power LED
parts.append(create_cylinder_approx(usb_x - 15, BASE_D, 30, 2.5, 3, 8))

# Ventilation slots (back)
for vz in range(15, 45, 6):
    parts.append(create_box(40, 2, 2, (BASE_W / 2 + 20, BASE_D - 1, vz)))

# ══════════════════════════════════════════════════════════
# SAVE
# ══════════════════════════════════════════════════════════

product = combine(parts)
out_path = os.path.join(OUTPUT_DIR, 'station_product_full.stl')
product.save(out_path)

mn = product.vectors.reshape(-1, 3).min(axis=0)
mx = product.vectors.reshape(-1, 3).max(axis=0)
dims = mx - mn
print(f"RestauMargin Station — Full Product Model")
print(f"Dimensions: {dims[0]:.0f} x {dims[1]:.0f} x {dims[2]:.0f} mm")
print(f"Faces: {product.vectors.shape[0]}")
print(f"Saved to: {out_path}")
