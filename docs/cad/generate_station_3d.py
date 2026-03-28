"""
RestauMargin Station — 3D CAD Model Generator
Generates STL files for the hardware kit support:
- Base shell (lower casing with scale compartment)
- Tablet cradle (adjustable bracket)
- Steel plate (weighing surface)
- Full assembly
"""
import numpy as np
from stl import mesh
import os

OUTPUT_DIR = os.path.dirname(os.path.abspath(__file__))

# ── Dimensions (mm) ──────────────────────────────────────
# Base shell
BASE_W = 350       # width (X)
BASE_D = 300       # depth (Y)
BASE_H = 65        # height (Z)
WALL = 4           # wall thickness
CORNER_R = 12      # corner radius (simplified as chamfer)

# Tablet cradle
TAB_W = 270        # tablet width slot
TAB_H = 180        # tablet height slot
TAB_THICK = 15     # cradle thickness
TAB_LIP = 8        # lip to hold tablet

# Steel plate
PLATE_W = 200
PLATE_D = 200
PLATE_H = 1.5
PLATE_RIM = 5      # rim height

# Tablet arm
ARM_H = 220        # height of the arm behind base
ARM_W = 40         # arm width
ARM_T = 8          # arm thickness

# Hinge position
HINGE_Y = BASE_D - 30  # near back of base

# ── Helper: Create box mesh ──────────────────────────────
def create_box(w, d, h, offset=(0, 0, 0)):
    """Create a solid box as STL mesh"""
    ox, oy, oz = offset
    vertices = np.array([
        [ox,     oy,     oz],
        [ox + w, oy,     oz],
        [ox + w, oy + d, oz],
        [ox,     oy + d, oz],
        [ox,     oy,     oz + h],
        [ox + w, oy,     oz + h],
        [ox + w, oy + d, oz + h],
        [ox,     oy + d, oz + h],
    ])
    faces = np.array([
        [0, 3, 1], [1, 3, 2],  # bottom
        [0, 4, 7], [0, 7, 3],  # left
        [4, 5, 6], [4, 6, 7],  # top
        [5, 1, 2], [5, 2, 6],  # right
        [2, 3, 6], [3, 7, 6],  # back
        [0, 1, 5], [0, 5, 4],  # front
    ])
    box = mesh.Mesh(np.zeros(faces.shape[0], dtype=mesh.Mesh.dtype))
    for i, f in enumerate(faces):
        for j in range(3):
            box.vectors[i][j] = vertices[f[j]]
    return box

def create_hollow_box(w, d, h, wall, offset=(0, 0, 0)):
    """Create a hollow box (outer - inner) approximated as 5 panels"""
    ox, oy, oz = offset
    panels = []
    # Bottom
    panels.append(create_box(w, d, wall, (ox, oy, oz)))
    # Left wall
    panels.append(create_box(wall, d, h, (ox, oy, oz)))
    # Right wall
    panels.append(create_box(wall, d, h, (ox + w - wall, oy, oz)))
    # Front wall
    panels.append(create_box(w, wall, h, (ox, oy, oz)))
    # Back wall
    panels.append(create_box(w, wall, h, (ox, oy + d - wall, oz)))
    return panels

def combine_meshes(mesh_list):
    """Combine multiple meshes into one"""
    total_faces = sum(m.vectors.shape[0] for m in mesh_list)
    combined = mesh.Mesh(np.zeros(total_faces, dtype=mesh.Mesh.dtype))
    idx = 0
    for m in mesh_list:
        n = m.vectors.shape[0]
        combined.vectors[idx:idx + n] = m.vectors
        idx += n
    return combined

# ── Generate Base Shell ──────────────────────────────────
def generate_base():
    """Lower casing with compartments"""
    parts = []

    # Outer shell (hollow box)
    parts.extend(create_hollow_box(BASE_W, BASE_D, BASE_H, WALL))

    # Scale compartment platform (raised center)
    platform_x = (BASE_W - PLATE_W) / 2
    platform_y = (BASE_D - PLATE_D) / 2 - 20  # offset forward
    parts.append(create_box(PLATE_W + 20, PLATE_D + 20, WALL + 5,
                           (platform_x - 10, platform_y - 10, WALL)))

    # Electronics compartment (rear section)
    elec_w = BASE_W - 2 * WALL - 20
    elec_d = 60
    elec_h = 30
    elec_x = WALL + 10
    elec_y = BASE_D - WALL - elec_d - 5
    parts.extend(create_hollow_box(elec_w, elec_d, elec_h, WALL * 0.6,
                                   (elec_x, elec_y, WALL)))

    # USB-C port cutout marker (small box on back)
    usb_w, usb_h = 12, 7
    usb_x = BASE_W / 2 - usb_w / 2
    usb_z = WALL + 10
    parts.append(create_box(usb_w, 2, usb_h, (usb_x, BASE_D - 2, usb_z)))

    # LCD display housing (front)
    lcd_w, lcd_h = 60, 25
    lcd_x = 30
    lcd_z = WALL + 15
    parts.append(create_box(lcd_w, WALL + 2, lcd_h, (lcd_x, 0, lcd_z)))

    # Button markers (Tare, On/Off)
    for i, bx in enumerate([110, 145]):
        parts.append(create_box(20, 3, 12, (bx, 0, WALL + 20)))

    # Anti-slip pads (4 corners)
    pad_r = 10
    pad_h = 3
    for px, py in [(20, 20), (BASE_W - 30, 20), (20, BASE_D - 30), (BASE_W - 30, BASE_D - 30)]:
        parts.append(create_box(pad_r, pad_r, pad_h, (px, py, -pad_h)))

    # Arm mount (back center, for tablet support arm)
    arm_mount_w = ARM_W + 10
    arm_mount_x = BASE_W / 2 - arm_mount_w / 2
    parts.append(create_box(arm_mount_w, 20, 25, (arm_mount_x, BASE_D - 25, BASE_H)))

    return combine_meshes(parts)

