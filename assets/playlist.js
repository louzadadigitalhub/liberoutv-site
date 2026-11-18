/* Aba Playlist (playlist.html). O cliente que comprou uma ativacao entra com o codigo do
   provedor (o que ele digita na TV) e a senha da ativacao, e escolhe o servidor que a TV abre.
   Fala com o painel em /api/playlist.php; a senha vai no corpo, nunca em cookie. O codigo e a
   senha ficam so nesta aba do navegador (sessionStorage) para o "Recarregar" funcionar.
   Arquivo proprio porque a politica de conteudo do site nao deixa script embutido.
   Os textos do rodape (skip, navTv, navPrivacy, navTerms, footPartners, tm) sao os mesmos de
   assets/downloads.js: mudou la, mude aqui. */

var API = "https://painel.liberouplayer.com/api/playlist.php";
/* teste local: http://localhost/playlist.html?api=http://127.0.0.1:8099/api/playlist.php */
(function () {
  var m = /[?&]api=([^&]+)/.exec(location.search);
  if (m && /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) API = decodeURIComponent(m[1]);
})();

var I18N = {
  en: {
    docTitle: "LIBEROU PLAYER: playlist",
    skip: "Skip to content", navLabel: "Main", langLabel: "Language", navTv: "Devices",
    navPrivacy: "Privacy", navTerms: "Terms", footPartners: "For providers and resellers",
    kicker: "Playlist",
    title: "Your playlists.",
    lede: "Sign in with the provider code you type on your TV and the password of your activation. Here you choose which server your TV opens.",
    loginTitle: "Sign in",
    loginSub: "You got both with your activation. The provider code is the one you type on the TV.",
    fCode: "Provider", fPass: "Password", btnLogin: "Sign in",
    actTitle: "Activation", kState: "Status", kUntil: "Valid until", kTv: "TV",
    btnReload: "Reload", btnTv: "Change TV", btnOut: "Sign out",
    listsTitle: "Playlists",
    listsSub: "The one in use is what your TV opens. After switching, close and open the app on the TV. Each provider has its own user and password: on the TV, sign out and sign in again with the same code.",
    fName: "Name", fServer: "Server", btnAdd: "Add playlist", btnSave: "Save", btnCancel: "Cancel",
    hint: "The server is the address your provider gave you, with the port, like http://server.com:8080.",
    phName: "Provider A", phServer: "http://server.com:8080",
    inUse: "In use", use: "Use", edit: "Edit", del: "Delete",
    noLists: "No playlist yet. Add the server of your provider below.",
    noTv: "No TV yet", seen: "Last seen ", nextChange: "Next TV change: ",
    confirmTv: "Release the TV? The next TV that signs in with your code keeps the activation. You can do this once every 30 days.",
    confirmDel: "Delete this playlist?",
    reloaded: "Up to date. On the TV, close and open the app to use the playlist in use now.",
    offline: "Could not reach the server. Check your connection and try again.",
    states: { nova: "Waiting for the first sign-in", ativa: "Active", vencida: "Expired", bloqueada: "Blocked" }
  },
  pt: {
    docTitle: "LIBEROU PLAYER: playlist",
    skip: "Pular para o conteúdo", navLabel: "Principal", langLabel: "Idioma", navTv: "Aparelhos",
    navPrivacy: "Privacidade", navTerms: "Termos", footPartners: "Para provedores e revendas",
    kicker: "Playlist",
    title: "Suas playlists.",
    lede: "Entre com o código do provedor que você digita na TV e a senha da sua ativação. Aqui você escolhe qual servidor a TV abre.",
    loginTitle: "Entrar",
    loginSub: "Você recebeu os dois com a ativação. O código do provedor é o mesmo que você digita na TV.",
    fCode: "Provider", fPass: "Password", btnLogin: "Entrar",
    actTitle: "Ativação", kState: "Situação", kUntil: "Vale até", kTv: "TV",
    btnReload: "Recarregar", btnTv: "Trocar de TV", btnOut: "Sair",
    listsTitle: "Playlists",
    listsSub: "A que está em uso é a que a TV abre. Depois de trocar, feche e abra o app na TV. Cada provedor tem o seu usuário e senha: na TV, saia e entre de novo com o mesmo código.",
    fName: "Nome", fServer: "Servidor", btnAdd: "Adicionar playlist", btnSave: "Salvar", btnCancel: "Cancelar",
    hint: "O servidor é o endereço que o seu provedor passou, com a porta, como http://servidor.com:8080.",
    phName: "Provedor A", phServer: "http://servidor.com:8080",
    inUse: "Em uso", use: "Usar", edit: "Editar", del: "Apagar",
    noLists: "Nenhuma playlist ainda. Adicione abaixo o servidor do seu provedor.",
    noTv: "Nenhuma TV ainda", seen: "Visto em ", nextChange: "Próxima troca de TV: ",
    confirmTv: "Soltar a TV? A próxima TV que entrar com o seu código fica com a ativação. Dá para fazer isso uma vez a cada 30 dias.",
    confirmDel: "Apagar esta playlist?",
    reloaded: "Atualizado. Na TV, feche e abra o app para usar a playlist em uso agora.",
    offline: "Não deu para falar com o servidor. Confira a internet e tente de novo.",
    states: { nova: "Aguardando o 1º login", ativa: "Ativa", vencida: "Vencida", bloqueada: "Bloqueada" }
  }
};
/* o aviso de marcas do rodape: o texto mora em assets/downloads.js, pagina por pagina */
I18N.en.tm = document.querySelector("[data-i='tm']") ? document.querySelector("[data-i='tm']").textContent : "";
I18N.pt.tm = "Samsung é marca da Samsung Electronics Co., Ltd. LG e webOS são marcas da LG Electronics Inc. ROKU é marca e/ou marca registrada da Roku, Inc. nos Estados Unidos e em outros países. Android é marca da Google LLC. Apple, Mac, macOS, iPhone, iPad, Apple TV e App Store são marcas da Apple Inc., registradas nos Estados Unidos e em outros países e regiões. Windows, Xbox e Microsoft Store são marcas do grupo de empresas Microsoft. Amazon, Fire TV e Vega OS são marcas da Amazon.com, Inc. ou de suas afiliadas. VIDAA é marca do seu titular. O LIBEROU PLAYER é um app independente, sem vínculo, patrocínio ou endosso dessas empresas.";

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
var lang = "en", cred = null, last = null;
function t(key) { var p = I18N[lang] || I18N.en; return p[key] !== undefined ? p[key] : I18N.en[key]; }

