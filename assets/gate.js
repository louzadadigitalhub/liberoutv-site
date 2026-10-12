/* Os cinco portoes do topo estatico. Valem aqui e no script do fim da pagina. */
(function (d) {
  var G = [
    "(max-width: 720px)",
    "(orientation: portrait) and (max-width: 1024px)",
    "(orientation: portrait) and (pointer: coarse)",
    "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
    "(prefers-reduced-motion: reduce)"
  ];
  var motionOk = false;
  try { motionOk = localStorage.getItem("liberou-motion") === "1"; } catch (e) {}
  window.LTV_GATES = G;
  window.LTV_MOTION_OK = motionOk;
  var gated = G.some(function (q, i) { return window.matchMedia(q).matches && !(motionOk && i === 4); });
  d.className += " js" + (gated ? "" : " scrub");
})(document.documentElement);
