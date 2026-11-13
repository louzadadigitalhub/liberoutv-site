/* Pagina de parceiros. Fica em arquivo proprio porque a politica de conteudo
   do site nao deixa script embutido no HTML. Os textos comuns (menu, rodape e
   aviso de marcas) sao os mesmos de assets/downloads.js. */
var I18N = {
  en: {
    docTitle: "LIBEROU PLAYER: partners",
    navDownloads: "Downloads",
    navPartners: "Partners",
    navLogin: "Sign in",
    kicker: "PARTNERS",
    title: "Take Liberou Player to your customers.",
    lede: "The app is free for viewers. Resellers pay a license per active customer and follow everything in their own panel.",
    ctaBtn: "I want to be a partner",
    seePlans: "See the programs",
    howChip: "How it works",
    howName: "From the panel to your customer's TV.",
    howDesc: "Your customer installs the app from the store or the site and signs in with the details you give them.",
    h1: "You get access to the panel and add your server. It gets a code.",
    h2: "Your customer signs in to Liberou Player with that code, the username and the password. The server address never shows in the app.",
    h3: "On the 15th of each month you pay for the peak of active customers in the cycle. An active customer is anyone who used the app in the last 7 days.",
    howNote: "The same customer on a TV and a phone counts once. Payments go straight to Liberou Player, never through the app.",
    plansKicker: "Programs",
    plansTitle: "Choose how you want to sell.",
    rvChip: "Reseller",
    rvName: "Reseller",
    rvFor: "For those who serve their own customers.",
    rvPrice: "R$ 1.00",
    rvPer: "per active customer per month",
    rv1: "A panel with your customers and devices",
    rv2: "One code for each of your servers",
    rv3: "See who is watching right now",
    rv4: "Suggested price to your customer: R$ 1.50",
    msChip: "Master",
    msName: "Master",
    msFor: "For those who build their own network of resellers.",
    msPrice: "R$ 0.50",
    msPer: "per active customer per month",
    ms1: "Add resellers and charge them R$ 1.00",
    ms2: "Follow and bill your network in the panel",
    ms3: "Block and release your resellers",
    ms4: "35% to 50% commission on the provider partnerships you close",
    pvChip: "Provider",
    pvName: "Partner provider",
    pvFor: "For servers with a large base, at a fixed monthly price.",
    pvPrice: "R$ 5,000",
    pvPer: "per month, on the 10,000-user plan",
    pv1: "R$ 5,000 a month: up to 10,000 users",
    pv2: "R$ 10,000 a month: up to 25,000 users",
    pv3: "R$ 15,000 a month: up to 40,000 users",
    pv4: "Over the limit? The panel warns you and you agree on a plan change",
    featsKicker: "What you get",
    featsTitle: "Everything your customer needs to watch.",
    f1N: "One app, every screen",
    f1T: "Windows, Mac, Android, iPhone, iPad and Apple TV are available now. Samsung, LG and Roku are on the way.",
    f2N: "A protected server",
    f2T: "The server address lives in the panel, not in the app. You can switch servers without updating a single device.",
    f3N: "A live panel",
    f3T: "Customers, devices and who is watching right now, by code.",
    f4N: "Made for the remote",
    f4T: "Large menus, a focus you can always see, and live TV, movies and series from your server a few presses away.",
    bandTitle: "Shall we talk?",
    bandText: "Tell us how many customers you serve today and which program fits. We reply with the next steps.",
    legal: "LIBEROU PLAYER does not host, bundle or distribute channels, films or series. Each partner is responsible for the content they distribute and may only distribute what they have the right to. Illegal streaming services are not supported.",
    skip: "Skip to content",
    navLabel: "Main",
    langLabel: "Language",
    navTv: "Devices",
    navFaq: "Questions",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    footPartners: "For providers and resellers",
    tm: "Samsung is a trademark of Samsung Electronics Co., Ltd. LG and webOS are trademarks of LG Electronics Inc. ROKU is a trademark and/or registered trademark of Roku, Inc. in the United States and other countries. Android is a trademark of Google LLC. Apple, Mac, macOS, iPhone, iPad, Apple TV and App Store are trademarks of Apple Inc., registered in the U.S. and other countries and regions. Windows is a trademark of the Microsoft group of companies. LIBEROU PLAYER is an independent app and is not affiliated with, sponsored or endorsed by these companies.",
  },
  pt: {
    docTitle: "LIBEROU PLAYER: parceiros",
    navDownloads: "Downloads",
    navPartners: "Parceiros",
    navLogin: "Entrar",
    kicker: "PARCEIROS",
    title: "Leve o Liberou Player para os seus clientes.",
    lede: "O app é grátis para quem assiste. Quem revende paga a licença de uso por cliente ativo e acompanha tudo num painel próprio.",
    ctaBtn: "Quero ser parceiro",
    seePlans: "Ver os programas",
    howChip: "Como funciona",
    howName: "Do painel à TV do cliente.",
    howDesc: "Seu cliente instala o app pela loja ou pelo site e entra com os dados que você passa.",
    h1: "Você recebe acesso ao painel e cadastra o seu servidor. Ele ganha um código.",
    h2: "Seu cliente entra no Liberou Player com esse código, o usuário e a senha. O endereço do servidor nunca aparece no app.",
    h3: "No dia 15 de cada mês, você paga pelo pico de clientes ativos do ciclo. Cliente ativo é quem usou o app nos últimos 7 dias.",
    howNote: "O mesmo cliente na TV e no celular conta uma vez só. Os pagamentos são feitos direto com a Liberou Player, nunca pelo app.",
    plansKicker: "Programas",
    plansTitle: "Escolha como quer vender.",
    rvChip: "Revenda",
    rvName: "Revenda",
    rvFor: "Para quem atende os próprios clientes.",
    rvPrice: "R$ 1,00",
    rvPer: "por cliente ativo no mês",
    rv1: "Painel com os seus clientes e aparelhos",
    rv2: "Um código para cada servidor seu",
    rv3: "Veja quem está assistindo agora",
    rv4: "Sugestão de repasse ao seu cliente: R$ 1,50",
    msChip: "Master",
    msName: "Master",
    msFor: "Para quem monta a própria rede de revendas.",
    msPrice: "R$ 0,50",
    msPer: "por cliente ativo no mês",
    ms1: "Cadastre revendas e repasse a R$ 1,00",
    ms2: "Acompanhe e cobre a sua rede pelo painel",
    ms3: "Bloqueie e libere as suas revendas",
    ms4: "Comissão de 35% a 50% nas parcerias com provedores que você fechar",
    pvChip: "Provedor",
    pvName: "Provedor parceiro",
    pvFor: "Para servidores com base grande, com valor fechado por mês.",
    pvPrice: "R$ 5.000",
    pvPer: "por mês, no plano de 10 mil usuários",
    pv1: "R$ 5.000 por mês: até 10 mil usuários",
    pv2: "R$ 10.000 por mês: até 25 mil usuários",
    pv3: "R$ 15.000 por mês: até 40 mil usuários",
    pv4: "Passou do limite? O painel avisa e vocês combinam a troca de plano",
    featsKicker: "O que você recebe",
    featsTitle: "Tudo o que o seu cliente precisa para assistir.",
    f1N: "Um app, todas as telas",
    f1T: "Windows, Mac, Android, iPhone, iPad e Apple TV já estão disponíveis. Samsung, LG e Roku estão a caminho.",
    f2N: "Servidor protegido",
    f2T: "O endereço do servidor fica no painel, não no app. Dá para trocar de servidor sem atualizar nenhum aparelho.",
    f3N: "Painel em tempo real",
    f3T: "Clientes, aparelhos e quem está assistindo agora, separados por código.",
    f4N: "Feito para o controle remoto",
    f4T: "Menus grandes, foco sempre visível e ao vivo, filmes e séries do seu servidor a poucos cliques.",
    bandTitle: "Vamos conversar?",
    bandText: "Conte quantos clientes você atende hoje e qual programa faz mais sentido. A gente responde com os próximos passos.",
    legal: "O LIBEROU PLAYER não hospeda, empacota nem distribui canais, filmes ou séries. Cada parceiro responde pelo conteúdo que distribui e só pode distribuir o que tem direito de distribuir. Não apoiamos serviços ilegais.",
    skip: "Pular para o conteúdo",
    navLabel: "Principal",
    langLabel: "Idioma",
    navTv: "Aparelhos",
    navFaq: "Dúvidas",
    navPrivacy: "Privacidade",
    navTerms: "Termos",
    footPartners: "Para provedores e revendas",
    tm: "Samsung é marca da Samsung Electronics Co., Ltd. LG e webOS são marcas da LG Electronics Inc. ROKU é marca e/ou marca registrada da Roku, Inc. nos Estados Unidos e em outros países. Android é marca da Google LLC. Apple, Mac, macOS, iPhone, iPad, Apple TV e App Store são marcas da Apple Inc., registradas nos Estados Unidos e em outros países e regiões. Windows é marca do grupo de empresas Microsoft. O LIBEROU PLAYER é um app independente, sem vínculo, patrocínio ou endosso dessas empresas.",
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
}
/* a escolha de idioma e a mesma das outras paginas */
function chooseLang(next) {
  applyLang(next);
  try { localStorage.setItem("liberou-lang", next); } catch (e) {}
}

document.documentElement.className += " js";
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
