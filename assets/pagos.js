// Página /pagos (só do dono): quem pagou a taxa do novo acesso. Abre com senha: ela vai para a função "migracao", que
// confere com o hash guardado lá e devolve uma sessão de 30 dias. Aqui só fica a sessão (no aparelho), nunca senha nem
// chave. Botão de WhatsApp para chamar o cliente e "marcar como enviado" depois de mandar o login novo.
(() => {
  const API = 'https://dlijnfrsynqjsulenigp.supabase.co/functions/v1/migracao';
  const GUARDA = 'lbtv-sessao-pagos';
  const $ = (s) => document.querySelector(s);
  let dados = [], filtro = 'enviar';

  // restos do acesso antigo por link (#k=...): some da barra e do aparelho
  try { localStorage.removeItem('lbtv-chave-pagos'); } catch { /* sem localStorage */ }
  if (location.hash) history.replaceState(null, '', location.pathname);

  let sessao = (() => { try { return localStorage.getItem(GUARDA) || ''; } catch { return ''; } })();
  const valida = () => Number(sessao.split('.')[0]) > Date.now();
  const mostrar = (dentro) => {
    $('#entrar').hidden = dentro; $('#painel').hidden = !dentro; $('#sair').hidden = !dentro;
    if (!dentro) { $('#quando').textContent = ''; setTimeout(() => $('#senha').focus(), 100); }
  };
  const sair = (aviso = '') => {
    sessao = ''; dados = [];
    try { localStorage.removeItem(GUARDA); } catch { /* */ }
    $('#lista').innerHTML = ''; $('#busca').value = ''; $('#resPainel').hidden = true;
    $('#erroEntrar').textContent = aviso;
    mostrar(false);
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const quando = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  const fone = (d) => `+${d}`;
  const telasTxt = (n) => `${Number(n) || 1} tela${Number(n) > 1 ? 's' : ''}`;
  const norm = (s) => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  // primeiro e último nome de quem pagou: é o que costuma estar no painel
  const curto = (n) => { const w = String(n || '').trim().split(/\s+/); return w.length > 1 ? `${w[0]} ${w[w.length - 1]}` : w[0] || ''; };
  const bate = (x, q) => {
    const termos = norm(q).split(/\s+/).filter(Boolean), num = q.replace(/\D/g, '');
    if (num.length >= 3 && [x.telefone, x.pagador_fone].some((f) => String(f || '').includes(num))) return true;
    const alvo = norm([x.nome, x.pagador_nome, x.codigo, x.usuario_cinerk].join(' '));
    return termos.length > 0 && termos.every((t) => alvo.includes(t));
  };

  const desenhar = () => {
    const pagos = dados.filter((x) => x.status === 'pago');
    $('#nPara').textContent = pagos.filter((x) => !x.atendido).length;
    $('#nPagos').textContent = pagos.length;
    $('#nValor').textContent = 'R$ ' + pagos.reduce((s, x) => s + Number(x.valor_pago ?? x.valor ?? 0), 0).toLocaleString('pt-BR');
    const q = $('#busca').value.trim();
    // com busca: procura em tudo (pagos, enviados e quem só começou); sem busca: a aba escolhida
    const lista = q ? dados.filter((x) => bate(x, q))
      : filtro === 'enviar' ? pagos.filter((x) => !x.atendido) : filtro === 'enviados' ? pagos.filter((x) => x.atendido) : dados.filter((x) => x.status === 'pendente');
    document.querySelector('.abas').classList.toggle('apagada', !!q);
    $('#buscarPainel').hidden = !q;
    $('#lista').innerHTML = lista.length ? lista.map((x) => {
      const outroNome = x.pagador_nome && norm(curto(x.pagador_nome)) !== norm(curto(x.nome));
      const outroFone = x.pagador_fone && !String(x.pagador_fone).endsWith(String(x.telefone).slice(-8));
      const msg = x.nome ? `Olá, ${x.nome.split(' ')[0]}! Recebemos o seu pagamento (código ${x.codigo}). Seguem os seus dados novos:` : `Olá! Recebemos o seu pagamento (código ${x.codigo}). Seguem os seus dados novos:`;
      return `<div class="item ${x.atendido ? 'feito' : ''}" data-id="${esc(x.id)}">
        <div class="linha"><div><div class="nome">${esc(x.nome || x.pagador_nome || 'Sem cadastro no painel')}</div>
          <div class="meta">${esc(fone(x.telefone))}${x.usuario_cinerk ? ' · ' + esc(x.usuario_cinerk) : ''}</div>
          ${x.nome && outroNome ? `<div class="pagador">💳 Quem pagou: <b>${esc(x.pagador_nome)}</b></div>` : ''}
          ${!x.nome && x.status === 'pago' ? `<div class="alerta">⚠️ Telefone não achado no painel${x.pagador_nome ? ' (nome acima é de quem pagou)' : ''}</div>` : ''}
          ${outroFone ? `<div class="pagador">📱 Telefone digitado no cartão: ${esc(fone(x.pagador_fone))}</div>` : ''}
          <span class="selo ${x.status === 'pago' ? 'pago' : 'pendente'}">${x.status === 'pago' ? 'Pago' + (x.metodo ? ' no ' + esc(x.metodo) : '') + ' ' + esc(quando(x.pago_em)) : 'Começou ' + esc(quando(x.criado_em))}</span>
          <div class="telasx">${esc(telasTxt(x.telas))} · R$ ${esc(Number(x.valor_pago ?? x.valor ?? 0).toLocaleString('pt-BR'))}</div>
          ${x.telas_painel && x.telas_painel !== x.telas ? `<div class="alerta">⚠️ No painel ${x.telas_painel > (x.telas || 1) ? 'tem' : 'só tem'} ${esc(telasTxt(x.telas_painel))}</div>` : ''}</div>
          <span class="cod">${esc(x.codigo)}</span></div>
        <div class="acoes"><a href="https://wa.me/${esc(x.telefone)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 WhatsApp</a>
          ${x.status === 'pago' ? `<button data-marcar class="${x.atendido ? 'feito' : ''}">${x.atendido ? '✓ Enviado' : 'Marcar como enviado'}</button>` : ''}
          ${!x.nome && x.pagador_nome ? `<button data-procurar="${esc(curto(x.pagador_nome))}">🔎 Procurar no painel</button>` : ''}</div>
      </div>`;
    }).join('') : `<p class="vazio">${q ? 'Ninguém na lista com isso. Tente procurar no painel.' : filtro === 'enviar' ? 'Ninguém esperando. 🎉' : 'Nada por aqui.'}</p>`;
  };

  // ---- busca no painel CINERK (nome, usuário ou parte do telefone) ----
  const STATUS = { ACTIVE: 'ativo', EXPIRED: 'vencido', DISABLED: 'desativado' };
  const procurarNoPainel = async (q) => {
    const caixa = $('#resPainel');
    caixa.hidden = false;
    caixa.innerHTML = `<p class="vazio">Procurando “${esc(q)}” no painel…</p>`;
    caixa.scrollIntoView({ behavior: 'smooth', block: 'start' });
    try {
      const r = await fetch(`${API}?acao=painel&q=${encodeURIComponent(q)}`, { cache: 'no-store', headers: { 'x-sessao': sessao } });
      if (r.status === 401) return sair('A sessão não vale mais. Digite a senha de novo.');
      const contas = await r.json();
      caixa.innerHTML = `<div class="tituloPainel">No painel: “${esc(q)}” <button class="fechar" data-fechar aria-label="Fechar">✕</button></div>` + (contas.length ? contas.map((c) => `
        <div class="item conta"><div class="linha"><div><div class="nome">${esc(c.nome || '(sem nome)')}</div>
          <div class="meta">${esc(c.usuario)}${c.fone ? ' · ' + esc(fone(c.fone)) : ' · sem telefone'}</div>
          <div class="telasx">${esc(telasTxt(c.telas))} · ${esc(STATUS[c.status] || c.status.toLowerCase())}${c.vence ? ' · vence ' + esc(c.vence.split('-').reverse().join('/')) : ''}</div></div></div>
          ${c.fone ? `<div class="acoes"><a href="https://wa.me/${esc(c.fone)}" target="_blank" rel="noopener">💬 WhatsApp</a></div>` : ''}</div>`).join('')
        : '<p class="vazio">Ninguém no painel com isso. Tente só o primeiro nome ou o sobrenome.</p>');
    } catch { caixa.innerHTML = '<p class="aviso">Não consegui procurar agora. Tente de novo.</p>'; }
  };
  $('#busca').addEventListener('input', () => { $('#resPainel').hidden = true; desenhar(); });
  $('#buscarPainel').addEventListener('click', () => { const q = $('#busca').value.trim(); if (q) procurarNoPainel(q); });
  $('#resPainel').addEventListener('click', (e) => { if (e.target.closest('[data-fechar]')) $('#resPainel').hidden = true; });

  const carregar = async () => {
    if (!valida()) return sair(sessao ? 'A sessão venceu. Digite a senha de novo.' : '');
    try {
      const r = await fetch(`${API}?acao=pagos`, { cache: 'no-store', headers: { 'x-sessao': sessao } });
      if (r.status === 401) return sair('A sessão não vale mais. Digite a senha de novo.');
      dados = await r.json();
      $('#quando').textContent = 'atualizado ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      desenhar();
    } catch { $('#quando').textContent = 'sem conexão, tentando de novo…'; }
  };

  $('#formEntrar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = $('#btnEntrar');
    b.disabled = true; b.textContent = 'Conferindo…'; $('#erroEntrar').textContent = '';
    try {
      const r = await fetch(`${API}?acao=entrar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ senha: $('#senha').value }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.sessao) throw new Error(d.erro || 'Não consegui entrar. Tente de novo.');
      sessao = d.sessao;
      try { localStorage.setItem(GUARDA, sessao); } catch { /* sem localStorage: vale só enquanto a página estiver aberta */ }
      $('#senha').value = '';
      mostrar(true);
      carregar();
    } catch (err) {
      $('#erroEntrar').textContent = err.message || 'Não consegui entrar.';
      $('#senha').select();
    } finally { b.disabled = false; b.textContent = 'Entrar'; }
  });
  $('#sair').addEventListener('click', () => sair());

  document.querySelectorAll('.abas button').forEach((b) => b.addEventListener('click', () => {
    filtro = b.dataset.f; document.querySelectorAll('.abas button').forEach((x) => x.classList.toggle('on', x === b)); desenhar();
  }));
  $('#lista').addEventListener('click', async (e) => {
    const p = e.target.closest('[data-procurar]');
    if (p) { $('#busca').value = p.dataset.procurar; desenhar(); return procurarNoPainel(p.dataset.procurar); }
    const b = e.target.closest('[data-marcar]'); if (!b) return;
    const item = b.closest('[data-id]'); const x = dados.find((d) => d.id === item.dataset.id); if (!x) return;
    b.disabled = true;
    const r = await fetch(`${API}?acao=atendido`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-sessao': sessao }, body: JSON.stringify({ id: x.id, atendido: !x.atendido }) });
    if (r.status === 401) return sair('A sessão não vale mais. Digite a senha de novo.');
    if (r.ok) { x.atendido = !x.atendido; desenhar(); } else b.disabled = false;
  });

  if (valida()) { mostrar(true); carregar(); } else sair();
  setInterval(() => { if (!document.hidden && valida()) carregar(); }, 20000);
})();
