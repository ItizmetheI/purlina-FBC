# PURLINA world v3 — ONE pod, ONE unbroken camera. (client v4 brochure, p2 pod)
# A single hall: racks -> heat zone -> data bars -> THE POD (camera breaches the
# fluid, a blade lifts out, molecule chain) -> X1/X2/X3 columns -> rise + wide.
# Royal blue on near-black navy, per brochure. No plates, no cuts, no seams.
import bpy
import os
import sys
import math
import random

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out") + os.sep

FPS = 24
TOTAL = 1152

random.seed(7)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for d in (bpy.data.meshes, bpy.data.materials, bpy.data.lights,
          bpy.data.cameras, bpy.data.images, bpy.data.curves):
    for item in list(d):
        try:
            d.remove(item)
        except Exception:
            pass

scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = TOTAL

# ---------- palette (brochure royal blue) ----------
NAVY = (0.0008, 0.002, 0.010)
BLUE = (0.05, 0.22, 1.0)        # royal blue emission
BLUE_SOFT = (0.10, 0.30, 1.0)
RED = (1.0, 0.16, 0.05)
WHITE = (0.9, 0.94, 1.0)

world = bpy.data.worlds.new("void")
scene.world = world
world.use_nodes = True
world.node_tree.nodes["Background"].inputs[0].default_value = (*NAVY, 1)
wvol = world.node_tree.nodes.new("ShaderNodeVolumePrincipled")
wvol.inputs["Color"].default_value = (0.12, 0.28, 0.85, 1)
wvol.inputs["Density"].default_value = 0.013
try:
    wvol.inputs["Anisotropy"].default_value = 0.55
except KeyError:
    pass
wout = world.node_tree.nodes["World Output"]
world.node_tree.links.new(wvol.outputs["Volume"], wout.inputs["Volume"])


def mat_emission(name, color, strength):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs[0].default_value = (*color, 1)
    em.inputs[1].default_value = strength
    nt.links.new(em.outputs[0], out.inputs[0])
    return m


def mat_dark(name, color=(0.022, 0.032, 0.062), rough=0.5, metal=0.4):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    return m


def mat_glass(name, tint=(0.75, 0.85, 1.0), rough=0.02):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*tint, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = 0.0
    try:
        b.inputs["Transmission Weight"].default_value = 1.0
    except KeyError:
        b.inputs["Transmission"].default_value = 1.0
    b.inputs["Alpha"].default_value = 0.14
    m.blend_method = "BLEND"
    m.use_backface_culling = True
    return m


def box(name, size, loc, mat, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    o.data.materials.append(mat)
    return o


M_BODY = mat_dark("body")
M_FLOOR = mat_dark("floor", (0.004, 0.007, 0.016), rough=0.12, metal=0.85)
M_LED_B = mat_emission("ledB", BLUE, 7)
M_LED_R = mat_emission("ledR", RED, 22)
M_GLOW = mat_emission("glow", BLUE_SOFT, 5)
M_GLASS = mat_glass("glass")
BUBM = mat_emission("bub", (0.75, 0.88, 1.0), 2.2)
BUBM.blend_method = "BLEND"
BUBM.use_nodes = True
M_WHITE = mat_emission("white", WHITE, 7)

# ---------- floor ----------
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 60, 0))
fl = bpy.context.object
fl.scale = (30, 170, 1)
fl.data.materials.append(M_FLOOR)

# ---------- enclosure: side walls + ceiling ----------
M_WALL = mat_dark("wall", (0.012, 0.02, 0.045), rough=0.65, metal=0.15)
for wx in (-7.0, 7.0):
    bpy.ops.mesh.primitive_plane_add(size=1, location=(wx, 60, 2.75),
                                     rotation=(0, math.pi / 2, 0))
    w = bpy.context.object
    w.scale = (5.5, 170, 1)
    w.data.materials.append(M_WALL)
    # faint horizontal seam lights along each wall
    for sz in (1.1, 3.4):
        box("seam", (0.03, 320, 0.025), (wx * 0.985, 60, sz), mat_emission(f"seam{wx}{sz}", BLUE_SOFT, 2.5))
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 60, 5.5), rotation=(math.pi, 0, 0))
ceil = bpy.context.object
ceil.scale = (30, 170, 1)
ceil.data.materials.append(M_WALL)

