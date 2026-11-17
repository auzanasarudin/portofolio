/* Renders the page from assets/js/data.js. Handles language (ID/EN), sheet (Ringkas/Mendalam),
   the hero reel, the gallery + lightbox, and scroll reveals. */
(function () {
  'use strict';
  var D = window.SITE, V = D.v2, root = document.documentElement;
  var $ = function (s) { return document.querySelector(s); };
  var lang = 'id', mode = 'overview';
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage blocked */ } } };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var tx = function (o) { return o == null ? '' : typeof o === 'string' ? o : (o[lang] != null ? o[lang] : o.id); };
  var T = function (path) { var o = D.t; path.split('.').forEach(function (k) { o = o && o[k]; }); return tx(o); };
  var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };
  var rp = function (n) { return 'Rp' + Number(n).toLocaleString('id-ID'); };
  var EXT = ' target="_blank" rel="noopener"', AR = ' <span aria-hidden="true">→</span>';
  var caseById = function (id) { return D.cases.filter(function (c) { return c.id === id; })[0]; };
  var price = function (k) { return D.prices[k] ? rp(D.prices[k][0]) : ''; };
  var buy = function (k) { return D.prices[k] ? D.prices[k][1] : D.links.laboru; };
  var BRIEF = { review: 1, umkm: 8, dashboard: 0, automation: 1, iso: 9, change: 2, bom: 2, costing: 4, robot: 3, retainer: 7 };
  var org = function (k) { return D.org[k] || { name: k }; };
  var orgLink = function (k, cls) { var o = org(k); return o.url ? '<a class="' + (cls || 'olink') + '" href="' + o.url + '"' + EXT + '>' + esc(o.name) + ' <span aria-hidden="true">↗</span></a>' : '<span class="' + (cls || 'olink') + '">' + esc(o.name) + '</span>'; };
  var gFilter = 'all', gAll = false, lbList = [], lbIdx = 0;
  var gLimit = function () { return mode === 'deep' ? 99 : 6; };

  /* ---------------- overview (showreel) ---------------- */
  function rChrome() {
    root.lang = lang;
    document.querySelectorAll('[data-t]').forEach(function (el) { var v = T(el.getAttribute('data-t')); if (v) el.textContent = v; });
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    document.title = lang === 'id' ? 'Auzan Asarudin — Production Engineer · Data & Otomasi Manufaktur' : 'Auzan Asarudin — Production Engineer · Manufacturing Data & Automation';
    var nav = mode === 'deep'
      ? [['karya', T('nav.karya')], ['studi', lang === 'id' ? 'Studi kasus' : 'Cases'], ['riwayat', lang === 'id' ? 'Riwayat' : 'History'], ['produk', T('nav.produk')], ['jasa', T('nav.jasa')], ['kontak', T('nav.kontak')]]
      : [['karya', T('nav.karya')], ['tentang', T('nav.tentang')], ['pengakuan', lang === 'id' ? 'Pencapaian' : 'Achievements'], ['perjalanan', lang === 'id' ? 'Perjalanan' : 'Journey'], ['kontak', T('nav.kontak')]];
    $('#nav').innerHTML = nav.map(function (n) { return '<a href="#' + n[0] + '">' + esc(n[1]) + '</a>'; }).join('');
    document.querySelectorAll('#modeSeg [data-mode-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-mode-btn') === mode)); });
    $('#modeSeg').setAttribute('aria-label', T('mode.label'));
  }
  function rHero() {
    set('hRole', tx(V.role)); set('hHello', tx(V.hello)); set('hLine', tx(V.line)); set('bigword', V.bigword);
    $('#hSee').innerHTML = esc(tx(V.see)) + ' <span aria-hidden="true">↓</span>';
    $('#hStats').innerHTML = V.stats.map(function (s) { return '<li><b>' + (s[1] ? '<small>' + esc(tx(s[0])) + '</small>' + esc(s[1]) : esc(s[0])) + '</b><span>' + esc(tx(s[2])) + '</span></li>'; }).join('');
    $('#hFeat').innerHTML = V.heroFeat.map(function (f) { return '<li>' + (window.PixelIcon ? PixelIcon(f[0], 36) : '') + '<b>' + esc(tx(f[1])) + '</b><span>' + esc(tx(f[2])) + '</span></li>'; }).join('');
    if (window.LaboScene && !$('#scene svg')) LaboScene($('#scene'));
    set('placesLbl', tx(V.places));
    var p = V.placeList.map(function (k) { var o = org(k); return o.url ? '<a href="' + o.url + '"' + EXT + '>' + esc(o.name) + '</a>' : '<span>' + esc(o.name) + '</span>'; }).join('');
    $('#places').innerHTML = p + p.replace(/<(a|span)( |>)/g, '<$1 aria-hidden="true" tabindex="-1"$2');
  }
  var reelT, reelI = 0;
  function rReel() {
    var reel = $('#reel'), dots = $('#reelDots');
    reel.innerHTML = D.hero.map(function (f, i) { var g = D.gallery.filter(function (x) { return x.f === f; })[0]; return '<img src="assets/img/g/' + f + '.webp" alt="' + esc(tx(g.cap)) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + ' width="1440" height="900"' + (i === reelI ? ' class="on"' : '') + '>'; }).join('');
    dots.innerHTML = D.hero.map(function (f, i) { return '<button type="button" data-reel="' + i + '" aria-label="' + (i + 1) + '"' + (i === reelI ? ' aria-current="true"' : '') + '></button>'; }).join('');
    showReel(reelI);
  }
  function showReel(i) {
    reelI = (i + D.hero.length) % D.hero.length;
    document.querySelectorAll('#reel img').forEach(function (im, k) { im.classList.toggle('on', k === reelI); });
    document.querySelectorAll('#reelDots button').forEach(function (b, k) { if (k === reelI) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    var f = D.hero[reelI], g = D.gallery.filter(function (x) { return x.f === f; })[0];
    set('hUrl', g.c ? 'auzanasarudin.github.io/portofolio/demos/' + g.c : 'auzanasarudin.github.io/laboru');
    clearTimeout(reelT);
    if (!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) reelT = setTimeout(function () { showReel(reelI + 1); }, 4200);
  }
  function rGallery() {
    set('s1n', V.s1.n); set('s1a', tx(V.s1.a)); set('s1b', tx(V.s1.b)); set('s1lead', tx(V.s1.lead));
    $('#filters').innerHTML = V.filters.map(function (f) { return '<button type="button" data-filter="' + f[0] + '" aria-pressed="' + (gFilter === f[0]) + '">' + esc(tx(f[1])) + '</button>'; }).join('');
    $('#gal').innerHTML = D.gallery.map(function (g, i) {
      var tag = g.t === 'laboru' ? 'LABORU' : g.t === 'sistem' ? 'Demo' : (g.c ? tx(caseById(g.c).name) : '');
      return '<button type="button" class="tile' + (g.s[1] > g.s[0] ? ' tall' : '') + '" data-g="' + i + '"' + (tileHidden(g, i) ? ' hidden' : '') + '>' +
        (g.s[1] > g.s[0] ? '<img class="bg" src="assets/img/g/' + g.f + '-s.webp" loading="lazy" decoding="async" alt="">' : '') +
        '<img src="assets/img/g/' + g.f + '-s.webp" width="' + g.s[0] + '" height="' + g.s[1] + '" loading="lazy" decoding="async" alt="">' +
        '<span class="cap"><small>' + esc(tag) + '</small><b>' + esc(tx(g.cap)) + '</b></span></button>';
    }).join('') + '';
    syncMore();
  }
  function tileHidden(g, i) { return gFilter !== 'all' ? g.t !== gFilter : (!gAll && i >= gLimit()); }
  function syncMore() {
    var b = $('#galMore'), n = D.gallery.length;
    if (!b) return;
    b.hidden = gFilter !== 'all' || gAll || n <= gLimit();
    b.textContent = (lang === 'id' ? 'Lihat semua ' + n + ' cuplikan' : 'See all ' + n + ' previews') + ' ↓';
  }
  function rRecognition() {
    set('s2n', V.s2.n); set('s2a', tx(V.s2.a)); set('s2b', tx(V.s2.b)); set('s2sub', tx(V.s2.bigSub));
    $('#awards').innerHTML = V.awards.map(function (a) { return '<li><b>' + esc(tx(a[1])) + '</b><span>' + esc(tx(a[2])) + (a[3] ? ' · <a href="' + a[3] + '"' + EXT + '>' + (lang === 'id' ? 'sumber' : 'source') + ' ↗</a>' : '') + '</span><i>' + esc(tx(a[0])) + '</i></li>'; }).join('');
  }
  function rBehind() {
    var s = V.s3; set('s3n', s.n); set('s3a', tx(s.a)); set('s3b', tx(s.b)); set('s3text', tx(s.text)); set('s3quote', tx(s.quote));
    $('#pillars').innerHTML = s.pillars.map(function (p, i) { return '<article class="pillar"><span>' + ('0' + (i + 1)).slice(-2) + '</span><h3>' + esc(tx(p[0])) + '</h3><p>' + esc(tx(p[1])) + '</p></article>'; }).join('');
    set('stdLbl', tx(s.stdLbl)); set('s3who', tx(s.who));
    $('#std').innerHTML = s.std.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');
  }
  function rJourney() {
    var s = V.s4; set('s4n', s.n); set('s4a', tx(s.a)); set('s4b', tx(s.b)); set('w1', tx(s.w1)); set('w2', tx(s.w2));
    $('#tl').innerHTML = V.outline.map(function (t) { return '<li' + (t[3] ? ' class="now"' : '') + '><span class="y">' + esc(t[0]) + '</span><div><b>' + esc(tx(t[1])) + '</b><span>' + esc(tx(t[2])) + '</span></div></li>'; }).join('');
    $('#wins').innerHTML = V.wins.map(function (w) { return '<li>' + esc(tx(w)) + '</li>'; }).join('');
  }
  function rLaboru() {
    var s = V.s5; set('s5n', s.n); set('s5a', tx(s.a)); set('s5b', tx(s.b)); set('s5text', tx(s.text));
    var a = $('#s5cta'); a.href = D.links.laboru; a.innerHTML = esc(tx(s.cta)) + ' <span aria-hidden="true">↗</span>';
    $('#laboBig').innerHTML = window.LaboSprite ? LaboSprite.svg('happy', 120) : '';
    $('#phones').innerHTML = ['lb-ratrace', 'lb-title', 'lb-pet'].map(function (f) { var i = D.gallery.map(function (g) { return g.f; }).indexOf(f); return '<button type="button" class="phone" data-g="' + i + '" aria-label="' + esc(tx(D.gallery[i].cap)) + '"><img src="assets/img/g/' + f + '-s.webp" loading="lazy" decoding="async" alt=""></button>'; }).join('');
  }
  function rContact() {
    var s = V.s6, p = D.person; set('s6a', tx(s.a)); set('s6b', tx(s.b)); set('s6text', tx(s.text)); set('s6side', tx(s.side)); set('s6deep', tx(s.deep)); set('deepIntro', tx(V.deepIntro)); set('cBase', tx(p.base));
    var row = function (lbl, val, href, extra) { return '<li><span class="c-lbl">' + esc(lbl) + '</span>' + (href ? '<a class="c-val" href="' + href + '"' + (/^https?:/.test(href) ? EXT : '') + '>' + esc(val) + ' <span aria-hidden="true">↗</span></a>' : '<span class="c-val">' + esc(val) + '</span>') + (extra || '') + '</li>'; };
    $('#chan').innerHTML = row('Email', p.email, 'mailto:' + p.email, '<button type="button" class="btn sm" id="copyMail">' + esc(T('btn.copy')) + '</button>') +
      row('LinkedIn', 'Auzan Asarudin', p.linkedin) + row('Instagram', '@laboru_id', D.links.laboruInstagram) +
      (p.whatsapp ? row('WhatsApp', '+' + p.whatsapp.replace(/\D/g, ''), 'https://wa.me/' + p.whatsapp.replace(/\D/g, '')) : '');
    if (window.LaboSprite) { $('#cLabo').innerHTML = LaboSprite.svg('happy', 64); $('#nbLabo').innerHTML = LaboSprite.svg('wow', 110); }
    var n = V.nudge; set('nbA', tx(n.a)); set('nbText', tx(n.text)); set('nbBubble', tx(n.bubble)); $('#nbCta').innerHTML = esc(tx(n.cta)) + AR;
    var sel = $('#f-topic'), cur = sel.selectedIndex;
    sel.innerHTML = D.t.form.topics.map(function (t, i) { return '<option value="' + i + '">' + esc(tx(t)) + '</option>'; }).join('');
    if (cur >= 0) sel.selectedIndex = cur;
    $('#f-msg').placeholder = T('form.ph');
    $('#footLinks').innerHTML = '<a href="' + p.linkedin + '"' + EXT + '>LinkedIn</a><a href="' + D.links.laboru + '"' + EXT + '>LABORU</a><a href="' + D.links.zonion + '"' + EXT + '>Z-ONION</a>' +
      D.cases.map(function (c) { return '<a href="' + c.demo + '">' + esc(tx(c.name)) + '</a>'; }).join('') + '<a href="#top">' + esc(T('foot.top')) + '</a>';
  }

  /* ---------------- deep (reading + offers) ---------------- */
  function rDeep() {
    var stLbl = { built: T('lbl.built'), progress: T('lbl.progress'), research: T('lbl.research'), planned: T('lbl.planned') };
    $('#caps').innerHTML = '<thead><tr><th>' + esc(T('lbl.no')) + '</th><th>' + esc(T('lbl.cap')) + '</th><th>' + esc(T('lbl.evidence')) + '</th><th>' + esc(T('lbl.level')) + '</th></tr></thead><tbody>' +
      D.caps.map(function (c, i) { return '<tr><td class="n">' + ('0' + (i + 1)).slice(-2) + '</td><td><b>' + esc(tx(c[0])) + '</b></td><td>' + esc(tx(c[1])) + '</td><td><span class="lv ' + c[2] + '">' + esc(tx(D.levels[c[2]])) + '</span></td></tr>'; }).join('') + '</tbody>';
    $('#path').innerHTML = D.path.map(function (p) { return '<li><b>' + esc(tx(p.h)) + '</b><span>' + p.items.map(function (i) { return esc(tx(i)); }).join('<br>') + '</span></li>'; }).join('');
    $('#probs').innerHTML = D.problems.map(function (p) { var c = caseById(p.to); return '<article class="prob"><q>' + esc(tx(p.q)) + '</q><p>' + esc(tx(p.a)) + '</p><a class="tlink" href="#case-' + c.id + '">' + esc(tx(c.name)) + AR + '</a></article>'; }).join('');
    $('#cases').innerHTML = D.cases.map(function (c, i) {
      var box = function (h, body, wide) { return '<div class="box' + (wide ? ' wide' : '') + '"><h4>' + esc(h) + '</h4>' + body + '</div>'; };
      return '<article class="case" id="case-' + c.id + '"><figure class="fig"><a href="' + c.demo + '"><img src="' + c.img + '.webp" srcset="' + c.img + '-800.webp 800w, ' + c.img + '.webp 1600w" sizes="(max-width:1050px) 94vw, 700px" width="1600" height="1040" loading="lazy" decoding="async" alt="' + esc(c.name + ' — ' + tx(c.title)) + '"></a><figcaption>Fig. ' + (i + 1) + ' · ' + esc(tx(c.name)) + ' · ' + esc(T('lbl.demoNote')) + '</figcaption></figure>' +
        '<div><p class="eyebrow">' + esc(tx(c.kicker)) + '</p><h3>' + esc(tx(c.name)) + '</h3><p class="ttl">' + esc(tx(c.title)) + '</p><p class="sum">' + esc(tx(c.summary)) + '</p><ul class="ticks">' + c.bullets.map(function (b) { return '<li>' + esc(tx(b)) + '</li>'; }).join('') + '</ul><div class="acts"><a class="btn pri" href="' + c.demo + '">' + esc(T('btn.demo')) + AR + '</a></div></div>' +
        '<div class="detail">' + box(T('lbl.context'), '<p>' + esc(tx(c.context)) + '</p>') + box(T('lbl.problem'), '<p>' + esc(tx(c.problem)) + '</p>') +
        box(T('lbl.approach'), '<ol>' + c.approach.map(function (a) { return '<li>' + esc(tx(a)) + '</li>'; }).join('') + '</ol>') +
        box(T('lbl.status'), '<ul class="sts">' + c.status.map(function (s) { return '<li><span>' + esc(tx(s[0])) + '</span><span class="tagst ' + s[1] + '">' + esc(stLbl[s[1]]) + '</span></li>'; }).join('') + '</ul>') +
        box(T('lbl.arch'), '<div class="pipe">' + c.arch.map(function (a) { return '<span>' + esc(tx(a)) + '</span>'; }).join('') + '</div>', true) +
        box(T('lbl.stack'), '<div class="chips">' + c.stack.map(function (s) { return '<span class="chip">' + esc(s) + '</span>'; }).join('') + '</div>') + box(T('lbl.data'), '<p>' + esc(tx(c.limits)) + '</p>') + '</div></article>';
    }).join('');
    $('#more').innerHTML = D.more.map(function (m) {
      var act = m.wip ? '<span class="pill">' + esc(T('lbl.wip')) + '</span>' : m.link ? '<a class="tlink" href="' + D.links[m.link] + '"' + EXT + '>' + esc(T('btn.' + m.cta)) + AR + '</a>' : '<a class="tlink" href="' + m.href + '">' + esc(T('btn.' + m.cta)) + AR + '</a>';
      return '<article class="box"><span class="chip" style="align-self:flex-start">' + esc(m.tag) + '</span><b>' + esc(tx(m.name)) + '</b><p>' + esc(tx(m.text)) + '</p><div class="acts">' + act + '</div></article>';
    }).join('');
    $('#method').innerHTML = D.method.map(function (m) { return '<li><b>' + esc(tx(m.h)) + '</b><span>' + esc(tx(m.text)) + '</span></li>'; }).join('');
    var r = D.research;
    $('#research').innerHTML = '<div class="about"><div class="story"><p><b>' + esc(tx(r.title)) + '.</b> ' + esc(tx(r.text)) + '</p><p><span class="tagst progress">' + esc(T('lbl.progress')) + '</span></p></div><div class="tw"><table class="t"><tbody>' + r.points.map(function (p) { return '<tr><td class="n">' + esc(tx(p[0])) + '</td><td>' + esc(tx(p[1])) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    $('#story').innerHTML = D.story.map(function (p) { return '<p>' + esc(tx(p)) + '</p>'; }).join('');
    $('#beliefs').innerHTML = D.beliefs.map(function (b) { return '<li>' + esc(tx(b)) + '</li>'; }).join('');
    var who = function (k, fallback) { return k === 'hcmi' && !D.person.employerPublic ? '<span class="olink">' + esc(tx(fallback)) + '</span>' : orgLink(k); };
    $('#timeline').innerHTML = D.timeline.map(function (t) { return '<li' + (t.now ? ' class="now"' : '') + '><span class="y">' + esc(t.y) + '</span><div><b>' + esc(tx(t.what)) + '</b><p class="at">' + who(t.o, t.where) + ' <small>' + esc(tx(t.where)) + '</small></p><p>' + esc(tx(t.text)) + '</p></div></li>'; }).join('');
    $('#edu').innerHTML = D.education.map(function (e) { return '<article class="box"><p class="eyebrow">' + esc(e.y) + '</p><h4 class="eh">' + esc(tx(e.h)) + '</h4><p class="at">' + orgLink(e.o) + '</p><p class="sub">' + esc(tx(e.sub)) + '</p><ul class="ticks">' + e.items.map(function (i) { return '<li>' + esc(tx(i)) + '</li>'; }).join('') + '</ul></article>'; }).join('');
    $('#certs').innerHTML = '<tbody>' + D.certs.map(function (c) { return '<tr><td><b>' + esc(tx(c.h)) + '</b><small>' + esc(tx(c.by)) + '</small></td><td class="r n">' + esc(c.y) + '</td></tr>'; }).join('') + '</tbody>';
    $('#orgs').innerHTML = D.orgs.map(function (o) { var h = esc(tx(o.h)), url = o.url || (o.o && org(o.o).url); return '<article class="box"><b>' + (url ? '<a href="' + url + '"' + EXT + '>' + h + ' ↗</a>' : h) + '</b><p>' + esc(tx(o.text)) + '</p></article>'; }).join('');
    $('#faqList').innerHTML = D.faq.map(function (q) { return '<details class="q"><summary>' + esc(tx(q[0])) + '</summary><p>' + esc(tx(q[1])) + '</p></details>'; }).join('');
    rProducts(); rServices();
  }
  function rProducts() {
    $('#showcase').innerHTML = D.showcase.map(function (p) { return '<article class="feat sc"><a class="shots" href="' + p.demo + '"><img src="' + p.img + '" width="1440" height="900" loading="lazy" alt="' + esc(tx(p.name)) + '"></a><div><p class="eyebrow">LABORU · ' + esc(T('lbl.demoNote')) + '</p><h3>' + esc(tx(p.name)) + '</h3><p>' + esc(tx(p.text)) + '</p><ul class="ticks">' + p.bullets.map(function (b) { return '<li>' + esc(tx(b)) + '</li>'; }).join('') + '</ul><div class="acts"><a class="btn pri" href="' + p.demo + '">' + esc(T('btn.demo')) + AR + '</a><a class="btn ghost" href="' + buy(p.k) + '"' + EXT + '>' + esc(T('btn.buy')) + ' · ' + price(p.k) + '</a></div></div></article>'; }).join('');
    var f = D.featured;
    $('#featured').innerHTML = '<div class="feat"><div class="shots"><img src="' + f.img + '" width="1280" height="720" loading="lazy" alt="' + esc(f.name) + '"><img src="' + f.img2 + '" width="960" height="540" loading="lazy" alt=""></div><div><p class="eyebrow">LABORU</p><h3>' + esc(f.name) + '</h3><p>' + esc(tx(f.text)) + '</p><div class="tiers">' + f.tiers.map(function (t) { return '<div class="tier"><b>' + esc(t.name) + '</b><span>' + esc(tx(t.sub)) + '</span><div class="pr">' + price(t.k) + '</div></div>'; }).join('') + '</div><div class="acts"><a class="btn pri" href="' + D.links.laboru + '"' + EXT + '>' + esc(tx(f.cta)) + AR + '</a></div></div></div>';
    var rows = f.tiers.map(function (t) { return { k: t.k, name: f.name + ' · ' + t.name, who: D.products[3].who, text: t.sub }; }).concat(D.products);
    $('#catalog').innerHTML = '<thead><tr><th>' + esc(T('lbl.product')) + '</th><th>' + esc(T('lbl.forWho')) + '</th><th class="r">' + esc(T('lbl.price')) + '</th><th></th></tr></thead><tbody>' + rows.map(function (p) { return '<tr><td><b>' + esc(p.name) + '</b><small>' + esc(tx(p.text)) + '</small></td><td>' + esc(tx(p.who)) + '</td><td class="r"><b>' + price(p.k) + '</b></td><td class="r"><a class="tlink" href="' + buy(p.k) + '"' + EXT + '>' + esc(T('btn.buy')) + '</a></td></tr>'; }).join('') + '</tbody>';
    $('#pipeline').innerHTML = D.pipeline.map(function (p) { return '<article class="pcard"><span class="pill" style="align-self:flex-start">' + esc(T('lbl.prep')) + '</span><b>' + esc(p.name) + '</b><p>' + esc(tx(p.text)) + '</p><div class="foot"><a class="tlink" href="#kontak" data-brief="7" data-note="' + esc(p.name) + '">' + esc(T('btn.notify')) + '</a></div></article>'; }).join('');
  }
  function rServices() {
    $('#services').innerHTML = D.services.map(function (s) {
      var ex = s.ex ? caseById(s.ex) : null, pr = lang === 'id' ? rp(s.idr) : 'US$' + Number(s.usd).toLocaleString('en-US');
      return '<article class="svc" id="svc-' + s.id + '"><span class="pill" style="align-self:flex-start">' + esc(tx(D.tiers[s.tier])) + '</span><h3>' + esc(tx(s.name)) + '</h3><p class="pb">' + esc(tx(s.problem)) + '</p><p style="font-size:.93em"><b>' + esc(T('lbl.forWho')) + ':</b> ' + esc(tx(s.who)) + '</p>' +
        '<ul class="ticks" style="margin:4px 0 6px">' + s.get.map(function (g) { return '<li>' + esc(tx(g)) + '</li>'; }).join('') + '</ul><p style="font-size:.9em;color:var(--fg-2)"><b>' + esc(T('lbl.limits')) + ':</b> ' + esc(tx(s.limits)) + '</p>' +
        (ex ? '<p style="font-size:.93em"><a class="tlink" href="#case-' + ex.id + '">' + esc(T('lbl.example')) + ': ' + esc(tx(ex.name)) + '</a></p>' : '') +
        '<div class="meta">' + esc(T('lbl.duration')) + ': ' + esc(tx(s.time)) + '</div><div class="price"><small>' + esc(T('lbl.from')) + '</small>' + pr + (s.per ? ' <small>' + esc(tx(s.per)) + '</small>' : '') + '</div>' +
        '<div class="acts">' + (s.demo ? '<a class="btn sm pri" href="' + s.demo + '">' + esc(T('btn.demoSvc')) + AR + '</a>' : '') + '<a class="btn sm" href="#kontak" data-brief="' + BRIEF[s.id] + '" data-note="' + esc(tx(s.name)) + '">' + esc(T('btn.quote')) + AR + '</a></div></article>';
    }).join('');
  }
  function renderAll() { rChrome(); rHero(); rReel(); rGallery(); rRecognition(); rBehind(); rJourney(); rLaboru(); rContact(); rDeep(); reveal(); document.dispatchEvent(new CustomEvent('site:render')); }

  /* ---------------- lightbox ---------------- */
  function openLb(i) {
    lbList = D.gallery.map(function (g, k) { return k; }).filter(function (k) { return gFilter === 'all' || D.gallery[k].t === gFilter || D.gallery[k].t === 'laboru' && D.gallery[i].t === 'laboru'; });
    if (lbList.indexOf(i) < 0) lbList = D.gallery.map(function (g, k) { return k; });
    lbIdx = lbList.indexOf(i); showLb(); $('#lb').hidden = false; document.body.style.overflow = 'hidden'; $('#lbClose').focus();
  }
  function showLb() {
    var g = D.gallery[lbList[lbIdx]], c = g.c && caseById(g.c);
    $('#lbImg').src = 'assets/img/g/' + g.f + '.webp'; $('#lbImg').width = g.s[0] * 2; $('#lbImg').height = g.s[1] * 2; $('#lbImg').alt = tx(g.cap); set('lbCap', tx(g.cap));
    $('#lbActs').innerHTML = g.demo ? '<a class="btn pri sm" href="' + g.demo + '">' + esc(tx(V.open)) + AR + '</a>' : c ? '<a class="btn pri sm" href="' + c.demo + '">' + esc(tx(V.open)) + AR + '</a><button type="button" class="btn sm" data-go-deep="case-' + c.id + '" data-lb="close">' + esc(tx(V.readCase)) + '</button>' : '<a class="btn pri sm" href="' + D.links.laboru + '"' + EXT + '>LABORU ↗</a>';
    $('#lbClose').setAttribute('aria-label', tx(V.close));
  }
  function closeLb() { $('#lb').hidden = true; document.body.style.overflow = ''; }

  /* ---------------- sheet + language ---------------- */
  function setHash() { var t = [lang === 'en' ? 'en' : '', mode === 'deep' ? 'deep' : ''].filter(Boolean).join('-'); try { history.replaceState(null, '', t ? '#' + t : location.pathname + location.search); } catch (e) { /* sandbox */ } }
  function setMode(m, anchor) {
    if (m !== 'deep' && m !== 'overview') return;
    var apply = function () {
      mode = m; root.setAttribute('data-mode', m); gAll = false; rChrome(); rGallery(); setHash(); reveal();
      var el = anchor && document.getElementById(anchor);
      if (el && el.offsetParent !== null) el.scrollIntoView({ block: 'start' }); else if (m === 'deep' && !anchor) { var d = $('#kapabilitas'); if (d) d.scrollIntoView({ block: 'start' }); } else window.scrollTo(0, 0);
      document.dispatchEvent(new CustomEvent('site:mode', { detail: m }));
    };
    if (document.startViewTransition && !(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) document.startViewTransition(apply); else apply();
  }
  function setLang(l) { if (l !== 'id' && l !== 'en') return; lang = l; store.set('aa_lang', l); renderAll(); setHash(); document.dispatchEvent(new CustomEvent('site:lang', { detail: l })); }

  /* ---------------- reveal on scroll ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -8% 0px' }) : null;
  function reveal() {
    if (!io) return;
    document.querySelectorAll('.sh, .tile, .awards li, .pillar, .quote, .tl li, .hist li, .wins li, .phone, .bignum, .stack, h2.one, .huge').forEach(function (el) { if (!el.classList.contains('rv')) { el.classList.add('rv'); var r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); else io.observe(el); } });
  }

  /* ---------------- contact ---------------- */
  var meN = 0, meT = 0;
  function briefText() { var t = $('#f-topic'); return (lang === 'id' ? 'Nama: ' : 'Name: ') + $('#f-name').value.trim() + '\n' + (lang === 'id' ? 'Perusahaan: ' : 'Company: ') + ($('#f-org').value.trim() || '-') + '\n' + (lang === 'id' ? 'Topik: ' : 'Topic: ') + t.options[t.selectedIndex].text + '\n\n' + $('#f-msg').value.trim() + '\n'; }
  function say(m) { set('formMsg', m); }
  function copy(text, done) { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); else done(false); }
  function prefill(idx, note) { var sel = $('#f-topic'), msg = $('#f-msg'); if (idx != null && sel.options[idx]) sel.selectedIndex = +idx; if (note && !msg.value.trim()) msg.value = (lang === 'id' ? 'Saya tertarik dengan: ' : 'I am interested in: ') + note + '. '; }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t.closest) return;
    var b = t.closest('[data-lang]'); if (b) return setLang(b.getAttribute('data-lang'));
    b = t.closest('[data-lb]'); if (b) { var k = b.getAttribute('data-lb'); if (k === 'close') closeLb(); if (k === 'prev') { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showLb(); } if (k === 'next') { lbIdx = (lbIdx + 1) % lbList.length; showLb(); } }
    b = t.closest('[data-mode-btn]'); if (b) return setMode(b.getAttribute('data-mode-btn'));
    b = t.closest('[data-go-deep]'); if (b) return setMode('deep', b.getAttribute('data-go-deep'));
    b = t.closest('[data-filter]'); if (b) { gFilter = b.getAttribute('data-filter'); document.querySelectorAll('[data-filter]').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); document.querySelectorAll('#gal .tile').forEach(function (x) { var i = +x.getAttribute('data-g'); x.hidden = tileHidden(D.gallery[i], i); x.classList.add('in'); }); syncMore(); return; }
    if (t.id === 'galMore') { gAll = true; document.querySelectorAll('#gal .tile').forEach(function (x) { x.hidden = false; x.classList.add('in'); }); syncMore(); return; }
    b = t.closest('[data-g]'); if (b) return openLb(+b.getAttribute('data-g'));
    b = t.closest('[data-reel]'); if (b) return showReel(+b.getAttribute('data-reel'));
    b = t.closest('[data-brief]'); if (b) prefill(b.getAttribute('data-brief'), b.getAttribute('data-note'));
    if (t.id === 'lb' ) closeLb();
    if (t.id === 'askLabo') return document.dispatchEvent(new CustomEvent('labo:open'));
    if (t.id === 'me') { meN = (Date.now() - meT < 1500) ? meN + 1 : 1; meT = Date.now(); if (meN >= 3) location.href = 'me/'; return; }
    if (t.id === 'copyMail') return copy(D.person.email, function (ok) { t.textContent = ok ? T('btn.copied') : D.person.email; setTimeout(function () { t.textContent = T('btn.copy'); }, 1600); });
    if (t.id === 'copyBrief') { if (!$('#f-name').value.trim() || !$('#f-msg').value.trim()) return say(T('form.need')); return copy(briefText(), function (ok) { say(ok ? T('btn.copied') : D.person.email); }); }
  });
  document.addEventListener('keydown', function (e) {
    if ($('#lb').hidden) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') { lbIdx = (lbIdx + 1) % lbList.length; showLb(); }
    if (e.key === 'ArrowLeft') { lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showLb(); }
  });
  $('#brief').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!$('#f-name').value.trim() || !$('#f-msg').value.trim()) return say(T('form.need'));
    say(T('form.emailLbl') + ' ' + D.person.email);
    location.href = 'mailto:' + D.person.email + '?subject=' + encodeURIComponent(T('form.subject') + ' — ' + $('#f-name').value.trim()) + '&body=' + encodeURIComponent(briefText());
  });
  function loadPrices() {
    if (!D.priceSheetId || !window.fetch || !window.AbortController) return;
    var ctl = new AbortController(); setTimeout(function () { ctl.abort(); }, 4000);
    fetch('https://docs.google.com/spreadsheets/d/' + D.priceSheetId + '/gviz/tq?tqx=out:csv', { signal: ctl.signal }).then(function (r) { return r.ok ? r.text() : Promise.reject(); }).then(function (txt) {
      var changed = false;
      txt.split(/\r?\n/).slice(1).forEach(function (line) { var c = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g); if (!c || c.length < 5) return; c = c.map(function (x) { return x.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim(); }); var k = c[0], n = Number(String(c[2]).replace(/[^0-9]/g, '')); if (D.prices[k] && n > 0) { D.prices[k] = [n, /^https?:\/\//.test(c[4]) ? c[4] : D.prices[k][1]]; changed = true; } });
      if (changed) rProducts();
    }).catch(function () { /* keep data.js prices */ });
  }

  /* ---------------- start ---------------- */
  root.classList.add('js');
  var h = location.hash.replace('#', ''), anchor = null;
  if (h && /^(en|id)?-?(deep)?$/.test(h)) { lang = /^en/.test(h) ? 'en' : /^id/.test(h) ? 'id' : (store.get('aa_lang') === 'en' ? 'en' : 'id'); if (/deep$/.test(h)) mode = 'deep'; }
  else { lang = store.get('aa_lang') === 'en' ? 'en' : 'id'; anchor = h; }
  root.setAttribute('data-mode', mode);
  renderAll();
  if (anchor) { var el = document.getElementById(anchor); if (el) { if (el.offsetParent === null) { mode = 'deep'; root.setAttribute('data-mode', 'deep'); rChrome(); } el.scrollIntoView(); } }
  loadPrices();
  window.SiteAPI = { lang: function () { return lang; }, mode: function () { return mode; }, setMode: setMode, setLang: setLang, prefill: prefill, tx: tx, T: T };
})();
