/* Pagina de downloads. Fica em arquivo proprio porque a politica de conteudo
   do site nao deixa script embutido no HTML. */

/* O arquivo de cada plataforma. Versao nova: trocar url, version, size e sha256
   aqui. O arquivo em si sobe para o servico "downloads", fora deste repositorio. */
var FILES = {
  windows: {
    url: "downloads/LiberouTV-Setup-1.0.1.exe",
    version: "1.0.1",
    size: "108 MB",
    sha256: "e41d1c2ddb80eab2b3cee83de0e16ee2e3156638eb09b923e1a493ad428ef1e6"
  },
  mac: {
    url: "downloads/LiberouTV-1.0.0.dmg",
    version: "1.0.0",
    size: "5 MB",
    sha256: "2735eba7a97354df9ebf773605c57f49d2ea44609514e52cd747bd0ef9013522"
  },
  android: {
    url: "downloads/LiberouTV-2.5.2.apk",
    version: "2.5.2",
    size: "38 MB",
    sha256: "d1fb823bf512554a73dc73dde5723ec467549ea47b25e5ca789805db4885b098"
  }
};

var I18N = {
  en: {
    docTitle: "LIBEROU TV: downloads",
    skip: "Skip to content",
    navLabel: "Main",
    langLabel: "Language",
    othersLabel: "Other platforms",
    navTv: "Devices",
    navFaq: "Questions",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    title: "Get LiberouTV.",
    lede: "The app is free and does not come with any content. You sign in with the details from your provider.",
    available: "Available",
    soon: "Coming soon",
    winDesc: "Windows 10 or 11, 64-bit",
    meta: "Version {version} \u00b7 {size}",
    winBtn: "Download for Windows",
    shaLabel: "File check (SHA-256)",
    howTitle: "How to install",
    w1: "Open the file you downloaded.",
    w2: "If Windows shows a blue warning, click More info and then Run anyway.",
    w3: "The app installs by itself and opens. Sign in with the details from your provider.",
    warn: "The warning appears because the installer does not have a digital signature yet.",
    macDesc: "Every Mac with macOS 13 or later",
    macBtn: "Download for Mac",
    m1: "Open the file you downloaded and drag LiberouTV to the Applications folder.",
    m2: "Open LiberouTV. Your Mac will say it could not verify the app: click OK.",
    m3: "Open System Settings, then Privacy & Security, scroll to the end and click Open Anyway. Confirm with your Mac password. Only the first time.",
    macWarn: "The warning appears because the app is not registered with Apple yet.",
    andDesc: "Phones, tablets, Android TV and TV boxes, with Android 5 or later",
    andBtn: "Download for Android",
    and1: "On a phone, open the file you downloaded. On a TV or TV box, open the Downloader app, type app.liberoutv.com/downloads and download it there.",
    and2: "Android will ask for permission to install apps from this source: allow it and tap Install.",
    and3: "Open the app and sign in with the provider code, username and password.",
    andWarn: "The permission request appears because the app is not in the app store yet.",
    othersName: "App stores",
    othersNote: "Samsung, LG, Roku, Apple TV and iPhone are on the way.",
    othersLink: "See every device.",
    /* estes dois sao iguais aos de assets/site.js */
    legal: "LIBEROU TV does not host, bundle or distribute channels, films or series. Illegal streaming services are not supported. Rated 16+.",
    tm: "Samsung is a trademark of Samsung Electronics Co., Ltd. LG and webOS are trademarks of LG Electronics Inc. ROKU is a trademark and/or registered trademark of Roku, Inc. in the United States and other countries. Android is a trademark of Google LLC. Apple, Mac, macOS, iPhone, iPad, Apple TV and App Store are trademarks of Apple Inc., registered in the U.S. and other countries and regions. Windows is a trademark of the Microsoft group of companies. LIBEROU TV is an independent app and is not affiliated with, sponsored or endorsed by these companies."
  },
  pt: {
    docTitle: "LIBEROU TV: downloads",
    skip: "Pular para o conteúdo",
    navLabel: "Principal",
    langLabel: "Idioma",
    othersLabel: "Outras plataformas",
    navTv: "Aparelhos",
    navFaq: "Dúvidas",
    navPrivacy: "Privacidade",
    navTerms: "Termos",
    title: "Baixe o LiberouTV.",
    lede: "O app é grátis e não traz conteúdo. Você entra com os dados do seu provedor.",
    available: "Disponível",
    soon: "Em breve",
    winDesc: "Windows 10 ou 11, de 64 bits",
    meta: "Versão {version} \u00b7 {size}",
    winBtn: "Baixar para Windows",
    shaLabel: "Conferência do arquivo (SHA-256)",
    howTitle: "Como instalar",
    w1: "Abra o arquivo baixado.",
    w2: "Se o Windows mostrar um aviso azul, clique em Mais informações e depois em Executar assim mesmo.",
    w3: "O app instala sozinho e abre. Entre com os dados do seu provedor.",
    warn: "O aviso aparece porque o instalador ainda não tem assinatura digital.",
    macDesc: "Todo Mac com macOS 13 ou mais recente",
    macBtn: "Baixar para Mac",
    m1: "Abra o arquivo baixado e arraste o LiberouTV para a pasta Aplicativos.",
    m2: "Abra o LiberouTV. O Mac vai avisar que não pôde verificar o aplicativo: clique em OK.",
    m3: "Abra Ajustes do Sistema, depois Privacidade e Segurança, role até o fim e clique em Abrir Mesmo Assim. Confirme com a senha do Mac. É só na primeira vez.",
    macWarn: "O aviso aparece porque o app ainda não tem o registro da Apple.",
    andDesc: "Celular, tablet, Android TV e TV box, com Android 5 ou mais recente",
    andBtn: "Baixar para Android",
    and1: "No celular, abra o arquivo baixado. Na TV ou TV box, abra o app Downloader, digite app.liberoutv.com/downloads e baixe por lá.",
    and2: "O Android vai pedir permissão para instalar apps desta fonte: permita e toque em Instalar.",
    and3: "Abra o app e entre com o código do provedor, o usuário e a senha.",
    andWarn: "O pedido de permissão aparece porque o app ainda não está na loja de apps.",
    othersName: "Lojas de apps",
    othersNote: "Samsung, LG, Roku, Apple TV e iPhone estão a caminho.",
    othersLink: "Ver todos os aparelhos.",
    legal: "O LIBEROU TV não hospeda, empacota nem distribui canais, filmes ou séries. Não apoiamos serviços ilegais. Classificação 16+.",
    tm: "Samsung é marca da Samsung Electronics Co., Ltd. LG e webOS são marcas da LG Electronics Inc. ROKU é marca e/ou marca registrada da Roku, Inc. nos Estados Unidos e em outros países. Android é marca da Google LLC. Apple, Mac, macOS, iPhone, iPad, Apple TV e App Store são marcas da Apple Inc., registradas nos Estados Unidos e em outros países e regiões. Windows é marca do grupo de empresas Microsoft. O LIBEROU TV é um app independente, sem vínculo, patrocínio ou endosso dessas empresas."
  }
};