# ---------- rack hall: y -18 .. 62, rows at x = +/-4.2 ----------
# heat zone y in [10, 34] burns red (the problem); blue elsewhere
for side in (-4.2, 4.2):
    y = -18.0
    while y < 62.0:
        r = box(f"rack{side}{y:.0f}", (1.6, 2.0, 2.6), (side, y, 1.3), M_BODY)
        hot = 10.0 < y < 34.0
        led = M_LED_R if hot else M_LED_B
        for i in range(5):
            box("led", (0.04, 1.3, 0.02),
                (side + (0.85 if side < 0 else -0.85), y, 0.45 + i * 0.5), led)
        y += 2.6

# ---------- data bar chart: 2010-2029 along left wall, y 38..58 ----------
ZB = [2, 5, 6.5, 9, 12.5, 15.5, 18, 26, 33, 41,
      64, 79, 97, 120, 147, 181, 221, 291, 394, 460]
for i, v in enumerate(ZB):
    h = 0.25 + (v / 460.0) * 4.0
    box(f"bar{i}", (0.55, 0.55, h), (-3.4, 38 + i * 1.02, h / 2), M_GLOW)

# ---------- THE POD at y=90 (brochure p2) ----------
POD_Y = 90.0
# frame / base
box("podbase", (7.0, 5.6, 0.5), (0, POD_Y, 0.25), M_BODY)
# glass shell WITHOUT front face (camera enters through the open front)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, POD_Y, 2.1))
shell = bpy.context.object
shell.scale = (3.2, 2.5, 1.65)
shell.data.materials.append(M_GLASS)
# delete front (-Y) face so breach is clean
import bmesh
bm = bmesh.new()
bm.from_mesh(shell.data)
bm.faces.ensure_lookup_table()
for f in list(bm.faces):
    if f.normal.y < -0.5:
        bm.faces.remove(f)
bm.to_mesh(shell.data)
bm.free()

# pod frame pillars so the tank reads as a built object
for (fx, fy) in ((-3.25, POD_Y - 2.55), (3.25, POD_Y - 2.55), (-3.25, POD_Y + 2.55), (3.25, POD_Y + 2.55)):
    box("podpillar", (0.18, 0.18, 3.4), (fx, fy, 2.15), M_BODY)
box("podtoprim", (6.7, 5.3, 0.12), (0, POD_Y, 3.85), M_BODY)
# fluid surface plane near the top of the tank
FLUIDM = bpy.data.materials.new("fluidsurf")
FLUIDM.use_nodes = True
fb = FLUIDM.node_tree.nodes["Principled BSDF"]
fb.inputs["Base Color"].default_value = (0.2, 0.42, 1.0, 1)
fb.inputs["Roughness"].default_value = 0.05
fb.inputs["Metallic"].default_value = 0.3
try:
    fb.inputs["Emission Color"].default_value = (0.15, 0.35, 1.0, 1)
    fb.inputs["Emission Strength"].default_value = 0.8
except KeyError:
    pass
fb.inputs["Alpha"].default_value = 0.42
FLUIDM.blend_method = "BLEND"
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, POD_Y, 3.35))
fsurf = bpy.context.object
fsurf.scale = (3.1, 2.4, 1)
fsurf.data.materials.append(FLUIDM)
# blades: 8 submerged server blades
BLADE_LIFT = None
for i in range(8):
    bx = -2.45 + i * 0.7
    b = box(f"blade{i}", (0.22, 3.6, 2.4), (bx, POD_Y, 1.7), M_BODY)
    for s in range(6):
        box("bl", (0.24, 3.2, 0.035), (bx, POD_Y, 0.7 + s * 0.42), mat_emission(f"bled{i}{s}", BLUE_SOFT, 12))
    if i == 4:
        BLADE_LIFT = b

# the lifted blade rises out of the fluid during the immersion beat
if BLADE_LIFT is not None:
    grp = [BLADE_LIFT]
    # its led strips share location keys via parenting
    for o in bpy.data.objects:
        if o.name.startswith("bl") and not o.name.startswith("blade") and \
           abs(o.location.x - BLADE_LIFT.location.x) < 0.01 and abs(o.location.y - POD_Y) < 0.01:
            o.parent = BLADE_LIFT
            o.matrix_parent_inverse = BLADE_LIFT.matrix_world.inverted()
    BLADE_LIFT.keyframe_insert("location", frame=580)
    BLADE_LIFT.location.z += 2.4
    BLADE_LIFT.keyframe_insert("location", frame=760)

