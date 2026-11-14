/* Change Board — public demo. Cases, part names, drawing numbers and people are generated;
   nothing here comes from a real company. The flow (Design → Prod. Engineering → Procurement →
   PPIC → Warehouse) is the generic hand-over chain of an engineering change. */
(function () {
  'use strict';
  var h = U.h, F = Charts.F;
  var TODAY = '2026-11-12', LAST_MEETING = '2026-11-11';
  var DEF_FLOW = [{ k: 'DSN', name: 'Design', std: 3 }, { k: 'PE', name: 'Prod. Engineering', std: 4 }, { k: 'PUR', name: 'Procurement', std: 7 }, { k: 'PPC', name: 'PPIC', std: 3 }, { k: 'WH', name: 'Warehouse', std: 2 }];
  var URG = ['Critical', 'High', 'Medium', 'Low'], UCOL = { Critical: 'var(--st-critical)', High: 'var(--st-serious)', Medium: 'var(--st-warning)', Low: 'var(--de)' };
  var PARTS = [['BRACKET, HOSE CLAMP', 'fab'], ['COVER, DRIVE GUARD', 'fab'], ['PLATE, MOTOR BASE', 'fab'], ['SHAFT, IDLER', 'mach'], ['HARNESS, CONTROL BOX', 'buy'], ['PIPE, LUBRICATION', 'fab'], ['DECAL, WARNING', 'buy'], ['SEAL, GEARBOX COVER', 'buy'], ['BOLT SET, FRAME', 'buy'], ['SPACER, ROLLER', 'mach'], ['HOUSING, BEARING', 'mach'], ['GUARD, CHAIN', 'fab'], ['BRACKET, SENSOR', 'fab'], ['ARM, TENSIONER', 'fab'], ['LUG, LIFTING', 'fab'], ['PANEL, SIDE', 'fab'], ['HOSE, HYDRAULIC', 'buy'], ['RAIL, GUIDE', 'mach']];
  var WHAT = [['hole pitch corrected after fit-up issue', 'Quality claim', 'Revise', 'fab'], ['thickness reduced 6 → 4.5 mm', 'Cost down', 'Revise', 'fab'], ['weld length reduced on low-stress seam', 'Cost down', 'Revise', 'fab'], ['paint spec updated to new primer', 'Design change', 'Revise', 'fab'], ['material grade changed to stocked plate', 'Cost down', 'Revise', 'fab'], ['interference with harness fixed', 'Quality claim', 'Revise', 'fab'],
    ['tolerance relaxed on non-fitting diameter', 'Cost down', 'Revise', 'mach'], ['chamfer added to ease assembly', 'Quality claim', 'Revise', 'mach'], ['heat treatment note clarified', 'Design change', 'Revise', 'mach'], ['new length variant for long-stroke model', 'Customer option', 'New item', 'mach'],
    ['supplier part superseded', 'Supplier request', 'Revise', 'buy'], ['second source qualified', 'Supplier request', 'New item', 'buy'], ['added to option kit', 'Customer option', 'New item', 'buy'], ['merged into parent kit, old item obsolete', 'Design change', 'Obsolete', 'buy'], ['specification note clarified for incoming inspection', 'Design change', 'Revise', 'buy']];
  var MODELS = ['CDU-300', 'CDU-450', 'LFT-120'], PEOPLE = ['R. Hartono', 'D. Wibowo', 'S. Lestari', 'A. Nugraha', 'M. Putri', 'B. Santoso'];
  var NOTE = { DSN: ['Drawing revision in checking', 'Waiting for old/new item confirmation from Design', '3D model updated, 2D drawing pending'], PE: ['Routing and jig impact under review', 'MBOM structure drafted, needs plate cutting list', 'Standard time re-estimate requested'], PUR: ['Quotation requested from second supplier', 'Lead time 21 days quoted, negotiating', 'PO raised, waiting for supplier confirmation'], PPC: ['Run-out of old stock planned', 'Effectivity date to be aligned with build schedule', 'Planning parameters updated'], WH: ['Bin location and label update pending', 'Old stock segregation in progress', 'Receiving inspection plan shared'] };

  function generate() {
    var r = U.rng(4812), flow = DEF_FLOW, cases = [], n = 46;
    for (var i = 0; i < n; i++) {
      var pk = U.pick(r, PARTS), part = pk[0], w = U.pick(r, WHAT.filter(function (x) { return x[3] === pk[1]; })), opened = U.add(TODAY, -Math.round(2 + 90 * Math.pow(r(), 1.9))), dn = U.int(r, 1100, 8990), rev = U.pick(r, ['A', 'B', 'C', 'D']);
      var u = r(), urg = u < 0.12 ? 'Critical' : u < 0.36 ? 'High' : u < 0.78 ? 'Medium' : 'Low', speed = urg === 'Critical' ? 0.8 : urg === 'High' ? 0.95 : 1.08;
      var steps = [], cur = opened, notes = [];
      for (var s = 0; s < flow.length; s++) {
        if (cur > TODAY) { steps.push({ start: null, end: null }); continue; }
        var dur = Math.max(1, Math.round(flow[s].std * speed * (0.35 + r() * 0.95) + (r() < 0.24 ? flow[s].std * (0.9 + r() * 1.3) : 0))), end = U.add(cur, dur);
        if (end > TODAY) { steps.push({ start: cur, end: null }); notes.push({ d: U.add(cur, Math.min(dur - 1, U.int(r, 0, 3))), by: U.pick(r, PEOPLE), t: U.pick(r, NOTE[flow[s].k]) }); cur = U.add(TODAY, 1); }
        else { steps.push({ start: cur, end: end }); if (r() < 0.55) notes.push({ d: end, by: U.pick(r, PEOPLE), t: flow[s].name + ' done. ' + U.pick(r, NOTE[flow[s].k]) + '.' }); cur = end; }
      }
      cases.push({ id: 'EC-26-' + ('00' + (i + 12)).slice(-3), part: part, what: w[0], source: w[1], type: w[2], model: U.pick(r, MODELS), urg: urg, oldDwg: w[2] === 'New item' ? '—' : dn + '-' + rev, newDwg: w[2] === 'Obsolete' ? '—' : dn + '-' + String.fromCharCode(rev.charCodeAt(0) + 1),
        buy: pk[1] === 'buy' ? 'Buy' : pk[1] === 'mach' ? U.pick(r, ['Make', 'Subcon']) : U.pick(r, ['Make', 'Make', 'Subcon']), opened: opened, effective: U.add(opened, U.int(r, 25, 60)), steps: steps, notes: notes, seen: {} });
    }
    cases.sort(function (a, b) { return a.opened < b.opened ? -1 : 1; }).forEach(function (c, i) { c.id = 'EC-26-' + ('00' + (i + 12)).slice(-3); });
    return { flow: JSON.parse(JSON.stringify(DEF_FLOW)), cases: cases };
  }
  var DB = U.get('cb_db_v3', null) || generate();
  function save() { U.set('cb_db_v3', DB); }

  /* ---------------- derived ---------------- */
  function stage(c) { for (var i = 0; i < c.steps.length; i++) if (!c.steps[i].end) return i; return -1; }
  function waiting(c) { var s = stage(c); return s < 0 || !c.steps[s].start ? 0 : U.diff(c.steps[s].start, TODAY); }
  function late(c) { var s = stage(c); return s >= 0 && waiting(c) > DB.flow[s].std; }
  function closedOn(c) { return stage(c) < 0 ? c.steps[c.steps.length - 1].end : null; }
  function lead(c) { var e = closedOn(c); return e ? U.diff(c.opened, e) : null; }
  function stdTotal() { return U.sum(DB.flow.map(function (f) { return f.std; })); }
  function lastNote(c) { return c.notes.length ? c.notes[c.notes.length - 1] : null; }
  function urgHtml(u) { return '<span class="urg u-' + u + '"><b></b>' + u + '</span>'; }
  function flowDots(c) { var s = stage(c); return '<span class="flow" aria-label="' + (s < 0 ? 'Closed' : 'With ' + DB.flow[s].name) + '">' + c.steps.map(function (st, i) { return '<i class="' + (st.end ? 'dn' : i === s ? (late(c) ? 'lt' : 'on') : '') + '" title="' + h(DB.flow[i].name) + '"></i>'; }).join('') + '</span>'; }
  function card(title, hint, body) { return '<section class="card"><h3>' + h(title) + '</h3>' + (hint ? '<p class="hint">' + hint + '</p>' : '') + body + '</section>'; }
  var S = { view: 'board', q: '', urg: 'all', dept: 'all', closed: false, meet: LAST_MEETING, open: null };
  var VIEWS = [['board', 'Board'], ['timeline', 'Timeline'], ['meeting', 'Meeting mode'], ['analytics', 'Analytics'], ['settings', 'Settings']];
  var WF = 640, WH = 640;
  function filtered() {
    var q = S.q.trim().toLowerCase();
    return DB.cases.filter(function (c) {
      var s = stage(c);
      if (!S.closed && s < 0) return false;
      if (S.urg !== 'all' && c.urg !== S.urg) return false;
      if (S.dept !== 'all' && (s < 0 || DB.flow[s].k !== S.dept)) return false;
      return !q || (c.id + ' ' + c.part + ' ' + c.what + ' ' + c.model + ' ' + c.newDwg).toLowerCase().indexOf(q) >= 0;
    }).sort(function (a, b) { var sa = stage(a) < 0, sb = stage(b) < 0; if (sa !== sb) return sa ? 1 : -1; var d = URG.indexOf(a.urg) - URG.indexOf(b.urg); return d || (waiting(b) - waiting(a)); });
  }

  /* ---------------- views ---------------- */
  function vBoard() {
    var open = DB.cases.filter(function (c) { return stage(c) >= 0; }), closed = DB.cases.filter(function (c) { return stage(c) < 0; });
    var lateN = open.filter(late).length, leads = closed.map(lead), onTime = closed.filter(function (c) { return lead(c) <= stdTotal(); }).length;
    var ball = DB.flow.map(function (f, i) { var mine = open.filter(function (c) { return stage(c) === i; }); return { label: f.name, parts: URG.map(function (u) { return mine.filter(function (c) { return c.urg === u; }).length; }) }; });
    var rows = filtered();
    var tbl = '<div class="tw"><table class="t"><thead><tr><th>Case</th><th>Part</th><th>Urgency</th><th>Flow</th><th>With</th><th class="r">Waiting</th><th>Drawing</th><th>Effective</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (c) {
        var s = stage(c), w = waiting(c);
        return '<tr class="click" data-open="' + c.id + '" tabindex="0"><td><b class="code">' + c.id + '</b><span class="sub">' + h(c.type) + ' · ' + h(c.source) + '</span></td><td>' + h(c.part) + '<span class="sub">' + h(c.what) + '</span></td><td>' + urgHtml(c.urg) + '</td><td>' + flowDots(c) + '</td>' +
          '<td>' + (s < 0 ? '<span class="pill ok">Closed</span>' : h(DB.flow[s].name)) + '</td><td class="r">' + (s < 0 ? '–' : w + ' d' + (late(c) ? ' <span class="pill bad">+' + (w - DB.flow[s].std) + ' over</span>' : '')) + '</td><td class="code">' + h(c.oldDwg) + ' → ' + h(c.newDwg) + '</td><td class="code">' + U.short(c.effective) + '</td></tr>';
      }).join('') : '<tr><td colspan="8">No case matches these filters.</td></tr>') + '</tbody></table></div>';
    return '<div class="grid g4">' + [
      Charts.tile({ label: 'Open cases', value: String(open.length), note: closed.length + ' closed in the last 13 weeks' }),
      Charts.tile({ label: 'Over standard time now', value: String(lateN), status: lateN === 0 ? { kind: 'good', label: 'None late' } : lateN <= 4 ? { kind: 'warning', label: 'Needs follow-up' } : { kind: 'critical', label: 'Escalate' } }),
      Charts.tile({ label: 'Average lead time', value: F(U.avg(leads), 1), unit: 'days', note: 'standard ' + stdTotal() + ' days' }),
      Charts.tile({ label: 'Closed within standard', value: F(closed.length ? onTime / closed.length * 100 : 0, 0), unit: '%', note: onTime + ' of ' + closed.length + ' cases' })].join('') + '</div>' +
      card('Who holds the ball', 'Open cases by the department they are waiting on, split by urgency. The longest row is the meeting’s first topic.', Charts.stackedH({ W: WF, rows: ball, labelW: 132, series: URG.map(function (u) { return { name: u, color: UCOL[u] }; }), fmt: function (v) { return F(v, 0); }, xName: 'Department' })) +
      card('Cases', rows.length + ' shown. Critical first, then longest waiting. Select a row for the full history.', tbl);
  }

  function vTimeline() {
    var rows = filtered().filter(function (c) { return stage(c) >= 0; }).slice(0, 22);
    if (!rows.length) return '<div class="note">No open case matches these filters.</div>';
    var min = rows.reduce(function (m, c) { return c.opened < m ? c.opened : m; }, TODAY), max = U.add(TODAY, 10), span = U.diff(min, max);
    var lw = 150, m = { l: lw, r: 12, t: 22, b: 6 }, rowH = 24, W = WF, pw = W - m.l - m.r, H = m.t + m.b + rows.length * rowH, g = '';
    var x = function (d) { return m.l + U.diff(min, d) / span * pw; };
    for (var d = min; d <= max; d = U.add(d, 1)) if (U.dow(d) === 1) g += '<line class="gr" x1="' + x(d) + '" x2="' + x(d) + '" y1="' + (m.t - 4) + '" y2="' + (H - m.b) + '"/><text x="' + x(d) + '" y="12" text-anchor="middle">' + U.short(d) + '</text>';
    rows.forEach(function (c, i) {
      var y = m.t + i * rowH, s = stage(c);
      g += '<rect class="hit" x="0" y="' + y + '" width="' + W + '" height="' + rowH + '" tabindex="0" data-open="' + c.id + '" data-tip="' + h(JSON.stringify({ t: c.id + ' · ' + c.part, r: c.steps.map(function (st, k) { return [DB.flow[k].name, st.start ? (U.diff(st.start, st.end || TODAY) + ' d' + (st.end ? '' : ' so far') + ' / std ' + DB.flow[k].std) : 'not started', 'var(--s' + (k + 1) + ')']; }) })) + '"/>';
      g += '<text class="lbl" x="' + (m.l - 8) + '" y="' + (y + rowH / 2 + 3.5) + '" text-anchor="end">' + c.id + ' ' + h(c.urg.charAt(0)) + '</text>';
      c.steps.forEach(function (st, k) {
        if (!st.start) return;
        var x0 = x(st.start), x1 = x(st.end || TODAY), wdt = Math.max(2, x1 - x0 - 2);
        g += '<rect class="mk" x="' + x0 + '" y="' + (y + 6) + '" width="' + wdt + '" height="12" rx="2" style="fill:var(--s' + (k + 1) + ')' + (st.end ? ';opacity:.55' : '') + '"/>';
        if (!st.end && k === s && late(c)) g += '<text class="lbl" x="' + (x1 + 5) + '" y="' + (y + rowH / 2 + 3.5) + '">+' + (waiting(c) - DB.flow[k].std) + ' d over</text>';
      });
    });
    g += '<line class="tg" x1="' + x(TODAY) + '" x2="' + x(TODAY) + '" y1="' + (m.t - 4) + '" y2="' + (H - m.b) + '"/>';
    return card('Open cases on a calendar', 'One bar per department. Finished steps are faded, the active step is solid, the dashed line is today. First letter after the ID is the urgency.',
      '<svg class="ch" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Timeline of open cases">' + g + '</svg>' + Charts.legend(DB.flow.map(function (f, k) { return { n: f.name, c: 'var(--s' + (k + 1) + ')' }; })) +
      Charts.table(['Case', 'Urgency', 'With', 'Waiting (days)', 'Opened'], rows.map(function (c) { return [c.id, c.urg, DB.flow[stage(c)].name, waiting(c), U.long(c.opened)]; })));
  }

  function meetings() { var out = []; for (var d = U.add(LAST_MEETING, 7), i = 0; i < 8; i++, d = U.add(d, -7)) out.push(d); return out; }
  function recap(date) {
    var open = DB.cases.filter(function (c) { return stage(c) >= 0 && c.opened <= date; }).sort(function (a, b) { return URG.indexOf(a.urg) - URG.indexOf(b.urg) || waiting(b) - waiting(a); });
    var closedWeek = DB.cases.filter(function (c) { var e = closedOn(c); return e && e <= date && e > U.add(date, -7); });
    var lateL = open.filter(late), L = [];
    L.push('Subject: Engineering change meeting recap — ' + U.long(date), '', 'Team,', '', 'Recap of the weekly engineering change meeting on ' + U.long(date) + '.', '',
      'Open cases: ' + open.length + '  |  over standard time: ' + lateL.length + '  |  closed since last meeting: ' + closedWeek.length, '', 'NEEDS ACTION FIRST');
    open.filter(function (c) { return late(c) || c.urg === 'Critical'; }).slice(0, 8).forEach(function (c, i) {
      var s = stage(c), n = lastNote(c);
      L.push((i + 1) + '. ' + c.id + ' [' + c.urg + '] ' + c.part + ' — ' + c.what, '   With ' + DB.flow[s].name + ' for ' + waiting(c) + ' days (standard ' + DB.flow[s].std + '). Drawing ' + c.oldDwg + ' -> ' + c.newDwg + '.' + (n ? ' Last note: "' + n.t + '"' : ''));
    });
    L.push('', 'WHO HOLDS THE BALL', DB.flow.map(function (f, i) { return f.name + ' ' + open.filter(function (c) { return stage(c) === i; }).length; }).join('  |  '));
    if (closedWeek.length) L.push('', 'CLOSED THIS WEEK', closedWeek.map(function (c) { return c.id + ' ' + c.part; }).join('; '));
    L.push('', 'Please update your status on the board before the next meeting (' + U.long(U.add(date, 7)) + ').', '', 'Regards,', 'Production Engineering');
    return L.join('\n');
  }
  function vMeeting() {
    var date = S.meet, open = DB.cases.filter(function (c) { return stage(c) >= 0 && c.opened <= date; }).sort(function (a, b) { return URG.indexOf(a.urg) - URG.indexOf(b.urg) || waiting(b) - waiting(a); });
    var done = open.filter(function (c) { return c.seen[date]; }).length;
    var agenda = open.map(function (c) {
      var s = stage(c), n = lastNote(c);
      return '<div class="ag"><input type="checkbox" id="seen_' + c.id + '" data-seen="' + c.id + '"' + (c.seen[date] ? ' checked' : '') + ' aria-label="Discussed ' + c.id + '"><div><h4><label for="seen_' + c.id + '">' + c.id + ' · ' + h(c.part) + '</label></h4><div class="meta">' + urgHtml(c.urg) + flowDots(c) + '<span>with <b>' + h(DB.flow[s].name) + '</b> for ' + waiting(c) + ' d (std ' + DB.flow[s].std + ')</span>' + (late(c) ? '<span class="pill bad">over standard</span>' : '') + '</div>' +
        '<div class="last">' + h(c.what) + (n ? ' — <i>“' + h(n.t) + '”</i> (' + h(n.by) + ', ' + U.short(n.d) + ')' : '') + '</div>' +
        '<div class="add"><input type="text" id="note_' + c.id + '" placeholder="Decision or next action…" aria-label="Note for ' + c.id + '"><button class="btn sm" type="button" data-addnote="' + c.id + '">Add note</button><button class="btn sm" type="button" data-open="' + c.id + '">Details</button></div></div></div>';
    }).join('');
    return '<div class="grid g-2-1"><div class="grid" style="align-content:start">' +
      card('Agenda — ' + U.long(date), done + ' of ' + open.length + ' discussed. Tick a case when it is covered; notes go into the case history and the recap.', '<div class="agenda">' + (agenda || '<div class="note">No open case on this date.</div>') + '</div>') +
      '</div><div class="grid" style="align-content:start">' +
      card('Recap, ready to send', 'Written from the board. Copy it into your mail client; nothing is sent from this page.', '<pre class="mail" id="mail" tabindex="0">' + h(recap(date)) + '</pre><div class="tools" style="margin-top:10px"><button class="btn pri" type="button" id="copyMail">Copy recap</button></div>') +
      '</div></div>';
  }

  function vAnalytics() {
    var closed = DB.cases.filter(function (c) { return stage(c) < 0; }), open = DB.cases.filter(function (c) { return stage(c) >= 0; });
    var perDept = DB.flow.map(function (f, i) { var ds = []; DB.cases.forEach(function (c) { var st = c.steps[i]; if (st.start && st.end) ds.push(U.diff(st.start, st.end)); }); return { label: f.name, before: f.std, after: +U.avg(ds).toFixed(1) }; });
    var weeks = []; for (var d = U.add(LAST_MEETING, -84); d <= LAST_MEETING; d = U.add(d, 7)) weeks.push(d);
    var op = weeks.map(function (w) { return DB.cases.filter(function (c) { return c.opened > U.add(w, -7) && c.opened <= w; }).length; }), cl = weeks.map(function (w) { return closed.filter(function (c) { var e = closedOn(c); return e > U.add(w, -7) && e <= w; }).length; });
    var src = {}; DB.cases.forEach(function (c) { src[c.source] = (src[c.source] || 0) + 1; });
    var srcRows = Object.keys(src).map(function (k) { return { label: k, value: src[k] }; }).sort(function (a, b) { return b.value - a.value; });
    var buckets = [['0–7 d', 0, 7], ['8–14 d', 8, 14], ['15–30 d', 15, 30], ['31+ d', 31, 999]], age = buckets.map(function (b) { return open.filter(function (c) { var a = U.diff(c.opened, TODAY); return a >= b[1] && a <= b[2]; }).length; });
    return '<div class="grid g2">' +
      card('Time per department: standard vs actual', 'Average days a case stays with each department, against the agreed standard.', Charts.dumbbell({ W: WH, rows: perDept, unit: ' d', labelW: 132, beforeName: 'Standard', afterName: 'Actual average', fmt: function (v) { return F(v, 1) + ' d'; } })) +
      card('Opened and closed per week', 'When the opened line stays above the closed line, the backlog is growing.', Charts.lines({ W: WH, labels: weeks.map(U.short), series: [{ name: 'Opened', values: op }, { name: 'Closed', values: cl }], xName: 'Week ending', h: 200 })) +
      card('Why changes are raised', 'All cases in the last 13 weeks by source.', Charts.hbars({ W: WH, rows: srcRows, name: 'Cases', xName: 'Source', labelW: 132, fmt: function (v) { return F(v, 0); } })) +
      card('Age of open cases', 'Days since the case was opened.', Charts.columns({ W: WH, labels: buckets.map(function (b) { return b[0]; }), values: age, name: 'Open cases', xName: 'Age', h: 190, fmt: function (v) { return F(v, 0); } })) +
      '</div>';
  }

  function vSettings() {
    return card('Standard time per department', 'Calendar days a case may stay with each department before it counts as over standard. Lateness, the Gantt and the recap all follow these.', '<div class="grid g5">' + DB.flow.map(function (f, i) { return '<label class="f">' + h(f.name) + '<input type="number" min="1" max="60" step="1" id="std_' + i + '" value="' + f.std + '"></label>'; }).join('') + '</div>') +
      '<div class="tools"><button class="btn pri" type="button" id="stdSave">Save standards</button><button class="btn" type="button" id="csv">Download cases (CSV)</button><button class="btn" type="button" id="reset">Reset demo data</button></div>' +
      '<div class="note"><b>In a real rollout</b> this board reads your existing meeting sheet (Excel or Google Sheets), keeps previews of each drawing change, and prepares the recap and per-department reminders as mail drafts. People stay in control of what is sent.</div>';
  }

  function drawer(id) {
    var c = DB.cases.filter(function (x) { return x.id === id; })[0]; if (!c) return '';
    var s = stage(c);
    var steps = c.steps.map(function (st, i) {
      var f = DB.flow[i], d = st.start ? U.diff(st.start, st.end || TODAY) : 0, mx = Math.max(f.std * 2, d, 1);
      return '<div class="stp"><span>' + h(f.name) + '</span><span class="bar"><i class="' + (d > f.std ? 'lt' : '') + '" style="width:' + Math.min(100, d / mx * 100) + '%"></i><b style="left:' + (f.std / mx * 100) + '%"></b></span><span class="mono">' + (st.start ? d + ' / ' + f.std + ' d' + (st.end ? '' : ' · active') : 'not started') + '</span></div>';
    }).join('');
    return '<div class="scrim" data-close></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="Case ' + c.id + '">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><div class="mono" style="font-size:11px;color:var(--fg-2)">' + c.id + ' · ' + h(c.model) + '</div><h2>' + h(c.part) + '</h2></div><button class="btn sm" type="button" data-close aria-label="Close">Close</button></div>' +
      '<p>' + h(c.what.charAt(0).toUpperCase() + c.what.slice(1)) + '.</p>' +
      '<dl class="kv"><dt>Urgency</dt><dd><select id="dUrg" aria-label="Urgency">' + URG.map(function (u) { return '<option' + (u === c.urg ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select></dd><dt>Type</dt><dd>' + h(c.type) + ' · ' + h(c.source) + '</dd><dt>Drawing</dt><dd class="mono">' + h(c.oldDwg) + ' → ' + h(c.newDwg) + '</dd><dt>Supply</dt><dd>' + h(c.buy) + '</dd><dt>Opened</dt><dd>' + U.long(c.opened) + '</dd><dt>Effective</dt><dd>' + U.long(c.effective) + '</dd><dt>Status</dt><dd>' + (s < 0 ? 'Closed ' + U.long(closedOn(c)) + ' · lead time ' + lead(c) + ' d' : 'With ' + h(DB.flow[s].name) + (late(c) ? ' — over standard' : '')) + '</dd></dl>' +
      '<div><h4 style="margin-bottom:8px">Time at each department</h4><div class="steps">' + steps + '</div><p class="hint" style="font-size:11.5px;color:var(--fg-2);margin-top:6px">The tick marks the standard time.</p></div>' +
      (s >= 0 ? '<div class="tools"><button class="btn pri" type="button" data-advance="' + c.id + '">' + (s === c.steps.length - 1 ? 'Close case' : 'Hand over to ' + h(DB.flow[s + 1].name)) + '</button></div>' : '') +
      '<div><h4 style="margin-bottom:8px">History</h4><div class="notes">' + (c.notes.slice().reverse().map(function (n) { return '<div><small>' + U.short(n.d) + ' · ' + h(n.by) + '</small>' + h(n.t) + '</div>'; }).join('') || '<div>No notes yet.</div>') + '</div>' +
      '<div class="ag" style="grid-template-columns:minmax(0,1fr);margin-top:10px"><div class="add" style="margin:0"><input type="text" id="note_' + c.id + '" placeholder="Add a note…" aria-label="Add a note"><button class="btn sm" type="button" data-addnote="' + c.id + '">Add note</button></div></div></div></aside>';
  }

  /* ---------------- shell ---------------- */
  var R = { board: vBoard, timeline: vTimeline, meeting: vMeeting, analytics: vAnalytics, settings: vSettings };
  function measure() { var v = document.getElementById('view'), vw = Math.max(280, v.clientWidth - 44); WF = U.clamp(vw - 34, 280, 1120); WH = vw > 860 ? (vw - 14) / 2 - 34 : WF; }
  function draw(keepFocus) {
    document.getElementById('nav').innerHTML = VIEWS.map(function (v, i) { return '<button type="button" data-view="' + v[0] + '"' + (S.view === v[0] ? ' aria-current="page"' : '') + '><i>0' + (i + 1) + '</i>' + v[1] + '</button>'; }).join('');
    document.getElementById('title').textContent = VIEWS.filter(function (v) { return v[0] === S.view; })[0][1];
    document.getElementById('sub').textContent = DB.cases.length + ' cases · last meeting ' + U.long(LAST_MEETING) + ' · next ' + U.long(U.add(LAST_MEETING, 7));
    var fl = '';
    if (S.view === 'board' || S.view === 'timeline') fl = '<label class="f">Search<input type="search" id="fQ" value="' + h(S.q) + '" placeholder="Case, part, drawing"></label>' +
      '<label class="f">Urgency<select id="fUrg"><option value="all">All</option>' + URG.map(function (u) { return '<option' + (S.urg === u ? ' selected' : '') + '>' + u + '</option>'; }).join('') + '</select></label>' +
      '<label class="f">Waiting on<select id="fDept"><option value="all">Everyone</option>' + DB.flow.map(function (f) { return '<option value="' + f.k + '"' + (S.dept === f.k ? ' selected' : '') + '>' + h(f.name) + '</option>'; }).join('') + '</select></label>' +
      (S.view === 'board' ? '<label class="f">Closed<div class="seg"><button type="button" data-closed="0" aria-pressed="' + !S.closed + '">Hide</button><button type="button" data-closed="1" aria-pressed="' + S.closed + '">Show</button></div></label>' : '');
    if (S.view === 'meeting') fl = '<label class="f">Meeting date<select id="fMeet">' + meetings().map(function (d) { return '<option value="' + d + '"' + (S.meet === d ? ' selected' : '') + '>' + U.long(d) + (d > TODAY ? ' (next)' : '') + '</option>'; }).join('') + '</select></label>';
    if (!keepFocus) document.getElementById('filters').innerHTML = fl;
    measure();
    document.getElementById('view').innerHTML = R[S.view]();
    document.getElementById('layer').innerHTML = S.open ? drawer(S.open) : '';
  }
  function byId(id) { return DB.cases.filter(function (x) { return x.id === id; })[0]; }
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var b = t.closest('[data-view]'); if (b) { S.view = b.getAttribute('data-view'); S.open = null; draw(); window.scrollTo(0, 0); return; }
    if (t.closest('[data-close]')) { S.open = null; return draw(true); }
    b = t.closest('[data-closed]'); if (b) { S.closed = b.getAttribute('data-closed') === '1'; return draw(); }
    b = t.closest('[data-addnote]'); if (b) { var id = b.getAttribute('data-addnote'), inp = document.getElementById('note_' + id), txt = inp && inp.value.trim(); if (!txt) return U.toast('Type a note first'); byId(id).notes.push({ d: TODAY, by: 'You', t: txt }); save(); U.toast('Note added to ' + id); return draw(true); }
    b = t.closest('[data-advance]'); if (b) { var c = byId(b.getAttribute('data-advance')), s = stage(c); c.steps[s].end = TODAY; if (c.steps[s + 1]) c.steps[s + 1].start = TODAY; c.notes.push({ d: TODAY, by: 'You', t: s === c.steps.length - 1 ? 'Case closed.' : DB.flow[s].name + ' done. Handed over to ' + DB.flow[s + 1].name + '.' }); save(); U.toast(s === c.steps.length - 1 ? c.id + ' closed' : c.id + ' handed over'); return draw(true); }
    b = t.closest('[data-open]'); if (b && !t.closest('input,button:not([data-open])')) { S.open = b.getAttribute('data-open'); return draw(true); }
    if (t.id === 'copyMail') return U.copy(document.getElementById('mail').textContent);
    if (t.id === 'stdSave') { DB.flow.forEach(function (f, i) { var v = +document.getElementById('std_' + i).value; if (v >= 1) f.std = Math.round(v); }); save(); U.toast('Standards saved'); return draw(); }
    if (t.id === 'reset') { U.del('cb_db_v3'); DB = generate(); U.toast('Demo data reset'); return draw(); }
    if (t.id === 'csv') { U.download('change-board-synthetic-cases.csv', U.csv([['case', 'part', 'change', 'type', 'source', 'model', 'urgency', 'old_drawing', 'new_drawing', 'opened', 'effective', 'with', 'waiting_days', 'status']].concat(DB.cases.map(function (c) { var s = stage(c); return [c.id, c.part, c.what, c.type, c.source, c.model, c.urg, c.oldDwg, c.newDwg, c.opened, c.effective, s < 0 ? '' : DB.flow[s].name, s < 0 ? '' : waiting(c), s < 0 ? 'Closed' : late(c) ? 'Over standard' : 'In progress']; })))); }
  });
  document.addEventListener('change', function (e) {
    var t = e.target;
    if (t.id === 'fUrg') { S.urg = t.value; draw(); } if (t.id === 'fDept') { S.dept = t.value; draw(); } if (t.id === 'fMeet') { S.meet = t.value; draw(); }
    if (t.id === 'dUrg' && S.open) { byId(S.open).urg = t.value; save(); draw(true); }
    if (t.getAttribute && t.getAttribute('data-seen')) { var c = byId(t.getAttribute('data-seen')); if (t.checked) c.seen[S.meet] = 1; else delete c.seen[S.meet]; save(); draw(true); }
  });
  var qt; document.addEventListener('input', function (e) { if (e.target.id === 'fQ') { S.q = e.target.value; clearTimeout(qt); qt = setTimeout(function () { draw(true); }, 140); } });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && S.open) { S.open = null; draw(true); }
    if (e.key === 'Enter' && e.target.matches && e.target.matches('tr[data-open]')) { S.open = e.target.getAttribute('data-open'); draw(true); }
    if (e.key === 'Enter' && e.target.id && e.target.id.indexOf('note_') === 0) { var b = document.querySelector('[data-addnote="' + e.target.id.slice(5) + '"]'); if (b) b.click(); }
  });
  var rz; window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(function () { draw(true); }, 160); });
  document.getElementById('logo').innerHTML = LaboSprite.svg('idle', 34);
  U.skin('cb_skin', 'paper');
  draw();
})();
