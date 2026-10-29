// ===== GERENCIAMENTO DO CARRINHO, CEP & CHECKOUT (USER STORY H003) =====

let freteSelecionadoVal = 0;
let freteSelecionadoNome = '';

function formatMoeda(val) {
  return Number(val).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Renderiza a visualização do carrinho de compras
function renderCarrinho() {
  const container = document.getElementById('itensCarrinhoContainer');
  if (!container) return;

  const itensCarrinho = store.getCarrinho();
  const cartCountEl = document.getElementById('cartCount');
  
  // Atualiza contador do topo
  const totalItensCount = itensCarrinho.reduce((acc, item) => acc + item.qtd, 0);
  if (cartCountEl) cartCountEl.textContent = totalItensCount;

  if (itensCarrinho.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 40px 20px;">
        <div style="font-size: 64px; margin-bottom: 12px;">🛒</div>
        <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 8px;">Seu carrinho está vazio</h3>
        <p style="font-size: 14px; color: var(--texto-sec); margin-bottom: 20px;">Navegue pelos produtos e adicione seus itens favoritos!</p>
        <button class="btn btn-primary" onclick="navigateTo('page-home')">Ir para a Loja</button>
      </div>
    `;
    if (typeof store.limparFrete === 'function') store.limparFrete();
    freteSelecionadoVal = 0;
    freteSelecionadoNome = '';
    atualizarResumoValores(0, 0, 0, null);
    return;
  }

  let html = '';
  let subtotalGeral = 0;

  itensCarrinho.forEach(item => {
    const p = store.getProdutoById(item.id);
    if (!p) return;

    const itemSubtotal = p.preco * item.qtd;
    subtotalGeral += itemSubtotal;

    html += `
      <div class="item-carrinho">
        <div class="item-info">
          <div class="item-thumb">${htmlImagemProduto(p)}</div>
          <div class="item-detalhes">
            <h4>${p.nome}</h4>
            <span class="item-cat-tag">Categoria: ${p.cat}</span>
            <div class="item-preco-unit">${formatMoeda(p.preco)} cada</div>
          </div>
        </div>
        
        <div class="qtd-control">
          <button class="qtd-btn" onclick="alterarQuantidade(${p.id}, -1)">-</button>
          <input class="qtd-val" type="text" value="${item.qtd}" readonly>
          <button class="qtd-btn" onclick="alterarQuantidade(${p.id}, 1)">+</button>
        </div>

        <div class="item-subtotal">
          <div class="item-subtotal-val">${formatMoeda(itemSubtotal)}</div>
        </div>

        <button class="btn-remove" title="Remover item" onclick="removerItemCarrinho(${p.id})">🗑️</button>
      </div>
    `;
  });

  container.innerHTML = html;
  sincronizarFreteNoCarrinho();
  calcularEEstipularValores();
}

function alterarQuantidade(produtoId, delta) {
  const res = store.atualizarQtdCarrinho(produtoId, delta);
  if (res && !res.success) {
    showToast(res.msg, 'error');
  }
  renderCarrinho();
  renderCheckoutSummary();
}

function removerItemCarrinho(produtoId) {
  store.removerDoCarrinho(produtoId);
  showToast('Item removido do carrinho.', 'success');
  renderCarrinho();
  renderCheckoutSummary();
}

// Helper genérico para cálculo seguro de descontos de cupons
function calcularDescontoCupom(subtotal, itensCarrinho, freteVal) {
  const cupom = store.getCupomAplicado();
  let descontoVal = 0;
  let freteFinal = Number(freteVal) || 0;

  if (!cupom) {
    return { desconto: 0, frete: freteFinal, cupom: null };
  }

  if (cupom.freteGratis) {
    freteFinal = 0;
  }

  if (cupom.valorFixo) {
    descontoVal = Number(cupom.valorFixo) || 0;
  } else if (cupom.porcentagem) {
    const pct = Number(cupom.porcentagem) || 0;
    if (!cupom.categoria && !cupom.produtos) {
      descontoVal = (subtotal * pct) / 100;
    } else if (cupom.categoria) {
      itensCarrinho.forEach(item => {
        const p = store.getProdutoById(item.id);
        if (p && cupom.categoria.includes(p.cat)) {
          descontoVal += ((p.preco * item.qtd) * pct) / 100;
        }
      });
    } else if (cupom.produtos) {
      itensCarrinho.forEach(item => {
        const p = store.getProdutoById(item.id);
        if (p && cupom.produtos.includes(p.nome)) {
          descontoVal += ((p.preco * item.qtd) * pct) / 100;
        }
      });
    }
  }

  return {
    desconto: isNaN(descontoVal) ? 0 : descontoVal,
    frete: freteFinal,
    cupom
  };
}

// Lógica de cálculo de cupons por categoria, produtos e subtotais
function calcularEEstipularValores() {
  const itensCarrinho = store.getCarrinho();
  let subtotal = 0;
  
  itensCarrinho.forEach(item => {
    const p = store.getProdutoById(item.id);
    if (p) subtotal += p.preco * item.qtd;
  });

  const res = calcularDescontoCupom(subtotal, itensCarrinho, freteSelecionadoVal);
  atualizarResumoValores(subtotal, res.desconto, res.frete, res.cupom);
}

function atualizarResumoValores(subtotal, desconto, frete, cupom) {
  const qtdItensEl = document.getElementById('qtdItens');
  const subtotalEl = document.getElementById('subtotal');
  const pesoEl = document.getElementById('pesoTotalCarrinho');
  const descontoEl = document.getElementById('valorDesconto');
  const freteEl = document.getElementById('valorFreteCarrinho');
  const totalEl = document.getElementById('totalCarrinho');
  const cupomTagEl = document.getElementById('cupomAplicadoBox');

  const itensCarrinho = store.getCarrinho();
  const totalQtd = itensCarrinho.reduce((acc, i) => acc + i.qtd, 0);

  const subVal = Number(subtotal) || 0;
  const descVal = Number(desconto) || 0;
  const freteVal = Number(frete) || 0;
  const pesoKg = typeof store.calcularPesoCarrinho === 'function' ? store.calcularPesoCarrinho() : 0.5;

  if (qtdItensEl) qtdItensEl.textContent = totalQtd;
  if (subtotalEl) subtotalEl.textContent = formatMoeda(subVal);
  if (pesoEl) pesoEl.textContent = pesoKg.toFixed(1).replace('.', ',') + ' kg';

  if (descontoEl) {
    descontoEl.textContent = `- ${formatMoeda(descVal)}`;
    descontoEl.parentElement.style.display = descVal > 0 ? 'flex' : 'none';
  }

  const freteAtual = typeof store.getFreteSelecionado === 'function' ? store.getFreteSelecionado() : null;
  const freteNome = (freteAtual && freteAtual.nome) || freteSelecionadoNome;

  if (freteEl) {
    if (freteVal === 0 && (freteNome || (cupom && cupom.freteGratis) || subVal >= 199)) {
      freteEl.textContent = '🎉 Frete Grátis' + (freteNome ? ` (${freteNome})` : '');
    } else if (freteVal > 0) {
      freteEl.textContent = `${formatMoeda(freteVal)}${freteNome ? ' (' + freteNome + ')' : ''}`;
    } else {
      freteEl.textContent = 'A calcular';
    }
  }

  const totalFinal = Math.max(0, subVal - descVal + freteVal);
  if (totalEl) totalEl.textContent = formatMoeda(totalFinal);

  if (cupomTagEl) {
    if (cupom) {
      cupomTagEl.style.display = 'block';
      cupomTagEl.innerHTML = `
        <div class="cupom-aplicado-tag">
          <span>🏷️ Cupom <b>${cupom.codigo}</b> (${cupom.desc})</span>
          <button style="background:none;border:none;cursor:pointer;color:var(--vermelho);font-weight:800;" onclick="removerCupom()">✕</button>
        </div>
      `;
    } else {
      cupomTagEl.style.display = 'none';
      cupomTagEl.innerHTML = '';
    }
  }
}

function aplicarCupomDigitado() {
  const input = document.getElementById('inputCupom');
  if (!input || !input.value.trim()) {
    showToast('Digite um código de cupom!', 'error');
    return;
  }

  const res = store.aplicarCupom(input.value);
  if (res.success) {
    showToast(res.msg, 'success');
    input.value = '';
  } else {
    showToast(res.msg, 'error');
  }
  renderCarrinho();
}

function removerCupom() {
  store.removerCupom();
  showToast('Cupom removido.', 'success');
  renderCarrinho();
}

// MÁSCARAS DE INPUT PARA CPF, TELEFONE E CEP
function aplicarMascaraCPF(val) {
  const d = String(val || '').replace(/\D/g, '').slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function aplicarMascaraTelefone(val) {
  const d = String(val || '').replace(/\D/g, '').slice(0, 11);
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }
  return d.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
}

function aplicarMascaraCEP(val) {
  const d = String(val || '').replace(/\D/g, '').slice(0, 8);
  return d.replace(/(\d{5})(\d)/, '$1-$2');
}

function setupInputMasks() {
  const cpfInputs = ['clientCPF', 'cadCPF'];
  const phoneInputs = ['clientTelefone', 'cadTelefone'];
  const cepInputs = ['cepFrete', 'cepCarrinho', 'cepModalProduto'];

  cpfInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => e.target.value = aplicarMascaraCPF(e.target.value));
  });

  phoneInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => e.target.value = aplicarMascaraTelefone(e.target.value));
  });

  cepInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', e => e.target.value = aplicarMascaraCEP(e.target.value));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupInputMasks();
});

// ===== CÁLCULO E SINCRONIZAÇÃO DE FRETE NO CARRINHO (H004) =====
function sincronizarFreteNoCarrinho() {
  if (typeof FreteLogistica === 'undefined' || typeof store === 'undefined') return;

  const cotacao = store.getFreteCotacao();
  const freteAtual = store.getFreteSelecionado();
  const inputCep = document.getElementById('cepCarrinho');
  const msgEl = document.getElementById('msgFreteCarrinho');
  const opcoesBox = document.getElementById('opcoesFreteCarrinho');

  if (cotacao && cotacao.sucesso) {
    if (inputCep && !inputCep.value) inputCep.value = cotacao.cep;
    if (opcoesBox && cotacao.opcoes) {
      const selId = freteAtual ? freteAtual.id : (cotacao.opcoes.length > 0 ? cotacao.opcoes[0].id : null);
      opcoesBox.innerHTML = FreteLogistica.gerarHtmlOpcoes(cotacao, selId, 'selecionarOpcaoFreteCarrinho');
      opcoesBox.style.display = 'block';

      if (msgEl) {
        const end = cotacao.endereco;
        const localTxt = (end && end.cidade) ? `${end.cidade} - ${end.uf}` : cotacao.regiao;
        const ruaTxt = (end && end.logradouro) ? `${end.logradouro}${end.bairro ? ', ' + end.bairro : ''} · ` : '';
        msgEl.innerHTML = `
          ✅ Entrega para: <b>${cotacao.cep}</b> (${localTxt})<br>
          <small style="opacity:0.9;">${ruaTxt}Distância aprox.: ~${cotacao.distanciaKm} km | Peso: ${cotacao.pesoFormatado}</small>
          ${cotacao.elegivelFreteGratis ? `<div style="color:var(--verde); font-weight:800; margin-top:4px;">🎉 Parabéns! Pedido qualificado para FRETE GRÁTIS no PAC!</div>` : ''}
        `;
        msgEl.className = 'msg-frete sucesso';
      }
    }

    if (freteAtual) {
      freteSelecionadoVal = freteAtual.valor;
      freteSelecionadoNome = freteAtual.nome;
    }
  }
}

async function calcularFreteCarrinho() {
  if (typeof FreteLogistica === 'undefined') {
    showToast('Módulo de frete não carregado.', 'error');
    return;
  }

  const input = document.getElementById('cepCarrinho');
  const msgEl = document.getElementById('msgFreteCarrinho');
  const opcoesBox = document.getElementById('opcoesFreteCarrinho');
  if (!input) return;

  const cepLimpo = FreteLogistica.limparCEP(input.value);
  if (cepLimpo.length !== 8) {
    if (msgEl) {
      msgEl.innerHTML = '❌ CEP inválido. Digite os 8 dígitos (ex.: 01001-000).';
      msgEl.className = 'msg-frete erro';
    }
    if (opcoesBox) opcoesBox.style.display = 'none';
    return;
  }

  if (msgEl) {
    msgEl.innerHTML = '⏳ Calculando frete e prazos para sua residência...';
    msgEl.className = 'msg-frete aviso';
  }

  const itens = store.getCarrinho();
  let subtotal = 0;
  itens.forEach(i => {
    const p = store.getProdutoById(i.id);
    if (p) subtotal += p.preco * i.qtd;
  });
  const pesoKg = store.calcularPesoCarrinho();
  const cupom = store.getCupomAplicado();

  const cotacao = await FreteLogistica.calcularCotacao({
    cep: cepLimpo,
    pesoKg,
    subtotal,
    cupom
  });

  if (!cotacao.sucesso) {
    if (msgEl) {
      msgEl.innerHTML = `❌ ${cotacao.msg}`;
      msgEl.className = 'msg-frete erro';
    }
    if (opcoesBox) opcoesBox.style.display = 'none';
    return;
  }

  store.saveFreteCotacao(cotacao);

  const end = cotacao.endereco;
  const localTxt = (end && end.cidade) ? `${end.cidade} - ${end.uf}` : cotacao.regiao;
  const ruaTxt = (end && end.logradouro) ? `${end.logradouro}${end.bairro ? ', ' + end.bairro : ''} · ` : '';

  if (msgEl) {
    msgEl.innerHTML = `
      ✅ Entrega para: <b>${cotacao.cep}</b> (${localTxt})<br>
      <small style="opacity:0.9;">${ruaTxt}Distância aprox.: ~${cotacao.distanciaKm} km | Peso: ${cotacao.pesoFormatado}</small>
      ${cotacao.elegivelFreteGratis ? `<div style="color:var(--verde); font-weight:800; margin-top:4px;">🎉 Parabéns! Pedido qualificado para FRETE GRÁTIS no PAC!</div>` : ''}
    `;
    msgEl.className = 'msg-frete sucesso';
  }

  let optPadrao = cotacao.opcoes.find(o => o.isGratis) || cotacao.opcoes[0];
  const selecionadoId = optPadrao ? optPadrao.id : null;

  if (opcoesBox) {
    opcoesBox.innerHTML = FreteLogistica.gerarHtmlOpcoes(cotacao, selecionadoId, 'selecionarOpcaoFreteCarrinho');
    opcoesBox.style.display = 'block';
  }

  if (optPadrao) {
    store.saveFreteSelecionado(optPadrao);
    freteSelecionadoVal = optPadrao.valor;
    freteSelecionadoNome = optPadrao.nome;
  }

  const cepCheckout = document.getElementById('cepFrete');
  if (cepCheckout) cepCheckout.value = cotacao.cep;

  calcularEEstipularValores();
  showToast(`Opções de frete calculadas para ${localTxt}.`, 'success');
}

function selecionarOpcaoFreteCarrinho(id, valor, elemento) {
  const cotacao = store.getFreteCotacao();
  const optObj = cotacao && cotacao.opcoes ? cotacao.opcoes.find(o => o.id === id) : { id, nome: id.toUpperCase(), valor };

  freteSelecionadoVal = Number(valor) || 0;
  freteSelecionadoNome = optObj ? optObj.nome : id;
  store.saveFreteSelecionado(optObj);

  document.querySelectorAll('#opcoesFreteCarrinho .opcao').forEach(el => el.classList.remove('selecionada'));
  if (elemento) {
    elemento.classList.add('selecionada');
    const radio = elemento.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
  }

  calcularEEstipularValores();
  showToast(`Frete ${freteSelecionadoNome} selecionado: ${formatMoeda(freteSelecionadoVal)}`, 'success');
}

// ===== SIMULADOR DE FRETE NO MODAL DO PRODUTO =====
async function calcularFreteProdutoModal() {
  if (typeof FreteLogistica === 'undefined') return;

  const produtoId = typeof produtoDetalhesAtualId !== 'undefined' ? produtoDetalhesAtualId : null;
  const p = produtoId ? store.getProdutoById(produtoId) : null;
  const input = document.getElementById('cepModalProduto');
  const resContainer = document.getElementById('resultadoFreteModalProduto');
  if (!input || !resContainer) return;

  const cepLimpo = FreteLogistica.limparCEP(input.value);
  if (cepLimpo.length !== 8) {
    resContainer.innerHTML = '<div class="msg-frete erro">❌ Digite um CEP válido com 8 dígitos (ex: 01001-000).</div>';
    return;
  }

  resContainer.innerHTML = '<div class="msg-frete aviso">⏳ Consultando frete e prazos para este produto...</div>';

  const precoProd = p ? p.preco : 100;
  const pesoKg = p ? store.obterPesoProduto(p) : 0.5;

  const cotacao = await FreteLogistica.calcularCotacao({
    cep: cepLimpo,
    pesoKg: pesoKg,
    subtotal: precoProd
  });

  if (!cotacao.sucesso) {
    resContainer.innerHTML = `<div class="msg-frete erro">❌ ${cotacao.msg}</div>`;
    return;
  }

  const end = cotacao.endereco;
  const localTxt = (end && end.cidade) ? `${end.cidade} - ${end.uf}` : cotacao.regiao;

  let htmlOpcoes = cotacao.opcoes.map(opt => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 12px; background:#fff; border:1.5px solid var(--cinza-borda); border-radius:10px; margin-bottom:6px; font-size:12px;">
      <div>
        <div style="font-weight:800; color:var(--azul-principal);">${opt.nome} ${opt.badge ? `<span class="badge ${opt.isGratis ? 'badge-gratis' : ''}" style="font-size:9px; padding:2px 6px;">${opt.badge}</span>` : ''}</div>
        <div style="color:var(--texto-secundario); font-size:11px;">⏱️ ${opt.prazo}</div>
      </div>
      <div style="font-weight:900; font-size:14px; color:${opt.isGratis ? 'var(--verde)' : 'var(--laranja-principal)'};">${opt.valorFormatado}</div>
    </div>
  `).join('');

  resContainer.innerHTML = `
    <div class="msg-frete sucesso" style="font-size:12px; padding:10px 12px; margin-bottom:8px;">
      📍 Entrega para <b>${cotacao.cep}</b> (${localTxt})<br>
      <small style="opacity:0.9;">Peso unitário estimado: ${cotacao.pesoFormatado} | Distância aprox.: ~${cotacao.distanciaKm} km</small>
    </div>
    <div style="margin-top:8px;">
      ${htmlOpcoes}
    </div>
  `;
}

// ===== BUSCA DE CEP E CÁLCULO DE FRETE NO CHECKOUT =====
async function consultarCEP() {
  if (typeof FreteLogistica === 'undefined') return;

  const input = document.getElementById('cepFrete');
  if (!input) return;

  const clean = FreteLogistica.limparCEP(input.value);
  if (clean.length !== 8) {
    showToast('CEP inválido! Digite os 8 dígitos (ex.: 01001-000).', 'error');
    return;
  }

  showToast('Consultando endereço e calculando frete...', 'info');

  const itens = store.getCarrinho();
  let subtotal = 0;
  itens.forEach(i => {
    const p = store.getProdutoById(i.id);
    if (p) subtotal += p.preco * i.qtd;
  });
  const pesoKg = store.calcularPesoCarrinho();
  const cupom = store.getCupomAplicado();

  const cotacao = await FreteLogistica.calcularCotacao({
    cep: clean,
    pesoKg,
    subtotal,
    cupom
  });

  if (!cotacao.sucesso) {
    showToast(cotacao.msg, 'error');
    return;
  }

  store.saveFreteCotacao(cotacao);

  if (cotacao.endereco) {
    const ruaInput = document.getElementById('checkoutRua');
    const bairroInput = document.getElementById('checkoutBairro');
    const cidadeInput = document.getElementById('checkoutCidade');
    const ufInput = document.getElementById('checkoutUF');

    if (ruaInput) ruaInput.value = cotacao.endereco.logradouro || '';
    if (bairroInput) bairroInput.value = cotacao.endereco.bairro || '';
    if (cidadeInput) cidadeInput.value = cotacao.endereco.cidade || '';
    if (ufInput) ufInput.value = cotacao.endereco.uf || '';
  }

  showToast(`Endereço localizado: ${cotacao.endereco.cidade} - ${cotacao.endereco.uf}`, 'success');

  const freteAtual = store.getFreteSelecionado();
  const selId = freteAtual ? freteAtual.id : (cotacao.opcoes.length > 0 ? cotacao.opcoes[0].id : null);
  renderOpcoesFreteCheckout(cotacao, selId);
}

function sincronizarFreteNoCheckout() {
  const cepCheckout = document.getElementById('cepFrete');
  const cotacao = store.getFreteCotacao();
  const freteSelecionado = store.getFreteSelecionado();

  const user = store.getCurrentUser();
  if (user) {
    const nomeInput = document.getElementById('clientNome');
    const emailInput = document.getElementById('clientEmail');
    const cpfInput = document.getElementById('clientCPF');
    const telInput = document.getElementById('clientTelefone');
    if (nomeInput && !nomeInput.value) nomeInput.value = user.name || '';
    if (emailInput && !emailInput.value) emailInput.value = user.email || '';
    if (cpfInput && !cpfInput.value) cpfInput.value = user.cpf || '';
    if (telInput && !telInput.value) telInput.value = user.telefone || '';
  }

  if (cotacao && cotacao.cep) {
    if (cepCheckout && !cepCheckout.value) {
      cepCheckout.value = cotacao.cep;
    }
    const ruaInput = document.getElementById('checkoutRua');
    const bairroInput = document.getElementById('checkoutBairro');
    const cidadeInput = document.getElementById('checkoutCidade');
    const ufInput = document.getElementById('checkoutUF');

    if (cotacao.endereco) {
      if (ruaInput && !ruaInput.value) ruaInput.value = cotacao.endereco.logradouro || '';
      if (bairroInput && !bairroInput.value) bairroInput.value = cotacao.endereco.bairro || '';
      if (cidadeInput && !cidadeInput.value) cidadeInput.value = cotacao.endereco.cidade || '';
      if (ufInput && !ufInput.value) ufInput.value = cotacao.endereco.uf || '';
    }

    renderOpcoesFreteCheckout(cotacao, freteSelecionado ? freteSelecionado.id : null);
  }
}

function renderOpcoesFreteCheckout(cotacao, selecionadoId) {
  const container = document.getElementById('opcoesFrete');
  if (!container || !cotacao || !cotacao.opcoes) return;

  container.style.display = 'block';

  let htmlCards = cotacao.opcoes.map(opcao => {
    const isSelected = opcao.id === selecionadoId;
    const iconMap = {
      sedex: '⚡',
      pac: '📦',
      jmexp: '🚀',
      retirada: '🏪'
    };
    const icon = iconMap[opcao.id] || '🚚';

    return `
      <div class="opcao-card ${isSelected ? 'selected' : ''}" onclick="selecionarOpcaoFreteCheckout('${opcao.id}', ${opcao.valor}, this)">
        <div style="font-size:18px;">${icon}</div>
        <div class="title">${opcao.nome}</div>
        ${opcao.badge ? `<div style="margin:2px 0;"><span class="badge ${opcao.isGratis ? 'badge-gratis' : ''}" style="font-size:9px; padding:2px 6px;">${opcao.badge}</span></div>` : ''}
        <small style="color:var(--texto-secundario);">${opcao.prazo}</small>
        <div style="font-weight:900; color:${opcao.isGratis ? 'var(--verde)' : 'var(--laranja-principal)'}; margin-top:4px;">${opcao.valorFormatado}</div>
      </div>
    `;
  }).join('');

  const end = cotacao.endereco;
  const localTxt = (end && end.cidade) ? `${end.cidade}/${end.uf}` : cotacao.regiao;

  container.innerHTML = `
    <label style="font-size: 13px; font-weight: 800; color:var(--azul-principal); display: block; margin-bottom: 10px;">
      🚚 Modalidade de Frete para ${cotacao.cep} (${localTxt}):
    </label>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
      ${htmlCards}
    </div>
  `;

  if (selecionadoId) {
    const optObj = cotacao.opcoes.find(o => o.id === selecionadoId);
    if (optObj) {
      freteSelecionadoVal = optObj.valor;
      freteSelecionadoNome = optObj.nome;
      store.saveFreteSelecionado(optObj);
    }
  }

  const subtotalEl = document.getElementById('checkoutSubtotal');
  const descontoEl = document.getElementById('checkoutDesconto');
  const freteEl = document.getElementById('checkoutFrete');
  const totalEl = document.getElementById('checkoutTotal');

  const itensCarrinho = store.getCarrinho();
  let subtotal = 0;
  itensCarrinho.forEach(item => {
    const p = store.getProdutoById(item.id);
    if (p) subtotal += p.preco * item.qtd;
  });
  const res = calcularDescontoCupom(subtotal, itensCarrinho, freteSelecionadoVal);

  if (subtotalEl) subtotalEl.textContent = formatMoeda(subtotal);
  if (freteEl) freteEl.textContent = res.frete === 0 && (freteSelecionadoNome || (res.cupom && res.cupom.freteGratis) || subtotal >= 199) ? '🎉 Grátis' : (res.frete > 0 ? formatMoeda(res.frete) : 'A calcular');
  if (totalEl) totalEl.textContent = formatMoeda(Math.max(0, subtotal - res.desconto + res.frete));
}

function selecionarOpcaoFreteCheckout(id, valor, elemento) {
  const cotacao = store.getFreteCotacao();
  const optObj = cotacao && cotacao.opcoes ? cotacao.opcoes.find(o => o.id === id) : { id, nome: id.toUpperCase(), valor };

  freteSelecionadoNome = optObj ? optObj.nome : id;
  freteSelecionadoVal = Number(valor) || 0;
  store.saveFreteSelecionado(optObj);

  document.querySelectorAll('#opcoesFrete .opcao-card').forEach(o => o.classList.remove('selected'));
  if (elemento) elemento.classList.add('selected');

  renderCarrinho();
  renderCheckoutSummary();
  showToast(`Opção de frete ${freteSelecionadoNome} selecionada.`, 'success');
}

function selecionarOpcaoFrete(nome, valor, el) {
  selecionarOpcaoFreteCheckout(nome.toLowerCase(), valor, el);
}

// CHECKOUT SUMMARY
function renderCheckoutSummary() {
  const container = document.getElementById('itensCheckoutContainer');
  if (!container) return;

  sincronizarFreteNoCheckout();

  const itensCarrinho = store.getCarrinho();
  let subtotal = 0;
  let html = '';

  itensCarrinho.forEach(item => {
    const p = store.getProdutoById(item.id);
    if (!p) return;

    const itemSub = p.preco * item.qtd;
    subtotal += itemSub;

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px;">
        <div><b>${item.qtd}x</b> ${p.nome}</div>
        <div style="font-weight:700;">${formatMoeda(itemSub)}</div>
      </div>
    `;
  });

  container.innerHTML = html;

  const res = calcularDescontoCupom(subtotal, itensCarrinho, freteSelecionadoVal);

  const subtotalEl = document.getElementById('checkoutSubtotal');
  const descontoEl = document.getElementById('checkoutDesconto');
  const freteEl = document.getElementById('checkoutFrete');
  const totalEl = document.getElementById('checkoutTotal');

  if (subtotalEl) subtotalEl.textContent = formatMoeda(subtotal);
  if (descontoEl) {
    descontoEl.textContent = `- ${formatMoeda(res.desconto)}`;
    descontoEl.parentElement.style.display = res.desconto > 0 ? 'flex' : 'none';
  }

  const freteAtual = store.getFreteSelecionado();
  const freteNome = (freteAtual && freteAtual.nome) || freteSelecionadoNome;

  if (freteEl) {
    if (res.frete === 0 && (freteNome || (res.cupom && res.cupom.freteGratis) || subtotal >= 199)) {
      freteEl.textContent = '🎉 Grátis' + (freteNome ? ` (${freteNome})` : '');
    } else if (res.frete > 0) {
      freteEl.textContent = `${formatMoeda(res.frete)}${freteNome ? ' (' + freteNome + ')' : ''}`;
    } else {
      freteEl.textContent = 'A calcular';
    }
  }

  const total = Math.max(0, subtotal - res.desconto + res.frete);
  if (totalEl) totalEl.textContent = formatMoeda(total);
}

// Seleção de Pagamento no Checkout
let metodoPagamentoSelecionado = 'pix';

function selecionarFormaPagamento(metodo) {
  metodoPagamentoSelecionado = metodo;

  document.querySelectorAll('.opcoes-pag .opcao-card').forEach(c => c.classList.remove('selected'));
  const targetCard = document.getElementById(`opt-pag-${metodo}`);
  if (targetCard) targetCard.classList.add('selected');

  document.getElementById('pag-detalhe-pix').style.display = metodo === 'pix' ? 'block' : 'none';
  document.getElementById('pag-detalhe-cartao').style.display = metodo === 'cartao' ? 'block' : 'none';
  document.getElementById('pag-detalhe-boleto').style.display = metodo === 'boleto' ? 'block' : 'none';
}

// CONFIRMAÇÃO DO PEDIDO
function confirmarPedidoCheckout() {
  const itens = store.getCarrinho();
  if (itens.length === 0) {
    showToast('Adicione produtos ao carrinho antes de finalizar!', 'error');
    return;
  }

  const nome = document.getElementById('clientNome')?.value || 'Cliente JM Variedades';
  const email = document.getElementById('clientEmail')?.value || 'cliente@exemplo.com';
  const cpf = document.getElementById('clientCPF')?.value || '000.000.000-00';
  const telefone = document.getElementById('clientTelefone')?.value || '(11) 99999-8888';

  const rua = document.getElementById('checkoutRua')?.value || 'Av. Paulista';
  const numero = document.getElementById('checkoutNumero')?.value || '1000';
  const bairro = document.getElementById('checkoutBairro')?.value || 'Bela Vista';
  const cidade = document.getElementById('checkoutCidade')?.value || 'São Paulo';
  const uf = document.getElementById('checkoutUF')?.value || 'SP';
  const cep = document.getElementById('cepFrete')?.value || '01310-100';

  let subtotal = 0;
  itens.forEach(item => {
    const p = store.getProdutoById(item.id);
    if (p) subtotal += p.preco * item.qtd;
  });

  const res = calcularDescontoCupom(subtotal, itens, freteSelecionadoVal);
  const total = Math.max(0, subtotal - res.desconto + res.frete);

  const dadosCheckout = {
    cliente: { nome, email, cpf, telefone },
    endereco: { rua, numero, bairro, cidade, uf, cep },
    subtotal,
    desconto: res.desconto,
    cupomCodigo: res.cupom ? res.cupom.codigo : null,
    frete: res.frete,
    total,
    metodoPagamento: metodoPagamentoSelecionado
  };

  const resultadoPedido = store.finalizarPedido(dadosCheckout);
  if (!resultadoPedido.success) {
    showToast(resultadoPedido.msg, 'error');
    return;
  }

  // Sucesso na compra! Exibir Modal Recibo e Animação Confetti
  exibirModalConfirmação(resultadoPedido.pedido);
}

function exibirModalConfirmação(pedido) {
  const modal = document.getElementById('modalConfirmação');
  const reciboBox = document.getElementById('reciboDetalhes');

  if (!modal || !reciboBox) return;

  let itensHtml = pedido.itens.map(i => `
    <div class="recibo-linha">
      <span>${i.qtd}x ${htmlImagemProduto(store.getProdutoById(i.id) || i, '', 'img-prod-mini')} ${i.nome}</span>
      <span>${formatMoeda(i.subtotal)}</span>
    </div>
  `).join('');

  reciboBox.innerHTML = `
    <div class="recibo-linha"><strong>Código do Pedido:</strong> <span><b>${pedido.id}</b></span></div>
    <div class="recibo-linha"><strong>Data/Hora:</strong> <span>${pedido.data}</span></div>
    <div class="recibo-linha"><strong>Cliente:</strong> <span>${pedido.cliente.nome}</span></div>
    <div class="recibo-linha"><strong>Endereço de Entrega:</strong> <span>${pedido.endereco.rua}, ${pedido.endereco.numero} - ${pedido.endereco.cidade}/${pedido.endereco.uf}</span></div>
    <div class="recibo-linha"><strong>Forma de Pagamento:</strong> <span style="text-transform:uppercase; font-weight:700; color:var(--dourado-escuro);">${pedido.metodoPagamento}</span></div>
    <hr style="margin: 12px 0; border: none; border-top: 1px dashed var(--linha);">
    <div style="font-weight:700; margin-bottom:8px;">Itens Comprados:</div>
    ${itensHtml}
    <hr style="margin: 12px 0; border: none; border-top: 1px dashed var(--linha);">
    <div class="recibo-linha"><span>Subtotal:</span> <span>${formatMoeda(pedido.subtotal)}</span></div>
    ${pedido.desconto > 0 ? `<div class="recibo-linha" style="color:var(--verde);"><span>Desconto Cupom (${pedido.cupomCodigo}):</span> <span>- ${formatMoeda(pedido.desconto)}</span></div>` : ''}
    <div class="recibo-linha"><span>Frete:</span> <span>${formatMoeda(pedido.frete)}</span></div>
    <div class="recibo-linha total"><span>Total Pago:</span> <span>${formatMoeda(pedido.total)}</span></div>
  `;

  modal.classList.add('active');

  // Dispara Confetti comemorativo se a biblioteca estiver disponível
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Atualiza a visualização principal
  renderCarrinho();
}

// Fecha o recibo e volta para a página inicial da loja
// (nome sem acento para o botão do HTML não depender de caracteres especiais)
function fecharReciboEVoltar() {
  const modal = document.getElementById('modalConfirmação');
  if (modal) modal.classList.remove('active');
  try {
    navigateTo('page-home');
    // atualiza a vitrine, pois o estoque mudou com a compra
    if (typeof renderProdutosGrid === 'function') renderProdutosGrid();
  } catch (e) {
    console.error('Erro ao voltar para a loja:', e);
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const home = document.getElementById('page-home');
    if (home) home.classList.add('active');
  }
}

// Mantido por compatibilidade com o nome antigo
function fecharModalConfirmação() {
  fecharReciboEVoltar();
}

// Também fecha o recibo com a tecla Esc ou clicando fora do cartão
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('modalConfirmação');
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) fecharReciboEVoltar();
});
document.addEventListener('click', (e) => {
  const modal = document.getElementById('modalConfirmação');
  if (modal && e.target === modal) fecharReciboEVoltar();
});