# CDU + pipes (brochure labels: CDU, Hot Water Outlet, Cold Water Inlet)
box("cdu", (1.4, 1.2, 2.4), (4.4, POD_Y - 1.2, 1.2), M_BODY)
box("cduled", (0.05, 0.8, 0.6), (3.68, POD_Y - 1.2, 1.4), M_LED_B)
bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=2.6,
                                    location=(4.35, POD_Y - 2.2, 0.5),
                                    rotation=(math.pi / 2, 0, 0))
hot = bpy.context.object
hot.data.materials.append(mat_emission("hotpipe", (1.0, 0.35, 0.1), 3))
bpy.ops.mesh.primitive_cylinder_add(radius=0.09, depth=2.6,
                                    location=(4.05, POD_Y - 2.2, 0.32),
                                    rotation=(math.pi / 2, 0, 0))
cold = bpy.context.object
cold.data.materials.append(mat_emission("coldpipe", BLUE_SOFT, 3))

# molecule chain drifting inside the pod
for i in range(9):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=0.09 if i % 2 == 0 else 0.055,
        location=(-1.4 + i * 0.34, POD_Y + 1.1, 2.5 + 0.18 * math.sin(i * 1.1)))
    o = bpy.context.object
    o.data.materials.append(M_WHITE if i % 2 else M_GLOW)
    o.keyframe_insert("location", frame=700)
    o.location.z += 0.35
    o.location.x += 0.1
    o.keyframe_insert("location", frame=900)

# bubbles inside the pod
for i in range(130):
    bpy.ops.mesh.primitive_ico_sphere_add(
        radius=random.uniform(0.006, 0.018),
        location=(random.uniform(-2.8, 2.8), POD_Y + random.uniform(-2.2, 2.2),
                  random.uniform(0.6, 3.4)))
    o = bpy.context.object
    o.data.materials.append(BUBM)
    o.keyframe_insert("location", frame=520)
    o.location.z += random.uniform(1.2, 2.6)
    o.location.x += random.uniform(-0.3, 0.3)
    o.keyframe_insert("location", frame=1000)

# ---------- X1 / X2 / X3 columns at y=104 ----------
XM = [mat_emission("x1f", (0.25, 0.5, 1.0), 2.2),
      mat_emission("x2f", (0.12, 0.32, 1.0), 2.2),
      mat_emission("x3f", (0.05, 0.18, 0.9), 2.2)]
for i, x in enumerate((-2.6, 0.0, 2.6)):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.55, depth=3.2, location=(x, 104, 1.8))
    g = bpy.context.object
    g.data.materials.append(M_GLASS)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.42, depth=2.6, location=(x, 104, 1.7))
    f = bpy.context.object
    f.data.materials.append(XM[i])
    box("xbase", (1.5, 1.5, 0.3), (x, 104, 0.15), M_BODY)
    t = bpy.data.curves.new(f"tx{i}", type="FONT")
    t.body = f"X{i + 1}"
    t.size = 0.55
    t.extrude = 0.02
    to = bpy.data.objects.new(f"tx{i}", t)
    to.location = (x - 0.35, 103.2, 3.7)
    to.rotation_euler = (math.pi / 2, 0, 0)
    to.data.materials.append(M_WHITE)
    scene.collection.objects.link(to)

# ---------- finale: sister pods in the wide shot ----------
for (px, py) in ((-14, 96), (14, 96), (-14, 112), (14, 112)):
    box("sisterbase", (7, 5.6, 0.5), (px, py, 0.25), M_BODY)
    box("sisterbody", (6, 4.6, 2.6), (px, py, 1.8), M_BODY)
    box("sisterrim", (6.1, 4.7, 0.06), (px, py, 3.15), mat_emission("sg", BLUE, 4))

# ---------- the ribbon (cover thread) ----------
rc = bpy.data.curves.new("ribbon", type="CURVE")
rc.dimensions = "3D"
rc.bevel_depth = 0.016
rc.bevel_resolution = 3
sp = rc.splines.new("BEZIER")
pts = [(-9, -26, 5.8), (2, -14, 4.6), (8, -2, 5.2)]
sp.bezier_points.add(len(pts) - 1)
for bp, p in zip(sp.bezier_points, pts):
    bp.co = p
    bp.handle_left_type = bp.handle_right_type = "AUTO"
ro = bpy.data.objects.new("ribbon", rc)
ro.data.materials.append(mat_emission("ribbonm", BLUE_SOFT, 5))
scene.collection.objects.link(ro)

