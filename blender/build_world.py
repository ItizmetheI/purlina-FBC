# PURLINA world v2 — pure plate cinematics.
# Each leg: slow push-in + drift on its photoreal plate, particles floating
# in front for depth. No procedural geometry — the plates carry the look.
# ponytail: discrete scenes + engine crossfade beat crude continuous geometry.
import bpy
import os
import sys
import math
import random

ARGS = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "out") + os.sep
PLATES = os.path.join(HERE, "plates")

FPS = 24
FPL = 192  # frames per leg
LEGS = 6
TOTAL = FPL * LEGS

random.seed(11)

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for d in (bpy.data.meshes, bpy.data.materials, bpy.data.lights, bpy.data.cameras, bpy.data.images):
    for item in list(d):
        try:
            d.remove(item)
        except Exception:
            pass

scene = bpy.context.scene
scene.render.fps = FPS
scene.frame_start = 1
scene.frame_end = TOTAL

world = bpy.data.worlds.new("void")
scene.world = world
world.use_nodes = True
bgn = world.node_tree.nodes["Background"]
bgn.inputs[0].default_value = (0.001, 0.004, 0.012, 1)

BUBM = bpy.data.materials.new("bub")
BUBM.use_nodes = True
bb = BUBM.node_tree.nodes["Principled BSDF"]
bb.inputs["Base Color"].default_value = (0.7, 0.93, 1.0, 1)
bb.inputs["Roughness"].default_value = 0.08
bb.inputs["Metallic"].default_value = 0.0

key = bpy.data.lights.new("key", type="AREA")
key.energy = 420
key.color = (0.35, 0.8, 0.95)
key.size = 30

# per-leg: plate at y = k*100 + 40; camera pushes 34 -> 29 m with drift
for k in range(LEGS):
    py = k * 100 + 40
    img = bpy.data.images.load(os.path.join(PLATES, f"plate_{k + 1}.jpg"))
    m = bpy.data.materials.new(f"plate{k}")
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs[1].default_value = 1.0
    tex = nt.nodes.new("ShaderNodeTexImage")
    tex.image = img
    nt.links.new(tex.outputs["Color"], em.inputs[0])
    nt.links.new(em.outputs[0], out.inputs[0])
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, py, 0), rotation=(math.pi / 2, 0, 0))
    p = bpy.context.object
    p.name = f"plate{k}"
    p.scale = (64, 36, 1)  # fills 24mm FOV at 34m with ~15% margin for drift
    p.data.materials.append(m)

    ko = bpy.data.objects.new(f"key{k}", key)
    ko.location = (0, py - 20, 14)
    scene.collection.objects.link(ko)

    # particles drifting in front of the plate (bubbles under water legs, motes elsewhere)
    n = 90 if k in (3, 4) else 45
    for i in range(n):
        bpy.ops.mesh.primitive_ico_sphere_add(
            radius=random.uniform(0.012, 0.05),
            location=(random.uniform(-9, 9), py - random.uniform(6, 26),
                      random.uniform(-6, 8)))
        o = bpy.context.object
        o.data.materials.append(BUBM)
        # slow rise/drift over the leg
        f0, f1 = k * FPL + 1, (k + 1) * FPL
        o.keyframe_insert("location", frame=f0)
        o.location.z += random.uniform(0.8, 2.2)
        o.location.x += random.uniform(-0.4, 0.4)
        o.keyframe_insert("location", frame=f1)

cam_data = bpy.data.cameras.new("cam")
cam_data.lens = 24
cam_data.dof.use_dof = True
cam_data.dof.aperture_fstop = 2.2
cam = bpy.data.objects.new("cam", cam_data)
scene.collection.objects.link(cam)
scene.camera = cam

for k in range(LEGS):
    py = k * 100 + 40
    dx = random.uniform(-1.6, 1.6)
    dz = random.uniform(-0.8, 0.8)
    roll = math.radians(random.uniform(-0.7, 0.7))
    f0, f1 = k * FPL + 1, (k + 1) * FPL
    cam.location = (0, py - 34, 0)
    cam.rotation_euler = (math.pi / 2, -roll, 0)
    cam_data.dof.focus_distance = 34
    cam.keyframe_insert("location", frame=f0)
    cam.keyframe_insert("rotation_euler", frame=f0)
    cam_data.dof.keyframe_insert("focus_distance", frame=f0)
    cam.location = (dx, py - 29, dz)
    cam.rotation_euler = (math.pi / 2, roll, math.atan2(-dx, 29) * 0.3)
    cam_data.dof.focus_distance = 29
    cam.keyframe_insert("location", frame=f1)
    cam.keyframe_insert("rotation_euler", frame=f1)
    cam_data.dof.keyframe_insert("focus_distance", frame=f1)

for eng in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE"):
    try:
        scene.render.engine = eng
        break
    except TypeError:
        continue
try:
    scene.eevee.taa_render_samples = 16
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
    for i, f in enumerate([96, 288, 480, 672, 864, 1056]):
        scene.frame_set(f)
        scene.render.filepath = OUT + f"probe_{i + 1}_"
        bpy.ops.render.render(write_still=True)
    print("PROBES DONE")
elif "--render" in ARGS:
    scene.render.filepath = OUT + "frame_"
    bpy.ops.render.render(animation=True)
    print("RENDER DONE")
else:
    print("SCENE BUILT")
