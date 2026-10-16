// Página /pagar: taxa de R$ 7 do novo acesso. O cliente informa o WhatsApp, paga o PIX gerado no Asaas e, confirmado o
// pagamento (webhook), avisa no WhatsApp com o código. Guarda o pagamento no aparelho para retomar quando a pessoa volta do
// app do banco. Fala só com a função "migracao" do Supabase da Liberou TV.
(() => {
  const API = 'https://dlijnfrsynqjsulenigp.supabase.co/functions/v1/migracao';
  const ZAP = '5551933006768'; // WhatsApp da Liberou TV
  const GUARDA = 'lbtv-pagamento';
  const $ = (s) => document.querySelector(s);
  let pagamento = null; // { id, codigo, nome, telefone }
  let timer = null;

  const toast = (txt) => { const t = $('#toast'); t.textContent = txt; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 2200); };
  const passo = { inicio: -1, fone: 0, pagar: 1, pago: 2 };
  const ir = (nome) => {
    document.querySelectorAll('.tela').forEach((t) => t.classList.toggle('on', t.dataset.tela === nome));
    document.querySelectorAll('.passos i').forEach((i) => i.classList.toggle('on', Number(i.dataset.p) <= passo[nome]));
    window.scrollTo({ top: 0 });
    if (nome === 'fone') setTimeout(() => $('#numero').focus(), 250);
  };
  document.querySelectorAll('[data-ir]').forEach((b) => b.addEventListener('click', () => ir(b.dataset.ir)));

  // ---- passo 1: telefone ----
  const DICAS = { 55: 'Ex.: 11 98765-4321', 1: 'Ex.: 305 555 1234', 61: 'Ex.: 412 345 678', 64: 'Ex.: 21 123 4567', '': 'Com o código do país. Ex.: 351 912 345 678' };
  const fone = () => { const ddi = $('#ddi').value; let n = $('#numero').value.replace(/\D/g, ''); if (ddi === '61' || ddi === '64' || ddi === '44') n = n.replace(/^0/, ''); return ddi + n; };
  const valido = () => { const d = fone(); return d.length >= 10 && d.length <= 15; };
  const atualizar = () => { $('#continuar').disabled = !valido(); $('#erroFone').textContent = ''; };
  $('#ddi').addEventListener('change', () => { $('#dica').textContent = DICAS[$('#ddi').value] ?? 'DDD + número'; atualizar(); });
  $('#numero').addEventListener('input', atualizar);
  $('#numero').addEventListener('keydown', (e) => { if (e.key === 'Enter' && valido()) $('#continuar').click(); });

  $('#continuar').addEventListener('click', async () => {
    const b = $('#continuar');
    b.disabled = true; b.textContent = 'Gerando o PIX…';
    try {
      const r = await fetch(`${API}?acao=criar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telefone: fone() }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || 'Não consegui gerar o PIX.');
      pagamento = { id: d.id, codigo: d.codigo, nome: d.nome || '', telefone: fone() };
      localStorage.setItem(GUARDA, JSON.stringify(pagamento));
      if (d.status === 'pago') return mostrarPago();
      mostrarPix(d);
    } catch (e) {
      $('#erroFone').textContent = e.message || 'Algo deu errado. Tente de novo.';
    } finally { b.textContent = 'Continuar'; b.disabled = !valido(); }
  });

  // ---- passo 2: PIX ----
  const mostrarPix = (d) => {
    $('#ola').innerHTML = d.nome ? `Olá, ${d.nome.replace(/[<>&]/g, '')}! Pague <em>R$ 7</em>` : 'Pague <em>R$ 7</em>';
    $('#copiaTexto').textContent = d.copiaECola || '';
    if (d.qr) $('#qr').src = `data:image/png;base64,${d.qr}`;
    ir('pagar');
    acompanhar();
  };
  $('#copiar').addEventListener('click', async () => {
    const txt = $('#copiaTexto').textContent;
    try { await navigator.clipboard.writeText(txt); }
    catch { const t = document.createElement('textarea'); t.value = txt; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    $('#copiar').textContent = '✅ Código copiado! Abra o app do banco';
    toast('Código PIX copiado');
  });
  $('#verQr').addEventListener('click', () => { $('#qr').classList.toggle('on'); $('#verQr').textContent = $('#qr').classList.contains('on') ? 'Esconder QR Code' : 'Vai pagar com outro celular? Mostrar QR Code'; });

  // PIX ou cartão
  document.querySelectorAll('[data-forma]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-forma]').forEach((x) => x.classList.toggle('on', x === b));
    $('#formaPix').hidden = b.dataset.forma !== 'pix';
    $('#formaCartao').hidden = b.dataset.forma !== 'cartao';
  }));
  $('#pagarCartao').addEventListener('click', async () => {
    const b = $('#pagarCartao');
    b.disabled = true; b.textContent = 'Abrindo a página do cartão…'; $('#erroCartao').textContent = '';
    try {
      const r = await fetch(`${API}?acao=cartao`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: pagamento.id }) });
      const d = await r.json();
      if (d.status === 'pago') return mostrarPago();
      if (!r.ok || !d.url) throw new Error(d.erro || 'Não consegui abrir o pagamento no cartão.');
      location.href = d.url; // página segura do Asaas; ao voltar, a página retoma e confere o pagamento
    } catch (e) {
      $('#erroCartao').textContent = e.message || 'Algo deu errado. Tente de novo ou pague no PIX.';
      b.disabled = false; b.textContent = '💳 Pagar R$ 7 no cartão';
    }
  });

  const conferir = async () => {
    if (!pagamento) return;
    try {
      const r = await fetch(`${API}?acao=status&id=${encodeURIComponent(pagamento.id)}`, { cache: 'no-store' });
      const d = await r.json();
      if (d.status === 'pago') mostrarPago();
    } catch { /* sem internet agora: tenta na próxima */ }
  };
  const acompanhar = () => { clearInterval(timer); timer = setInterval(conferir, 4000); };
  $('#jaPaguei').addEventListener('click', async () => { $('#esperaTxt').textContent = 'Conferindo o pagamento…'; await conferir(); setTimeout(() => { $('#esperaTxt').textContent = 'Ainda não chegou. Pode levar alguns segundos depois de pagar.'; }, 1200); });
  // voltou do app do banco: confere na hora
  document.addEventListener('visibilitychange', () => { if (!document.hidden && pagamento) conferir(); });

  // ---- passo 3: pago ----
  const mostrarPago = () => {
    clearInterval(timer);
    $('#codigo').textContent = pagamento.codigo;
    const msg = `Olá! Paguei a taxa do novo acesso da Liberou TV ✅\nCódigo: ${pagamento.codigo}\nMeu WhatsApp: +${pagamento.telefone}`;
    $('#zap').href = `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;
    ir('pago');
  };

  // retoma um pagamento em andamento (a pessoa saiu para o app do banco e voltou)
  try {
    const salvo = JSON.parse(localStorage.getItem(GUARDA) || 'null');
    if (salvo?.id) {
      pagamento = salvo;
      fetch(`${API}?acao=status&id=${encodeURIComponent(salvo.id)}`, { cache: 'no-store' }).then((r) => r.json()).then(async (d) => {
        if (d.status === 'pago') return mostrarPago();
        if (d.status === 'pendente') {
          // busca de novo o QR (a função devolve o mesmo enquanto estiver válido)
          const r = await fetch(`${API}?acao=criar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telefone: salvo.telefone }) });
          const x = await r.json();
          if (r.ok && x.status === 'pago') { pagamento = { ...salvo, codigo: x.codigo }; return mostrarPago(); }
          if (r.ok) { pagamento = { ...salvo, id: x.id, codigo: x.codigo }; localStorage.setItem(GUARDA, JSON.stringify(pagamento)); mostrarPix(x); }
        }
      }).catch(() => {});
    }
  } catch { /* sem localStorage */ }
})();