function $(sel) { return document.querySelector(sel); }
function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }

var lang = "en";
function t(key) {
  var pack = I18N[lang] || I18N.en;
  return pack[key] || I18N.en[key] || "";
}

function applyLang(next) {
  lang = I18N[next] ? next : "en";
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  document.title = t("docTitle");
  $$("[data-i]").forEach(function (el) {
    var v = t(el.getAttribute("data-i"));
    if (v) el.textContent = v;
  });
  $$("[data-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-aria"))); });
  $$("[data-en][data-pt]").forEach(function (el) {
    el.setAttribute("href", el.getAttribute(lang === "pt" ? "data-pt" : "data-en"));
  });
  $("#btnEn").setAttribute("aria-pressed", lang === "en" ? "true" : "false");
  $("#btnPt").setAttribute("aria-pressed", lang === "pt" ? "true" : "false");
  Object.keys(FILES).forEach(function (key) {
    var file = FILES[key], id = key === "windows" ? "win" : key;
    $("#" + id + "Meta").textContent = t("meta").replace("{version}", file.version).replace("{size}", file.size);
  });
}
/* a escolha de idioma e a mesma da pagina principal */
function chooseLang(next) {
  applyLang(next);
  try { localStorage.setItem("liberou-lang", next); } catch (e) {}
}

document.documentElement.className += " js";
Object.keys(FILES).forEach(function (key) {
  var file = FILES[key], id = key === "windows" ? "win" : key;
  $("#" + id + "Btn").setAttribute("href", file.url);
  $("#" + id + "Sha").textContent = file.sha256;
});
$("#btnEn").addEventListener("click", function () { chooseLang("en"); });
$("#btnPt").addEventListener("click", function () { chooseLang("pt"); });
applyLang((function () {
  var saved = null;
  try { saved = localStorage.getItem("liberou-lang"); } catch (e) {}
  if (saved) return saved;
  return /^pt/i.test(navigator.language || "") ? "pt" : "en";
})());

/* entradas em sequencia */
$$(".ri").forEach(function (el, i) { el.style.setProperty("--i", Math.min(i, 6)); });
requestAnimationFrame(function () {
  requestAnimationFrame(function () { $$(".ri").forEach(function (el) { el.classList.add("in"); }); });
});
