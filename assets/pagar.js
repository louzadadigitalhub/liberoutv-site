// Página /pagar: taxa de R$ 7 por tela do novo acesso. O cliente informa o WhatsApp e quantas telas tem, paga no PIX (QR do Asaas) ou no cartão (link
// de pagamento do Asaas) e, confirmado o pagamento (webhook), avisa no WhatsApp com o código. O login novo é mandado à mão
// pelo dono (entrega automática ficou de fora para ninguém gerar vários acessos). Guarda o pagamento no aparelho para
// retomar quando a pessoa volta do app do banco. Fala só com a função "migracao" do Supabase do Liberou Player.
(() => {
  const API = 'https://dlijnfrsynqjsulenigp.supabase.co/functions/v1/migracao';
  const ZAP = '5551933006768'; // WhatsApp do Liberou Player
  const GUARDA = 'lbtv-pagamento';
  const $ = (s) => document.querySelector(s);
  const POR_TELA = 7, MAX_TELAS = 10;
  let pagamento = null; // { id, codigo, telefone, ddi, numero, telas, valor }
  let timer = null;
  let telas = 1;
  const plural = (n) => `${n} tela${n > 1 ? 's' : ''}`;

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
  const mostrarTelas = () => {
    $('#nTelas').textContent = telas;
    $('#total').textContent = `R$ ${POR_TELA * telas}`;
    $('#menos').disabled = telas <= 1;
    $('#mais').disabled = telas >= MAX_TELAS;
  };
  $('#menos').addEventListener('click', () => { telas = Math.max(1, telas - 1); mostrarTelas(); });
  $('#mais').addEventListener('click', () => { telas = Math.min(MAX_TELAS, telas + 1); mostrarTelas(); });

  $('#continuar').addEventListener('click', async () => {
    const b = $('#continuar');
    b.disabled = true; b.textContent = 'Preparando o pagamento…';
    try {
      const r = await fetch(`${API}?acao=criar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telefone: fone(), telas }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.erro || 'Não consegui preparar o pagamento.');
      pagamento = { id: d.id, codigo: d.codigo, telefone: fone(), ddi: $('#ddi').value, numero: $('#numero').value, telas: d.telas, valor: d.valor }; // número que já pagou: sem telas/valor (vêm do servidor)
      if (d.status === 'pago') return mostrarPago(); // número que já pagou: o servidor não devolve o código
      localStorage.setItem(GUARDA, JSON.stringify(pagamento));
      mostrarPix(d);
    } catch (e) {
      $('#erroFone').textContent = e.message || 'Algo deu errado. Tente de novo.';
    } finally { b.textContent = 'Continuar'; b.disabled = !valido(); }
  });

  // ---- passo 2: PIX ou cartão ----
  const mostrarPix = (d) => {
    const valor = Number(d.valor) || POR_TELA * (pagamento?.telas || 1);
    $('#ola').innerHTML = `Pague <em>R$ ${valor}</em>`;
    $('#resumoTelas').textContent = plural(Number(d.telas) || pagamento?.telas || 1);
    $('#valorPix').textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    $('#pagarCartao').textContent = `💳 Pagar R$ ${valor} no cartão`;
    $('#copiar').textContent = '📋 Copiar código PIX';
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
      b.disabled = false; b.textContent = `💳 Pagar R$ ${pagamento?.valor || POR_TELA} no cartão`;
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
    $('#codigo').textContent = pagamento.codigo || 'já registrado';
    const msg = `Olá! Paguei a taxa do novo acesso do Liberou Player${pagamento.telas ? ` (${plural(pagamento.telas)})` : ''} ✅\n${pagamento.codigo ? `Código: ${pagamento.codigo}\n` : ''}Meu WhatsApp: +${pagamento.telefone}`;
    $('#zap').href = `https://wa.me/${ZAP}?text=${encodeURIComponent(msg)}`;
    ir('pago');
  };

  // retoma um pagamento em andamento (a pessoa saiu para o app do banco e voltou)
  try {
    const salvo = JSON.parse(localStorage.getItem(GUARDA) || 'null');
    if (salvo?.id) {
      pagamento = salvo;
      // deixa o passo 1 preenchido, para o "trocar" as telas não pedir o número de novo
      if (salvo.ddi !== undefined) { $('#ddi').value = salvo.ddi; $('#numero').value = salvo.numero || ''; atualizar(); }
      telas = Number(salvo.telas) || 1; mostrarTelas();
      fetch(`${API}?acao=status&id=${encodeURIComponent(salvo.id)}`, { cache: 'no-store' }).then((r) => r.json()).then(async (d) => {
        if (d.status === 'pago') return mostrarPago();
        if (d.status === 'pendente') {
          // busca de novo o QR (a função devolve o mesmo enquanto estiver válido)
          const r = await fetch(`${API}?acao=criar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telefone: salvo.telefone, telas: Number(salvo.telas) || 1 }) });
          const x = await r.json();
          if (r.ok && x.status === 'pago') return mostrarPago();
          if (r.ok) { pagamento = { ...salvo, id: x.id, codigo: x.codigo, valor: x.valor || salvo.valor }; localStorage.setItem(GUARDA, JSON.stringify(pagamento)); mostrarPix(x); }
        }
      }).catch(() => {});
    }
  } catch { /* sem localStorage */ }
})();