# ── Generate Steel Plate ─────────────────────────────────
def generate_plate():
    """Stainless steel weighing plate with rim"""
    parts = []
    # Main plate
    parts.append(create_box(PLATE_W, PLATE_D, PLATE_H))
    # Rim (4 sides)
    parts.append(create_box(PLATE_W, 2, PLATE_RIM, (0, 0, PLATE_H)))  # front
    parts.append(create_box(PLATE_W, 2, PLATE_RIM, (0, PLATE_D - 2, PLATE_H)))  # back
    parts.append(create_box(2, PLATE_D, PLATE_RIM, (0, 0, PLATE_H)))  # left
    parts.append(create_box(2, PLATE_D, PLATE_RIM, (PLATE_W - 2, 0, PLATE_H)))  # right

    plate = combine_meshes(parts)
    # Position on base
    plate.translate([(BASE_W - PLATE_W) / 2, (BASE_D - PLATE_D) / 2 - 20, BASE_H])
    return plate

# ── Generate Tablet Arm + Cradle ─────────────────────────
def generate_tablet_cradle():
    """Vertical arm with tablet cradle at top"""
    parts = []

    # Vertical arm (behind base, center)
    arm_x = BASE_W / 2 - ARM_W / 2
    arm_y = BASE_D - 15
    parts.append(create_box(ARM_W, ARM_T, ARM_H, (arm_x, arm_y, BASE_H)))

    # Cradle backplate
    cradle_x = BASE_W / 2 - TAB_W / 2
    cradle_z = BASE_H + ARM_H - TAB_H - 10
    parts.append(create_box(TAB_W, TAB_THICK, TAB_H, (cradle_x, arm_y, cradle_z)))

    # Bottom lip (holds tablet)
    parts.append(create_box(TAB_W, TAB_THICK + TAB_LIP, TAB_LIP,
                           (cradle_x, arm_y, cradle_z)))

    # Top lip
    parts.append(create_box(TAB_W, TAB_THICK + TAB_LIP / 2, TAB_LIP / 2,
                           (cradle_x, arm_y, cradle_z + TAB_H - TAB_LIP / 2)))

    # Side grips
    for sx in [cradle_x - 5, cradle_x + TAB_W]:
        parts.append(create_box(5, TAB_THICK + TAB_LIP, TAB_H * 0.6,
                               (sx, arm_y, cradle_z + TAB_H * 0.2)))

    # Hinge cylinder approximation (box at base of arm)
    hinge_w = ARM_W + 20
    hinge_x = BASE_W / 2 - hinge_w / 2
    parts.append(create_box(hinge_w, 15, 15, (hinge_x, arm_y - 3, BASE_H - 2)))

    return combine_meshes(parts)

# ── Generate Full Assembly ───────────────────────────────
def generate_assembly():
    """Complete RestauMargin Station"""
    base = generate_base()
    plate = generate_plate()
    cradle = generate_tablet_cradle()
    return combine_meshes([base, plate, cradle])

# ── Main ─────────────────────────────────────────────────
if __name__ == '__main__':
    print("Generating RestauMargin Station 3D models...")

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Generate individual parts
    print("  [1/4] Base shell...")
    base = generate_base()
    base.save(os.path.join(OUTPUT_DIR, 'station_base.stl'))

    print("  [2/4] Steel plate...")
    plate = generate_plate()
    plate.save(os.path.join(OUTPUT_DIR, 'station_plate.stl'))

    print("  [3/4] Tablet cradle...")
    cradle = generate_tablet_cradle()
    cradle.save(os.path.join(OUTPUT_DIR, 'station_cradle.stl'))

    print("  [4/4] Full assembly...")
    assembly = generate_assembly()
    assembly.save(os.path.join(OUTPUT_DIR, 'station_assembly.stl'))

    print(f"\nDone! Files saved to: {OUTPUT_DIR}")
    print("  - station_base.stl     (coque inférieure)")
    print("  - station_plate.stl    (plateau inox)")
    print("  - station_cradle.stl   (bras + berceau tablette)")
    print("  - station_assembly.stl (assemblage complet)")

    # Print dimensions summary
    for name, m in [("Base", base), ("Plate", plate), ("Cradle", cradle), ("Assembly", assembly)]:
        min_coords = m.vectors.reshape(-1, 3).min(axis=0)
        max_coords = m.vectors.reshape(-1, 3).max(axis=0)
        dims = max_coords - min_coords
        print(f"\n  {name}: {dims[0]:.0f} x {dims[1]:.0f} x {dims[2]:.0f} mm")
