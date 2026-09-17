/* ============================================================
   AVERMONT LEGAL - публикации из Google-таблицы.
   Клиент добавляет строку в таблицу и кладёт PDF в папку Google Диска -
   сайт подхватывает без деплоя. Контейнеры:
   [data-pubs="N"] - список (N карточек, 0 = все), #pub-view - чтение одной
   публикации (publikacii.html?id=<адрес>). PDF показывается просмотрщиком Google Диска.
   Файл PDF и папка должны быть открыты «Все, у кого есть ссылка - Читатель».
   ============================================================ */
(function(){
"use strict";

var SHEET = "1JRp6pwtoJ_vYA3mpU7kVBBxKELfGte1JXvYCt1cLBqg";
/* первый лист таблицы. gid не указывать: у таблицы, созданной из CSV, лист не 0, и адрес с gid=0 отдаёт страницу входа */
var SRC = [
  "https://docs.google.com/spreadsheets/d/" + SHEET + "/export?format=csv",
  "https://docs.google.com/spreadsheets/d/" + SHEET + "/gviz/tq?tqx=out:csv"   /* запасной */
];
/* кэш вкладки - только для мгновенной первой отрисовки; таблица перечитывается при каждом открытии,
   иначе переключение «да/нет» в таблице не видно до истечения срока кэша */
var CACHE = "al-pubs-v2";

var T = {
  ru: { read: "Читать", open: "Открыть PDF", dl: "Скачать PDF", empty: "Публикации скоро появятся.",
        missing: "Публикация не найдена.", err: "Не удалось загрузить публикации. Обновите страницу чуть позже.",
        months: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
        frame: "Публикация в формате PDF", site: "Публикации - Avermont Legal" },
  en: { read: "Read", open: "Open PDF", dl: "Download PDF", empty: "Publications are coming soon.",
        missing: "Publication not found.", err: "Could not load publications. Please refresh the page a little later.",
        months: ["January","February","March","April","May","June","July","August","September","October","November","December"],
        frame: "Publication in PDF format", site: "Publications - Avermont Legal" }
};
function lang(){ return document.documentElement.lang === "en" ? "en" : "ru"; }

/* ---------- CSV (RFC 4180: кавычки, запятые и переносы внутри ячеек) ---------- */
function parseCSV(t){
  var rows = [], row = [], cell = "", q = false;
  for (var i = 0; i < t.length; i++) {
    var c = t[i];
    if (q) {
      if (c === '"') { if (t[i + 1] === '"') { cell += '"'; i++; } else q = false; }
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}

function esc(s){ return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

/* id файла из любой ссылки Диска: /file/d/ID/..., ?id=ID, или голый id */
function driveId(s){
  s = (s || "").trim();
  var m = s.match(/\/d\/([\w-]{20,})/) || s.match(/[?&]id=([\w-]{20,})/) || s.match(/^([\w-]{20,})$/);
  return m ? m[1] : "";
}
function parseDate(s){
  var m = (s || "").trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]);
  m = (s || "").trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}
function fmtDate(d){
  if (!d) return "";
  var L = T[lang()];
  return d.getDate() + " " + L.months[d.getMonth()] + " " + d.getFullYear();
}
function slugify(s){ return (s || "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, ""); }

/* колонки: 0 публиковать · 1 дата · 2 тип RU · 3 тип EN · 4 заголовок RU · 5 заголовок EN ·
   6 описание RU · 7 описание EN · 8 ссылка на PDF · 9 адрес страницы */
function toItems(rows){
  var out = [];
  rows.slice(1).forEach(function(r, i){
    var on = (r[0] || "").trim().toLowerCase();
    if (!/^(да|yes|1|\+|true)$/.test(on)) return;
    var id = driveId(r[8]);
    if (!id || !(r[4] || "").trim()) return;
    out.push({
      date: parseDate(r[1]),
      type: { ru: (r[2] || "").trim(), en: (r[3] || r[2] || "").trim() },
      title: { ru: r[4].trim(), en: (r[5] || r[4]).trim() },
      desc: { ru: (r[6] || "").trim(), en: (r[7] || r[6] || "").trim() },
      pdf: id,
      slug: slugify(r[9]) || ("pub-" + (i + 1))
    });
  });
  var seen = {};
  out.forEach(function(it){                    /* одинаковый адрес у двух строк - второй получает суффикс */
    var base = it.slug, n = 2;
    while (seen[it.slug]) it.slug = base + "-" + n++;
    seen[it.slug] = 1;
  });
  out.sort(function(a, b){ return (b.date ? +b.date : 0) - (a.date ? +a.date : 0); });
  return out;
}

function cached(){
  try { var c = JSON.parse(sessionStorage.getItem(CACHE) || "null"); return c && c.rows || null; }
  catch(e){ return null; }
}
function load(){
  function get(k){
    return fetch(SRC[k], {credentials: "omit", cache: "no-store"}).then(function(r){
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.text();
    }).then(function(t){
      if (/^\s*</.test(t)) throw new Error("not csv");   /* закрытая таблица отдаёт страницу входа */
      var rows = parseCSV(t);
      if (rows.length < 2) throw new Error("empty");
      return rows;
    }).catch(function(e){
      if (k + 1 < SRC.length) return get(k + 1);
      throw e;
    });
  }
  return get(0).then(function(rows){
    try { sessionStorage.setItem(CACHE, JSON.stringify({t: Date.now(), rows: rows})); } catch(e){}
    return rows;
  });
}

/* ---------- отрисовка ---------- */
var items = null, failed = false;
function thumb(id){ return "https://drive.google.com/thumbnail?id=" + encodeURIComponent(id) + "&sz=w640"; }
function viewUrl(id){ return "https://drive.google.com/file/d/" + encodeURIComponent(id) + "/view"; }
function dlUrl(id){ return "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(id); }
function pageUrl(it){ return "publikacii.html?id=" + encodeURIComponent(it.slug) + (lang() === "en" ? "&lang=en" : ""); }

function card(it){
  var L = lang(), meta = [it.type[L], fmtDate(it.date)].filter(Boolean).join(" · ");
  return '<a class="pub" href="' + esc(pageUrl(it)) + '">' +
    '<span class="pub-cov"><span class="pub-ph" aria-hidden="true"><b>AL</b><i>' + esc(it.type[L] || "PDF") + '</i></span>' +
    '<img src="' + esc(thumb(it.pdf)) + '" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onload="this.parentNode.classList.add(\'has-img\')" onerror="this.remove()"></span>' +
    '<span class="pub-txt"><small>' + esc(meta) + '</small><b>' + esc(it.title[L]) + '</b>' +
    (it.desc[L] ? '<span class="pub-d">' + esc(it.desc[L]) + '</span>' : '') +
    '<span class="pub-go">' + esc(T[L].read) + ' <i aria-hidden="true">&rarr;</i></span></span></a>';
}

function renderLists(){
  document.querySelectorAll("[data-pubs]").forEach(function(box){
    var n = parseInt(box.getAttribute("data-pubs"), 10) || 0;
    var sec = box.closest("section");
    var home = sec && sec.id === "publikacii";
    if (!items || !items.length) {
      if (home) { sec.hidden = true; return; }
      box.innerHTML = '<p class="pub-empty">' + esc(failed ? T[lang()].err : T[lang()].empty) + '</p>';
      return;
    }
    box.innerHTML = (n ? items.slice(0, n) : items).map(card).join("");
    if (home) sec.hidden = false;
  });
}

function renderView(){
  var view = document.getElementById("pub-view");
  var list = document.getElementById("pub-list");
  if (!view) return;
  var id = new URLSearchParams(location.search).get("id");
  if (!id) { view.hidden = true; if (list) list.hidden = false; return; }
  if (list) list.hidden = true;
  view.hidden = false;
  var L = lang(), body = view.querySelector(".pv-body");
  if (!items) { body.innerHTML = failed ? '<p class="pub-empty">' + esc(T[L].err) + '</p>' : ""; return; }
  var it = items.filter(function(x){ return x.slug === id; })[0];
  if (!it) { body.innerHTML = '<p class="pub-empty">' + esc(T[L].missing) + '</p>'; return; }
  var meta = [it.type[L], fmtDate(it.date)].filter(Boolean).join(" · ");
  document.title = it.title[L] + " - Avermont Legal";
  var md = document.querySelector('meta[name="description"]');
  if (md && it.desc[L]) md.setAttribute("content", it.desc[L]);
  var cur = body.getAttribute("data-pdf");
  if (cur === it.pdf + L) return;              /* тот же файл и язык - не перезагружать просмотрщик */
  body.setAttribute("data-pdf", it.pdf + L);
  body.innerHTML =
    '<p class="kick">' + esc(meta) + '</p>' +
    '<h1 class="h2 pv-h">' + esc(it.title[L]) + '</h1>' +
    (it.desc[L] ? '<p class="lead">' + esc(it.desc[L]) + '</p>' : '') +
    '<div class="pv-act">' +
      '<a class="btn btn-solid sm" href="' + esc(viewUrl(it.pdf)) + '" target="_blank" rel="noopener"><span>' + esc(T[L].open) + '</span><i class="ar" aria-hidden="true">&#8599;</i></a>' +
      '<a class="btn btn-ghost sm" href="' + esc(dlUrl(it.pdf)) + '" target="_blank" rel="noopener"><span>' + esc(T[L].dl) + '</span></a>' +
    '</div>' +
    '<div class="pv-frame"><iframe src="https://drive.google.com/file/d/' + encodeURIComponent(it.pdf) + '/preview" title="' + esc(T[L].frame) + '" allow="autoplay" allowfullscreen></iframe></div>';
}

function render(){ renderLists(); renderView(); }

document.addEventListener("al:lang", render);
if (!document.querySelector("[data-pubs], #pub-view")) return;
var early = cached();
if (early) items = toItems(early);
render();
load().then(function(rows){ items = toItems(rows); failed = false; render(); })
      .catch(function(){ if (!early) { failed = true; items = null; render(); } });
})();
