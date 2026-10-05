"""
Генератор временных изображений-фактур Emerald Textile.

Рендерит процедурные макро-снимки ткани (махра, вафля, лён, сатин, вязка,
стёжка, жатка, ёлочка) в палитре бренда: тёплый дневной свет, мягкий контраст,
без людей — по правилам раздела «09 — Photography & Imagery».

Это плейсхолдеры: финальные фотографии кладутся в public/images/products
с теми же именами файлов — код сайта менять не нужно.

Запуск:  python scripts/generate_textiles.py
"""
import os
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "images")
OUT_T = os.path.join(ROOT, "textures")
OUT_P = os.path.join(ROOT, "products")
os.makedirs(OUT_T, exist_ok=True)
os.makedirs(OUT_P, exist_ok=True)

W, H = 960, 1200
rng = np.random.default_rng(7)

# Цвета изделий — натуральная палитра бренда (тёплые нейтральные + изумруд)
COLORS = {
    "white":   (242, 239, 232),
    "milk":    (236, 228, 212),
    "beige":   (218, 203, 178),
    "sand":    (199, 179, 146),
    "taupe":   (138, 118, 92),
    "walnut":  (104, 84, 70),
    "sage":    (152, 163, 140),
    "emerald": (28, 86, 62),
}


# ---------------------------------------------------------------- utils
def _box(a, r, axis):
    r = int(max(1, r))
    pad = [(0, 0), (0, 0)]
    pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(a, pad, mode="edge"), axis=axis)
    if axis == 0:
        return (c[2 * r + 1:] - c[:-2 * r - 1]) / (2 * r + 1)
    return (c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)


def blur(a, r):
    """Гауссово размытие float-массива (три прохода box-фильтра)."""
    if r <= 0:
        return a
    a = a.astype(np.float32)
    k = max(1, int(r * 0.8))
    for _ in range(3):
        a = _box(_box(a, k, 0), k, 1)
    return a


