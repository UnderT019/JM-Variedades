// ===== ABA HISTÓRICO DO PRODUTO POR CÓDIGO DE BARRAS =====

function consultarHistoricoCodigo() {
  const input = document.getElementById('barcodeSearchInput');
  if (!input || !input.value.trim()) {
    showToast('Digite ou escaneie o código de barras para pesquisar!', 'error');
    return;
  }

  const barcodeClean = input.value.trim();
  renderTimelineHistorico(barcodeClean);
}

function consultarHistoricoCodigoDirect(barcode) {
  navigateTo('page-historico');
  const input = document.getElementById('barcodeSearchInput');
  if (input) input.value = barcode;
  renderTimelineHistorico(barcode);
}

// Simula a leitura por um scanner a laser visual
function simularLeitorLaser() {
  const scannerBox = document.getElementById('scannerLaserBox');
  const input = document.getElementById('barcodeSearchInput');

  if (scannerBox) {
    scannerBox.style.display = 'grid';
    showToast('Leitor a laser ativado... Aproxime o código!', 'success');
  }

  setTimeout(() => {
    const produtos = store.getProdutos();
    if (produtos.length > 0) {
      // Pega um código de barras de demonstração aleatório ou do primeiro item
      const itemSorteado = produtos[Math.floor(Math.random() * produtos.length)];
      if (input) input.value = itemSorteado.barcode;

      if (scannerBox) scannerBox.style.display = 'none';
      showToast(`Leitura concluída com sucesso! EAN: ${itemSorteado.barcode}`, 'success');
      renderTimelineHistorico(itemSorteado.barcode);
    }
  }, 1800);
}

function renderTimelineHistorico(barcode) {
  const container = document.getElementById('historicoResultadoContainer');
  if (!container) return;

  const produto = store.getProdutoByBarcode(barcode);
  const movimentacoes = store.getHistoricoByBarcode(barcode);

  if (!produto) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding: 40px 20px;">
        <div style="font-size: 48px; margin-bottom: 12px;">⚠️</div>
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Nenhum produto cadastrado com o código: ${barcode}</h3>
        <p style="font-size: 14px; color: var(--texto-sec);">Verifique se o código de barras foi digitado corretamente (Ex: 7891234567012).</p>
      </div>
    `;
    return;
  }

  let statusBadge = '';
  if (produto.estoque === 0) {
    statusBadge = `<span class="badge-status status-zerado">🔴 Estoque Zerado / Esgotado</span>`;
  } else if (produto.estoque <= 5) {
    statusBadge = `<span class="badge-status status-baixo">🟡 Estoque Baixo (${produto.estoque} unid.)</span>`;
  } else {
    statusBadge = `<span class="badge-status status-ok">🟢 Em Estoque (${produto.estoque} unid.)</span>`;
  }

  let timelineHtml = '';
  if (movimentacoes.length === 0) {
    timelineHtml = `<p style="color: var(--texto-sec); padding: 12px 0;">Nenhuma movimentação registrada para este código de barras ainda.</p>`;
  } else {
    timelineHtml = movimentacoes.map(m => {
      const isVenda = m.qtd < 0;
      const classTipo = isVenda ? 'venda' : 'refeita';
      const sinal = m.qtd > 0 ? `+${m.qtd}` : `${m.qtd}`;
      const corQtd = isVenda ? 'var(--vermelho)' : 'var(--verde)';

      return `
        <div class="timeline-item ${classTipo}">
          <div class="timeline-date">📅 ${m.timestamp}</div>
          <div class="timeline-title">${m.tipo} - <span style="color:${corQtd}; font-weight:900;">${sinal} unid.</span></div>
          <div class="timeline-desc">
            ${m.pedidoId ? `<b>ID do Pedido / Ref:</b> ${m.pedidoId} &nbsp;|&nbsp; ` : ''}
            <b>Saldo Resultante:</b> ${m.saldoResultante} unid.<br>
            <small style="color:var(--texto-sec);">${m.obs || ''}</small>
          </div>
        </div>
      `;
    }).join('');
  }

  container.innerHTML = `
    <div class="card" style="margin-bottom: 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
        <div style="display:flex; align-items:center; gap:16px;">
          <div style="width:72px; height:72px; background:#F8FAFC; border:1px solid var(--linha); border-radius:14px; display:grid; place-items:center; font-size:36px; overflow:hidden;">
            ${htmlImagemProduto(produto)}
          </div>
          <div>
            <h2 style="font-size:20px; font-weight:800;">${produto.nome}</h2>
            <div style="font-size:13px; color:var(--texto-sec); margin-top:2px;">
              Categoria: <b>${produto.cat}</b> &nbsp;|&nbsp; Preço: <b>${formatMoeda(produto.preco)}</b>
            </div>
            <div style="margin-top:6px; font-family:monospace; font-size:13px; color:var(--texto-sec);">
              ║▌║█║▌│║▌║▌█ Código: <b>${produto.barcode}</b>
            </div>
          </div>
        </div>
        <div>
          ${statusBadge}
        </div>
      </div>
    </div>

    <div class="card">
      <h3 style="margin-bottom:20px;">📜 Linha do Tempo e Histórico de Movimentações (EAN-13)</h3>
      <div class="timeline">
        ${timelineHtml}
      </div>
    </div>
  `;
}