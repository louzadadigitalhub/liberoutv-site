// Página /pagos (só do dono): quem pagou a taxa do novo acesso. A chave vem depois do # no link (/pagos#k=...), então não
// passa pelo servidor do site. Botão de WhatsApp para chamar o cliente e "marcar como enviado" depois de mandar o login novo.
(() => {
  const API = 'https://dlijnfrsynqjsulenigp.supabase.co/functions/v1/migracao';
  const $ = (s) => document.querySelector(s);
  const chave = new URLSearchParams(location.hash.slice(1)).get('k') || '';
  let dados = [], filtro = 'enviar';

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
    if (!chave) { $('#lista').innerHTML = '<p class="aviso">Abra pelo link com a chave (…/pagos#k=…).</p>'; return; }
    try {
      const r = await fetch(`${API}?acao=pagos&k=${encodeURIComponent(chave)}`, { cache: 'no-store' });
      if (r.status === 401) { $('#lista').innerHTML = '<p class="aviso">Chave inválida.</p>'; return; }
      dados = await r.json();
      $('#quando').textContent = 'atualizado ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      desenhar();
    } catch { $('#quando').textContent = 'sem conexão, tentando de novo…'; }
  };

  document.querySelectorAll('.abas button').forEach((b) => b.addEventListener('click', () => {
    filtro = b.dataset.f; document.querySelectorAll('.abas button').forEach((x) => x.classList.toggle('on', x === b)); desenhar();
  }));
  $('#lista').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-marcar]'); if (!b) return;
    const item = b.closest('[data-id]'); const x = dados.find((d) => d.id === item.dataset.id); if (!x) return;
    b.disabled = true;
    const r = await fetch(`${API}?acao=atendido&k=${encodeURIComponent(chave)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: x.id, atendido: !x.atendido }) });
    if (r.ok) { x.atendido = !x.atendido; desenhar(); } else b.disabled = false;
  });
  carregar();
  setInterval(() => { if (!document.hidden) carregar(); }, 20000);
})();