# ---------- dust motes in the hall ----------
for i in range(70):
    bpy.ops.mesh.primitive_ico_sphere_add(
        radius=random.uniform(0.004, 0.011),
        location=(random.uniform(-5, 5), random.uniform(-16, 80),
                  random.uniform(0.4, 4.5)))
    o = bpy.context.object
    o.data.materials.append(M_WHITE)
    o.keyframe_insert("location", frame=1)
    o.location.z += random.uniform(0.3, 0.9)
    o.keyframe_insert("location", frame=TOTAL)

# ---------- lights ----------
def area(name, loc, color, energy, size=9):
    ld = bpy.data.lights.new(name, type="AREA")
    ld.energy = energy
    ld.color = color
    ld.size = size
    lo = bpy.data.objects.new(name, ld)
    lo.location = loc
    lo.rotation_euler = (0, 0, 0)
    scene.collection.objects.link(lo)


area("hall1", (0, 0, 5.2), (0.5, 0.65, 1.0), 900)
area("fill", (0, 40, 5.2), (0.4, 0.55, 1.0), 700, size=20)
area("hall2", (0, 22, 5.0), (1.0, 0.3, 0.12), 800)   # heat zone warmth
area("hall3", (0, 50, 5.2), (0.5, 0.65, 1.0), 900)
area("podtop", (0, 90, 5.2), (0.45, 0.62, 1.0), 1100, size=8)
area("xtop", (0, 104, 5.2), (0.5, 0.65, 1.0), 520, size=6)
pl = bpy.data.lights.new("podin", type="POINT")
pl.energy = 800
pl.color = (0.35, 0.55, 1.0)
plo = bpy.data.objects.new("podin", pl)
plo.location = (0, 90, 2.4)
scene.collection.objects.link(plo)

# ---------- ONE camera, ONE path ----------
cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 26
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 4.0
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

RX = math.pi / 2  # looking down +Y
# frame: (x, y, z, pitch_off, yaw, focus)
KEYS = [
    (1,    0.0, -16.0, 2.2, -0.02, 0.00, 20),
    (96,   0.7, -2.0, 1.9, -0.01, 0.03, 14),
    (192, -0.9, 14.0, 1.7,  0.00, -0.05, 10),
    (288,  1.1, 30.0, 1.9,  0.01, 0.06, 10),
    (384, -0.6, 46.0, 2.3, -0.03, -0.12, 8),   # glancing at the bars
    (480,  0.0, 66.0, 2.0,  0.00, 0.00, 22),   # pod ahead
    (576,  0.0, 84.0, 1.9,  0.02, 0.00, 4.5),    # breach the open front
    (672,  0.6, 88.5, 1.8,  0.04, -0.10, 1.6),   # among blades / lift
    (768, -0.5, 90.5, 2.4,  0.02, 0.12, 1.4),  # molecule
    (864,  0.0, 94.0, 2.0,  0.00, 0.00, 9),    # exit toward X columns
    (960,  0.0, 100.5, 1.9, 0.03, 0.00, 4),
    (1056, 0.0, 108.0, 4.2, 0.20, 0.00, 16),   # rising, tilt down
    (1152, 0.0, 118.0, 5.0, 0.26, 0.00, 26),   # wide finale over pods
]
for (f, x, y, z, pit, yaw, foc) in KEYS:
    cam.location = (x, y, z)
    cam.rotation_euler = (RX - pit, 0, yaw)
    cam_data.dof.focus_distance = foc
    cam.keyframe_insert("location", frame=f)
    cam.keyframe_insert("rotation_euler", frame=f)
    cam_data.dof.keyframe_insert("focus_distance", frame=f)

# ---------- render settings ----------
for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        continue
try:
    scene.eevee.taa_render_samples = 20
except AttributeError:
    pass
try:
    scene.eevee.use_raytracing = True
except AttributeError:
    pass
scene.render.resolution_x = 1920
scene.render.resolution_y = 1080
scene.render.use_motion_blur = True
scene.view_settings.view_transform = "AgX"
try:
    scene.view_settings.look = "AgX - Punchy"
except TypeError:
    pass
scene.render.image_settings.file_format = "PNG"

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "world.blend"))

if "--probe" in ARGS:
    for i, f in enumerate([1, 96, 192, 288, 384, 480, 576, 672, 768, 864, 960, 1056, 1152]):
        scene.frame_set(f)
        scene.render.filepath = OUT + f"probe_{i:02d}_"
        bpy.ops.render.render(write_still=True)
    print("PROBES DONE")
elif "--render" in ARGS:
    scene.render.filepath = OUT + "frame_"
    bpy.ops.render.render(animation=True)
    print("RENDER DONE")
else:
    print("SCENE BUILT")