def noise(h, w, scale, octaves=3, seed=None):
    r = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp = 1.0
    for o in range(octaves):
        s = max(1, int(scale / (2 ** o)))
        small = r.random((h // s + 2, w // s + 2)).astype(np.float32)
        im = Image.fromarray(small, "F").resize((w + s * 2, h + s * 2), Image.BICUBIC)
        out += np.asarray(im)[:h, :w] * amp
        amp *= 0.5
    out -= out.min()
    return out / (out.max() + 1e-9)


def grid(h, w):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    return y, x


def fibers(h, w, seed, angle=0.0, length=18):
    """Мелкая волокнистая структура: анизотропный шум."""
    n = noise(h, w, 2, 2, seed)
    n = _box(n, max(2, length // 3), 1)  # вытягиваем шум вдоль волокна
    im = Image.fromarray(n.astype(np.float32), "F").rotate(angle, resample=Image.BICUBIC)
    a = np.asarray(im)
    return (a - a.mean()) * 1.4


# ------------------------------------------------------------ weaves
def h_terry(h, w, seed):
    """Махра: плотные петли."""
    y, x = grid(h, w)
    r = np.random.default_rng(seed)
    base = noise(h, w, 10, 3, seed) * 0.6
    loops = np.zeros((h, w), np.float32)
    step = 9
    for _ in range(2):
        jx = r.random((h // step + 2, w // step + 2)) * step
        jy = r.random((h // step + 2, w // step + 2)) * step
        gy = (y // step).astype(int)
        gx = (x // step).astype(int)
        cx = gx * step + jx[gy, gx]
        cy = gy * step + jy[gy, gx]
        d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
        ring = np.exp(-((d - 3.2) ** 2) / 2.2)
        loops = np.maximum(loops, ring)
        x = x + step / 2
    return base + loops * 0.9 + noise(h, w, 2, 1, seed + 1) * 0.35


def h_waffle(h, w, seed, cell=46):
    y, x = grid(h, w)
    u = (x % cell) / cell
    v = (y % cell) / cell
    # рёбра ячейки — приподняты, центр — впадина
    edge = np.minimum(np.minimum(u, 1 - u), np.minimum(v, 1 - v))
    pocket = np.clip(edge * 6, 0, 1) ** 0.6
    ridge = 1 - pocket
    weave = (np.sin(x * 1.3) * np.sin(y * 1.3)) * 0.12
    return ridge * 1.0 + weave + noise(h, w, 4, 2, seed) * 0.25


def h_linen(h, w, seed):
    """Лён: полотняное переплетение с утолщениями нити."""
    y, x = grid(h, w)
    p = 7.0
    slub_x = noise(1, w, 40, 2, seed)[0] * 0.8 + 0.6
    slub_y = noise(h, 1, 40, 2, seed + 3)[:, 0:1] * 0.8 + 0.6
    warp = (np.sin(x / p * np.pi) ** 2) * slub_x[None, :]
    weft = (np.sin(y / p * np.pi) ** 2) * slub_y
    checker = np.sign(np.sin(x / p * np.pi / 1.0) * np.sin(y / p * np.pi / 1.0))
    surf = np.where(checker > 0, warp * 1.1, weft * 1.1)
    return surf + noise(h, w, 6, 2, seed) * 0.3 + fibers(h, w, seed, 0) * 0.4


def h_satin(h, w, seed):
    """Полисатин/сатин: тонкая диагональ с блеском."""
    y, x = grid(h, w)
    tw = np.sin((x + y * 0.5) / 2.2) * 0.25
    return tw + noise(h, w, 30, 3, seed) * 0.3 + fibers(h, w, seed, 30) * 0.15


def h_knit(h, w, seed):
    """Крупная вязка с косами."""
    y, x = grid(h, w)
    col = 120
    cx = x % col
    # косы
    phase = (y / 70.0) * np.pi
    braid = np.exp(-((cx - 60 - np.sin(phase) * 18) ** 2) / 260) + np.exp(-((cx - 60 + np.sin(phase) * 18) ** 2) / 260)
    # лицевые петли в «дорожках»
    lane = np.exp(-((cx - 12) ** 2) / 30) + np.exp(-((cx - 108) ** 2) / 30)
    stitches = (np.abs(np.sin(y / 6.0)) * 0.5 + 0.5) * np.abs(np.sin(x / 5.0))
    purl = 0.25 * (1 - braid.clip(0, 1)) * (1 - lane.clip(0, 1))
    return braid * 1.1 + lane * 0.6 + stitches * 0.35 + purl + noise(h, w, 3, 1, seed) * 0.2


def h_quilt(h, w, seed):
    """Стёжка «волна»: дутые сегменты между строчками."""
    y, x = grid(h, w)
    s = 110
    wave = np.sin(x / s * np.pi * 2) * 22
    t = ((y + wave) % s) / s
    puff = np.clip(np.sin(t * np.pi), 0, 1) ** 0.7
    stitch = np.exp(-((t - 0) ** 2) / 0.0008) + np.exp(-((t - 1) ** 2) / 0.0008)
    return puff * 1.6 - stitch * 0.4 + h_satin(h, w, seed) * 0.15


def h_crinkle(h, w, seed):
    """Крэп-жатка: вертикальные заломы."""
    n = noise(h, w, 80, 3, seed)
    y, x = grid(h, w)
    folds = np.sin(x / 9.0 + n * 9) * 0.6 + np.sin(x / 23.0 + n * 4) * 0.5
    return folds + h_satin(h, w, seed + 1) * 0.3


def h_herring(h, w, seed):
    """Ёлочка — плед/покрывало."""
    y, x = grid(h, w)
    band = 40
    b = (x // band).astype(int) % 2
    d = np.where(b == 0, x + y, x - y)
    tw = (np.sin(d / 3.0) * 0.5 + 0.5)
    return tw * 0.8 + noise(h, w, 5, 2, seed) * 0.4 + fibers(h, w, seed, 45) * 0.4


def h_lace(h, w, seed):
    """Полисатин с кружевным краем внизу кадра."""
    base = h_satin(h, w, seed)
    y, x = grid(h, w)
    edge = h * 0.72
    scallop = edge + np.abs(np.sin(x / 40 * np.pi)) * 30
    lace_zone = y > scallop
    holes = (np.sin(x / 7) * np.sin(y / 7) > 0.35) | (((x % 80) - 40) ** 2 + ((y % 80) - 40) ** 2 < 120)
    hm = base.copy()
    hm[lace_zone] = 0.4 + holes[lace_zone] * -0.9
    return hm, lace_zone & holes


ZOOM = {"terry": 2.2, "waffle": 1.6, "linen": 2.6, "satin": 2.4, "knit": 1.4,
        "quilt": 1.3, "crinkle": 1.8, "herringbone": 2.4}

WEAVES = {
    "terry": (h_terry, 3.5, 0.0),
    "waffle": (h_waffle, 2.4, 0.0),
    "linen": (h_linen, 1.6, 0.02),
    "satin": (h_satin, 1.0, 0.05),
    "knit": (h_knit, 3.0, 0.0),
    "quilt": (h_quilt, 1.6, 0.0),
    "crinkle": (h_crinkle, 2.0, 0.05),
    "herringbone": (h_herring, 1.6, 0.0),
}


# ------------------------------------------------------------ shading
def drape(h, w, seed, strength=1.0):
    """Крупные мягкие складки ткани."""
    y, x = grid(h, w)
    r = np.random.default_rng(seed)
    d = np.zeros((h, w), np.float32)
    for _ in range(3):
        ang = r.uniform(-0.5, 0.5) + np.pi / 2.3
        f = r.uniform(0.004, 0.010)
        ph = r.uniform(0, 6.28)
        d += np.sin((x * np.cos(ang) + y * np.sin(ang)) * f + ph) * r.uniform(30, 60)
    return d * strength


def shade(hm, color, depth, spec, macro_drape, seed, light=(-0.55, -0.65, 0.52), holes=None, bg=None):
    h, w = hm.shape
    hm = (hm - hm.mean()) / (hm.std() + 1e-6)
    total = hm * depth + macro_drape
    gy, gx = np.gradient(total)
    nx, ny, nz = -gx, -gy, np.ones_like(gx) * 2.2
    ln = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    nx, ny, nz = nx / ln, ny / ln, nz / ln
    lx, ly, lz = light
    ll = np.sqrt(lx * lx + ly * ly + lz * lz)
    lx, ly, lz = lx / ll, ly / ll, lz / ll
    diff = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    flat = lz  # освещённость ровной поверхности
    diff = diff / flat
    # полутени (ambient occlusion) из высоты
    ao = np.clip(1.0 + (hm - blur(hm, 6)) * 0.07, 0.7, 1.08)
    # блик
    hx, hy, hz = lx, ly, lz + 1
    hl = np.sqrt(hx * hx + hy * hy + hz * hz)
    sp = np.clip((nx * hx + ny * hy + nz * hz) / hl, 0, 1) ** 40 * spec
    base = np.array(color, np.float32) / 255.0
    lum = 0.30 + 0.72 * diff
    rgb = base[None, None, :] * (lum * ao)[..., None]
    # тёплый свет / прохладная тень
    warm = np.array([1.02, 1.0, 0.965])
    rgb = rgb * warm[None, None, :]
    rgb += sp[..., None] * np.array([1.0, 0.97, 0.9])[None, None, :]
    # дневной свет из окна: градиент слева-сверху
    y, x = grid(h, w)
    window = 1.07 - 0.13 * ((x / w) * 0.6 + (y / h) * 0.6)
    rgb *= window[..., None]
    if holes is not None and bg is not None:
        rgb[holes] = np.array(bg, np.float32) / 255.0 * 0.92
    return np.clip(rgb, 0, 1)


def finish(rgb, dof=True, grain=0.012, seed=0):
    h, w, _ = rgb.shape
    img = Image.fromarray((rgb * 255).astype(np.uint8))
    if dof:
        b = np.asarray(img.filter(ImageFilter.GaussianBlur(3.5))).astype(np.float32)
        a = np.asarray(img).astype(np.float32)
        y, _ = grid(h, w)
        focus = np.clip(np.abs(y / h - 0.48) * 2.2 - 0.35, 0, 1)[..., None]
        img = Image.fromarray((a * (1 - focus) + b * focus).astype(np.uint8))
    a = np.asarray(img).astype(np.float32) / 255
    # мягкая виньетка
    y, x = grid(h, w)
    vg = 1 - 0.10 * (((x / w - 0.45) ** 2 + (y / h - 0.42) ** 2) * 2.2)
    a *= vg[..., None]
    a += np.random.default_rng(seed).normal(0, grain, a.shape)
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))


def render_macro(weave, color_key, seed, drape_k=1.0, size=(W, H), zoom_k=1.0, light=(-0.55, -0.65, 0.52)):
    w, h = size
    fn, depth, spec = WEAVES[weave]
    z = ZOOM.get(weave, 2.0) * zoom_k
    small = fn(int(h / z), int(w / z), seed).astype(np.float32)
    hm = np.asarray(Image.fromarray(small, "F").resize((w, h), Image.BICUBIC))
    dr = drape(h, w, seed + 11, drape_k * 0.55)
    rgb = shade(hm, COLORS[color_key], depth, spec, dr, seed, light=light)
    return finish(rgb, seed=seed)


# ------------------------------------------------------------ packshot
def render_stack(weave, color_key, seed, layers=3, size=(W, H), roll=False):
    """Пакшот: стопка сложенного текстиля на светло-сером фоне."""
    w, h = size
    y, x = grid(h, w)
    bgc = np.array([236, 233, 228], np.float32) / 255
    floor_y = h * 0.74
    bg = np.where((y < floor_y)[..., None], bgc * (1.0 - 0.05 * (y / h))[..., None] * 1.0,
                  bgc * 0.955 * (1 - 0.04 * ((y - floor_y) / h))[..., None])
    bg = bg * (1.02 - 0.06 * (x / w))[..., None]
    img = bg.astype(np.float32)
    fn, depth, spec = WEAVES[weave]
    tex_full = fn(h, w, seed)
    tex_full = (tex_full - tex_full.mean()) / (tex_full.std() + 1e-6)
    sw = int(w * 0.66)
    x0 = (w - sw) // 2
    lh = int(h * (0.105 if not roll else 0.16))
    # тень под стопкой
    sh = np.exp(-(((x - w / 2) / (sw * 0.56)) ** 8)) * np.exp(-((y - floor_y - 6) ** 2) / 260)
    sh = blur(sh.astype(np.float32), 10)
    img *= (1 - 0.32 * sh / (sh.max() + 1e-6))[..., None]
    base = np.array(COLORS[color_key], np.float32) / 255
    top = floor_y
    for i in range(layers):
        y1 = int(top)
        y0 = y1 - lh
        inset = i * int(w * 0.006)
        xa, xb = x0 + inset, x0 + sw - inset
        yy = np.arange(y0, y1)
        t = (yy - y0) / lh  # 0..1 по высоте сгиба
        prof = np.sin(t * np.pi) ** 0.55  # выпуклость сгиба
        light = 0.55 + 0.55 * np.clip(np.cos((t - 0.32) * np.pi * 0.95), 0, 1)
        seg = tex_full[y0:y1, xa:xb] * (0.10 * depth / 3)
        shade_band = (light * (0.88 + 0.12 * prof))[:, None] + seg
        # скруглённые торцы
        xx = np.arange(xa, xb)
        endfall = np.clip(np.minimum(xx - xa, xb - xx) / (w * 0.02), 0, 1) ** 0.5
        shade_band *= (0.82 + 0.18 * endfall)[None, :]
        col = base[None, None, :] * shade_band[..., None] * np.array([1.02, 1.0, 0.965])
        # тонкая линия-тень между слоями
        col[-3:, :, :] *= 0.78
        img[y0:y1, xa:xb] = np.clip(col, 0, 1)
        top = y0
    # верхняя плоскость (перспектива)
    th = int(h * 0.06)
    for k in range(th):
        yy = int(top) - th + k
        frac = k / th
        inset = int((1 - frac) * w * 0.035) + layers * int(w * 0.006)
        xa, xb = x0 + inset, x0 + sw - inset
        rowtex = tex_full[yy, xa:xb] * 0.06
        col = base * (1.08 - 0.06 * frac) + rowtex[:, None]
        img[yy, xa:xb] = np.clip(col * np.array([1.02, 1.0, 0.965]), 0, 1)
    return finish(img, dof=False, grain=0.008, seed=seed)


# ------------------------------------------------------------ batch
def save(img, folder, name):
    p = os.path.join(folder, name)
    img.save(p, quality=86, optimize=True, progressive=True)
    print("ok", os.path.relpath(p, ROOT))


MATERIAL_TEXTURES = [
    ("terry", "milk"), ("waffle", "white"), ("linen", "sand"), ("satin", "white"),
    ("knit", "walnut"), ("quilt", "milk"), ("crinkle", "beige"), ("herringbone", "taupe"),
    ("linen", "beige"), ("waffle", "sage"), ("terry", "emerald"), ("herringbone", "emerald"),
]

if __name__ == "__main__":
    import sys
    only = sys.argv[1:] or ["textures", "products"]
    if "textures" in only:
        for i, (wv, c) in enumerate(MATERIAL_TEXTURES):
            save(render_macro(wv, c, 100 + i), OUT_T, f"{wv}-{c}.jpg")
    if "products" in only:
        # макро + пакшот для каждой комбинации ткани и цвета, используемой в каталоге
        combos = {
            "terry": ["white", "milk", "sand", "sage", "emerald", "walnut"],
            "waffle": ["white", "milk", "beige", "sage"],
            "linen": ["white", "milk", "beige", "sand", "taupe", "sage", "emerald"],
            "satin": ["white", "milk", "beige", "sage"],
            "knit": ["milk", "walnut", "sand", "emerald"],
            "quilt": ["white", "milk", "beige", "sand"],
            "crinkle": ["milk", "beige", "taupe"],
            "herringbone": ["milk", "taupe", "emerald", "walnut"],
        }
        for wv, cs in combos.items():
            for j, c in enumerate(cs):
                seed = 300 + sum(map(ord, wv + c)) * 7 % 1000
                save(render_macro(wv, c, seed, drape_k=1.2), OUT_P, f"{wv}-{c}-detail.jpg")
                save(render_macro(wv, c, seed + 1, drape_k=0.35, zoom_k=2.2, light=(0.5, -0.7, 0.6)),
                     OUT_P, f"{wv}-{c}-close.jpg")
