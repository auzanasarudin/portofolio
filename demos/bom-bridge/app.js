/* BOM Bridge — public demo. The product, item codes, materials and rules are invented for this demo.
   The idea it shows is general: a customer configuration selects option groups (CBOM), the option groups
   explode into the engineering structure (EBOM), and a rule set turns that into the manufacturing
   structure (MBOM) with a reason recorded for every line. */
(function () {
  'use strict';
  var h = U.h, F = Charts.F;

  /* level, code, name, qty, type, material, mass kg */
  var MASTER = [
    [0, 'A10', 'BASE FRAME GROUP', 1, 'GROUP', '', 0],
    [1, '1001', 'FRAME, MAIN', 1, 'WELDMENT', '', 0],
    [2, '1001-01', 'PLATE, SIDE LH', 1, 'PART', 'SS400 PL9', 38.5], [2, '1001-02', 'PLATE, SIDE RH', 1, 'PART', 'SS400 PL9', 38.5],
    [2, '1001-03', 'CHANNEL, CROSS', 3, 'PART', 'SS400 C100', 9.4], [2, '1001-04', 'PLATE, MOTOR BASE', 1, 'PART', 'SS400 PL12', 14.2], [2, '1001-05', 'LUG, LIFTING', 4, 'PART', 'SS400 PL16', 1.1],
    [1, '1002', 'LEG, SUPPORT', 4, 'WELDMENT', '', 0],
    [2, '1002-01', 'PIPE, LEG', 1, 'PART', 'STK400 D60', 6.8], [2, '1002-02', 'PLATE, FOOT', 1, 'PART', 'SS400 PL9', 2.3],
    [1, '1003', 'BOLT SET, FRAME', 1, 'GROUP', '', 0],
    [2, 'S-B1240', 'BOLT, HEX M12x40', 16, 'STD', '', 0.05], [2, 'S-N12', 'NUT, HEX M12', 16, 'STD', '', 0.02], [2, 'S-W12', 'WASHER, PLAIN M12', 32, 'STD', '', 0.01],
    [0, 'A20', 'DRIVE TRAIN GROUP', 1, 'GROUP', '', 0],
    [1, '2001', 'ASSY, DRIVE SHAFT', 1, 'ASSY', '', 0],
    [2, '2001-01', 'SHAFT, DRIVE', 1, 'PART', 'S45C D50', 11.6], [2, '2001-02', 'SPROCKET, DRIVE 17T', 1, 'PURCHASED', '', 3.2], [2, '2001-03', 'KEY, PARALLEL 14x9x50', 2, 'STD', '', 0.05],
    [2, '2002', 'HOUSING, BEARING', 2, 'PURCHASED', '', 4.1], [3, '2002-01', 'BEARING, BALL 6210', 1, 'PURCHASED', '', 0.5], [3, '2002-02', 'SEAL, OIL 50x72x8', 1, 'PURCHASED', '', 0.03],
    [1, '2003', 'ASSY, IDLER', 1, 'ASSY', '', 0],
    [2, '2003-01', 'SHAFT, IDLER', 1, 'PART', 'S45C D40', 6.9], [2, '2003-02', 'ROLLER, IDLER', 2, 'PURCHASED', '', 2.4], [2, '2003-03', 'SPACER, ROLLER', 2, 'PART', 'S45C D45', 0.4],
    [1, '2004', 'CHAIN, ROLLER #60', 1, 'PURCHASED', '', 5.5],
    [1, '2005', 'ARM, TENSIONER', 1, 'WELDMENT', '', 0],
    [2, '2005-01', 'PLATE, ARM', 1, 'PART', 'SS400 PL6', 1.8], [2, '2005-02', 'BOSS, PIVOT', 1, 'PART', 'S45C D35', 0.6],
    [0, 'B10', 'MOTOR 5.5 kW GROUP', 1, 'GROUP', '', 0],
    [1, '3001', 'MOTOR, GEARED 5.5 kW', 1, 'PURCHASED', '', 62], [1, '3002', 'COUPLING, JAW L100', 1, 'PURCHASED', '', 1.9],
    [1, 'S-B1035', 'BOLT, HEX M10x35', 4, 'STD', '', 0.03], [1, 'S-N10', 'NUT, HEX M10', 4, 'STD', '', 0.01], [1, 'S-W10', 'WASHER, PLAIN M10', 8, 'STD', '', 0.01],
    [0, 'B11', 'MOTOR 7.5 kW GROUP', 1, 'GROUP', '', 0],
    [1, '3011', 'MOTOR, GEARED 7.5 kW', 1, 'PURCHASED', '', 78], [1, '3012', 'COUPLING, JAW L110', 1, 'PURCHASED', '', 2.6], [1, '3013', 'PLATE, ADAPTER', 1, 'PART', 'SS400 PL12', 5.4],
    [1, 'S-B1240', 'BOLT, HEX M12x40', 4, 'STD', '', 0.05], [1, 'S-N12', 'NUT, HEX M12', 4, 'STD', '', 0.02], [1, 'S-W12', 'WASHER, PLAIN M12', 8, 'STD', '', 0.01],
    [0, 'C10', 'MESH GUARD GROUP', 1, 'GROUP', '', 0],
    [1, '4001', 'GUARD, CHAIN', 1, 'WELDMENT', '', 0], [2, '4001-01', 'FRAME, GUARD', 1, 'PART', 'SS400 L30', 3.1], [2, '4001-02', 'MESH, EXPANDED', 1, 'PART', 'SPHC XS32', 2.2],
    [1, '4002', 'COVER, DRIVE GUARD', 1, 'PART', 'SPHC t2.3', 4.6], [1, 'S-B0616', 'BOLT, FLANGE M6x16', 12, 'STD', '', 0.01],
    [0, 'C11', 'FULL ENCLOSURE GROUP', 1, 'GROUP', '', 0],
    [1, '4011', 'PANEL, SIDE', 2, 'PART', 'SPHC t2.3', 7.8], [1, '4012', 'PANEL, TOP', 1, 'PART', 'SPHC t2.3', 6.1],
    [1, '4013', 'DOOR, INSPECTION', 1, 'ASSY', '', 0], [2, '4013-01', 'PANEL, DOOR', 1, 'PART', 'SPHC t2.3', 3.4], [2, '4013-02', 'HINGE, LIFT-OFF', 2, 'PURCHASED', '', 0.2], [2, '4013-03', 'LATCH, QUARTER-TURN', 1, 'PURCHASED', '', 0.1],
    [1, '4014', 'SEAL, DOOR', 1, 'PURCHASED', '', 0.3], [1, 'S-B0616', 'BOLT, FLANGE M6x16', 24, 'STD', '', 0.01],
    [0, 'D10', 'STARTER PANEL GROUP', 1, 'GROUP', '', 0],
    [1, '5001', 'BOX, CONTROL', 1, 'PURCHASED', '', 8.5], [2, '5001-01', 'CONTACTOR 18 A', 1, 'PURCHASED', '', 0.4], [2, '5001-02', 'RELAY, OVERLOAD', 1, 'PURCHASED', '', 0.2],
    [1, '5002', 'HARNESS, CONTROL BOX', 1, 'PURCHASED', '', 1.2], [1, '5003', 'BRACKET, CONTROL BOX', 1, 'PART', 'SPHC t3.2', 1.6],
    [0, 'D11', 'INVERTER PANEL GROUP', 1, 'GROUP', '', 0],
    [1, '5011', 'BOX, INVERTER', 1, 'PURCHASED', '', 12.4], [2, '5011-01', 'INVERTER 7.5 kW', 1, 'PURCHASED', '', 3.8], [2, '5011-02', 'FILTER, EMC', 1, 'PURCHASED', '', 0.9],
    [1, '5012', 'HARNESS, INVERTER', 1, 'PURCHASED', '', 1.6], [1, '5003', 'BRACKET, CONTROL BOX', 1, 'PART', 'SPHC t3.2', 1.6],
    [0, 'E10', 'LUBRICATION KIT', 1, 'GROUP', '', 0],
    [1, '6001', 'PIPE, LUBRICATION', 2, 'PART', 'STKM D8', 0.3], [1, '6002', 'NIPPLE, GREASE', 4, 'STD', '', 0.01], [1, '6003', 'BRACKET, HOSE CLAMP', 2, 'PART', 'SPHC t3.2', 0.2],
    [0, 'E20', 'SENSOR KIT', 1, 'GROUP', '', 0],
    [1, '6101', 'SENSOR, SPEED', 1, 'PURCHASED', '', 0.2], [1, '6102', 'SENSOR, ALIGNMENT', 2, 'PURCHASED', '', 0.2], [1, '6103', 'BRACKET, SENSOR', 3, 'PART', 'SPHC t3.2', 0.2], [1, '6104', 'HARNESS, SENSOR', 1, 'PURCHASED', '', 0.5],
    [0, 'P10', 'EXPORT PACKING', 1, 'GROUP', '', 0],
    [1, '7001', 'SKID, WOODEN', 1, 'PURCHASED', '', 24], [1, '7002', 'DECAL, WARNING SET', 1, 'PURCHASED', '', 0.05], [1, '7003', 'MANUAL, OPERATION', 1, 'PURCHASED', '', 0.3]
  ];
  var CHOICES = [
    { k: 'motor', label: 'Drive motor', type: 'one', opts: [['B10', '5.5 kW geared motor', 'Standard duty'], ['B11', '7.5 kW geared motor', 'Adds an adapter plate']] },
    { k: 'guard', label: 'Guarding', type: 'one', opts: [['C10', 'Mesh chain guard', 'Open plant floor'], ['C11', 'Full enclosure', 'Panels, door and seal']] },
    { k: 'ctrl', label: 'Controls', type: 'one', opts: [['D10', 'Starter panel', 'Direct on line'], ['D11', 'Inverter panel', 'Variable speed']] },
    { k: 'kits', label: 'Option kits', type: 'many', opts: [['E10', 'Lubrication kit', 'Pipes and grease points'], ['E20', 'Sensor kit', 'Speed and alignment'], ['P10', 'Export packing', 'Skid, decals, manual']] }
  ];
  var CLS = { MAKE: ['var(--s1)', 0], SUBCON: ['var(--s2)', 0], BUY: ['var(--s3)', 0], PHANTOM: ['var(--s4)', 1], RAW: ['var(--s7)', 0], REF: ['var(--de)', 1] };
  var CDESC = { MAKE: 'Made in-house, stocked as a semi-finished good', SUBCON: 'Fabricated outside, received complete', BUY: 'Purchased item', PHANTOM: 'Grouping only, never stocked', RAW: 'Cut part consumed by its weldment', REF: 'Listed for reference, not planned' };
  var DEF_RULES = {
    hardware: 'BOLT, NUT, WASHER, KEY, NIPPLE, SCREW, RIVET', subcon: 'GUARD, COVER, PANEL, DOOR', smallFab: 'ARM, BRACKET', lineAssy: 'ASSY, IDLER',
    machined: 'SHAFT, SPACER, BOSS', inhouse: 'FRAME, LEG', phSuffix: '-PH', smallFabOut: true, machOut: false, sheetOut: true
  };
  var RULES = Object.assign({}, DEF_RULES, U.get('bb_rules', {}));
  var S = { view: 'cbom', sel: U.get('bb_sel', { motor: 'B11', guard: 'C10', ctrl: 'D11', kits: ['E10', 'E20'] }), custom: null, cls: 'all', q: '' };

  /* ---------------- structure ---------------- */
  function toTree(rows) {
    var roots = [], stack = [];
    rows.forEach(function (r, i) {
      var n = { lv: +r[0], code: String(r[1]), name: String(r[2]), qty: +r[3] || 1, type: String(r[4] || 'PART').toUpperCase(), mat: r[5] || '', mass: +r[6] || 0, kids: [], row: i };
      while (stack.length && stack[stack.length - 1].lv >= n.lv) stack.pop();
      if (stack.length) { n.parent = stack[stack.length - 1]; n.parent.kids.push(n); } else roots.push(n);
      stack.push(n);
    });
    return roots;
  }
  function selectedCodes() { return ['A10', 'A20', S.sel.motor, S.sel.guard, S.sel.ctrl].concat(S.sel.kits); }
  function ebom() {
    if (S.custom) return toTree(S.custom);
    var sel = selectedCodes();
    return toTree(MASTER).filter(function (n) { return sel.indexOf(n.code) >= 0; });
  }
  function walk(nodes, fn, depth) { nodes.forEach(function (n) { fn(n, depth || 0); walk(n.kids, fn, (depth || 0) + 1); }); }
  function list(v) { return String(v || '').split(/[,\n]/).map(function (x) { return x.trim().toUpperCase(); }).filter(Boolean); }
  function match(name, v) { var nm = name.toUpperCase(); return list(v).some(function (k) { return nm === k || nm.indexOf(k + ',') === 0 || nm.indexOf(k + ' ') === 0 || nm.indexOf(k) === 0; }); }

  function classify(n, pc) {
    if (pc === 'BUY' || pc === 'SUBCON' || pc === 'REF') return ['REF', 'R2', 'Parent is supplied complete'];
    if (n.type === 'STD' || match(n.name, RULES.hardware)) return ['BUY', 'R1', 'Standard hardware, issued from floor stock'];
    if (n.type === 'PURCHASED') return ['BUY', 'R3', 'Purchased component'];
    if (match(n.name, RULES.subcon)) return ['SUBCON', 'R4', 'Name is on the outsourced sheet-metal list'];
    if (n.type === 'GROUP') return ['PHANTOM', 'R7', 'Engineering group, no operation of its own'];
    if (n.type === 'WELDMENT') return RULES.smallFabOut && match(n.name, RULES.smallFab) ? ['SUBCON', 'R5b', 'Small weldment bought complete'] : ['MAKE', 'R5', 'In-house weldment'];
    if (n.type === 'ASSY') return match(n.name, RULES.lineAssy) ? ['PHANTOM', 'R6b', 'Assembled directly on the main line'] : ['MAKE', 'R6', 'Built at a sub-assembly station'];
    if (pc === 'MAKE' && n.parent && n.parent.type === 'WELDMENT') return ['RAW', 'R8a', 'Cut part consumed by its weldment'];
    if (match(n.name, RULES.machined)) return [RULES.machOut ? 'SUBCON' : 'MAKE', 'R8b', RULES.machOut ? 'Machined part, machining outsourced' : 'Machined part, in-house'];
    return [RULES.sheetOut ? 'SUBCON' : 'MAKE', 'R8c', RULES.sheetOut ? 'Loose plate or sheet part, outsourced' : 'Loose plate or sheet part, in-house'];
  }
  var WC = { WELDMENT: ['WELD-01', 'Cut → Fit-up → Weld → Paint'], ASSY: ['ASSY-SUB', 'Sub-assemble → Check'], R8b: ['MACH-01', 'Turn → Mill'], R8c: ['FAB-02', 'Laser → Bend'], RAW: ['CUT-01', 'Nest → Cut'], SUBCON: ['OUTSIDE', 'Issue → Receive → Inspect'], BUY: ['STORE', '—'] };
  function mbom() {
    var out = [];
    (function rec(nodes, pc, lv, mult) {
      nodes.forEach(function (n) {
        var c = classify(n, pc), cls = c[0], w = cls === 'MAKE' ? (n.type === 'WELDMENT' ? WC.WELDMENT : n.type === 'ASSY' ? WC.ASSY : WC[c[1]] || WC.R8c) : cls === 'RAW' ? WC.RAW : cls === 'SUBCON' ? WC.SUBCON : cls === 'BUY' ? WC.BUY : ['—', '—'];
        var row = { n: n, lv: lv, code: n.code + (cls === 'PHANTOM' ? RULES.phSuffix : ''), cls: cls, rule: c[1], why: c[2], wc: w[0], route: w[1], ext: n.qty * mult, flags: [] };
        out.push(row);
        rec(n.kids, cls, lv + 1, n.qty * mult);
      });
    })(ebom(), null, 0, 1);
    // review flags
    var seen = {};
    out.forEach(function (r) {
      (seen[r.n.code] = seen[r.n.code] || {})[r.cls] = 1;
      if ((r.cls === 'SUBCON' || r.cls === 'BUY') && r.n.kids.some(function (k) { return match(k.name, RULES.inhouse); })) r.flags.push('A child is on the in-house list but this item is supplied complete');
      if (r.cls === 'MAKE' && r.n.type === 'WELDMENT' && !r.n.kids.length) r.flags.push('Weldment has no cut parts');
      if ((r.cls === 'RAW' || (r.cls === 'MAKE' && r.n.type === 'PART')) && !r.n.mat) r.flags.push('Material is missing');
      if (r.cls === 'SUBCON' && r.rule === 'R5b' && r.n.kids.some(function (k) { return match(k.name, RULES.machined); })) r.flags.push('Bought complete but contains a machined part: confirm with the supplier');
    });
    out.forEach(function (r) { var k = Object.keys(seen[r.n.code]).filter(function (x) { return x !== 'REF'; }); if (k.length > 1) r.flags.push('Same item gets different classes: ' + k.join(' / ')); });
    return out;
  }
  function chip(cls) { return '<span class="cls' + (CLS[cls][1] ? ' dk' : '') + '" style="background:' + CLS[cls][0] + '">' + cls + '</span>'; }
  function card(title, hint, body) { return '<section class="card"><h3>' + h(title) + '</h3>' + (hint ? '<p class="hint">' + hint + '</p>' : '') + body + '</section>'; }
  var WF = 640, WH = 640;

  /* ---------------- views ---------------- */
  function vCbom() {
    if (S.custom) return '<div class="note"><b>You are using an uploaded EBOM</b> (' + S.custom.length + ' rows), so the sample configuration is switched off. <button class="btn sm" type="button" id="useSample">Back to the sample product</button></div>';
    var sel = selectedCodes(), groups = toTree(MASTER);
    var form = CHOICES.map(function (c) {
      return '<fieldset style="border:0;padding:0;margin:0 0 14px"><legend style="font-weight:700;margin-bottom:8px">' + h(c.label) + '</legend><div class="opts">' + c.opts.map(function (o) {
        var on = c.type === 'one' ? S.sel[c.k] === o[0] : S.sel.kits.indexOf(o[0]) >= 0;
        return '<label class="opt"><input type="' + (c.type === 'one' ? 'radio' : 'checkbox') + '" name="' + c.k + '" value="' + o[0] + '"' + (on ? ' checked' : '') + '><span><b>' + h(o[1]) + '</b><span>' + o[0] + ' · ' + h(o[2]) + '</span></span></label>';
      }).join('') + '</div></fieldset>';
    }).join('');
    var tbl = '<div class="tw"><table class="t"><thead><tr><th>Option code</th><th>Description</th><th class="r">Qty</th><th>In this order</th><th class="r">EBOM lines</th></tr></thead><tbody>' + groups.map(function (g) {
      var n = 0; walk([g], function () { n++; }); var on = sel.indexOf(g.code) >= 0;
      return '<tr><td class="code">' + g.code + '</td><td>' + h(g.name) + '</td><td class="r">1</td><td>' + (on ? '<span class="pill ok">Selected</span>' : '<span class="pill">Not selected</span>') + '</td><td class="r">' + (on ? n : '–') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    return card('What the customer ordered', 'Base frame and drive train are always included. Each choice maps to an option code, and each option code owns a branch of the engineering BOM.', form) +
      card('Customer BOM', 'The order as sales sees it: option codes only, no part numbers.', tbl) +
      '<div class="tools"><button class="btn pri" type="button" data-view="ebom">Explode to EBOM →</button></div>';
  }

  function vEbom() {
    var roots = ebom(), n = 0, depth = 0, types = {};
    walk(roots, function (x, d) { n++; depth = Math.max(depth, d); types[x.type] = (types[x.type] || 0) + 1; });
    var order = ['GROUP', 'ASSY', 'WELDMENT', 'PART', 'PURCHASED', 'STD'];
    var tree = ''; walk(roots, function (x, d) { tree += '<div class="n" style="padding-left:' + d * 22 + 'px"><span class="c">' + (d ? '└ ' : '') + h(x.code) + '</span><b>' + h(x.name) + '</b><span class="c">× ' + x.qty + '</span><span class="tag">' + x.type + '</span>' + (x.mat ? '<span class="c">' + h(x.mat) + '</span>' : '') + '</div>'; });
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'EBOM lines', value: String(n) }), Charts.tile({ label: 'Levels', value: String(depth + 1) }),
      Charts.tile({ label: 'Designed items', value: String((types.ASSY || 0) + (types.WELDMENT || 0) + (types.PART || 0)), note: 'assemblies, weldments, parts' }),
      Charts.tile({ label: 'Catalogue items', value: String((types.PURCHASED || 0) + (types.STD || 0)), note: 'purchased and standard' })].join('') + '</div>' +
      '<div class="grid g-2-1">' + card('Engineering structure', 'How design groups the product: by function, not by how it is built.', '<div class="tw" style="padding:10px 14px;max-height:620px"><div class="tree">' + tree + '</div></div>') +
      '<div class="grid" style="align-content:start">' + card('Lines by drawing type', '', Charts.hbars({ W: Math.min(WH, 420), rows: order.filter(function (t) { return types[t]; }).map(function (t) { return { label: t, value: types[t] }; }), name: 'Lines', xName: 'Type', labelW: 88, fmt: function (v) { return F(v, 0); } })) +
      card('Try your own EBOM', 'CSV with columns <span class="mono">level, code, name, qty, type, material, mass</span>. It is read in this browser and never uploaded.', '<div class="tools"><label class="btn" for="csvIn">Choose CSV…</label><input type="file" id="csvIn" accept=".csv,text/csv" hidden><button class="btn" type="button" id="csvSample">Download this EBOM as CSV</button></div>' + (S.custom ? '<p class="hint" style="margin-top:8px">Using your file. <button class="btn sm" type="button" id="useSample">Back to the sample</button></p>' : '')) +
      '</div></div><div class="tools"><button class="btn pri" type="button" data-view="mbom">Generate MBOM →</button></div>';
  }

  function vMbom() {
    var rows = mbom(), counts = {}, wc = {}, flags = rows.filter(function (r) { return r.flags.length; });
    rows.forEach(function (r) { counts[r.cls] = (counts[r.cls] || 0) + 1; if (r.wc !== '—') wc[r.wc] = (wc[r.wc] || 0) + 1; });
    var q = S.q.trim().toLowerCase(), shown = rows.filter(function (r) { return (S.cls === 'all' || (S.cls === 'flag' ? r.flags.length : r.cls === S.cls)) && (!q || (r.code + ' ' + r.n.name).toLowerCase().indexOf(q) >= 0); });
    var tbl = '<div class="tw" style="max-height:640px"><table class="t"><thead><tr><th>Lv</th><th>Item</th><th>Description</th><th class="r">Qty</th><th class="r">Per unit</th><th>Class</th><th>Work centre</th><th>Routing</th><th>Why</th></tr></thead><tbody>' +
      (shown.length ? shown.map(function (r) {
        return '<tr><td class="code">' + r.lv + '</td><td class="code" style="padding-left:' + (10 + r.lv * 14) + 'px">' + h(r.code) + '</td><td>' + h(r.n.name) + (r.n.mat ? '<span class="sub">' + h(r.n.mat) + '</span>' : '') + (r.flags.length ? '<span class="sub"><span class="pill warn">Review</span> ' + h(r.flags.join('; ')) + '</span>' : '') + '</td><td class="r">' + r.n.qty + '</td><td class="r">' + r.ext + '</td><td>' + chip(r.cls) + '</td><td class="code">' + r.wc + '</td><td>' + h(r.route) + '</td><td><span class="tag">' + r.rule + '</span> <span class="sub" style="display:inline">' + h(r.why) + '</span></td></tr>';
      }).join('') : '<tr><td colspan="9">No line matches this filter.</td></tr>') + '</tbody></table></div>';
    var cut = {}; rows.filter(function (r) { return r.cls === 'RAW'; }).forEach(function (r) { var k = r.n.mat || '(no material)'; cut[k] = (cut[k] || 0) + r.ext * r.n.mass; });
    var order = ['MAKE', 'SUBCON', 'BUY', 'PHANTOM', 'RAW', 'REF'];
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'MBOM lines', value: String(rows.length) }),
      Charts.tile({ label: 'Planned items', value: String(rows.length - (counts.PHANTOM || 0) - (counts.REF || 0)), note: 'excluding phantom and reference' }),
      Charts.tile({ label: 'Made in-house', value: String(counts.MAKE || 0), note: (counts.RAW || 0) + ' cut parts feed them' }),
      Charts.tile({ label: 'Lines to review', value: String(flags.length), status: flags.length ? { kind: 'warning', label: 'Check before release' } : { kind: 'good', label: 'No conflicts' } })].join('') + '</div>' +
      '<div class="grid g2">' + card('How the structure splits', 'Every EBOM line gets exactly one manufacturing class.', Charts.segbar({ parts: order.filter(function (c) { return counts[c]; }).map(function (c) { return { name: c, value: counts[c], color: CLS[c][0], dark: !!CLS[c][1] }; }), name: 'Lines', xName: 'Class', title: 'MBOM lines by class' })) +
      card('Lines per work centre', 'A first look at where the work lands.', Charts.hbars({ W: WH, rows: Object.keys(wc).map(function (k) { return { label: k, value: wc[k] }; }).sort(function (a, b) { return b.value - a.value; }), name: 'Lines', xName: 'Work centre', labelW: 88, fmt: function (v) { return F(v, 0); } })) + '</div>' +
      card('Manufacturing BOM', shown.length + ' of ' + rows.length + ' lines. “Per unit” multiplies quantities down the structure. The last column records which rule decided each line.', tbl) +
      (Object.keys(cut).length ? card('Cutting list by material', 'Raw material for the in-house weldments, per finished unit.', Charts.hbars({ W: WF, rows: Object.keys(cut).map(function (k) { return { label: k, value: +cut[k].toFixed(1) }; }).sort(function (a, b) { return b.value - a.value; }), unit: ' kg', name: 'Mass', xName: 'Material', labelW: 120 })) : '') +
      '<div class="tools"><button class="btn pri" type="button" id="exportM">Download MBOM (CSV)</button><button class="btn" type="button" data-view="rules">Change the rules</button></div>';
  }

  function vRules() {
    var ta = function (k, label, hint) { return '<label class="f">' + label + '<textarea id="r_' + k + '" rows="2">' + h(RULES[k]) + '</textarea><span>' + hint + '</span></label>'; };
    var cb = function (k, label) { return '<label class="opt"><input type="checkbox" id="r_' + k + '"' + (RULES[k] ? ' checked' : '') + '><span><b>' + label + '</b></span></label>'; };
    return card('Name lists', 'Comma-separated. A name matches when it starts with the keyword, so ARM also catches “ARM, TENSIONER”.', '<div class="grid g2">' +
      ta('hardware', 'Standard hardware → BUY', 'Rule R1') + ta('subcon', 'Outsourced sheet metal → SUBCON', 'Rule R4') + ta('smallFab', 'Small weldments', 'Rule R5b, when the switch below is on') +
      ta('lineAssy', 'Assemblies built on the main line → PHANTOM', 'Rule R6b') + ta('machined', 'Machined parts', 'Rule R8b') + ta('inhouse', 'Normally made in-house', 'Used only to raise a review flag') + '</div>') +
      card('Switches', '', '<div class="opts">' + cb('smallFabOut', 'Buy small weldments complete') + cb('machOut', 'Outsource machining') + cb('sheetOut', 'Outsource loose plate and sheet parts') + '</div><label class="f" style="margin-top:12px;max-width:220px">Phantom suffix<input type="text" id="r_phSuffix" value="' + h(RULES.phSuffix) + '"></label>') +
      '<div class="tools"><button class="btn pri" type="button" id="rulesSave">Apply and regenerate</button><button class="btn" type="button" id="rulesReset">Restore example rules</button></div>' +
      '<div class="note"><b>These rules are illustrations.</b> Real make/buy/phantom rules come from your routing, your supplier base and your stock policy. The point of the tool is that the rules live in one visible place and every MBOM line says which rule produced it.</div>';
  }

  function vHow() {
    var steps = [['CBOM', 'Customer BOM', 'Option codes from the order. No part numbers yet.'], ['Explode', 'Select branches', 'Each option code owns a branch of the engineering structure.'], ['EBOM', 'Engineering BOM', 'Grouped by function, as designed.'], ['Rules', 'Classify each line', 'Make, subcontract, buy, phantom, cut part or reference.'], ['MBOM', 'Manufacturing BOM', 'Grouped by how it is built, with work centre and routing.']];
    var flowHtml = '<div class="stepper" aria-label="Flow">' + steps.map(function (s, i) { return '<button type="button" tabindex="-1" style="cursor:default"><i>' + (i + 1) + '</i><span><b>' + s[1] + '</b>' + s[2] + '</span></button>'; }).join('') + '</div>';
    var rl = [['R1', 'Standard hardware', 'BUY'], ['R2', 'Child of an item supplied complete', 'REF'], ['R3', 'Purchased component', 'BUY'], ['R4', 'Name on the outsourced sheet-metal list', 'SUBCON'], ['R5', 'Weldment', 'MAKE'], ['R5b', 'Small weldment, when bought complete', 'SUBCON'], ['R6', 'Assembly with its own station', 'MAKE'], ['R6b', 'Assembly built on the main line', 'PHANTOM'], ['R7', 'Engineering group', 'PHANTOM'], ['R8a', 'Part under an in-house weldment', 'RAW'], ['R8b', 'Machined part', 'MAKE'], ['R8c', 'Loose plate or sheet part', 'SUBCON']];
    return card('From order to shop floor in five steps', 'One sequence, top to bottom.', flowHtml) +
      card('Rule order', 'Rules are tried in this order and the first match wins. R2 is checked first so that nothing inside a bought item is planned twice.', '<div class="tw"><table class="t"><thead><tr><th>Rule</th><th>Condition</th><th>Class</th><th>Meaning</th></tr></thead><tbody>' + rl.map(function (r) { return '<tr><td class="code">' + r[0] + '</td><td>' + r[1] + '</td><td>' + chip(r[2]) + '</td><td>' + CDESC[r[2]] + '</td></tr>'; }).join('') + '</tbody></table></div>') +
      '<div class="note"><b>What this demo leaves out on purpose.</b> Engineering change effectivity, alternates and substitutes, revision control, and writing back to an ERP. In a real project those are scoped with you, and the generator reads and writes your own Excel layout.</div>';
  }

  /* ---------------- shell ---------------- */
  var VIEWS = [['cbom', 'Configure (CBOM)'], ['ebom', 'Engineering BOM'], ['mbom', 'Manufacturing BOM'], ['rules', 'Rules'], ['how', 'How it works']];
  var R = { cbom: vCbom, ebom: vEbom, mbom: vMbom, rules: vRules, how: vHow };
  function measure() { var v = document.getElementById('view'), vw = Math.max(280, v.clientWidth - 44); WF = U.clamp(vw - 34, 280, 1120); WH = vw > 860 ? (vw - 14) / 2 - 34 : WF; }
  function draw(keep) {
    document.getElementById('nav').innerHTML = VIEWS.map(function (v, i) { return '<button type="button" data-view="' + v[0] + '"' + (S.view === v[0] ? ' aria-current="page"' : '') + '><i>0' + (i + 1) + '</i>' + v[1] + '</button>'; }).join('');
    document.getElementById('title').textContent = VIEWS.filter(function (v) { return v[0] === S.view; })[0][1];
    document.getElementById('sub').textContent = S.custom ? 'Uploaded EBOM · ' + S.custom.length + ' rows' : 'CDU-300 conveyor drive unit · order ' + selectedCodes().join(' + ');
    if (!keep) document.getElementById('filters').innerHTML = S.view === 'mbom' ? '<label class="f">Search<input type="search" id="fQ" value="' + h(S.q) + '" placeholder="Item or description"></label><label class="f">Class<select id="fCls"><option value="all">All classes</option>' + Object.keys(CLS).map(function (c) { return '<option' + (S.cls === c ? ' selected' : '') + '>' + c + '</option>'; }).join('') + '<option value="flag"' + (S.cls === 'flag' ? ' selected' : '') + '>Needs review</option></select></label>' : '';
    measure();
    document.getElementById('view').innerHTML = R[S.view]();
  }
  function parseCsv(text) {
    var lines = text.replace(/\r/g, '').split('\n').filter(function (l) { return l.trim(); }), rows = [];
    if (lines.length < 2) throw new Error('The file has no data rows.');
    var head = lines[0].toLowerCase().split(',').map(function (x) { return x.trim(); }), need = ['level', 'code', 'name'], ix = {};
    ['level', 'code', 'name', 'qty', 'type', 'material', 'mass'].forEach(function (k) { ix[k] = head.indexOf(k); });
    need.forEach(function (k) { if (ix[k] < 0) throw new Error('Column “' + k + '” is missing. Expected: level, code, name, qty, type, material, mass.'); });
    lines.slice(1).forEach(function (l, i) {
      var c = [], cur = '', q = false; for (var k = 0; k < l.length; k++) { var ch = l[k]; if (q) { if (ch === '"') { if (l[k + 1] === '"') { cur += '"'; k++; } else q = false; } else cur += ch; } else if (ch === '"') q = true; else if (ch === ',') { c.push(cur); cur = ''; } else cur += ch; } c.push(cur);
      var lv = parseInt(c[ix.level], 10); if (isNaN(lv) || lv < 0) throw new Error('Row ' + (i + 2) + ': level must be a whole number from 0.');
      rows.push([lv, (c[ix.code] || '').trim(), (c[ix.name] || '').trim(), ix.qty >= 0 ? c[ix.qty] : 1, ix.type >= 0 ? (c[ix.type] || 'PART').trim() : 'PART', ix.material >= 0 ? (c[ix.material] || '').trim() : '', ix.mass >= 0 ? c[ix.mass] : 0]);
    });
    if (rows.length > 3000) throw new Error('This demo reads up to 3,000 rows.');
    return rows;
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var b = t.closest('[data-view]'); if (b) { S.view = b.getAttribute('data-view'); draw(); window.scrollTo(0, 0); return; }
    if (t.id === 'useSample') { S.custom = null; U.toast('Back to the sample product'); return draw(); }
    if (t.id === 'csvSample') { var rows = [['level', 'code', 'name', 'qty', 'type', 'material', 'mass']]; walk(ebom(), function (n, d) { rows.push([d, n.code, n.name, n.qty, n.type, n.mat, n.mass]); }); return U.download('bom-bridge-sample-ebom.csv', U.csv(rows)); }
    if (t.id === 'exportM') { return U.download('bom-bridge-mbom.csv', U.csv([['level', 'item', 'description', 'qty', 'qty_per_unit', 'class', 'work_centre', 'routing', 'rule', 'reason', 'material', 'review']].concat(mbom().map(function (r) { return [r.lv, r.code, r.n.name, r.n.qty, r.ext, r.cls, r.wc, r.route, r.rule, r.why, r.n.mat, r.flags.join('; ')]; })))); }
    if (t.id === 'rulesSave') { ['hardware', 'subcon', 'smallFab', 'lineAssy', 'machined', 'inhouse', 'phSuffix'].forEach(function (k) { RULES[k] = document.getElementById('r_' + k).value; }); ['smallFabOut', 'machOut', 'sheetOut'].forEach(function (k) { RULES[k] = document.getElementById('r_' + k).checked; }); U.set('bb_rules', RULES); S.view = 'mbom'; U.toast('Rules applied'); draw(); window.scrollTo(0, 0); return; }
    if (t.id === 'rulesReset') { RULES = Object.assign({}, DEF_RULES); U.del('bb_rules'); U.toast('Example rules restored'); return draw(); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.name && ['motor', 'guard', 'ctrl'].indexOf(t.name) >= 0) { S.sel[t.name] = t.value; U.set('bb_sel', S.sel); return draw(); }
    if (t.name === 'kits') { var i = S.sel.kits.indexOf(t.value); if (t.checked && i < 0) S.sel.kits.push(t.value); if (!t.checked && i >= 0) S.sel.kits.splice(i, 1); U.set('bb_sel', S.sel); return draw(); }
    if (t.id === 'fCls') { S.cls = t.value; return draw(true); }
    if (t.id === 'csvIn' && t.files && t.files[0]) { var rd = new FileReader(); rd.onload = function () { try { S.custom = parseCsv(String(rd.result)); U.toast('EBOM loaded: ' + S.custom.length + ' rows'); draw(); } catch (err) { U.toast(err.message); } }; rd.readAsText(t.files[0]); }
  });
  var qt; document.addEventListener('input', function (e) { if (e.target.id === 'fQ') { S.q = e.target.value; clearTimeout(qt); qt = setTimeout(function () { draw(true); }, 140); } });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { draw(true); }, 160); });
  document.getElementById('logo').innerHTML = LaboSprite.svg('idle', 34);
  U.skin('bb_skin', 'paper');
  draw();
})();
