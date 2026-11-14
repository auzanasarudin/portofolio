/* Labo — the LABORU mascot, redrawn as crisp SVG from the original 32×32 pixel grid
   (source: 09_maskot_labo.png). Expressions only move eye and mouth pixels, so every
   frame stays on-model. Usage: LaboSprite.svg('idle' | 'blink' | 'happy' | 'think' | 'wow', sizePx) */
(function () {
  'use strict';
  var ROWS = [
    '................................', '................................',
    '.................cccccc.........', '................cddddddc........',
    '................fddddddc........', '................fccccccc........',
    '...............f................', '.........cccccccccccccc.........',
    '.......ccdddddddbbbbbbbcc.......', '......cddddddddbbbbbbbbbbc......',
    '.....cddddddddbbbbbbbbbbbbc.....', '....cddddddddbbbbbbbbbbbbbbc....',
    '....cdddddddbbbbbbbbbbbbbbbc....', '....cddddddbbbbbbbbbbbbbbbbc....',
    '...cddddddbeeeeeeeeeebbbbbbfc...', '...cdddddeeaaaaaaaaaaeebbbffc...',
    '...cddddeaagaaaaaaaagaaebfffc...', '...cdddeaajggaaaaaajggaaefffc...',
    '...cddbeaagggaaaaaagggaaefffc...', '...cdbeaaagkgaaaaaagkgaaaeffc...',
    '...cbbeaaaagaaaaaaaagaaaaeffc...', '....cbbehhaaaaaaaaaaaahheffc....',
    '....cbbeaaaaaailliaaaaaaeffc....', '....cbbbeaaaaaaiiaaaaaaefffc....',
    '.....cbbbeeaaaaaaaaaaeefffc.....', '......cbbbeeeeaaaaeeeefffc......',
    '.......ccbbbbbeeeefffffcc.......', '.........cccccccccccccc.........',
    '.........cccccc..cccccc.........', '................................',
    '................................', '................................'
  ];
  var PAL = { a: '#f4f5ef', b: '#789b82', c: '#34483d', d: '#a7c0a9', e: '#d9e4db', f: '#526f5b', g: '#1b2a22', h: '#efa9a3', i: '#8a3b3b', j: '#ffffff', k: '#3d5a4a', l: '#e8888a' };
  var EYE_X = [10, 11, 12, 19, 20, 21];

  function grid(expr) {
    var g = ROWS.map(function (r) { return r.split(''); });
    var set = function (y, x, ch) { g[y][x] = ch; };
    var clearEyes = function () { for (var y = 16; y <= 20; y++) EYE_X.forEach(function (x) { set(y, x, 'a'); }); };
    if (expr === 'blink') { clearEyes(); EYE_X.forEach(function (x) { set(18, x, 'g'); }); }
    if (expr === 'happy') { clearEyes(); [[17, 11], [18, 10], [18, 12], [17, 20], [18, 19], [18, 21]].forEach(function (p) { set(p[0], p[1], 'g'); }); }
    if (expr === 'think') {
      clearEyes();
      [[16, 11], [16, 12], [17, 11], [17, 12], [16, 20], [16, 21], [17, 20], [17, 21]].forEach(function (p) { set(p[0], p[1], 'g'); });
      set(22, 14, 'a'); set(22, 17, 'a'); set(22, 15, 'i'); set(22, 16, 'i'); set(23, 15, 'a'); set(23, 16, 'a');
    }
    if (expr === 'wow') { set(22, 14, 'a'); set(22, 17, 'a'); set(22, 15, 'i'); set(22, 16, 'i'); set(23, 15, 'i'); set(23, 16, 'i'); }
    return g;
  }
  function svg(expr, size, label) {
    var g = grid(expr || 'idle'), out = '';
    for (var y = 0; y < 32; y++) {
      var x = 0;
      while (x < 32) {
        var ch = g[y][x];
        if (ch === '.') { x++; continue; }
        var x2 = x; while (x2 < 32 && g[y][x2] === ch) x2++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + (x2 - x) + '" height="1" fill="' + PAL[ch] + '"/>';
        x = x2;
      }
    }
    size = size || 48;
    return '<svg class="labo-sprite" xmlns="http://www.w3.org/2000/svg" viewBox="2 1 28 29" width="' + size + '" height="' + Math.round(size * 29 / 28) + '" shape-rendering="crispEdges"' +
      (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + out + '</svg>';
  }
  window.LaboSprite = { svg: svg, PAL: PAL };
})();
