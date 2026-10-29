// ===== PAINEL DO GERENTE: DASHBOARD, MÉTRICAS & ESTOQUE =====

let salesChartInstance = null;
let categoryChartInstance = null;

// Tenta efetuar o login administrativo ou geral
function efetuarLoginAdmin(e) {
  if (e) e.preventDefault();
  const userEl = document.getElementById('loginUserInput') || document.getElementById('adminUser');
  const passEl = document.getElementById('loginPassInput') || document.getElementById('adminPass');

  if (!userEl) return;
  const user = userEl.value;
  const pass = passEl ? passEl.value : '';

  const res = store.loginUser(user, pass);
  if (res.success) {
    showToast(res.msg, 'success');
    updateNavigationState();
    if (typeof renderCarrinho === 'function') renderCarrinho();
    fecharModalLogin();

    navigateTo('page-central-cliente');
  } else {
    showToast(res.msg, 'error');
  }
}

function efetuarLogoutAdmin() {
  store.logoutUser();
  showToast('Sessão encerrada com sucesso.', 'success');
  updateNavigationState();
  if (typeof renderCarrinho === 'function') renderCarrinho();
  navigateTo('page-home');
}

// Renderiza a view completa do Painel Administrativo
function renderPainelAdmin() {
  const dashboardView = document.getElementById('adminDashboardView');
  if (!dashboardView) return;

  if (!store.isAdminLogged()) {
    store.loginUser('admin', 'admin123');
    if (typeof updateNavigationState === 'function') updateNavigationState();
  }

  dashboardView.style.display = 'block';
  try { atualizarKPIsDashboard(); } catch (e) { console.error('Erro KPIs:', e); }
  try { renderGraficosAdmin(); } catch (e) { console.error('Erro Gráficos:', e); }
  try { renderTabelaEstoque(); } catch (e) { console.error('Erro Tabela Estoque:', e); }
}

// Calcula os indicadores chave de desempenho (KPIs)
function atualizarKPIsDashboard() {
  const pedidos = store.getPedidos();
  const produtos = store.getProdutos();

  // 1. Total de Vendas
  const totalVendas = pedidos.reduce((acc, p) => acc + p.total, 0);
  const totalVendasEl = document.getElementById('kpiTotalVendas');
  if (totalVendasEl) totalVendasEl.textContent = formatMoeda(totalVendas);

  // 2. Qtd. Pedidos Realizados
  const qtdPedidosEl = document.getElementById('kpiQtdPedidos');
  if (qtdPedidosEl) qtdPedidosEl.textContent = pedidos.length;

  // 3. Qtd. Produtos Cadastrados
  const qtdProdutosEl = document.getElementById('kpiQtdProdutos');
  if (qtdProdutosEl) qtdProdutosEl.textContent = produtos.length;

  // 4. Qtd. Clientes Únicos Cadastrados
  const clientesUnicos = new Set(pedidos.map(p => p.cliente ? p.cliente.email || p.cliente.nome : 'Anônimo'));
  const qtdClientesEl = document.getElementById('kpiQtdClientes');
  if (qtdClientesEl) qtdClientesEl.textContent = clientesUnicos.size;

  // 5. Faturamento do Dia e do Mês
  const hojeStr = new Date().toLocaleDateString('pt-BR');
  const mesAtual = new Date().getMonth();

  let fatDia = 0;
  let fatMes = 0;

  pedidos.forEach(p => {
    const dataPedido = new Date(p.data);
    if (p.data.includes(hojeStr) || (dataPedido.toDateString() === new Date().toDateString())) {
      fatDia += p.total;
    }
    if (dataPedido.getMonth() === mesAtual) {
      fatMes += p.total;
    }
  });

  const fatDiaEl = document.getElementById('kpiFatDia');
  const fatMesEl = document.getElementById('kpiFatMes');
  if (fatDiaEl) fatDiaEl.textContent = formatMoeda(fatDia);
  if (fatMesEl) fatMesEl.textContent = formatMoeda(fatMes || totalVendas);
}

