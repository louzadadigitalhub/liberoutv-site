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
    $('#lista').innerHTML = '';
    $('#erroEntrar').textContent = aviso;
    mostrar(false);
  };

  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const quando = (iso) => (iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');
  const fone = (d) => `+${d}`;

  const desenhar = () => {
    const pagos = dados.filter((x) => x.status === 'pago');
    $('#nPara').textContent = pagos.filter((x) => !x.atendido).length;
    $('#nPagos').textContent = pagos.length;
    $('#nValor').textContent = 'R$ ' + pagos.reduce((s, x) => s + Number(x.valor || 0), 0).toLocaleString('pt-BR');
    const lista = filtro === 'enviar' ? pagos.filter((x) => !x.atendido) : filtro === 'enviados' ? pagos.filter((x) => x.atendido) : dados.filter((x) => x.status !== 'pago');
    $('#lista').innerHTML = lista.length ? lista.map((x) => {
      const msg = x.nome ? `Olá, ${x.nome.split(' ')[0]}! Recebemos o seu pagamento (código ${x.codigo}). Seguem os seus dados novos:` : `Olá! Recebemos o seu pagamento (código ${x.codigo}). Seguem os seus dados novos:`;
      return `<div class="item ${x.atendido ? 'feito' : ''}" data-id="${esc(x.id)}">
        <div class="linha"><div><div class="nome">${esc(x.nome || 'Sem cadastro no painel')}</div>
          <div class="meta">${esc(fone(x.telefone))}${x.usuario_cinerk ? ' · ' + esc(x.usuario_cinerk) : ''}</div>
          <span class="selo ${x.status === 'pago' ? 'pago' : 'pendente'}">${x.status === 'pago' ? 'Pago' + (x.metodo ? ' no ' + esc(x.metodo) : '') + ' ' + esc(quando(x.pago_em)) : 'Começou ' + esc(quando(x.criado_em))}</span></div>
          <span class="cod">${esc(x.codigo)}</span></div>
        <div class="acoes"><a href="https://wa.me/${esc(x.telefone)}?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">💬 WhatsApp</a>
          ${x.status === 'pago' ? `<button data-marcar class="${x.atendido ? 'feito' : ''}">${x.atendido ? '✓ Enviado' : 'Marcar como enviado'}</button>` : ''}</div>
      </div>`;
    }).join('') : `<p class="vazio">${filtro === 'enviar' ? 'Ninguém esperando. 🎉' : 'Nada por aqui.'}</p>`;
  };

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
