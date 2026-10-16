/* KTISO — "Ma gestion" : période budgétaire (jour de début du mois) + répartition idéale.
   Partagé par l'espace abonné et l'outil Gestion de comptes. Idempotent. */
(function () {
  "use strict";
  if (window.KtisoGestion) return;

  var KEY = "ktiso-gestion";
  var OLD_GOALS_KEY = "ktiso-comptes:goals";
  var DEFAULTS = { startDay: 1, goals: { fixe: 50, variable: 30, epargne: 20 } };

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function int(v, min, max, fb) { v = Math.round(Number(v)); return isFinite(v) ? Math.max(min, Math.min(max, v)) : fb; }
  function sanitize(c) {
    c = c || {};
    var g = c.goals || {};
    return {
      startDay: int(c.startDay, 0, 31, 1),
      goals: {
        fixe: int(g.fixe, 0, 100, DEFAULTS.goals.fixe),
        variable: int(g.variable, 0, 100, DEFAULTS.goals.variable),
        epargne: int(g.epargne, 0, 100, DEFAULTS.goals.epargne)
      }
    };
  }

  var cfg = (function () {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || "null");
      if (s) return sanitize(s);
      var old = JSON.parse(localStorage.getItem(OLD_GOALS_KEY) || "null"); // migration de l'ancien réglage
      if (old && typeof old.fixe === "number") return sanitize({ goals: old });
    } catch (e) {}
    return sanitize(DEFAULTS);
  })();

  function persist() { try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch (e) {} }
  function emit(source) {
    try { window.dispatchEvent(new CustomEvent("ktiso:gestion-changed", { detail: { source: source || "local", config: get() } })); } catch (e) {}
  }

  // ----- calendrier (tout en chaînes ISO "AAAA-MM-JJ", sans fuseau) -----
  function dim(y, m0) { return new Date(y, m0 + 1, 0).getDate(); }
  function iso(y, m0, d) {
    var dt = new Date(y, m0, 1);
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(Math.min(d, dim(dt.getFullYear(), dt.getMonth())));
  }
  function parts(s) { s = String(s).slice(0, 10).split("-"); return [Number(s[0]), Number(s[1]) - 1, Number(s[2])]; }
  function addDays(s, n) { var p = parts(s); var d = new Date(p[0], p[1], p[2] + n); return iso(d.getFullYear(), d.getMonth(), d.getDate()); }

  // Début de la période « nommée » d'après le mois (y, m0).
  // Jour 1..15 : la période démarre dans ce mois. Jour 16..31 ou « dernier jour » : elle démarre le mois précédent,
  // si bien que la période porte le nom du mois où tombe la majorité de ses jours.
  function startISO(y, m0) {
    var s = cfg.startDay;
    if (s === 0) return iso(y, m0 - 1, 31);
    if (s <= 15) return iso(y, m0, s);
    return iso(y, m0 - 1, s);
  }
  function labelOf(s) {
    var p = parts(s);
    for (var k = -1; k <= 1; k++) {
      var d = new Date(p[0], p[1] + k, 1);
      var a = startISO(d.getFullYear(), d.getMonth());
      var n = new Date(p[0], p[1] + k + 1, 1);
      var b = startISO(n.getFullYear(), n.getMonth());
      var x = String(s).slice(0, 10);
      if (a <= x && x < b) return [d.getFullYear(), d.getMonth()];
    }
    return [p[0], p[1]];
  }

  function get() { return JSON.parse(JSON.stringify(cfg)); }
  function set(patch, opts) {
    patch = patch || {};
    var next = get();
    if (patch.startDay !== undefined) next.startDay = patch.startDay;
    if (patch.goals) { for (var k in patch.goals) next.goals[k] = patch.goals[k]; }
    cfg = sanitize(next);
    persist();
    if (!opts || !opts.silent) emit((opts && opts.source) || "local");
  }
  function todayISO() { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function labelDate(s) { var l = labelOf(s); return new Date(l[0], l[1], 1); }
  function labelKey(s) { var l = labelOf(s); return l[0] + "-" + pad(l[1] + 1); }
  function inPeriod(s, ref) {
    if (!s) return false;
    var l = labelOf(s);
    return l[0] === ref.getFullYear() && l[1] === ref.getMonth();
  }
  function range(ref) {
    var a = startISO(ref.getFullYear(), ref.getMonth());
    var b = addDays(startISO(ref.getFullYear(), ref.getMonth() + 1), -1);
    return { start: a, end: b };
  }
  function fmtShort(s) {
    var p = parts(s);
    var m = new Date(p[0], p[1], p[2]).toLocaleDateString("fr-BE", { month: "short" }).replace(".", "");
    return p[2] + " " + m;
  }
  function rangeText(ref) {
    if (cfg.startDay === 1) return "";
    var r = range(ref);
    return fmtShort(r.start) + " → " + fmtShort(r.end);
  }

  window.KtisoGestion = {
    get: get, set: set, todayISO: todayISO, labelDate: labelDate, labelKey: labelKey,
    inPeriod: inPeriod, range: range, rangeText: rangeText
  };
})();