function applyLang(next) {
  lang = I18N[next] ? next : "en";
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.title = t("docTitle");
  $$("[data-i]").forEach(function (el) { var v = t(el.getAttribute("data-i")); if (typeof v === "string" && v) el.textContent = v; });
  $$("[data-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-aria"))); });
  $$("[data-ph]").forEach(function (el) { el.setAttribute("placeholder", t(el.getAttribute("data-ph"))); });
  $$("[data-en][data-pt]").forEach(function (el) { el.setAttribute("href", el.getAttribute(lang === "pt" ? "data-pt" : "data-en")); });
  $("#btnEn").setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  $("#btnPt").setAttribute("aria-pressed", lang === "pt" ? "true" : "false");
  $("#btnAdd").textContent = $("#editId").value ? t("btnSave") : t("btnAdd");
  if (last) render(last);
}
function chooseLang(next) { applyLang(next); try { localStorage.setItem("liberou-lang", next); } catch (e) {} }

function say(id, text, ok) {
  var el = $(id);
  el.textContent = text || "";
  el.className = "msg" + (text ? " on " + (ok ? "ok" : "err") : "");
}

/* um pedido ao painel; devolve a resposta JSON, ou um erro com a mensagem */
function ask(acao, extra) {
  var body = { acao: acao, codigo: cred.codigo, senha: cred.senha };
  Object.keys(extra || {}).forEach(function (k) { body[k] = extra[k]; });
  return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then(function (r) { return r.json().catch(function () { return { ok: false, mensagem: t("offline") }; }); },
          function () { return { ok: false, mensagem: t("offline") }; });
}

function button(text, cls, fn) {
  var b = document.createElement("button"); b.type = "button"; b.className = cls; b.textContent = text;
  b.addEventListener("click", fn); return b;
}