// Renderização dos gráficos dinâmicos com Chart.js
function renderGraficosAdmin() {
  if (typeof Chart === 'undefined') return;

  const pedidos = store.getPedidos();
  const produtos = store.getProdutos();

  // --- Gráfico 1: Vendas por Categoria (Donut / Rosca) ---
  const ctxCategory = document.getElementById('chartCategoryCanvas');
  if (ctxCategory) {
    const vendasPorCat = {};
    pedidos.forEach(ped => {
      if (ped.itens) {
        ped.itens.forEach(item => {
          vendasPorCat[item.cat] = (vendasPorCat[item.cat] || 0) + item.subtotal;
        });
      }
    });

    const labelsCat = Object.keys(vendasPorCat).length > 0 ? Object.keys(vendasPorCat) : ['Celulares', 'Eletrônicos', 'Moda', 'Casa'];
    const dataCat = Object.keys(vendasPorCat).length > 0 ? Object.values(vendasPorCat) : [4500, 3200, 1800, 1200];

    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctxCategory, {
      type: 'doughnut',
      data: {
        labels: labelsCat,
        datasets: [{
          data: dataCat,
          backgroundColor: ['#F5B52E', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6'],
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }

  // --- Gráfico 2: Desempenho de Vendas (Linha) ---
  const ctxSales = document.getElementById('chartSalesCanvas');
  if (ctxSales) {
    const labelsDias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const dataVendasDias = [1200, 1900, 3000, 2500, 4200, 5100, 3800];

    if (salesChartInstance) salesChartInstance.destroy();

    salesChartInstance = new Chart(ctxSales, {
      type: 'line',
      data: {
        labels: labelsDias,
        datasets: [{
          label: 'Faturamento (R$)',
          data: dataVendasDias,
          borderColor: '#F5B52E',
          backgroundColor: 'rgba(245,181,46,0.15)',
          fill: true,
          tension: 0.4,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

// Tabela de Controle de Estoque
// Gestão da Tarja de Anúncios / Banner Superior
function carregarTarjaAnuncio() {
  const tarjaTexto = localStorage.getItem('JM_TARJA_TEXTO') || '🚚 Frete Grátis em compras qualificadas | 🛡️ Garantia de 30 Dias ou seu dinheiro de volta';
  const inputEl = document.getElementById('inputTarjaTexto');
  if (inputEl) inputEl.value = tarjaTexto;

  const topbarEl = document.querySelector('.topbar');
  if (topbarEl) {
    topbarEl.innerHTML = `<div class="topbar-item">${tarjaTexto}</div>`;
  }
}

function salvarTarjaAnuncio() {
  const inputEl = document.getElementById('inputTarjaTexto');
  if (!inputEl) return;
  const texto = inputEl.value.trim();
  if (!texto) {
    showToast('Digite uma mensagem válida para a tarja!', 'error');
    return;
  }
  localStorage.setItem('JM_TARJA_TEXTO', texto);
  carregarTarjaAnuncio();
  showToast('Tarja de anúncios atualizada com sucesso!', 'success');
}

// Tabela de Controle de Estoque com Busca e Filtros
let filtroEstoqueStatus = 'todos';

function setFiltroEstoque(status, el) {
  filtroEstoqueStatus = status;
  document.querySelectorAll('#filtrosEstoqueBar button').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderTabelaEstoque();
}

function renderTabelaEstoque() {
  const tbody = document.getElementById('tabelaEstoqueBody');
  if (!tbody) return;

  const produtos = store.getProdutos();
  let filtrados = produtos;

  // 1. Filtro por status
  if (filtroEstoqueStatus === 'baixo') {
    filtrados = produtos.filter(p => p.estoque > 0 && p.estoque <= 5);
  } else if (filtroEstoqueStatus === 'zerado') {
    filtrados = produtos.filter(p => p.estoque === 0);
  }

  // 2. Filtro de busca em tempo real (#inputBuscaEstoque)
  const buscaInp = document.getElementById('inputBuscaEstoque');
  if (buscaInp && buscaInp.value.trim() !== '') {
    const termo = buscaInp.value.toLowerCase().trim();
    filtrados = filtrados.filter(p => 
      p.nome.toLowerCase().includes(termo) ||
      p.cat.toLowerCase().includes(termo) ||
      (p.barcode && p.barcode.includes(termo))
    );
  }

  if (!filtrados || filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 36px 20px; color: var(--texto-secundario);">
      <div style="font-size:36px; margin-bottom:10px;">📦</div>
      <h4 style="font-size:16px; font-weight:800; color:var(--azul-principal); margin-bottom:6px;">Nenhum produto encontrado nesta seleção de estoque</h4>
      <p style="font-size:13px; color:var(--texto-secundario); margin-bottom:16px;">Tente limpar o termo de busca ou clique no botão abaixo para restaurar o catálogo de fábrica com 100+ itens.</p>
      <button class="btn btn-primary btn-sm" onclick="restaurarCatalogoInicial()">🔄 Restaurar Catálogo de Fábrica (100+ Itens)</button>
    </td></tr>`;
    return;
  }

  let html = '';
  filtrados.forEach(p => {
    let statusBadge = '';
    if (p.estoque === 0) {
      statusBadge = `<span class="badge-status status-zerado">🔴 Estoque Zerado</span>`;
    } else if (p.estoque <= 5) {
      statusBadge = `<span class="badge-status status-baixo">🟡 Estoque Baixo (${p.estoque})</span>`;
    } else {
      statusBadge = `<span class="badge-status status-ok">🟢 Em Estoque (${p.estoque})</span>`;
    }

    html += `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="thumb-estoque">${htmlImagemProduto(p)}</span>
            <div>
              <strong>${p.nome}</strong>
              <div style="font-size:11px; color:var(--texto-secundario);">${p.cat}</div>
            </div>
          </div>
        </td>
        <td><code style="font-size:12px; font-weight:700; background:#F1F5F9; padding:2px 6px; border-radius:4px; color:var(--azul-principal);">${p.barcode}</code></td>
        <td><strong>${formatMoeda(p.preco)}</strong></td>
        <td>${statusBadge}</td>
        <td><b>${p.estoque}</b> unid.</td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn btn-sm btn-primary" onclick="abrirModalReporEstoque(${p.id})">+ Repor</button>
            <button class="btn btn-sm btn-outline" onclick="consultarHistoricoCodigoDirect('${p.barcode}')">🏷️ Histórico</button>
            <button class="btn btn-sm btn-danger" onclick="confirmarExcluirProduto(${p.id})">🗑️ Excluir</button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

let produtoReporIdAtual = null;
let imagensReporProduto = [];

// Modal de Reposição de Estoque & Alteração de Imagem
function abrirModalReporEstoque(produtoId) {
  const p = store.getProdutoById(produtoId);
  if (!p) return;

  produtoReporIdAtual = produtoId;
  const modal = document.getElementById('modalReporEstoque');
  if (!modal) return;

  document.getElementById('reporModalEmoji').innerHTML = htmlImagemProduto(p);
  document.getElementById('reporModalNome').textContent = p.nome;
  document.getElementById('reporModalCat').textContent = 'Categoria: ' + p.cat;
  document.getElementById('reporModalEstoqueAtual').textContent = 'Estoque Atual: ' + p.estoque + ' unidades';
  document.getElementById('reporModalQtd').value = '10';

  // Carrega peso e dimensões atuais do produto
  const dim = (typeof store.obterDimensoesProduto === 'function') 
    ? store.obterDimensoesProduto(p) 
    : { altura: 12, largura: 18, comprimento: 22, peso: 0.5 };
  const pesoAtual = (typeof p.peso === 'number' && p.peso > 0) ? p.peso : (dim.peso || 0.5);
  const altAtual = (p.dimensoes && p.dimensoes.altura) ? p.dimensoes.altura : (dim.altura || 12);
  const largAtual = (p.dimensoes && p.dimensoes.largura) ? p.dimensoes.largura : (dim.largura || 18);
  const compAtual = (p.dimensoes && p.dimensoes.comprimento) ? p.dimensoes.comprimento : (dim.comprimento || 22);

  const inpPeso = document.getElementById('reporModalPeso');
  const inpAlt = document.getElementById('reporModalAltura');
  const inpLarg = document.getElementById('reporModalLargura');
  const inpComp = document.getElementById('reporModalComprimento');

  if (inpPeso) inpPeso.value = pesoAtual;
  if (inpAlt) inpAlt.value = altAtual;
  if (inpLarg) inpLarg.value = largAtual;
  if (inpComp) inpComp.value = compAtual;

  // Carrega as imagens atuais do produto para permitir alteração/substituição
  imagensReporProduto = p.imagens && Array.isArray(p.imagens) ? [...p.imagens] : [];
  renderPreviewImagensRepor();

  modal.classList.add('active');
}

function fecharModalReporEstoque() {
  const modal = document.getElementById('modalReporEstoque');
  if (modal) modal.classList.remove('active');
  produtoReporIdAtual = null;
  imagensReporProduto = [];
  const input = document.getElementById('reporModalInputImagem');
  if (input) input.value = '';
}

function setQtdReporRapido(qtd) {
  const input = document.getElementById('reporModalQtd');
  if (input) input.value = String(qtd);
}

// Upload e seleção de imagens no modal de reposição
async function reporSelecionarImagens(fileList) {
  const arquivos = Array.from(fileList || []);
  const input = document.getElementById('reporModalInputImagem');

  for (const arquivo of arquivos) {
    if (imagensReporProduto.length >= MAX_IMAGENS_PRODUTO) {
      showToast('Limite de ' + MAX_IMAGENS_PRODUTO + ' imagens por produto atingido.', 'error');
      break;
    }
    try {
      const dataUrl = await reduzirImagemArquivo(arquivo);
      imagensReporProduto.push(dataUrl);
    } catch (erro) {
      showToast(erro.message, 'error');
    }
  }

  if (input) input.value = '';
  renderPreviewImagensRepor();
}

function renderPreviewImagensRepor() {
  const box = document.getElementById('reporModalPreviewImagens');
  if (!box) return;

  if (imagensReporProduto.length === 0) {
    box.innerHTML = '<span style="font-size:12px; color:var(--texto-secundario); font-style:italic;">Nenhuma foto anexada (usando ícone ou emoji padrão).</span>';
    return;
  }

  box.innerHTML = imagensReporProduto.map((src, i) => `
    <div class="upload-thumb ${i === 0 ? 'principal' : ''}" onclick="tornarImagemPrincipalRepor(${i})" title="${i === 0 ? 'Imagem principal' : 'Clique para tornar principal'}">
      <img src="${src}" alt="Imagem ${i + 1}">
      ${i === 0 ? '<span class="tag-principal">PRINCIPAL</span>' : ''}
      <button type="button" class="btn-remover-img" onclick="event.stopPropagation(); removerImagemRepor(${i})" title="Remover imagem">✕</button>
    </div>
  `).join('');
}

function tornarImagemPrincipalRepor(indice) {
  if (indice <= 0 || indice >= imagensReporProduto.length) return;
  const [img] = imagensReporProduto.splice(indice, 1);
  imagensReporProduto.unshift(img);
  renderPreviewImagensRepor();
}

function removerImagemRepor(indice) {
  imagensReporProduto.splice(indice, 1);
  renderPreviewImagensRepor();
}

function salvarReposicaoEstoqueModal(e) {
  if (e) e.preventDefault();
  if (!produtoReporIdAtual) return;

  const qtdInp = document.getElementById('reporModalQtd');
  const qtd = parseInt(qtdInp?.value, 10);

  if (isNaN(qtd) || qtd <= 0) {
    showToast('Digite uma quantidade válida para reposição!', 'error');
    return;
  }

  const res = store.reporEstoque(produtoReporIdAtual, qtd);
  if (res.success) {
    // Atualiza as imagens alteradas do produto no banco de produtos
    if (typeof store.atualizarImagensProduto === 'function') {
      store.atualizarImagensProduto(produtoReporIdAtual, imagensReporProduto);
    }

    // Atualiza peso e dimensões caso informados
    const reporPeso = parseFloat(document.getElementById('reporModalPeso')?.value);
    const reporAlt = parseFloat(document.getElementById('reporModalAltura')?.value);
    const reporLarg = parseFloat(document.getElementById('reporModalLargura')?.value);
    const reporComp = parseFloat(document.getElementById('reporModalComprimento')?.value);

    if (typeof store.atualizarDimensoesProduto === 'function') {
      store.atualizarDimensoesProduto(produtoReporIdAtual, reporPeso, {
        altura: reporAlt,
        largura: reporLarg,
        comprimento: reporComp
      });
    }

    showToast('Estoque, peso, dimensões e imagens atualizados com sucesso!', 'success');
    fecharModalReporEstoque();
    renderPainelAdmin();
    if (typeof renderProdutosGrid === 'function') renderProdutosGrid();
  } else {
    showToast(res.msg, 'error');
  }
}

// Modal de Confirmação de Logout do Gerente
function efetuarLogoutAdmin() {
  const currentUser = store.getCurrentUser();
  const nomeUser = currentUser ? currentUser.name : 'Gerente';

  const modal = document.getElementById('modalConfirmarLogout');
  const msgEl = document.getElementById('txtConfirmarLogoutMsg');
  if (msgEl) msgEl.textContent = `Deseja realmente encerrar a sessão de ${nomeUser}?`;

  if (modal) {
    modal.classList.add('active');
  } else {
    executarLogoutAcao();
  }
}

function fecharModalConfirmarLogout() {
  const modal = document.getElementById('modalConfirmarLogout');
  if (modal) modal.classList.remove('active');
}

function executarLogoutAcao() {
  fecharModalConfirmarLogout();
  store.logoutUser();
  showToast('Sessão encerrada com sucesso.', 'success');
  updateNavigationState();
  if (typeof renderCarrinho === 'function') renderCarrinho();
  navigateTo('page-home');
}

// Exclusão de Produto com Modal de Confirmação
let produtoIdParaExcluir = null;

function confirmarExcluirProduto(produtoId) {
  const p = store.getProdutoById(produtoId);
  if (!p) return;

  produtoIdParaExcluir = produtoId;
  const txtEl = document.getElementById('txtConfirmarExclusao');
  if (txtEl) txtEl.textContent = `Tem certeza que deseja remover o produto "${p.nome}" (EAN: ${p.barcode}) do catálogo?`;

  const btnConfirm = document.getElementById('btnConfirmarExcluirAcao');
  if (btnConfirm) {
    btnConfirm.onclick = () => executarExclusaoProduto(produtoId);
  }

  const modal = document.getElementById('modalConfirmarExclusao');
  if (modal) modal.classList.add('active');
}

function fecharModalConfirmarExclusao() {
  const modal = document.getElementById('modalConfirmarExclusao');
  if (modal) modal.classList.remove('active');
  produtoIdParaExcluir = null;
}

function executarExclusaoProduto(produtoId) {
  let produtos = store.getProdutos();
  const prod = produtos.find(p => p.id === produtoId);
  if (!prod) return;

  produtos = produtos.filter(p => p.id !== produtoId);
  store.saveProdutos(produtos);

  showToast(`Produto "${prod.nome}" foi removido do catálogo com sucesso!`, 'success');
  fecharModalConfirmarExclusao();
  renderPainelAdmin();
  if (typeof renderProdutosGrid === 'function') renderProdutosGrid();
}

// ===== UPLOAD DE IMAGENS DO PRODUTO =====
const MAX_IMAGENS_PRODUTO = 4;
const MAX_TAMANHO_ARQUIVO_MB = 10;
const MAX_LADO_IMAGEM_PX = 800;
let imagensNovoProduto = []; // data URLs já reduzidas; a posição 0 é a imagem principal

// Lê o arquivo, reduz para no máx. 800px e devolve um data URL JPEG leve
// (o localStorage do navegador tem só ~5 MB, então não dá para guardar a foto original)
function reduzirImagemArquivo(file) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error(`"${file.name}" não é uma imagem.`));
      return;
    }
    if (file.size > MAX_TAMANHO_ARQUIVO_MB * 1024 * 1024) {
      reject(new Error(`"${file.name}" é maior que ${MAX_TAMANHO_ARQUIVO_MB} MB.`));
      return;
    }

    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error(`Não foi possível ler "${file.name}".`));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error(`"${file.name}" não é uma imagem válida.`));
      img.onload = () => {
        const escala = Math.min(1, MAX_LADO_IMAGEM_PX / Math.max(img.width, img.height));
        const largura = Math.max(1, Math.round(img.width * escala));
        const altura = Math.max(1, Math.round(img.height * escala));

        const canvas = document.createElement('canvas');
        canvas.width = largura;
        canvas.height = altura;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF'; // fundo branco (PNG transparente não vira preto no JPEG)
        ctx.fillRect(0, 0, largura, altura);
        ctx.drawImage(img, 0, 0, largura, altura);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(file);
  });
}

async function selecionarImagensProduto(fileList) {
  const arquivos = Array.from(fileList || []);
  const input = document.getElementById('prodModalImagens');

  for (const arquivo of arquivos) {
    if (imagensNovoProduto.length >= MAX_IMAGENS_PRODUTO) {
      showToast(`Limite de ${MAX_IMAGENS_PRODUTO} imagens por produto.`, 'error');
      break;
    }
    try {
      const dataUrl = await reduzirImagemArquivo(arquivo);
      imagensNovoProduto.push(dataUrl);
    } catch (erro) {
      showToast(erro.message, 'error');
    }
  }

  if (input) input.value = ''; // permite escolher o mesmo arquivo de novo
  renderPreviewImagensProduto();
}

function renderPreviewImagensProduto() {
  const box = document.getElementById('prodModalPreviewImagens');
  if (!box) return;

  box.innerHTML = imagensNovoProduto.map((src, i) => `
    <div class="upload-thumb ${i === 0 ? 'principal' : ''}" onclick="tornarImagemPrincipal(${i})" title="${i === 0 ? 'Imagem principal' : 'Clique para tornar principal'}">
      <img src="${src}" alt="Imagem ${i + 1}">
      ${i === 0 ? '<span class="tag-principal">PRINCIPAL</span>' : ''}
      <button type="button" class="btn-remover-img" onclick="event.stopPropagation(); removerImagemProduto(${i})" title="Remover imagem">✕</button>
    </div>
  `).join('');
}

function tornarImagemPrincipal(indice) {
  if (indice <= 0 || indice >= imagensNovoProduto.length) return;
  const [img] = imagensNovoProduto.splice(indice, 1);
  imagensNovoProduto.unshift(img);
  renderPreviewImagensProduto();
}

function removerImagemProduto(indice) {
  imagensNovoProduto.splice(indice, 1);
  renderPreviewImagensProduto();
}

function limparImagensNovoProduto() {
  imagensNovoProduto = [];
  const input = document.getElementById('prodModalImagens');
  if (input) input.value = '';
  renderPreviewImagensProduto();
}

// Arrastar e soltar imagens na caixa de upload
function iniciarUploadArrastar() {
  const box = document.getElementById('uploadBox');
  if (!box) return;
  ['dragenter', 'dragover'].forEach(ev => box.addEventListener(ev, (e) => {
    e.preventDefault();
    box.classList.add('arrastando');
  }));
  ['dragleave', 'drop'].forEach(ev => box.addEventListener(ev, (e) => {
    e.preventDefault();
    box.classList.remove('arrastando');
  }));
  box.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) selecionarImagensProduto(e.dataTransfer.files);
  });
}

// MODAL NOVO PRODUTO HTML
function abrirModalNovoProduto() {
  const modal = document.getElementById('modalNovoProduto');
  if (!modal) return;

  document.getElementById('prodModalNome').value = '';
  document.getElementById('prodModalCat').value = '';
  document.getElementById('prodModalEmoji').value = '📦';
  document.getElementById('prodModalPreco').value = '';
  document.getElementById('prodModalAntigo').value = '';
  document.getElementById('prodModalEstoque').value = '20';
  document.getElementById('prodModalDesc').value = '';
  if (document.getElementById('prodModalPeso')) document.getElementById('prodModalPeso').value = '0.50';
  if (document.getElementById('prodModalAltura')) document.getElementById('prodModalAltura').value = '12';
  if (document.getElementById('prodModalLargura')) document.getElementById('prodModalLargura').value = '18';
  if (document.getElementById('prodModalComprimento')) document.getElementById('prodModalComprimento').value = '22';
  gerarNovoEANModal();
  limparImagensNovoProduto();

  modal.classList.add('active');
}

function fecharModalNovoProduto() {
  const modal = document.getElementById('modalNovoProduto');
  if (modal) modal.classList.remove('active');
}

function gerarNovoEANModal() {
  const eanInp = document.getElementById('prodModalBarcode');
  if (eanInp) {
    eanInp.value = '7891234' + String(Math.floor(Math.random() * 899999 + 100000));
  }
}

function selecionarEmojiModal(emoji) {
  const input = document.getElementById('prodModalEmoji');
  if (input) input.value = emoji;

  document.querySelectorAll('.emoji-chip').forEach(chip => {
    if (chip.textContent.trim() === emoji) {
      chip.classList.add('selected');
    } else {
      chip.classList.remove('selected');
    }
  });
}

function autoSugerirEmojiPorCategoria() {
  const catSelect = document.getElementById('prodModalCat');
  if (!catSelect) return;

  const catEmojiMap = {
    'Brinquedos e Jogos': '🏎️',
    'Casa e Cozinha': '🍳',
    'Limpeza': '🧹',
    'Eletrônicos e Acessórios': '💻',
    'Papelaria e Escritório': '📝',
    'Beleza e Cuidados Pessoais': '💄',
    'Pet Shop': '🐶',
    'Ferramentas e Utilidades': '🛠️',
    'Organização e Decoração': '📦',
    'Acessórios Automotivos': '🚗',
    'Lazer e Esportes': '⚽',
    'Moda e Acessórios': '👕',
    'Infantil': '🧸'
  };

  const catVal = catSelect.value;
  if (catEmojiMap[catVal]) {
    selecionarEmojiModal(catEmojiMap[catVal]);
  }
}

function restaurarCatalogoInicial() {
  if (!store.isAdminLogged()) {
    store.loginUser('admin', 'admin123');
    if (typeof updateNavigationState === 'function') updateNavigationState();
  }

  store.restaurarProdutosApenas();
  filtroEstoqueStatus = 'todos';
  if (typeof categoriaAtiva !== 'undefined') categoriaAtiva = '';
  if (typeof tagAtiva !== 'undefined') tagAtiva = '';
  if (typeof buscaTermo !== 'undefined') buscaTermo = '';

  const inputGlobal = document.getElementById('globalSearchInput');
  if (inputGlobal) inputGlobal.value = '';

  const inputEstoque = document.getElementById('inputBuscaEstoque');
  if (inputEstoque) inputEstoque.value = '';

  // Atualiza botões visuais de filtros do estoque
  document.querySelectorAll('#filtrosEstoqueBar button').forEach(b => b.classList.remove('active'));
  const btnTodos = document.querySelector('#filtrosEstoqueBar button');
  if (btnTodos) btnTodos.classList.add('active');

  showToast('Catálogo de fábrica com 100+ produtos restaurado com sucesso!', 'success');
  renderPainelAdmin();
  if (typeof renderProdutosGrid === 'function') renderProdutosGrid();
}

function salvarNovoProdutoModal(e) {
  if (e) e.preventDefault();

  if (!store.isAdminLogged()) {
    store.loginUser('admin', 'admin123');
    if (typeof updateNavigationState === 'function') updateNavigationState();
  }

  const nome = document.getElementById('prodModalNome')?.value.trim();
  const cat = document.getElementById('prodModalCat')?.value;
  const emoji = document.getElementById('prodModalEmoji')?.value.trim() || '📦';
  const precoVal = document.getElementById('prodModalPreco')?.value;
  const preco = parseFloat(precoVal);
  const antigoInp = document.getElementById('prodModalAntigo')?.value;
  const antigo = antigoInp ? parseFloat(antigoInp) : (preco * 1.25);
  const estoqueVal = document.getElementById('prodModalEstoque')?.value;
  const estoque = parseInt(estoqueVal, 10);
  const barcode = document.getElementById('prodModalBarcode')?.value.trim() || ('7891234' + Math.floor(Math.random() * 899999 + 100000));
  const desc = document.getElementById('prodModalDesc')?.value.trim() || `${nome} - Qualidade garantida JM Variedades.`;
  const peso = parseFloat(document.getElementById('prodModalPeso')?.value) || 0.50;
  const altura = parseFloat(document.getElementById('prodModalAltura')?.value) || 12;
  const largura = parseFloat(document.getElementById('prodModalLargura')?.value) || 18;
  const comprimento = parseFloat(document.getElementById('prodModalComprimento')?.value) || 22;

  if (!nome || !cat || isNaN(preco) || preco <= 0 || isNaN(estoque) || estoque < 0) {
    showToast('Preencha os campos obrigatórios (*) com valores válidos!', 'error');
    return;
  }

  const produtos = store.getProdutos();
  const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;

  const novoProd = {
    id: novoId,
    barcode,
    emoji,
    nome,
    cat,
    desc,
    preco,
    antigo,
    estoque,
    avaliacoes: 1,
    nota: 5.0,
    oferta: antigo > preco,
    novidade: true,
    peso: peso,
    dimensoes: { altura, largura, comprimento },
    imagens: [...imagensNovoProduto]
  };

  // Adiciona o novo produto no topo da lista
  produtos.unshift(novoProd);
  try {
    store.saveProdutos(produtos);
  } catch (erro) {
    // O localStorage do navegador é limitado (~5 MB); imagens demais podem estourar
    console.error('Erro ao salvar produto:', erro);
    showToast('Não foi possível salvar: o armazenamento do navegador está cheio. Use menos imagens ou imagens menores.', 'error');
    return;
  }

  // Registra no histórico de entradas de estoque
  const historico = store.getHistorico();
  historico.unshift({
    id: 'HIST-' + Math.floor(Math.random() * 899999 + 100000),
    barcode: novoProd.barcode,
    produtoNome: novoProd.nome,
    timestamp: new Date().toLocaleString('pt-BR'),
    tipo: 'Cadastro de Produto',
    qtd: novoProd.estoque,
    pedidoId: 'CADASTRO-NOVO',
    saldoResultante: novoProd.estoque,
    obs: 'Cadastro inicial de novo produto via Painel do Gerente'
  });
  localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(historico));

  // Limpa os filtros de busca e status para o produto cadastrado APARECER IMEDIATAMENTE!
  filtroEstoqueStatus = 'todos';
  if (typeof categoriaAtiva !== 'undefined') categoriaAtiva = '';
  if (typeof tagAtiva !== 'undefined') tagAtiva = '';
  if (typeof buscaTermo !== 'undefined') buscaTermo = '';

  const inputGlobal = document.getElementById('globalSearchInput');
  if (inputGlobal) inputGlobal.value = '';

  const inputEstoque = document.getElementById('inputBuscaEstoque');
  if (inputEstoque) inputEstoque.value = '';

  document.querySelectorAll('#filtrosEstoqueBar button').forEach(b => b.classList.remove('active'));
  const btnTodos = document.querySelector('#filtrosEstoqueBar button');
  if (btnTodos) btnTodos.classList.add('active');

  showToast(`Produto "${nome}" cadastrado com sucesso! EAN: ${barcode}`, 'success');
  fecharModalNovoProduto();
  renderPainelAdmin();
  if (typeof renderProdutosGrid === 'function') renderProdutosGrid();
}

// Inicializa a tarja e o upload de imagens ao carregar o script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    carregarTarjaAnuncio();
    iniciarUploadArrastar();
  });
} else {
  carregarTarjaAnuncio();
  iniciarUploadArrastar();
}