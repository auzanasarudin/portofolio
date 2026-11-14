/* Robot Insight — public demo. Everything below runs on data generated from a fixed seed;
   no production data, robot names, alarm codes or part names from any real plant are used. */
(function () {
  'use strict';
  var h = U.h, F = Charts.F;
  var TODAY = '2026-11-12', DAYS = 90, START = U.add(TODAY, -(DAYS - 1));
  var CELLS = [{ id: 'A', name: 'Chassis' }, { id: 'B', name: 'Beam' }, { id: 'C', name: 'Bracket' }, { id: 'D', name: 'Tank' }];
  var ALARMS = [
    ['E-101', 'Wire feed fault', 'Wire & feeder', 9, 7], ['E-104', 'Wire stick / burn-back', 'Wire & feeder', 7, 6],
    ['E-210', 'Arc start failure', 'Arc & torch', 12, 3], ['E-214', 'Arc loss during weld', 'Arc & torch', 6, 5], ['E-221', 'Contact tip worn', 'Arc & torch', 5, 9],
    ['E-305', 'Shield gas pressure low', 'Gas & cooling', 4, 11], ['E-309', 'Torch cooling flow low', 'Gas & cooling', 2, 14],
    ['E-402', 'Seam tracking lost', 'Sensing', 6, 6], ['E-407', 'Touch-sense error', 'Sensing', 5, 4],
    ['E-511', 'Collision detect', 'Motion', 1, 38], ['E-515', 'Axis following error', 'Motion', 1, 22],
    ['E-620', 'Jig clamp not confirmed', 'Fixture & part', 7, 8], ['E-624', 'Part fit-up gap', 'Fixture & part', 5, 12],
    ['E-701', 'Operator stop / door open', 'Operator', 8, 5]
  ];
  var CATS = ['Wire & feeder', 'Arc & torch', 'Gas & cooling', 'Sensing', 'Motion', 'Fixture & part', 'Operator'];
  var DEF = { oee: 65, stop: 15, avail: 85, ef: 0.85, tipLife: 40, nozzleLife: 120, linerLife: 600, calibDays: 30, asfLimit: 3 };
  var CFG = Object.assign({}, DEF, U.get('ri_cfg', {}));
  var CM = [
    { id: 'CM-01', robot: 'A-02', title: 'Feeder roller and liner replaced on a fixed arc-hour schedule', cat: 'Wire & feeder', date: '2026-09-21', status: 'Done', owner: 'Maintenance', cut: 0.45 },
    { id: 'CM-02', robot: 'B-01', title: 'Contact tip changed by arc-hours instead of by shift', cat: 'Arc & torch', date: '2026-10-05', status: 'Done', owner: 'Production Eng.', cut: 0.40 },
    { id: 'CM-03', robot: 'C-03', title: 'Jig clamp sensor relocated away from spatter', cat: 'Fixture & part', date: '2026-10-12', status: 'Done', owner: 'Jig & Fixture', cut: 0.50 },
    { id: 'CM-04', robot: 'D-01', title: 'Andon buzzer when a robot waits for the operator', cat: 'Waiting', date: '2026-10-19', status: 'Trial', owner: 'Production', cut: 0.35, wait: true },
    { id: 'CM-05', robot: 'B-03', title: 'Gas regulator check added to the start-up sheet', cat: 'Gas & cooling', date: '2026-10-26', status: 'Trial', owner: 'Production', cut: 0.30 },
    { id: 'CM-06', robot: 'A-03', title: 'Seam tracking re-teach for long welds', cat: 'Sensing', date: '2026-11-23', status: 'Planned', owner: 'Production Eng.', cut: 0 }
  ];

  /* ---------------- synthetic data ---------------- */
  var robots = [], recs = [], events = [];
  (function build() {
    var r = U.rng(20261112);
    CELLS.forEach(function (c) {
      for (var k = 1; k <= 3; k++) {
        var focus = U.pick(r, CATS.slice(0, 6));
        robots.push({
          id: c.id + '-0' + k, cell: c.id, cellName: c.name, alarmRate: 0.04 + r() * 0.08, waitRate: 0.03 + r() * 0.05, stdCycle: 0.7 + r() * 1.5,
          perf: 0.87 + r() * 0.10, rework: 0.006 + r() * 0.028, arcRatio: 0.56 + r() * 0.14, wireRate: 3.4 + r() * 1.8, kW: 9 + r() * 5, focus: focus,
          tip: r() * 20, nozzle: r() * 90, liner: r() * 400, tipStretch: 0.85 + r() * 0.3, calib: U.add(TODAY, -U.int(r, 3, 36))
        });
      }
    });
    var byId = {}; robots.forEach(function (x) { byId[x.id] = x; });
    byId['A-02'].alarmRate = 0.22; byId['A-02'].focus = 'Wire & feeder';
    byId['B-01'].alarmRate = 0.19; byId['B-01'].focus = 'Arc & torch';
    byId['C-03'].alarmRate = 0.20; byId['C-03'].focus = 'Fixture & part';
    byId['D-01'].waitRate = 0.19; byId['B-03'].focus = 'Gas & cooling'; byId['B-03'].alarmRate = 0.15;
    byId['C-01'].tipStretch = 1.32; byId['C-01'].tip = 16;
    var hourW = [7, 9, 5, 4, 5, 6, 4, 3, 8, 9, 5, 4, 5, 6, 4, 3]; // 07:00..22:00, peaks at shift starts
    var hourTot = U.sum(hourW);
    for (var i = 0; i < DAYS; i++) {
      var date = U.add(START, i), dow = U.dow(date), planned = dow === 0 ? 0 : dow === 6 ? 8 : 20;
      if (!planned) continue;
      robots.forEach(function (rb) {
        var ar = rb.alarmRate, wr = rb.waitRate, cm = CM.filter(function (c) { return c.robot === rb.id && c.status !== 'Planned' && date >= c.date; })[0];
        if (cm) { if (cm.wait) wr *= (1 - cm.cut); else ar *= (1 - cm.cut); }
        if (rb.id === 'C-01') ar *= 1 + (i / DAYS) * 0.7;
        ar *= U.clamp(1 + 0.32 * U.gauss(r), 0.35, 2.1); wr *= U.clamp(1 + 0.28 * U.gauss(r), 0.4, 1.9);
        var alarmH = planned * ar, waitH = planned * wr, oper = Math.max(0, planned - alarmH - waitH);
        var perf = U.clamp(rb.perf * (1 + 0.03 * U.gauss(r)), 0.7, 1), cycles = Math.max(0, Math.round(oper * perf / rb.stdCycle));
        var rework = U.clamp(Math.round(cycles * rb.rework * (1 + 0.6 * U.gauss(r))), 0, cycles);
        var arc = oper * rb.arcRatio * perf, wire = arc * rb.wireRate, kwh = arc * rb.kW + (oper - arc) * 2.2 + (alarmH + waitH) * 1.3;
        // consumable counters
        rb.tip += arc; rb.nozzle += arc; rb.liner += arc;
        var tipChanged = false;
        if (rb.tip > CFG.tipLife * rb.tipStretch && rb.id !== 'C-01') { rb.tip = arc * r(); tipChanged = true; }
        if (rb.nozzle > 120 * (0.9 + r() * 0.2)) rb.nozzle = 0;
        if (rb.liner > 600 * (0.9 + r() * 0.2)) rb.liner = 0;
        var wear = rb.tip / CFG.tipLife, asf = Math.max(0.1, 0.45 + 2.3 * wear * wear + 0.16 * U.gauss(r));
        recs.push({ date: date, i: i, robot: rb.id, cell: rb.cell, planned: planned, alarm: alarmH, wait: waitH, oper: oper, cycles: cycles, rework: rework, std: cycles * rb.stdCycle, arc: arc, wire: wire, kwh: kwh, asf: asf, tip: rb.tip, tipChanged: tipChanged });
        // alarm events that add up to alarmH
        var mins = alarmH * 60, n = Math.max(1, Math.round(mins / (5 + r() * 9))), cuts = [], tot = 0;
        for (var e = 0; e < n; e++) { var w = 0.25 + r() * r() * 3; cuts.push(w); tot += w; }
        for (e = 0; e < n; e++) {
          var pool = ALARMS.map(function (a) { var wt = a[3]; if (a[2] === rb.focus) wt *= 3.2; if (cm && !cm.wait && a[2] === cm.cat) wt *= 0.35; if (a[0] === 'E-221' || a[0] === 'E-210') wt *= 1 + wear; return wt; });
          var pick = r() * U.sum(pool), ai = 0; while (pick > pool[ai]) { pick -= pool[ai]; ai++; }
          var hp = r() * hourTot, hi = 0; while (hp > hourW[hi]) { hp -= hourW[hi]; hi++; }
          if (planned === 8) hi = hi % 8;
          events.push({ date: date, robot: rb.id, cell: rb.cell, a: ai, min: mins * cuts[e] / tot, hour: 7 + hi });
        }
      });
    }
  })();

  /* ---------------- state + selectors ---------------- */
  var S = { view: 'overview', cell: 'all', robot: 'all', days: 30, pmRobot: null };
  var VIEWS = [['overview', 'Overview'], ['oee', 'OEE'], ['stop', 'Stop time'], ['alarms', 'Alarms'], ['predict', 'Consumable life'], ['energy', 'Energy & CO₂'], ['cm', 'Countermeasures'], ['settings', 'Settings']];
  function inScope(x) { return (S.cell === 'all' || x.cell === S.cell) && (S.robot === 'all' || x.robot === S.robot) && x.date >= U.add(TODAY, -(S.days - 1)); }
  function scopeRobots() { return robots.filter(function (x) { return (S.cell === 'all' || x.cell === S.cell) && (S.robot === 'all' || x.id === S.robot); }); }
  function agg(list) {
    var a = { planned: 0, alarm: 0, wait: 0, oper: 0, cycles: 0, rework: 0, std: 0, arc: 0, wire: 0, kwh: 0, n: list.length };
    list.forEach(function (x) { a.planned += x.planned; a.alarm += x.alarm; a.wait += x.wait; a.oper += x.oper; a.cycles += x.cycles; a.rework += x.rework; a.std += x.std; a.arc += x.arc; a.wire += x.wire; a.kwh += x.kwh; });
    a.A = a.planned ? a.oper / a.planned * 100 : 0; a.P = a.oper ? Math.min(100, a.std / a.oper * 100) : 0; a.Q = a.cycles ? (a.cycles - a.rework) / a.cycles * 100 : 0;
    a.OEE = a.A * a.P * a.Q / 10000; a.stop = a.planned ? (a.alarm + a.wait) / a.planned * 100 : 0; a.sec = a.wire ? a.kwh / a.wire : 0;
    return a;
  }
  function group(list, key) { var m = {}, order = []; list.forEach(function (x) { var k = key(x); if (!m[k]) { m[k] = []; order.push(k); } m[k].push(x); }); return order.map(function (k) { return { k: k, v: m[k] }; }); }
  function hi(v, t) { return v >= t ? { kind: 'good', label: 'On target' } : v >= t * 0.92 ? { kind: 'warning', label: 'Below target' } : { kind: 'critical', label: 'Well below target' }; }
  function lo(v, t) { return v <= t ? { kind: 'good', label: 'Within limit' } : v <= t * 1.3 ? { kind: 'warning', label: 'Over limit' } : { kind: 'critical', label: 'Well over limit' }; }
  function card(title, hint, body, cls) { return '<section class="card' + (cls ? ' ' + cls : '') + '"><h3>' + h(title) + '</h3>' + (hint ? '<p class="hint">' + hint + '</p>' : '') + body + '</section>'; }
  function pct(v) { return F(v, 1) + '%'; }

  /* ---------------- views ---------------- */
  function vOverview() {
    var list = recs.filter(inScope), a = agg(list), byDay = group(list, function (x) { return x.date; });
    var dayA = byDay.map(function (g) { return agg(g.v); });
    var spark = function (f) { return dayA.slice(-20).map(f); };
    var tiles = [
      Charts.tile({ label: 'OEE', value: F(a.OEE, 1), unit: '%', status: hi(a.OEE, CFG.oee), note: 'target ' + CFG.oee + '%', spark: spark(function (d) { return d.OEE; }) }),
      Charts.tile({ label: 'Availability', value: F(a.A, 1), unit: '%', status: hi(a.A, CFG.avail), note: 'target ' + CFG.avail + '%', spark: spark(function (d) { return d.A; }) }),
      Charts.tile({ label: 'Performance', value: F(a.P, 1), unit: '%', note: 'cycles vs standard time', spark: spark(function (d) { return d.P; }) }),
      Charts.tile({ label: 'Quality', value: F(a.Q, 1), unit: '%', note: 'first-pass cycles', spark: spark(function (d) { return d.Q; }) }),
      Charts.tile({ label: 'Stop time', value: F(a.stop, 1), unit: '%', status: lo(a.stop, CFG.stop), note: 'limit ' + CFG.stop + '%', spark: spark(function (d) { return d.stop; }) })
    ];
    var perRobot = scopeRobots().map(function (rb) { return { rb: rb, a: agg(list.filter(function (x) { return x.robot === rb.id; })) }; });
    var fleet = perRobot.map(function (p) {
      var st = lo(p.a.stop, CFG.stop);
      return '<button class="rb" type="button" data-robot="' + p.rb.id + '"><span class="rn">' + p.rb.id + '<small>' + h(p.rb.cellName) + '</small></span>' + Charts.status(st.kind, st.label) +
        '<span class="rv"><b>' + F(p.a.OEE, 0) + '%</b> OEE · <b>' + F(p.a.stop, 0) + '%</b> stop</span>' + Charts.meter({ value: p.a.stop, max: 40, target: CFG.stop, kind: st.kind === 'good' ? 'good' : st.kind === 'warning' ? 'warning' : 'critical', label: p.rb.id + ' stop time' }) + '</button>';
    }).join('');
    return '<div class="grid g5">' + tiles.join('') + '</div>' +
      card('Fleet', 'Each robot against the stop-time limit. Select one to filter every view.', '<div class="fleet">' + fleet + '</div>') +
      '<div class="grid g2">' +
      card('Availability per day', 'Operating hours ÷ planned hours, all robots in scope.', Charts.lines({ labels: byDay.map(function (g) { return U.short(g.k); }), series: [{ name: 'Availability', values: dayA.map(function (d) { return +d.A.toFixed(1); }) }], unit: '%', target: CFG.avail, targetLabel: 'target ' + CFG.avail + '%', yMax: 100, area: true, xName: 'Day' })) +
      card('Stop time by robot', 'Alarm + waiting hours as a share of planned hours.', Charts.hbars({ rows: perRobot.map(function (p) { return { label: p.rb.id + ' ' + p.rb.cellName, value: +p.a.stop.toFixed(1) }; }).sort(function (x, y) { return y.value - x.value; }), unit: '%', target: CFG.stop, targetLabel: 'limit ' + CFG.stop + '%', name: 'Stop time', xName: 'Robot' })) +
      '</div>';
  }

  function vOee() {
    var list = recs.filter(inScope), a = agg(list), nR = scopeRobots().length, cal = S.days * 24 * nR;
    var speed = Math.max(0, a.oper - a.std), rw = a.cycles ? a.std * (a.rework / a.cycles) : 0;
    var wf = Charts.waterfall({
      unit: ' h', fmt: function (v) { return F(v, 0) + ' h'; }, totalName: 'Hours remaining', lossName: 'Hours lost', labelW: 168, steps: [
        { label: 'Calendar time', value: cal, kind: 'total' }, { label: 'Not scheduled', value: cal - a.planned, kind: 'loss' },
        { label: 'Planned production', value: a.planned, kind: 'total' }, { label: 'Alarm stops', value: a.alarm, kind: 'loss' }, { label: 'Waiting', value: a.wait, kind: 'loss' },
        { label: 'Operating', value: a.oper, kind: 'total' }, { label: 'Speed loss vs standard', value: speed, kind: 'loss' },
        { label: 'Net operating', value: a.std, kind: 'total' }, { label: 'Rework cycles', value: rw, kind: 'loss' }, { label: 'Fully productive', value: a.std - rw, kind: 'total' }]
    });
    var rows = scopeRobots().map(function (rb) { var x = agg(list.filter(function (q) { return q.robot === rb.id; })); return { rb: rb, a: x }; }).sort(function (p, q) { return p.a.OEE - q.a.OEE; });
    var tbl = '<div class="tw"><table class="t"><thead><tr><th>Robot</th><th class="r">Availability</th><th class="r">Performance</th><th class="r">Quality</th><th class="r">OEE</th><th style="min-width:120px">vs target ' + CFG.oee + '%</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function (p) { var st = hi(p.a.OEE, CFG.oee); return '<tr><td><b>' + p.rb.id + '</b><span class="sub">' + h(p.rb.cellName) + '</span></td><td class="r">' + pct(p.a.A) + '</td><td class="r">' + pct(p.a.P) + '</td><td class="r">' + pct(p.a.Q) + '</td><td class="r"><b>' + pct(p.a.OEE) + '</b></td><td>' + Charts.meter({ value: p.a.OEE, max: 100, target: CFG.oee, kind: st.kind === 'good' ? 'good' : st.kind === 'warning' ? 'warning' : 'critical', label: p.rb.id + ' OEE' }) + '</td><td>' + Charts.status(st.kind, st.label) + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var defs = '<div class="note"><b>How each number is calculated.</b> Availability = operating ÷ planned hours. Performance = (cycles × standard cycle time) ÷ operating hours. Quality = first-pass cycles ÷ total cycles. OEE = A × P × Q. ' +
      'A real deployment has to agree these definitions with production first; the same raw log gives a different OEE under a different definition.</div>';
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'OEE', value: F(a.OEE, 1), unit: '%', status: hi(a.OEE, CFG.oee), note: 'target ' + CFG.oee + '%' }),
      Charts.tile({ label: 'Availability', value: F(a.A, 1), unit: '%' }), Charts.tile({ label: 'Performance', value: F(a.P, 1), unit: '%' }), Charts.tile({ label: 'Quality', value: F(a.Q, 1), unit: '%' })].join('') + '</div>' +
      card('Where the hours go', 'From calendar time down to fully productive time, ' + nR + ' robot' + (nR > 1 ? 's' : '') + ' over ' + S.days + ' days.', wf) + defs + card('OEE by robot', 'Lowest first.', tbl);
  }

  function vStop() {
    var list = recs.filter(inScope), a = agg(list), ev = events.filter(inScope);
    var months = group(recs.filter(function (x) { return (S.cell === 'all' || x.cell === S.cell) && (S.robot === 'all' || x.robot === S.robot); }), function (x) { return x.date.slice(0, 7); });
    var mm = months.map(function (g) { return agg(g.v); });
    var comp = scopeRobots().map(function (rb) { var x = agg(list.filter(function (q) { return q.robot === rb.id; })); return { label: rb.id, parts: [x.oper, x.alarm, x.wait], stop: x.stop }; }).sort(function (p, q) { return q.stop - p.stop; });
    var dn = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], hrs = []; for (var k = 7; k <= 22; k++) hrs.push((k < 10 ? '0' : '') + k);
    var grid = dn.map(function () { return hrs.map(function () { return 0; }); });
    ev.forEach(function (e) { var d = U.dow(e.date); if (d >= 1 && d <= 6) grid[d - 1][e.hour - 7] += e.min; });
    grid = grid.map(function (row) { return row.map(function (v) { return Math.round(v); }); });
    var top = ev.slice().sort(function (p, q) { return q.min - p.min; }).slice(0, 10);
    var days = group(list, function (x) { return x.date; }).length || 1;
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'Stop time', value: F(a.stop, 1), unit: '%', status: lo(a.stop, CFG.stop), note: 'limit ' + CFG.stop + '%' }),
      Charts.tile({ label: 'Alarm hours', value: F(a.alarm, 0), unit: 'h' }), Charts.tile({ label: 'Waiting hours', value: F(a.wait, 0), unit: 'h' }),
      Charts.tile({ label: 'Stops per day', value: F(ev.length / days, 1), note: F(ev.length, 0) + ' alarm events' })].join('') + '</div>' +
      '<div class="grid g2">' +
      card('Stop time by month', 'Always the full 90-day history for the robots in scope.', Charts.columns({ labels: months.map(function (g) { return U.MON[+g.k.slice(5) - 1] + ' ' + g.k.slice(0, 4); }), values: mm.map(function (x) { return +x.stop.toFixed(1); }), unit: '%', target: CFG.stop, targetLabel: 'limit ' + CFG.stop + '%', name: 'Stop time', xName: 'Month', h: 190 })) +
      card('How each robot spends planned time', 'Share of planned hours, highest stop time first.', Charts.stackedH({ rows: comp, pct: true, labelW: 54, series: [{ name: 'Operating', color: 'var(--st-good)' }, { name: 'Alarm stop', color: 'var(--st-critical)' }, { name: 'Waiting', color: 'var(--st-warning)' }], fmt: function (v) { return F(v, 0) + ' h'; }, xName: 'Robot' })) +
      '</div>' +
      card('When alarms happen', 'Alarm minutes by weekday and start hour. Darker cells in a column point at a shift-start or break pattern.', Charts.heat({ rows: dn, cols: hrs, values: grid, unit: ' min', name: 'Alarm time', yName: 'Day', cell: 22 })) +
      card('Longest single stops', 'The ten longest alarm events in scope.', '<div class="tw"><table class="t"><thead><tr><th>Date</th><th>Robot</th><th>Code</th><th>Alarm</th><th>Category</th><th class="r">Minutes</th></tr></thead><tbody>' +
        top.map(function (e) { var al = ALARMS[e.a]; return '<tr><td class="code">' + U.short(e.date) + ' ' + (e.hour < 10 ? '0' : '') + e.hour + ':00</td><td><b>' + e.robot + '</b></td><td class="code">' + al[0] + '</td><td>' + h(al[1]) + '</td><td>' + h(al[2]) + '</td><td class="r">' + F(e.min, 0) + '</td></tr>'; }).join('') + '</tbody></table></div>');
  }

  function vAlarms() {
    var list = recs.filter(inScope), a = agg(list), ev = events.filter(inScope), totMin = U.sum(ev.map(function (e) { return e.min; })) || 1;
    var byCat = CATS.map(function (c) { var x = ev.filter(function (e) { return ALARMS[e.a][2] === c; }); return { label: c, value: Math.round(U.sum(x.map(function (e) { return e.min; })) / 6) / 10, n: x.length }; }).sort(function (p, q) { return q.value - p.value; });
    var byCode = ALARMS.map(function (al, i) { var x = ev.filter(function (e) { return e.a === i; }), m = U.sum(x.map(function (e) { return e.min; })); return { al: al, n: x.length, min: m }; }).filter(function (x) { return x.n; }).sort(function (p, q) { return q.min - p.min; });
    var cum = 0;
    var codeRows = byCode.map(function (x) { cum += x.min; return '<tr><td class="code">' + x.al[0] + '</td><td>' + h(x.al[1]) + '<span class="sub">' + h(x.al[2]) + '</span></td><td class="r">' + F(x.n, 0) + '</td><td class="r">' + F(x.min / 60, 1) + '</td><td class="r">' + F(x.min / x.n, 1) + '</td><td class="r">' + pct(x.min / totMin * 100) + '</td><td class="r">' + pct(cum / totMin * 100) + '</td></tr>'; }).join('');
    var weeks = group(ev, function (e) { var d = U.dow(e.date); return U.add(e.date, -((d + 6) % 7)); });
    var rel = scopeRobots().map(function (rb) { var x = agg(list.filter(function (q) { return q.robot === rb.id; })), n = ev.filter(function (e) { return e.robot === rb.id; }).length || 1; return { rb: rb, mtbf: x.oper / n, mttr: x.alarm * 60 / n, n: n }; }).sort(function (p, q) { return p.mtbf - q.mtbf; });
    var nAll = ev.length || 1;
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'Alarm events', value: F(ev.length, 0) }), Charts.tile({ label: 'Alarm hours', value: F(a.alarm, 0), unit: 'h' }),
      Charts.tile({ label: 'MTBF', value: F(a.oper / nAll, 1), unit: 'h', note: 'operating hours per alarm' }), Charts.tile({ label: 'MTTR', value: F(a.alarm * 60 / nAll, 1), unit: 'min', note: 'average alarm duration' })].join('') + '</div>' +
      '<div class="grid g2">' +
      card('Lost hours by alarm category', 'Ranked. The first two or three rows usually decide where to work.', Charts.hbars({ rows: byCat.map(function (c) { return { label: c.label, value: c.value, extra: [['Events', F(c.n, 0), null]] }; }), unit: ' h', name: 'Alarm time', xName: 'Category', labelW: 118 })) +
      card('Alarm events per week', 'Count of events, week starting Monday.', Charts.lines({ labels: weeks.map(function (g) { return U.short(g.k); }), series: [{ name: 'Alarm events', values: weeks.map(function (g) { return g.v.length; }) }], xName: 'Week of', area: true, h: 200 })) +
      '</div>' +
      card('Alarm codes', 'Sorted by lost time. The cumulative column is the Pareto reading.', '<div class="tw"><table class="t"><thead><tr><th>Code</th><th>Alarm</th><th class="r">Events</th><th class="r">Hours</th><th class="r">Avg min</th><th class="r">Share</th><th class="r">Cumulative</th></tr></thead><tbody>' + codeRows + '</tbody></table></div>') +
      card('Reliability by robot', 'MTBF = operating hours ÷ alarm events. MTTR = alarm minutes ÷ alarm events. Lowest MTBF first.', '<div class="tw"><table class="t"><thead><tr><th>Robot</th><th class="r">Alarm events</th><th class="r">MTBF (h)</th><th class="r">MTTR (min)</th></tr></thead><tbody>' +
        rel.map(function (x) { return '<tr><td><b>' + x.rb.id + '</b><span class="sub">' + h(x.rb.cellName) + '</span></td><td class="r">' + F(x.n, 0) + '</td><td class="r">' + F(x.mtbf, 2) + '</td><td class="r">' + F(x.mttr, 1) + '</td></tr>'; }).join('') + '</tbody></table></div>');
  }

  /* --- small forecasting models, fitted in the browser --- */
  function fitPoly(xs, ys, deg) {
    var n = deg + 1, A = [], b = [], i, j, k;
    for (i = 0; i < n; i++) { A.push([]); for (j = 0; j < n; j++) A[i].push(U.sum(xs.map(function (x) { return Math.pow(x, i + j); }))); b.push(U.sum(xs.map(function (x, q) { return ys[q] * Math.pow(x, i); }))); }
    for (i = 0; i < n; i++) { var p = i; for (k = i + 1; k < n; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k; var t = A[i]; A[i] = A[p]; A[p] = t; var tb = b[i]; b[i] = b[p]; b[p] = tb; if (Math.abs(A[i][i]) < 1e-12) return null; for (k = i + 1; k < n; k++) { var f = A[k][i] / A[i][i]; for (j = i; j < n; j++) A[k][j] -= f * A[i][j]; b[k] -= f * b[i]; } }
    var c = new Array(n); for (i = n - 1; i >= 0; i--) { var s = b[i]; for (j = i + 1; j < n; j++) s -= A[i][j] * c[j]; c[i] = s / A[i][i]; }
    return function (x) { var v = 0; for (var q = 0; q < n; q++) v += c[q] * Math.pow(x, q); return v; };
  }
  function fitHolt(ys) { var al = 0.5, be = 0.3, L = ys[0], T = ys.length > 1 ? ys[1] - ys[0] : 0; for (var i = 1; i < ys.length; i++) { var pl = L; L = al * ys[i] + (1 - al) * (L + T); T = be * (L - pl) + (1 - be) * T; } var n = ys.length - 1; return function (x) { return L + (x - n) * T; }; }
  var MODELS = [['Linear trend', function (xs, ys) { return fitPoly(xs, ys, 1); }], ['Quadratic trend', function (xs, ys) { return ys.length >= 4 ? fitPoly(xs, ys, 2) : null; }], ['Holt smoothing', function (xs, ys) { return fitHolt(ys); }]];

  function vPredict() {
    var rs = scopeRobots(); if (!S.pmRobot || !rs.some(function (x) { return x.id === S.pmRobot; })) S.pmRobot = rs.slice().sort(function (p, q) { return q.tip - p.tip; })[0].id;
    var rb = rs.filter(function (x) { return x.id === S.pmRobot; })[0], hist = recs.filter(function (x) { return x.robot === rb.id; });
    var st = hist.length - 1; while (st > 0 && !hist[st].tipChanged) st--;
    var cyc = hist.slice(st), ys = cyc.map(function (x) { return x.asf; }), xs = ys.map(function (_, i) { return i; }), H = 12;
    var res = MODELS.map(function (m) {
      var mae = null; if (ys.length >= 8) { var k = ys.length - 4, f = m[1](xs.slice(0, k), ys.slice(0, k)); if (f) mae = U.avg(xs.slice(k).map(function (x, i) { return Math.abs(f(x) - ys[k + i]); })); }
      var full = m[1](xs, ys), rul = null; if (full) for (var q = 1; q <= 40; q++) if (full(ys.length - 1 + q) >= CFG.asfLimit) { rul = q; break; }
      return { name: m[0], mae: mae, f: full, rul: rul };
    });
    var ok = res.filter(function (x) { return x.f; }), best = ok.filter(function (x) { return x.mae != null; }).sort(function (p, q) { return p.mae - q.mae; })[0] || ok[0];
    var arcDay = U.avg(hist.slice(-10).map(function (x) { return x.arc; }));
    var labels = cyc.map(function (x) { return U.short(x.date); }), act = ys.map(function (v) { return +v.toFixed(2); }), fc = ys.map(function (v, i) { return i === ys.length - 1 ? +v.toFixed(2) : null; });
    for (var q = 1; q <= H; q++) { labels.push('+' + q + 'd'); act.push(null); fc.push(+Math.max(0, best.f(ys.length - 1 + q)).toFixed(2)); }
    var over = ys[ys.length - 1] >= CFG.asfLimit;
    var chart = Charts.lines({ labels: labels, series: [{ name: 'Measured arc-start failure rate', values: act }, { name: 'Forecast (' + best.name.toLowerCase() + ')', values: fc, color: 'var(--s2)', dash: true }], unit: '%', fmt: function (v) { return F(v, 2) + '%'; }, target: CFG.asfLimit, targetLabel: 'limit ' + CFG.asfLimit + '%', xName: 'Working day', h: 230 });
    var mt = '<div class="tw"><table class="t"><thead><tr><th>Model</th><th class="r">Backtest MAE (pts)</th><th class="r">Days to limit</th><th class="r">Arc-hours to limit</th><th></th></tr></thead><tbody>' +
      res.map(function (x) { return '<tr><td><b>' + h(x.name) + '</b></td><td class="r">' + (x.mae == null ? 'needs 8+ days' : F(x.mae, 3)) + '</td><td class="r">' + (over ? 'limit passed' : x.rul == null ? '> 40' : x.rul) + '</td><td class="r">' + (over || x.rul == null ? '–' : F(x.rul * arcDay, 0)) + '</td><td>' + (x === best ? '<span class="pill info">used in chart</span>' : '') + '</td></tr>'; }).join('') + '</tbody></table></div>';
    var cons = function (used, life, name) { var p = used / life * 100, kind = p >= 100 ? 'critical' : p >= 80 ? 'warning' : 'good'; return '<td style="min-width:150px"><div class="mrow"><span>' + F(used, 0) + ' / ' + life + ' arc-h</span>' + Charts.status(kind, kind === 'good' ? 'OK' : kind === 'warning' ? 'Plan change' : 'Overdue') + '</div>' + Charts.meter({ value: Math.min(p, 100), max: 100, kind: kind, label: name }) + '</td>'; };
    var fleet = '<div class="tw"><table class="t"><thead><tr><th>Robot</th><th>Contact tip</th><th>Nozzle</th><th>Liner</th><th>Torch calibration</th></tr></thead><tbody>' + rs.map(function (x) {
      var dsc = U.diff(x.calib, TODAY), ck = dsc > CFG.calibDays ? 'critical' : dsc > CFG.calibDays * 0.8 ? 'warning' : 'good';
      return '<tr class="click" data-pm="' + x.id + '"><td><b>' + x.id + '</b><span class="sub">' + h(x.cellName) + '</span></td>' + cons(x.tip, CFG.tipLife, x.id + ' tip') + cons(x.nozzle, CFG.nozzleLife, x.id + ' nozzle') + cons(x.liner, CFG.linerLife, x.id + ' liner') +
        '<td>' + dsc + ' days ago ' + Charts.status(ck, ck === 'good' ? 'OK' : ck === 'warning' ? 'Due soon' : 'Overdue') + '</td></tr>';
    }).join('') + '</tbody></table></div>';
    var sel = '<label class="f">Robot<select id="pmSel">' + rs.map(function (x) { return '<option value="' + x.id + '"' + (x.id === rb.id ? ' selected' : '') + '>' + x.id + ' · ' + h(x.cellName) + '</option>'; }).join('') + '</select></label>';
    return '<div class="note"><b>Research prototype.</b> The wear signal and every reading here are synthetic. The three models are fitted live in your browser on the current tip cycle and scored on the last four working days. ' +
      'In my thesis work the same question is studied on controller logs with an LSTM model; that model is not part of this demo.</div>' +
      '<div class="grid g4">' + [
        Charts.tile({ label: 'Tip in use', value: F(rb.tip, 0), unit: 'arc-h', note: 'expected life ' + CFG.tipLife + ' arc-h' }),
        Charts.tile({ label: 'Arc-start failures today', value: F(ys[ys.length - 1], 2), unit: '%', status: lo(ys[ys.length - 1], CFG.asfLimit), note: 'limit ' + CFG.asfLimit + '%' }),
        Charts.tile({ label: 'Forecast: days to limit', value: over ? '0' : best.rul == null ? '> 40' : String(best.rul), note: best.name }),
        Charts.tile({ label: 'Days in this tip cycle', value: String(ys.length) })].join('') + '</div>' +
      card('Contact-tip wear signal — ' + rb.id, 'Arc-start failure rate rises as the tip wears. The dashed line is the forecast; the limit is editable in Settings.', '<div class="filters" style="margin-bottom:10px">' + sel + '</div>' + chart) +
      card('Model comparison', 'Mean absolute error on a four-day hold-out, in percentage points. Lower is better.', mt) +
      card('Consumables across the fleet', 'Usage against expected life in arc-hours. Select a row to forecast that robot.', fleet);
  }

  function vEnergy() {
    var list = recs.filter(inScope), a = agg(list);
    var weeks = group(list, function (x) { var d = U.dow(x.date); return U.add(x.date, -((d + 6) % 7)); }), wa = weeks.map(function (g) { return agg(g.v); });
    var per = scopeRobots().map(function (rb) { var x = agg(list.filter(function (q) { return q.robot === rb.id; })); return { label: rb.id + ' ' + rb.cellName, value: +x.sec.toFixed(2), extra: [['Energy', F(x.kwh, 0) + ' kWh', null], ['Wire', F(x.wire, 0) + ' kg', null]] }; }).sort(function (p, q) { return q.value - p.value; });
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'Electricity', value: F(a.kwh / 1000, 1), unit: 'MWh' }), Charts.tile({ label: 'Wire deposited', value: F(a.wire / 1000, 2), unit: 't' }),
      Charts.tile({ label: 'Specific energy', value: F(a.sec, 2), unit: 'kWh/kg wire', spark: wa.map(function (x) { return x.sec; }) }),
      Charts.tile({ label: 'Scope 2 emissions', value: F(a.kwh * CFG.ef / 1000, 1), unit: 't CO₂e', note: 'factor ' + CFG.ef + ' kg/kWh' })].join('') + '</div>' +
      '<div class="grid g2">' +
      card('Specific energy per week', 'kWh of electricity per kg of wire deposited. Lower means less energy for the same weld metal.', Charts.lines({ labels: weeks.map(function (g) { return U.short(g.k); }), series: [{ name: 'Specific energy', values: wa.map(function (x) { return +x.sec.toFixed(2); }) }], fmt: function (v) { return F(v, 2) + ' kWh/kg'; }, xName: 'Week of', h: 200 })) +
      card('Specific energy by robot', 'Highest first. Idle and alarm time still draws power, so stop time shows up here too.', Charts.hbars({ rows: per, fmt: function (v) { return F(v, 2) + ' kWh/kg'; }, name: 'Specific energy', xName: 'Robot' })) +
      '</div>' +
      '<div class="note"><b>Method.</b> Emissions are location-based Scope 2: electricity (kWh) × grid emission factor. The factor shown is a placeholder; replace it in Settings with the official factor for your grid and year. ' +
      'Energy here is modelled from arc, idle and stop hours. A real project meters it at the power source or cell feeder.</div>';
  }

  function cmStats(c) {
    var b = agg(recs.filter(function (x) { return x.robot === c.robot && x.date < c.date && x.date >= U.add(c.date, -28); }));
    var af = c.status === 'Planned' ? null : agg(recs.filter(function (x) { return x.robot === c.robot && x.date >= c.date; }));
    return { before: b.stop, after: af ? af.stop : null, rec: af ? (b.stop - af.stop) / 100 * 472 : null };
  }
  function vCm() {
    var rows = CM.map(function (c) { return { c: c, s: cmStats(c) }; }), done = rows.filter(function (x) { return x.s.after != null; });
    var stc = { Done: 'ok', Trial: 'warn', Planned: 'info' };
    return '<div class="grid g3">' + [
      Charts.tile({ label: 'Countermeasures', value: String(CM.length), note: done.length + ' with results' }),
      Charts.tile({ label: 'Hours recovered per month', value: F(U.sum(done.map(function (x) { return Math.max(0, x.s.rec); })), 0), unit: 'h', note: 'at 472 planned h per robot' }),
      Charts.tile({ label: 'Average stop-time change', value: F(U.avg(done.map(function (x) { return x.s.after - x.s.before; })), 1), unit: 'pts' })].join('') + '</div>' +
      card('Stop time before and after', '28 days before the change against every day since. Same robot, same definition.', Charts.dumbbell({ rows: done.map(function (x) { return { label: x.c.id + ' · ' + x.c.robot, before: +x.s.before.toFixed(1), after: +x.s.after.toFixed(1) }; }), unit: '%', labelW: 110, beforeName: '28 days before', afterName: 'Since the change' })) +
      card('Register', 'One line per change so the effect can be checked later, not assumed.', '<div class="tw"><table class="t"><thead><tr><th>ID</th><th>Countermeasure</th><th>Robot</th><th>Targets</th><th>Owner</th><th>Since</th><th>Status</th><th class="r">Before</th><th class="r">After</th><th class="r">h / month</th></tr></thead><tbody>' +
        rows.map(function (x) { return '<tr><td class="code">' + x.c.id + '</td><td>' + h(x.c.title) + '</td><td><b>' + x.c.robot + '</b></td><td>' + h(x.c.cat) + '</td><td>' + h(x.c.owner) + '</td><td class="code">' + U.short(x.c.date) + '</td><td><span class="pill ' + stc[x.c.status] + '">' + x.c.status + '</span></td><td class="r">' + pct(x.s.before) + '</td><td class="r">' + (x.s.after == null ? '–' : pct(x.s.after)) + '</td><td class="r">' + (x.s.rec == null ? '–' : F(x.s.rec, 0)) + '</td></tr>'; }).join('') + '</tbody></table></div>') +
      '<div class="note"><b>Reading this honestly.</b> A before/after gap is not proof on its own: product mix, shifts and seasonality move stop time too. The register keeps the baseline period, the definition and the owner next to each claim so it can be re-checked.</div>';
  }

  function vSettings() {
    var f = function (k, label, step, hint) { return '<label class="f">' + label + '<input type="number" step="' + step + '" id="cfg_' + k + '" value="' + CFG[k] + '">' + (hint ? '<span>' + hint + '</span>' : '') + '</label>'; };
    return card('Targets and limits', 'Saved in this browser only. Every view recalculates against these.', '<div class="grid g3">' + f('oee', 'OEE target (%)', 1) + f('avail', 'Availability target (%)', 1) + f('stop', 'Stop-time limit (%)', 1) + '</div>') +
      card('Consumables', 'Expected life in arc-hours and the wear-signal limit used by the forecast.', '<div class="grid g3">' + f('tipLife', 'Contact tip life (arc-h)', 1) + f('nozzleLife', 'Nozzle life (arc-h)', 1) + f('linerLife', 'Liner life (arc-h)', 10) + f('asfLimit', 'Arc-start failure limit (%)', 0.1) + f('calibDays', 'Torch calibration interval (days)', 1) + '</div>') +
      card('Emissions', '', '<div class="grid g3">' + f('ef', 'Grid emission factor (kg CO₂e per kWh)', 0.01, 'Placeholder. Use your official grid factor.') + '</div>') +
      '<div class="tools"><button class="btn pri" id="cfgSave" type="button">Save settings</button><button class="btn" id="cfgReset" type="button">Restore defaults</button><button class="btn" id="csv" type="button">Download daily data (CSV)</button></div>';
  }

  /* ---------------- shell ---------------- */
  var R = { overview: vOverview, oee: vOee, stop: vStop, alarms: vAlarms, predict: vPredict, energy: vEnergy, cm: vCm, settings: vSettings };
  function draw() {
    document.getElementById('nav').innerHTML = VIEWS.map(function (v, i) { return '<button type="button" data-view="' + v[0] + '"' + (S.view === v[0] ? ' aria-current="page"' : '') + '><i>' + (i + 1 < 10 ? '0' : '') + (i + 1) + '</i>' + v[1] + '</button>'; }).join('');
    document.getElementById('title').textContent = VIEWS.filter(function (v) { return v[0] === S.view; })[0][1];
    var rs = scopeRobots();
    document.getElementById('sub').textContent = U.long(U.add(TODAY, -(S.days - 1))) + ' – ' + U.long(TODAY) + ' · ' + rs.length + ' robot' + (rs.length > 1 ? 's' : '');
    var cellRobots = robots.filter(function (x) { return S.cell === 'all' || x.cell === S.cell; });
    document.getElementById('filters').innerHTML =
      '<label class="f">Period<div class="seg" role="group" aria-label="Period">' + [30, 60, 90].map(function (d) { return '<button type="button" data-days="' + d + '" aria-pressed="' + (S.days === d) + '">' + d + ' days</button>'; }).join('') + '</div></label>' +
      '<label class="f">Cell<select id="fCell"><option value="all">All cells</option>' + CELLS.map(function (c) { return '<option value="' + c.id + '"' + (S.cell === c.id ? ' selected' : '') + '>' + c.id + ' · ' + c.name + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">Robot<select id="fRobot"><option value="all">All robots</option>' + cellRobots.map(function (x) { return '<option value="' + x.id + '"' + (S.robot === x.id ? ' selected' : '') + '>' + x.id + '</option>'; }).join('') + '</select></label>';
    document.getElementById('view').innerHTML = R[S.view]();
  }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var b = t.closest('[data-view]'); if (b) { S.view = b.getAttribute('data-view'); draw(); window.scrollTo(0, 0); return; }
    b = t.closest('[data-days]'); if (b) { S.days = +b.getAttribute('data-days'); return draw(); }
    b = t.closest('[data-robot]'); if (b) { var rb = b.getAttribute('data-robot'); S.robot = S.robot === rb ? 'all' : rb; return draw(); }
    b = t.closest('[data-pm]'); if (b) { S.pmRobot = b.getAttribute('data-pm'); draw(); window.scrollTo(0, 0); return; }
    if (t.id === 'cfgSave') { Object.keys(DEF).forEach(function (k) { var el = document.getElementById('cfg_' + k); if (el && el.value !== '' && !isNaN(+el.value)) CFG[k] = +el.value; }); U.set('ri_cfg', CFG); U.toast('Settings saved'); return draw(); }
    if (t.id === 'cfgReset') { CFG = Object.assign({}, DEF); U.del('ri_cfg'); U.toast('Defaults restored'); return draw(); }
    if (t.id === 'csv') { var rows = [['date', 'robot', 'cell', 'planned_h', 'operating_h', 'alarm_h', 'waiting_h', 'cycles', 'rework_cycles', 'arc_h', 'wire_kg', 'energy_kwh']].concat(recs.map(function (x) { return [x.date, x.robot, x.cell, x.planned, x.oper.toFixed(2), x.alarm.toFixed(2), x.wait.toFixed(2), x.cycles, x.rework, x.arc.toFixed(2), x.wire.toFixed(1), x.kwh.toFixed(1)]; })); U.download('robot-insight-synthetic-daily.csv', U.csv(rows)); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'fCell') { S.cell = t.value; S.robot = 'all'; draw(); }
    if (t.id === 'fRobot') { S.robot = t.value; draw(); }
    if (t.id === 'pmSel') { S.pmRobot = t.value; draw(); }
  });
  document.getElementById('logo').innerHTML = LaboSprite.svg('idle', 34);
  U.skin('ri_skin', 'mat');
  draw();
})();
