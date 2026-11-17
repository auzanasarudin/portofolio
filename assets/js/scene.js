/* Pemandangan pixel-art untuk mode Ringkas: tepi danau, pohon pinus, awan, Auzan memancing ditemani Labo.
   Digambar ke <canvas> pada resolusi asli lalu diperbesar dengan skala BULAT (image-rendering: pixelated),
   jadi setiap piksel punya ukuran yang persis sama. Lebar kanvas menyesuaikan lebar layar. */
(function () {
  'use strict';
  var C = {
    sky: '#d4e7df', cloud: '#f4f1e5', cloudSh: '#e2e6d8', cloudLn: '#cfd8cc',
    out: '#3e6a5b', dk: '#5a8877', md: '#82a995', lt: '#b5d1bf', hi: '#dce8d3',
    trunk: '#6d4b40', trunkDk: '#4f342c',
    grass: '#7ea383', grassDk: '#5f8a6a', grassLt: '#a6c49c',
    edge: '#a86a6c', edgeDk: '#7c4a4d', edgeLt: '#c98c8a',
    water: '#8fb7af', waterDk: '#76a198', waterLt: '#cfe4dc',
    wood: '#9b6b4f', woodDk: '#6e4a37', flower: '#e5604f'
  };
  var px, W, H, s, ctx, cv, seedV;
  var rnd = function () { seedV = (seedV * 9301 + 49297) % 233280; return seedV / 233280; };
  var R = function (x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  var P = function (x, y, c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };

  function cloud(cx, cy, r) {
    var blobs = [[0, 0, r], [-r * .9, r * .35, r * .7], [r * .95, r * .3, r * .75], [-r * 1.7, r * .7, r * .5], [r * 1.8, r * .65, r * .55], [r * .2, -r * .55, r * .65]];
    var x0 = Math.floor(cx - r * 2.4), x1 = Math.ceil(cx + r * 2.5), y0 = Math.floor(cy - r * 1.3), y1 = Math.ceil(cy + r * 1.3);
    for (var y = y0; y <= y1; y++) for (var x = x0; x <= x1; x++) {
      var inside = false, low = false;
      blobs.forEach(function (b) { var dx = x - (cx + b[0]), dy = y - (cy + b[1]); if (dx * dx + dy * dy <= b[2] * b[2]) { inside = true; if (dy > b[2] * .45) low = true; } });
      if (y > cy + r * 1.1) inside = false;
      if (inside) P(x, y, low ? C.cloudSh : C.cloud);
    }
  }
  function pine(x, base, h) {
    var tiers = Math.max(3, Math.round(h / 10)), top = base - h, trunkH = Math.max(3, Math.round(h * .12));
    R(x - 1, base - trunkH, 3, trunkH, C.trunk); R(x + 1, base - trunkH, 1, trunkH, C.trunkDk);
    var bodyH = h - trunkH, tierH = bodyH / tiers;
    for (var t = 0; t < tiers; t++) {
      var ty = Math.round(top + t * tierH * .82), th = Math.round(tierH * 1.35), maxHalf = Math.round(2 + (t + 1) * (h / 13));
      for (var j = 0; j < th; j++) {
        var y = ty + j, half = Math.round(1 + (maxHalf - 1) * (j / (th - 1)) + (j === th - 1 ? 1 : 0));
        if (y >= base - trunkH + 1) continue;
        for (var i = -half; i <= half; i++) {
          var edge = Math.abs(i) === half, c;
          if (edge) c = C.out;
          else if (i < -half * .35) c = (rnd() > .82 ? C.hi : C.lt);
          else if (i < half * .3) c = (rnd() > .9 ? C.lt : C.md);
          else c = (rnd() > .88 ? C.md : C.dk);
          if (j === th - 1 && (i + x) % 2 === 0) c = C.out;
          P(x + i, y, c);
        }
      }
    }
    P(x, top - 1, C.out);
  }
  function ground(x0, x1, g) {
    R(x0, g, x1 - x0, 3, C.grass); R(x0, g, x1 - x0, 1, C.grassLt);
    R(x0, g + 3, x1 - x0, 4, C.edge); R(x0, g + 7, x1 - x0, 1, C.edgeDk);
    for (var x = x0; x < x1; x += 6) { P(x, g + 4, C.edgeLt); P(x + 3, g + 5, C.edgeDk); }
    for (x = x0 + 1; x < x1 - 1; x += 2 + Math.floor(rnd() * 3)) { var hh = 1 + Math.floor(rnd() * 4); R(x, g - hh, 1, hh, rnd() > .5 ? C.grassDk : C.grass); }
  }
  function sprite(x, y, rows, pal) { rows.forEach(function (row, j) { for (var i = 0; i < row.length; i++) { var c = pal[row[i]]; if (c) P(x + i, y + j, c); } }); }
  var MAN = ['...YYYY...', '..yyyyyy..', '.YyyyyyyY.', '...hssss..', '...hsss...', '....ss....', '...oooo...', '..oOooooss', '..oOoo....', '..oOoo....', '..bbbbbbb.', '..bbbbbbb.', '.......bb.', '.......kk.'];
  var MANP = { y: '#e3bd62', Y: '#c99a3d', h: '#3b2a24', s: '#efc4a0', o: '#e5604f', O: '#c94a3c', b: '#3e5878', k: '#2a2a2a' };
  var LABO = ['...G...', '..ggg..', '.ggggg.', 'gwdgwdg', 'gggggGg', 'gpgggpg', '.ggggg.', '.G...G.'];
  var LABOP = { g: '#8fd6a8', G: '#5fae80', d: '#1c3a2c', w: '#ffffff', p: '#f2a3a3' };
  var trees = [], dashes = [], tick = 0, G0, pier;

  function layout() {
    seedV = 11; trees = []; dashes = [];
    G0 = H - 30;
    var cx = Math.round(W / 2);
    pier = { x0: cx - 60, x1: cx + 22 };
    var leftEnd = cx - 40, rightStart = cx + 40;
    for (var x = 12; x < leftEnd - 18; x += 24 + Math.floor(rnd() * 14)) trees.push([x, 36 + Math.floor(rnd() * 26)]);
    for (x = rightStart + 20; x < W - 6; x += 24 + Math.floor(rnd() * 14)) trees.push([x, 36 + Math.floor(rnd() * 28)]);
    for (var k = 0; k < Math.round(W / 6); k++) dashes.push([Math.floor(rnd() * W), G0 + 11 + Math.floor(rnd() * (H - G0 - 13)), 2 + Math.floor(rnd() * 7)]);
    return { leftEnd: leftEnd, rightStart: rightStart, cx: cx };
  }
  var L;
  function draw() {
    seedV = 23;
    R(0, 0, W, H, C.sky);
    /* awan besar di belakang pohon, kecil di langit */
    cloud(Math.round(W * .22), G0 - 38, 24); cloud(Math.round(W * .78), G0 - 36, 26); cloud(Math.round(W * .05), G0 - 30, 16); cloud(Math.round(W * .96), G0 - 28, 15); cloud(Math.round(W * .52) + (tick % 40 > 20 ? 1 : 0), 18, 6); cloud(Math.round(W * .1), 14, 5);
    ground(0, L.leftEnd, G0); ground(L.rightStart, W, G0);
    trees.forEach(function (t) { pine(t[0], G0, t[1]); });
    seedV = 31;
    for (var f = 0; f < W / 40; f++) { var fx = Math.floor(rnd() * W); if (fx < L.leftEnd - 4 || fx > L.rightStart + 4) { P(fx, G0 - 3, C.flower); P(fx + 1, G0 - 3, C.flower); P(fx, G0 - 2, C.grassDk); } }
    /* dermaga */
    R(pier.x0, G0 + 1, pier.x1 - pier.x0, 2, C.wood); R(pier.x0, G0 + 3, pier.x1 - pier.x0, 1, C.woodDk);
    for (var px2 = pier.x0 + 6; px2 < pier.x1; px2 += 14) R(px2, G0 + 4, 2, 12, C.woodDk);
    /* air */
    R(0, G0 + 8, W, H - G0 - 8, C.water); R(0, G0 + 8, W, 1, C.waterDk);
    R(0, G0 + 9, L.leftEnd, 2, C.waterDk); R(L.rightStart, G0 + 9, W - L.rightStart, 2, C.waterDk);
    dashes.forEach(function (d, i) { P((d[0] + (i % 3 === tick % 3 ? 1 : 0)) % W, d[1], C.waterLt); R((d[0] + (i % 3 === tick % 3 ? 1 : 0)) % W, d[1], d[2], 1, C.waterLt); });
    /* Auzan, Labo, ember, joran */
    var mx = pier.x1 - 12, my = G0 - 13;
    sprite(mx, my, MAN, MANP);
    sprite(mx - 16, G0 - 7 - (tick % 8 === 0 ? 1 : 0), LABO, LABOP);
    R(mx - 27, G0 - 5, 7, 5, '#6d8fa8'); R(mx - 27, G0 - 5, 7, 1, '#9fbdd1'); R(mx - 26, G0 - 7, 5, 1, '#3e5878');
    var rx = mx + 9, ry = my + 7;
    for (var t = 0; t < 30; t++) P(rx + t, ry - Math.floor(t * .8), C.woodDk);
    var tipX = rx + 29, tipY = ry - 23, bob = tick % 2;
    for (var yy = tipY + 1; yy < G0 + 10 + bob; yy++) P(tipX, yy, '#f4f1e5');
    P(tipX, G0 + 10 + bob, '#ffffff'); P(tipX, G0 + 11 + bob, C.flower);
    R(tipX - 3, G0 + 13, 2, 1, C.waterLt); R(tipX + 2, G0 + 13, 2, 1, C.waterLt);
  }
  var host, timer, calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function build() {
    if (!host) return;
    var w = host.clientWidth || window.innerWidth;
    s = w >= 900 ? 3 : 2;
    W = Math.ceil(w / s); H = w >= 900 ? 118 : 100;
    cv.width = W; cv.height = H; cv.style.width = W * s + 'px'; cv.style.height = H * s + 'px';
    ctx = cv.getContext('2d'); ctx.imageSmoothingEnabled = false;
    L = layout(); draw();
  }
  window.LaboScene = function (el) {
    host = el; if (!host) return;
    host.innerHTML = '<canvas role="img" aria-label="Ilustrasi pixel: Auzan memancing di tepi danau bersama Labo"></canvas>';
    cv = host.firstChild; build();
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 150); });
    clearInterval(timer); if (!calm) timer = setInterval(function () { if (document.documentElement.getAttribute('data-mode') !== 'overview') return; tick++; draw(); }, 600);
  };
  /* ikon pixel 12×12 untuk tiga keunggulan di hero */
  var ICONS = {
    wrench: ['....dddd....', '.d.dddddd.d.', '..dddddddd..', '.ddd....ddd.', 'ddd......ddd', 'ddd..oo..ddd', 'ddd..oo..ddd', 'ddd......ddd', '.ddd....ddd.', '..dddddddd..', '.d.dddddd.d.', '....dddd....'],
    board: ['...dddddd...', '..dwwwwwwd..', '..dw.oo.wd..', '..dwwwwwwd..', '..dwddddwd..', '..dwwwwwwd..', '..dwddddwd..', '..dwwwwwwd..', '..dwdddwwd..', '..dwwwwwwd..', '...dddddd...', '............'],
    chart: ['............', '.d..........', '.d......oo..', '.d......oo..', '.d...oo.oo..', '.d...oo.oo..', '.d.oooo.oo..', '.d.oooo.oo..', '.d.oooo.oo..', '.dddddddddd.', '............', '............']
  };
  window.PixelIcon = function (name, size) {
    var g = ICONS[name] || ICONS.chart, pal = { d: '#14382f', w: '#f3f0e2', o: '#e5604f' }, out = [];
    g.forEach(function (row, j) { for (var i = 0; i < row.length; i++) if (pal[row[i]]) out.push('<rect x="' + i + '" y="' + j + '" width="1" height="1" fill="' + pal[row[i]] + '"/>'); });
    return '<svg viewBox="0 0 12 12" width="' + (size || 36) + '" height="' + (size || 36) + '" shape-rendering="crispEdges" aria-hidden="true">' + out.join('') + '</svg>';
  };
})();