function render(a) {
  last = a;
  $("#vCode").textContent = a.codigo;
  $("#vState").textContent = t("states")[a.situacao] || a.situacao_txt;
  $("#vUntil").textContent = a.vence;
  $("#vTv").textContent = a.tv ? a.tv.aparelho : t("noTv");
  $("#vTvSeen").textContent = a.tv && a.tv.visto ? t("seen") + a.tv.visto : (a.troca_tv_em ? t("nextChange") + a.troca_tv_em : "");
  $("#btnTv").disabled = !a.tv;
  var box = $("#lista");
  box.textContent = "";
  if (!a.playlists.length) {
    var p = document.createElement("p"); p.className = "empty"; p.textContent = t("noLists"); box.appendChild(p);
  }
  a.playlists.forEach(function (pl) {
    var row = document.createElement("div"); row.className = "item";
    var info = document.createElement("div");
    var nm = document.createElement("div"); nm.className = "nm"; nm.textContent = pl.nome;
    var sv = document.createElement("div"); sv.className = "sv"; sv.textContent = pl.servidor;
    info.appendChild(nm); info.appendChild(sv);
    var bt = document.createElement("div"); bt.className = "bt";
    if (pl.ativa) {
      var on = document.createElement("span"); on.className = "chip-on"; on.textContent = t("inUse"); bt.appendChild(on);
    } else {
      bt.appendChild(button(t("use"), "ghost", function () { act("usar", { id: pl.id }); }));
    }
    bt.appendChild(button(t("edit"), "ghost", function () {
      $("#editId").value = pl.id; $("#nome").value = pl.nome; $("#servidor").value = pl.servidor;
      $("#btnAdd").textContent = t("btnSave"); $("#btnCancel").classList.remove("hidden"); $("#servidor").focus();
    }));
    bt.appendChild(button(t("del"), "ghost danger", function () { if (confirm(t("confirmDel"))) act("apagar", { id: pl.id }); }));
    row.appendChild(info); row.appendChild(bt); box.appendChild(row);
  });
}

function resetForm() {
  $("#editId").value = ""; $("#nome").value = ""; $("#servidor").value = "";
  $("#btnAdd").textContent = t("btnAdd"); $("#btnCancel").classList.add("hidden");
}

function show(on) {
  $("#entrar").classList.toggle("hidden", on);
  $("#conta").classList.toggle("hidden", !on);
  $("#listas").classList.toggle("hidden", !on);
}

function out() {
  cred = null; last = null;
  try { sessionStorage.removeItem("liberou-playlist"); } catch (e) {}
  show(false); say("#msgConta", ""); resetForm();
}

function act(acao, extra, okMsg) {
  return ask(acao, extra).then(function (r) {
    if (r.ok) { render(r.ativacao); say("#msgConta", okMsg || r.mensagem, true); return true; }
    if (r.error === "nao_autorizado") { out(); say("#msgLogin", r.mensagem, false); return false; }
    say("#msgConta", r.mensagem || t("offline"), false); return false;
  });
}

$("#fLogin").addEventListener("submit", function (ev) {
  ev.preventDefault();
  cred = { codigo: $("#code").value.trim().toUpperCase(), senha: $("#pass").value.trim() };
  ask("entrar").then(function (r) {
    if (!r.ok) { say("#msgLogin", r.mensagem || t("offline"), false); cred = null; return; }
    try { sessionStorage.setItem("liberou-playlist", JSON.stringify(cred)); } catch (e) {}
    say("#msgLogin", ""); $("#pass").value = ""; render(r.ativacao); show(true);
  });
});
$("#fAdd").addEventListener("submit", function (ev) {
  ev.preventDefault();
  var id = $("#editId").value;
  act(id ? "editar" : "adicionar", { id: id, nome: $("#nome").value.trim(), servidor: $("#servidor").value.trim() })
    .then(function (ok) { if (ok) resetForm(); });
});
$("#btnCancel").addEventListener("click", resetForm);
$("#btnReload").addEventListener("click", function () { act("entrar", {}, t("reloaded")); });
$("#btnTv").addEventListener("click", function () { if (confirm(t("confirmTv"))) act("trocar_tv"); });
$("#btnOut").addEventListener("click", out);
$("#btnEn").addEventListener("click", function () { chooseLang("en"); });
$("#btnPt").addEventListener("click", function () { chooseLang("pt"); });

applyLang((function () {
  var saved = null;
  try { saved = localStorage.getItem("liberou-lang"); } catch (e) {}
  if (saved) return saved;
  return /^pt/i.test(navigator.language || "") ? "pt" : "en";
})());

/* voltou para a aba (ou recarregou a pagina): entra de novo sozinho */
(function () {
  var saved = null;
  try { saved = JSON.parse(sessionStorage.getItem("liberou-playlist") || "null"); } catch (e) {}
  if (saved && saved.codigo && saved.senha) {
    cred = saved;
    ask("entrar").then(function (r) { if (r.ok) { render(r.ativacao); show(true); } else { out(); } });
  }
})();
