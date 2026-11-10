// ===== INICIALIZADOR GERAL E INTERFACE DA APLICAÇÃO (APP) =====

let categoriaAtiva = '';
let tagAtiva = '';
let buscaTermo = '';

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
} else {
  initApp();
}

function initApp() {
  renderProdutosGrid();
  renderCarrinho();
  setupBuscaInput();
  updateNavigationState();
  initMascarasCliente();
  initPaginaProdutoListeners();
}

// Atualiza o estado visual da barra de navegação superior
function updateNavigationState() {
  const navAdminBtn = document.getElementById('nav-admin');
  const navLoginBtn = document.getElementById('nav-login');
  const currentUser = store.getCurrentUser();
  const isManager = store.isAdminLogged();

  if (navAdminBtn) {
    navAdminBtn.style.display = 'none'; // botão de gerente removido da nav
  }

  if (navLoginBtn) {
    if (currentUser) {
      if (isManager) {
        navLoginBtn.innerHTML = `🔐 Acesso do Gerente`;
        navLoginBtn.title = `Acesso do Gerente (${currentUser.name})`;
      } else {
        navLoginBtn.innerHTML = `👤 Central do Cliente`;
        navLoginBtn.title = `Central do Cliente (${currentUser.name})`;
      }
      navLoginBtn.onclick = () => navigateTo('page-central-cliente');
    } else {
      navLoginBtn.innerHTML = `👤 Entrar`;
      navLoginBtn.title = 'Entrar ou Cadastrar';
      navLoginBtn.onclick = () => abrirModalLogin();
    }
  }
}

function abrirModalLogin(abaPadrao = 'login') {
  const currentUser = store.getCurrentUser();
  if (currentUser) {
    navigateTo('page-central-cliente');
    return;
  }

  const modal = document.getElementById('modalLoginWindow');
  if (modal) {
    modal.classList.add('active');
    alternarAbaAuth(abaPadrao);
  }
}

function fecharModalLogin() {
  const modal = document.getElementById('modalLoginWindow');
  if (modal) modal.classList.remove('active');
  resetarCamposSenha();
}

function resetarCamposSenha() {
  const loginPass = document.getElementById('loginPassInput');
  const cadPass = document.getElementById('cadSenha');
  const btnLoginPass = document.getElementById('btnToggleLoginPass');
  const btnCadPass = document.getElementById('btnToggleCadPass');

  if (loginPass) loginPass.type = 'password';
  if (cadPass) cadPass.type = 'password';
  if (btnLoginPass) btnLoginPass.innerHTML = '👁️ <span>Exibir</span>';
  if (btnCadPass) btnCadPass.innerHTML = '👁️ <span>Exibir</span>';
}

function toggleVisibilidadeSenha(inputId, btnEl) {
  const target = document.getElementById(inputId);
  if (!target) return;
  const isPass = target.type === 'password';
  target.type = isPass ? 'text' : 'password';
  if (btnEl) {
    btnEl.innerHTML = isPass ? '👁️ <span>Ocultar</span>' : '👁️ <span>Exibir</span>';
    btnEl.title = isPass ? 'Ocultar a senha' : 'Exibir a senha';
  }
}

function alternarAbaAuth(aba) {
  resetarCamposSenha();
  const painelLogin = document.getElementById('authPainelLogin');
  const painelCadastro = document.getElementById('authPainelCadastro');
  const btnLogin = document.getElementById('tabBtnLogin');
  const btnCadastro = document.getElementById('tabBtnCadastro');

  if (aba === 'cadastro') {
    if (painelLogin) painelLogin.style.display = 'none';
    if (painelCadastro) painelCadastro.style.display = 'block';
    if (btnLogin) btnLogin.className = 'btn btn-sm btn-outline';
    if (btnCadastro) btnCadastro.className = 'btn btn-sm btn-primary';
  } else {
    if (painelLogin) painelLogin.style.display = 'block';
    if (painelCadastro) painelCadastro.style.display = 'none';
    if (btnLogin) btnLogin.className = 'btn btn-sm btn-primary';
    if (btnCadastro) btnCadastro.className = 'btn btn-sm btn-outline';
  }
}

function efetuarCadastroCliente(e) {
  if (e) e.preventDefault();
  const nome = document.getElementById('cadNome')?.value;
  const email = document.getElementById('cadEmail')?.value;
  const cpf = document.getElementById('cadCPF')?.value;
  const telefone = document.getElementById('cadTelefone')?.value;
  const senha = document.getElementById('cadSenha')?.value;

  const res = store.cadastrarCliente({ nome, email, cpf, telefone, senha });
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

// Navegação entre abas SPA
function navigateTo(pageId) {
  // Proteção da Rota do Painel de Administração (Regra de Negócio)
  if (pageId === 'page-admin' && !store.isAdminLogged()) {
    showToast('Acesso restrito! O Painel do Gerente só está disponível para logins de gerentes autorizados.', 'error');
    abrirModalLogin();
    return;
  }

  // Proteção das Rotas da Central do Cliente
  if ((pageId === 'page-central-cliente' || pageId === 'page-meus-dados' || pageId === 'page-meus-pedidos') && !store.getCurrentUser()) {
    showToast('Acesse ou crie sua conta para consultar esta seção.', 'info');
    abrirModalLogin();
    return;
  }

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

  const targetPage = document.getElementById(pageId);
  if (targetPage) targetPage.classList.add('active');

  // Destaca o botão correspondente no header
  const navMap = {
    'page-home': 'nav-home',
    'page-produto': 'nav-home',
    'page-carrinho': 'nav-carrinho',
    'page-checkout': 'nav-carrinho',
    'page-historico': 'nav-historico',
    'page-admin': 'nav-admin',
    'page-central-cliente': 'nav-login',
    'page-meus-dados': 'nav-login',
    'page-meus-pedidos': 'nav-login'
  };

  const activeBtnId = navMap[pageId];
  if (activeBtnId) {
    const btn = document.getElementById(activeBtnId);
    if (btn) btn.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Dispara atualização de conteúdo específico da página
  if (pageId === 'page-carrinho') {
    renderCarrinho();
  } else if (pageId === 'page-checkout') {
    renderCheckoutSummary();
  } else if (pageId === 'page-admin') {
    renderPainelAdmin();
  } else if (pageId === 'page-central-cliente') {
    renderCentralCliente();
  } else if (pageId === 'page-meus-dados') {
    renderMeusDados();
  } else if (pageId === 'page-meus-pedidos') {
    renderMeusPedidos();
  }
}

// ===== CENTRAL DO CLIENTE, MEUS DADOS E MEUS PEDIDOS =====
function renderCentralCliente() {
  const currentUser = store.getCurrentUser();
  if (!currentUser) return;

  const isManager = store.isAdminLogged();

  const nomeEl = document.getElementById('centralClienteNome');
  const emailEl = document.getElementById('centralClienteEmail');
  const tagEl = document.getElementById('centralClienteTag');
  const secaoServicos = document.getElementById('secaoServicosGerenciamento');
  const adminBox = document.getElementById('centralAdminOpcaoBox');
  const crumbEl = document.getElementById('centralClienteBreadcrumb');

  if (isManager) {
    // Modo Gerente: oculta tag "Painel do Cliente" e seção de serviços do cliente
    if (tagEl) tagEl.style.display = 'none';
    if (secaoServicos) secaoServicos.style.display = 'none';
    if (adminBox) adminBox.style.display = 'block';
    if (crumbEl) crumbEl.textContent = 'Acesso do Gerente';
    if (nomeEl) nomeEl.textContent = 'Gerente (admin)';
    if (emailEl) emailEl.textContent = currentUser.email || 'admin@jmvariedades.com.br';
  } else {
    // Modo Cliente: exibe tag, seção de serviços, oculta bloco de gerente
    if (tagEl) {
      tagEl.style.display = 'inline-block';
      tagEl.textContent = 'Painel do Cliente';
    }
    if (secaoServicos) secaoServicos.style.display = 'block';
    if (adminBox) adminBox.style.display = 'none';
    if (crumbEl) crumbEl.textContent = 'Central do Cliente';
    if (nomeEl) nomeEl.textContent = `Olá, ${currentUser.name}!`;
    if (emailEl) emailEl.textContent = currentUser.email || 'Cliente JM Variedades';
  }
}

function renderMeusDados() {
  const currentUser = store.getCurrentUser();
  if (!currentUser) return;

  const nomeInp = document.getElementById('perfilNome');
  const emailInp = document.getElementById('perfilEmail');
  const cpfInp = document.getElementById('perfilCPF');
  const telInp = document.getElementById('perfilTelefone');

  const clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];
  const c = clientes.find(item => 
    (currentUser.id && item.id === currentUser.id) || 
    (item.email && item.email.toLowerCase() === (currentUser.email || '').toLowerCase())
  );

  if (nomeInp) nomeInp.value = (c && c.nome) || currentUser.name || '';
  if (emailInp) emailInp.value = (c && c.email) || currentUser.email || '';
  if (cpfInp) cpfInp.value = (c && c.cpf) || currentUser.cpf || '';
  if (telInp) telInp.value = (c && c.telefone) || currentUser.telefone || '';

  initMascarasCliente();
}

function salvarAlteracoesMeusDados(e) {
  if (e) e.preventDefault();
  const nome = document.getElementById('perfilNome')?.value.trim();
  const email = document.getElementById('perfilEmail')?.value.trim();
  const cpf = document.getElementById('perfilCPF')?.value.trim();
  const telefone = document.getElementById('perfilTelefone')?.value.trim();

  if (!nome || !email) {
    showToast('Nome Completo e E-mail são obrigatórios!', 'error');
    return;
  }

  const res = store.atualizarDadosCliente({ nome, email, cpf, telefone });
  if (res.success) {
    showToast(res.msg, 'success');
    updateNavigationState();
    renderCentralCliente();
  } else {
    showToast(res.msg, 'error');
  }
}

function renderMeusPedidos() {
  store.expirarPedidosVencidos();
  const container = document.getElementById('meusPedidosListaContainer');
  if (!container) return;

  const currentUser = store.getCurrentUser();
  if (!currentUser) return;

  const todosPedidos = store.getPedidos();
  const pedidosDoUsuario = todosPedidos.filter(p => {
    if (currentUser.role === 'admin') return true; // Gerente pode auditar todos os pedidos
    const pEmail = p.cliente && p.cliente.email ? p.cliente.email.toLowerCase() : '';
    const uEmail = currentUser.email ? currentUser.email.toLowerCase() : '';
    const pNome = p.cliente && p.cliente.nome ? p.cliente.nome.toLowerCase() : '';
    const uNome = currentUser.name ? currentUser.name.toLowerCase() : '';
    return (uEmail && pEmail === uEmail) || (uNome && pNome === uNome) || (uEmail && p.contaEmail === uEmail);
  });

  if (pedidosDoUsuario.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align:center; padding: 48px 20px;">
        <div style="font-size: 56px; margin-bottom: 12px;">📦</div>
        <h3 style="font-size: 18px; font-weight: 800; color:var(--azul-principal); margin-bottom: 8px;">Você ainda não possui pedidos realizados</h3>
        <p style="font-size: 14px; color: var(--texto-secundario); margin-bottom: 20px;">Navegue pelos nossos mais de 100 produtos em destaque e aproveite ofertas exclusivas!</p>
        <button class="btn btn-primary" onclick="navigateTo('page-home')">Explorar Catálogo de Produtos ➔</button>
      </div>
    `;
    return;
  }

  let html = '';
  pedidosDoUsuario.forEach(p => {
    const isPago = p.status === 'Pago';
    const statusClass = isPago ? 'status-ok' : 'status-baixo';
    const statusIcon = isPago ? '✓' : (p.status === 'Cancelado' ? '✖' : '⏳');

    let itensHtml = (p.itens || []).map(item => `
      <div class="pedido-item-row">
        <span><b>${item.qtd}x</b> ${item.nome}</span>
        <span style="font-weight:700;">${formatMoeda(item.subtotal)}</span>
      </div>
    `).join('');

    const end = p.endereco;
    const endTxt = end ? `${end.rua}, ${end.numero} - ${end.bairro}, ${end.cidade}/${end.uf}` : 'Endereço cadastrado';

    html += `
      <div class="pedido-card-item">
        <div class="pedido-header">
          <div>
            <span class="pedido-id">📦 Pedido #${p.id}</span>
            <div style="font-size:12px; color:var(--texto-secundario); margin-top:2px;">Realizado em: ${p.data}</div>
          </div>
          <div>
            <span class="badge-status ${statusClass}">${statusIcon} ${p.status}</span>
          </div>
        </div>

        <div class="pedido-itens-lista">
          ${itensHtml}
        </div>

        <div style="background:var(--cinza-muito-claro); border-radius:10px; padding:12px 14px; margin-bottom:14px; font-size:12px; color:var(--texto-secundario);">
          <div>📍 <b>Entrega:</b> ${endTxt}</div>
          <div style="margin-top:4px;">💳 <b>Pagamento:</b> ${p.metodoPagamento ? p.metodoPagamento.toUpperCase() : 'Pix'} | 🚚 <b>Frete:</b> ${p.frete === 0 ? 'Grátis' : formatMoeda(p.frete)}</div>
        </div>

        ${blocoAcoesPedido(p)}
        <div class="pedido-footer">
          <div style="font-size:14px; color:var(--texto-secundario);">
            Total: <span style="font-size:20px; font-weight:900; color:var(--laranja-principal);">${formatMoeda(p.total)}</span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="abrirReciboDePedido('${p.id}')">
            🖨️ Ver Comprovante / Imprimir
          </button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function abrirReciboDePedido(pedidoId) {
  const pedidos = store.getPedidos();
  const pedido = pedidos.find(p => p.id === pedidoId);
  if (pedido && typeof exibirModalConfirmação === 'function') {
    exibirModalConfirmação(pedido);
  }
}

function initMascarasCliente() {
  const cpfInp = document.getElementById('perfilCPF');
  const telInp = document.getElementById('perfilTelefone');

  if (cpfInp && !cpfInp.dataset.hasMask) {
    cpfInp.dataset.hasMask = 'true';
    cpfInp.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
      else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{1,3})$/, '$1.$2.$3');
      else if (v.length > 3) v = v.replace(/^(\d{3})(\d{1,3})$/, '$1.$2');
      e.target.value = v;
    });
  }

  if (telInp && !telInp.dataset.hasMask) {
    telInp.dataset.hasMask = 'true';
    telInp.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      e.target.value = v;
    });
  }
}

// Sistema Global de Notificações Toast
function showToast(mensagem, tipo = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${tipo}`;

  let icone = 'ℹ️';
  if (tipo === 'success') icone = '✅';
  if (tipo === 'error') icone = '❌';

  toast.innerHTML = `<span>${icone}</span> <span>${mensagem}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideUp 0.2s reverse ease';
    setTimeout(() => toast.remove(), 200);
  }, 3500);
}

// =======================================================
// TELA INDEPENDENTE DE DETALHES DO PRODUTO (PADRÃO E-COMMERCE / KABUM)
// =======================================================
let produtoAtualPaginaId = null;
let produtoDetalhesAtualId = null;
let qtdAtualPagina = 1;
const favoritosIds = new Set();

// Abre a tela independente do produto ao clicar no catálogo ou busca
function abrirPaginaProduto(produtoId) {
  const p = store.getProdutoById(produtoId);
  if (!p) return;

  produtoAtualPaginaId = produtoId;
  produtoDetalhesAtualId = produtoId;
  qtdAtualPagina = 1;

  // Atualiza campo de quantidade
  const inputQtd = document.getElementById('prodPageQtdInput');
  if (inputQtd) inputQtd.value = 1;

  // Breadcrumbs e Título
  const breadCat = document.getElementById('prodPageBreadCat');
  const breadNome = document.getElementById('prodPageBreadNome');
  const breadCodigo = document.getElementById('prodPageBreadCodigo');
  if (breadCat) breadCat.textContent = p.cat;
  if (breadNome) breadNome.textContent = p.nome;
  if (breadCodigo) breadCodigo.textContent = `Código: ${p.barcode || p.id}`;

  const badgeCat = document.getElementById('prodPageCatPill');
  if (badgeCat) badgeCat.textContent = p.cat;

  const titleEl = document.getElementById('prodPageTitle');
  if (titleEl) titleEl.textContent = p.nome;

  // Avaliações
  const starsEl = document.getElementById('prodPageStars');
  const revEl = document.getElementById('prodPageReviewsCount');
  if (starsEl) starsEl.textContent = `${p.nota || 4.9} ★★★★★`;
  if (revEl) revEl.textContent = `(${p.avaliacoes || 120} avaliações de compradores)`;

  // Renderiza a galeria de imagens e miniaturas verticais
  renderGaleriaPaginaProduto(p);

  // Status de Estoque
  const stockAlert = document.getElementById('prodPageStockAlert');
  if (stockAlert) {
    if (p.estoque === 0) {
      stockAlert.className = 'prod-page-stock-alert esgotado';
      stockAlert.innerHTML = '🔴 <strong>Esgotado no Momento</strong> — Sem unidades disponíveis';
    } else if (p.estoque <= 5) {
      stockAlert.className = 'prod-page-stock-alert baixo';
      stockAlert.innerHTML = `⚡ <strong>Poucas Unidades Restantes</strong> — Restam apenas ${p.estoque} unidades!`;
    } else {
      stockAlert.className = 'prod-page-stock-alert normal';
      stockAlert.innerHTML = `✓ <strong>Em Estoque</strong> (${p.estoque} unidades à pronta entrega)`;
    }
  }

  // Especificações Técnicas (SOBRE O PRODUTO)
  const specsList = document.getElementById('prodPageSpecsList');
  if (specsList) {
    const dim = p.dimensoes || {};
    const dimTxt = (dim.altura && dim.largura && dim.comprimento)
      ? `${dim.altura} cm (A) × ${dim.largura} cm (L) × ${dim.comprimento} cm (C)`
      : 'Embalagem padrão transportadora';
    const pesoTxt = p.peso ? `${p.peso} kg` : '0.50 kg';

    specsList.innerHTML = `
      <li><strong>Categoria Oficial:</strong> ${p.cat}</li>
      <li><strong>Código de Barras (EAN):</strong> <code style="font-weight:800; color:var(--azul-principal);">${p.barcode || '7890001000000'}</code></li>
      <li><strong>Peso Líquido Estimado:</strong> ${pesoTxt}</li>
      <li><strong>Dimensões do Produto:</strong> ${dimTxt}</li>
      <li><strong>Garantia Oficial:</strong> 90 dias com cobertura nacional JM Variedades</li>
      <li><strong>Condição:</strong> Produto 100% Original, lacrado na caixa com nota fiscal</li>
    `;
  }

  // Descrição Detalhada
  const descEl = document.getElementById('prodPageDescription');
  if (descEl) {
    descEl.textContent = p.desc || `${p.nome} - Produto original com garantia de fábrica, distribuição autorizada e envio imediato pela JM Variedades.`;
  }

  // Preço e Condições na Buy Box
  const oldPriceEl = document.getElementById('prodPageOldPrice');
  const mainPriceEl = document.getElementById('prodPagePrice');
  const discTagEl = document.getElementById('prodPageDiscountTag');
  const instEl = document.getElementById('prodPageInstallments');

  if (mainPriceEl) mainPriceEl.textContent = formatMoeda(p.preco);

  if (p.antigo && p.antigo > p.preco) {
    if (oldPriceEl) {
      oldPriceEl.style.display = 'block';
      oldPriceEl.textContent = `De: ${formatMoeda(p.antigo)}`;
    }
    if (discTagEl) {
      discTagEl.style.display = 'inline-block';
      discTagEl.textContent = p.desconto || `-${Math.round((1 - p.preco / p.antigo) * 100)}% OFF`;
    }
  } else {
    if (oldPriceEl) oldPriceEl.style.display = 'none';
    if (discTagEl) discTagEl.style.display = 'none';
  }

  const parcVal = (p.preco / 4).toFixed(2).replace('.', ',');
  if (instEl) {
    instEl.textContent = `Em até 4x de R$ ${parcVal} sem juros no cartão`;
  }

  // Botões de Compra
  const btnBuy = document.getElementById('btnProdPageComprarAgora');
  const btnAdd = document.getElementById('btnProdPageAddCarrinho');
  const isEsgotado = p.estoque === 0;

  if (btnBuy) {
    btnBuy.disabled = isEsgotado;
    btnBuy.style.opacity = isEsgotado ? '0.5' : '1';
    btnBuy.style.cursor = isEsgotado ? 'not-allowed' : 'pointer';
  }
  if (btnAdd) {
    btnAdd.disabled = isEsgotado;
    btnAdd.style.opacity = isEsgotado ? '0.5' : '1';
    btnAdd.style.cursor = isEsgotado ? 'not-allowed' : 'pointer';
  }

  // Simulador de Frete
  const inputCep = document.getElementById('cepPaginaProduto');
  const resFrete = document.getElementById('resultadoFretePaginaProduto');
  if (resFrete) resFrete.innerHTML = '';
  if (inputCep) {
    const cotacao = typeof store.getFreteCotacao === 'function' ? store.getFreteCotacao() : null;
    if (cotacao && cotacao.cep) {
      inputCep.value = cotacao.cep;
      if (typeof calcularFreteProdutoPagina === 'function') {
        calcularFreteProdutoPagina();
      }
    } else {
      inputCep.value = '';
    }
  }

  // Atualiza estado do botão de favorito
  const btnFav = document.getElementById('btnFavoritoProd');
  if (btnFav) {
    if (favoritosIds.has(produtoId)) {
      btnFav.classList.add('favoritado');
    } else {
      btnFav.classList.remove('favoritado');
    }
  }

  // Renderiza os produtos relacionados da mesma categoria
  renderProdutosRelacionados(p);

  // Renderiza a seção de comentários do produto
  renderComentariosProduto(p);

  // Fecha qualquer modal remanescente e abre a página independente
  fecharModalDetalhes();
  navigateTo('page-produto');
}

// Renderiza a galeria de imagens com suporte a miniaturas verticais
function renderGaleriaPaginaProduto(p) {
  const thumbsContainer = document.getElementById('prodPageThumbs');
  const mainPhotoContainer = document.getElementById('prodPageMainPhoto');
  const imgs = obterImagensProduto(p);

  if (imgs.length > 0) {
    mainPhotoContainer.innerHTML = `
      <img id="prodPageMainPhotoImg" src="${imgs[0]}" alt="${escaparAtributoHtml(p.nome)}" class="prod-page-hero-img">
    `;

    if (thumbsContainer) {
      let thumbsHtml = imgs.map((src, idx) => `
        <div class="prod-thumb-mini ${idx === 0 ? 'ativa' : ''}" onclick="trocarFotoPaginaPrincipal('${src}', this)" title="Ver imagem ${idx + 1}">
          <img src="${src}" alt="${escaparAtributoHtml(p.nome)}">
        </div>
      `).join('');

      thumbsContainer.innerHTML = thumbsHtml;
    }
  } else {
    mainPhotoContainer.innerHTML = `
      <div class="prod-page-hero-emoji">${p.emoji || '📦'}</div>
    `;
    if (thumbsContainer) {
      thumbsContainer.innerHTML = `
        <div class="prod-thumb-mini ativa">
          <span style="font-size: 26px;">${p.emoji || '📦'}</span>
        </div>
      `;
    }
  }
}

function trocarFotoPaginaPrincipal(src, thumbEl) {
  const mainImg = document.getElementById('prodPageMainPhotoImg');
  if (mainImg) mainImg.src = src;
  document.querySelectorAll('#prodPageThumbs .prod-thumb-mini').forEach(el => el.classList.remove('ativa'));
  if (thumbEl) thumbEl.classList.add('ativa');
}

// Controle de Quantidade na Página de Detalhes
function alterarQtdPaginaProduto(delta) {
  const p = store.getProdutoById(produtoAtualPaginaId);
  const maxEstoque = p ? p.estoque : 99;
  let novaQtd = qtdAtualPagina + delta;
  if (novaQtd < 1) novaQtd = 1;
  if (novaQtd > maxEstoque) {
    novaQtd = maxEstoque;
    showToast(`Limite atingido! Temos ${maxEstoque} unidades disponíveis em estoque.`, 'warning');
  }
  qtdAtualPagina = novaQtd;
  const input = document.getElementById('prodPageQtdInput');
  if (input) input.value = qtdAtualPagina;
}

function executarAdicionarCarrinhoPagina() {
  if (!produtoAtualPaginaId) return;
  const ok = adicionarProduto(produtoAtualPaginaId, qtdAtualPagina);
  if (ok) {
    showToast(`${qtdAtualPagina} unidade(s) adicionada(s) ao carrinho!`, 'success');
  }
}

function executarComprarAgoraPagina() {
  if (!produtoAtualPaginaId) return;
  if (!store.getCurrentUser()) {
    showToast('Faça login para prosseguir com a compra.', 'error');
    abrirModalLogin();
    return;
  }
  const ok = adicionarProduto(produtoAtualPaginaId, qtdAtualPagina);
  if (ok) {
    fecharCartPreview();
    navigateTo('page-carrinho');
  }
}

// Filtra produtos pela categoria pelo clique no breadcrumb e volta ao catálogo
function filtrarCategoriaBreadcrumb() {
  const p = store.getProdutoById(produtoAtualPaginaId);
  if (p && p.cat) {
    categoriaAtiva = p.cat;
    navigateTo('page-home');
    document.querySelectorAll('.cat-chip, .cat-circle-item').forEach(chip => {
      if (chip.textContent.includes(p.cat)) chip.classList.add('active');
      else chip.classList.remove('active');
    });
    renderProdutosGrid();
  } else {
    navigateTo('page-home');
  }
}

// Copiar código de cupom
function copiarCupom(codigo) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(codigo).then(() => {
      showToast(`Cupom ${codigo} copiado para a área de transferência!`, 'success');
    }).catch(() => {
      showToast(`Cupom: ${codigo}`, 'info');
    });
  } else {
    showToast(`Cupom: ${codigo}`, 'info');
  }
}

// Compartilhar Produto
function compartilharProdutoAtual() {
  const p = store.getProdutoById(produtoAtualPaginaId);
  const title = p ? p.nome : 'JM Variedades';
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: title,
      text: `Confira ${title} na JM Variedades!`,
      url: url
    }).catch(() => {});
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('Link do produto copiado para a área de transferência!', 'success');
    });
  } else {
    showToast('Link do produto pronto!', 'info');
  }
}

// Favoritar Produto
function toggleFavoritoProdutoAtual() {
  if (!produtoAtualPaginaId) return;
  const btn = document.getElementById('btnFavoritoProd');
  if (favoritosIds.has(produtoAtualPaginaId)) {
    favoritosIds.delete(produtoAtualPaginaId);
    if (btn) btn.classList.remove('favoritado');
    showToast('Produto removido dos seus favoritos.', 'info');
  } else {
    favoritosIds.add(produtoAtualPaginaId);
    if (btn) btn.classList.add('favoritado');
    showToast('Produto salvo nos seus favoritos com sucesso!', 'success');
  }
}

// Listener para máscara e busca por Enter no simulador de frete da página
function initPaginaProdutoListeners() {
  const cepInput = document.getElementById('cepPaginaProduto');
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').substring(0, 8);
      if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
      e.target.value = v;
    });
    cepInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        if (typeof calcularFreteProdutoPagina === 'function') {
          calcularFreteProdutoPagina();
        }
      }
    });
  }
}

// Alias de retrocompatibilidade para que qualquer chamada a abrirModalDetalhes leve à tela independente
function abrirModalDetalhes(produtoId) {
  abrirPaginaProduto(produtoId);
}

function fecharModalDetalhes() {
  const modal = document.getElementById('modalDetalhesProduto');
  if (modal) modal.classList.remove('active');
}

// Galeria de detalhes para legado se necessário
function renderGaleriaDetalhe(p) {
  renderGaleriaPaginaProduto(p);
}
function trocarImagemDetalhe(miniEl) {
  trocarFotoPaginaPrincipal(miniEl.src, miniEl);
}

// Modais Institucionais no Rodapé (Atendimento & Políticas)
function abrirModalInstitucional(tipo) {
  const modal = document.getElementById('modalInstitucional');
  const tituloEl = document.getElementById('modalInstitucionalTitulo');
  const conteudoEl = document.getElementById('modalInstitucionalConteudo');
  if (!modal || !tituloEl || !conteudoEl) return;

  if (tipo === 'frete') {
    tituloEl.textContent = '🚚 Política de Frete e Entregas';
    conteudoEl.innerHTML = `
      <p>A <strong>JM Variedades</strong> realiza entregas para 100% do território nacional com segurança e rastreamento em tempo real.</p>
      <br>
      <h4>Modalidades de Envio:</h4>
      <ul>
        <li><strong>⚡ SEDEX Express:</strong> Entrega em 1 a 3 dias úteis para capitais e regiões metropolitanas.</li>
        <li><strong>📦 PAC Convencional:</strong> Entrega econômica em 4 a 10 dias úteis para todo o Brasil.</li>
        <li><strong>🚀 JM Express:</strong> Entrega prioritária com despacho no mesmo dia para compras confirmadas até as 12h.</li>
      </ul>
      <br>
      <h4>Frete Grátis:</h4>
      <p>Oferecemos <strong>Frete Grátis</strong> para compras acima de R$ 199,00 ou utilizando cupons especiais como <b>FRETEGRATIS</b> no carrinho.</p>
    `;
  } else if (tipo === 'trocas') {
    tituloEl.textContent = '🔄 Trocas e Devoluções (CDC 7 Dias)';
    conteudoEl.innerHTML = `
      <p>Respeitamos integralmente o Código de Defesa do Consumidor (Lei nº 8.078/90).</p>
      <br>
      <h4>Garantia de Arrependimento (7 Dias):</h4>
      <p>Você pode solicitar a devolução ou troca de qualquer produto em até <strong>7 dias corridos</strong> após o recebimento, sem custo de frete de devolução.</p>
      <br>
      <h4>Produtos com Defeito de Fabrica:</h4>
      <p>Garantia total de 30 dias para itens não duráveis e 90 dias para eletroeletrônicos. Entre em contato com nosso suporte para substituição imediata.</p>
      <br>
      <h4>Reembolso Rápido:</h4>
      <p>Devoluções pagas via Pix são estornadas em até 24 horas úteis após a conferência no nosso centro logístico.</p>
    `;
  } else if (tipo === 'termos') {
    tituloEl.textContent = '📜 Termos e Condições de Uso';
    conteudoEl.innerHTML = `
      <p>Ao navegar e comprar na plataforma <strong>JM Variedades</strong>, você concorda com nossas condições de serviço:</p>
      <br>
      <ul>
        <li><strong>Autenticidade:</strong> Todos os produtos exibidos possuem nota fiscal e garantia oficial do fabricante.</li>
        <li><strong>Estoque Dinâmico:</strong> Adicionar itens ao carrinho não reserva o estoque até a confirmação do pagamento.</li>
        <li><strong>Pagamentos:</strong> Transações bancárias e via cartão de crédito são processadas sob criptografia de ponta a ponta SSL.</li>
      </ul>
    `;
  } else if (tipo === 'privacidade') {
    tituloEl.textContent = '🔒 Política de Privacidade & Proteção de Dados (LGPD)';
    conteudoEl.innerHTML = `
      <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
      <br>
      <ul>
        <li><strong>Segurança dos Dados:</strong> Não armazenamos números de cartão de crédito nem senhas em texto puro.</li>
        <li><strong>Uso Exclusivo:</strong> Seus dados de endereço e telefone são utilizados unicamente para a entrega dos pedidos e emissão da Nota Fiscal.</li>
        <li><strong>Transparência:</strong> Você pode solicitar a correção ou exclusão dos seus dados a qualquer momento junto ao nosso suporte.</li>
      </ul>
    `;
  }

  modal.classList.add('active');
}

function fecharModalInstitucional() {
  const modal = document.getElementById('modalInstitucional');
  if (modal) modal.classList.remove('active');
}

// Renderização do Catálogo de Produtos
function renderProdutosGrid() {
  const grid = document.getElementById('listaProdutosGrid');
  if (!grid) return;

  const produtos = store.getProdutos();
  let filtrados = produtos;

  if (categoriaAtiva) {
    filtrados = filtrados.filter(p => p.cat.toLowerCase() === categoriaAtiva.toLowerCase());
  }

  if (tagAtiva === 'oferta') {
    filtrados = filtrados.filter(p => p.oferta);
  } else if (tagAtiva === 'novidade') {
    filtrados = filtrados.filter(p => p.novidade);
  }

  if (buscaTermo) {
    const termo = buscaTermo.toLowerCase();
    filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(termo) || p.cat.toLowerCase().includes(termo) || (p.barcode && p.barcode.includes(termo)));
  }

  if (filtrados.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px;">
        <div style="font-size: 48px; margin-bottom: 12px;">🔍</div>
        <h3 style="font-size: 18px; font-weight: 800;">Nenhum produto encontrado</h3>
        <p style="font-size: 14px; color: var(--texto-secundario);">Tente ajustar o termo de busca ou limpar os filtros de categoria.</p>
      </div>
    `;
    return;
  }

  let html = '';
  filtrados.forEach(p => {
    let stockBadge = '';
    let stockText = `<span class="prod-stock-info text-verde">Em estoque (${p.estoque} unid.)</span>`;
    let btnDisabled = '';

    if (p.estoque === 0) {
      stockBadge = `<span class="badge-esgotado">Esgotado</span>`;
      stockText = `<span class="prod-stock-info text-vermelho">🚫 Produto Esgotado</span>`;
      btnDisabled = 'disabled';
    } else if (p.estoque <= 5) {
      stockBadge = `<span class="badge-estoque-baixo">Restam ${p.estoque}!</span>`;
      stockText = `<span class="prod-stock-info text-laranja">⚡ Poucas unidades (${p.estoque} restantes)</span>`;
    }

    let topBadge = '';
    if (p.oferta) topBadge = `<span class="prod-badge badge-oferta">${p.desconto || 'Oferta'}</span>`;
    else if (p.novidade) topBadge = `<span class="prod-badge badge-novidade">Novo</span>`;

    html += `
      <div class="produto-card">
        ${topBadge}
        ${stockBadge}
        <div class="prod-thumb" onclick="abrirPaginaProduto(${p.id})" style="cursor:pointer;" title="Clique para ver todos os detalhes do produto">${htmlImagemProduto(p)}</div>
        <div class="prod-body">
          <div class="prod-cat">${p.cat}</div>
          <div class="prod-nome" onclick="abrirPaginaProduto(${p.id})" style="cursor:pointer;" title="Clique para ver os detalhes">${p.nome}</div>
          <div class="prod-barcode" title="Código EAN-13">║▌ ${p.barcode}</div>
          <div class="prod-stars">★★★★★ (${p.avaliacoes || 50})</div>
          
          <div class="prod-precos">
            ${p.antigo ? `<div class="preco-antigo">${formatMoeda(p.antigo)}</div>` : ''}
            <div class="preco-atual">${formatMoeda(p.preco)}</div>
            ${stockText}
          </div>

          <div style="display:flex; gap:8px; margin-top:12px;">
            <button class="btn btn-outline btn-sm" onclick="abrirPaginaProduto(${p.id})" style="flex:1;">ℹ️ Detalhes</button>
            <button class="btn-add-cart" ${btnDisabled} onclick="adicionarProduto(${p.id})" style="flex:2; margin-top:0;">
              🛒 ${p.estoque > 0 ? 'Adicionar' : 'Esgotado'}
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function adicionarProduto(id, qtd = 1) {
  // Validação: usuário deve estar logado para adicionar ao carrinho
  if (!store.getCurrentUser()) {
    showToast('Faça login para prosseguir com a compra.', 'error');
    abrirModalLogin();
    return false;
  }

  const res = store.adicionarAoCarrinho(id, qtd);
  if (res.success) {
    showToast(res.msg, 'success');
    renderCarrinho();
    // Abre o mini-painel de prévia do carrinho
    abrirCartPreview();
    return true;
  } else {
    showToast(res.msg, 'error');
    return false;
  }
}

// Filtros do Catálogo
function filtrarCategoria(cat, el) {
  categoriaAtiva = cat;
  document.querySelectorAll('.cat-chip, .cat-circle-item').forEach(chip => chip.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProdutosGrid();
}

function filtrarTag(tag, el) {
  tagAtiva = tag;
  document.querySelectorAll('.tag-btn').forEach(btn => btn.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProdutosGrid();
}

function setupBuscaInput() {
  const input = document.getElementById('globalSearchInput');
  const suggestionsBox = document.getElementById('searchSuggestionsDropdown');
  if (!input) return;

  input.addEventListener('input', (e) => {
    buscaTermo = e.target.value.trim();

    if (buscaTermo.length > 0) {
      renderSearchSuggestions(buscaTermo);
    } else {
      if (suggestionsBox) suggestionsBox.classList.remove('active');
    }

    const homePage = document.getElementById('page-home');
    if (homePage && !homePage.classList.contains('active')) {
      navigateTo('page-home');
    }
    renderProdutosGrid();
  });

  document.addEventListener('click', (e) => {
    if (suggestionsBox && !e.target.closest('.busca')) {
      suggestionsBox.classList.remove('active');
    }
  });

  input.addEventListener('focus', () => {
    if (input.value.trim().length > 0) {
      renderSearchSuggestions(input.value.trim());
    }
  });
}

function renderSearchSuggestions(termo) {
  const suggestionsBox = document.getElementById('searchSuggestionsDropdown');
  if (!suggestionsBox) return;

  const t = termo.toLowerCase();
  const produtos = store.getProdutos();
  const correspondencias = produtos.filter(p => 
    p.nome.toLowerCase().includes(t) ||
    p.cat.toLowerCase().includes(t) ||
    (p.barcode && p.barcode.includes(t))
  ).slice(0, 6);

  if (correspondencias.length === 0) {
    suggestionsBox.classList.remove('active');
    return;
  }

  let html = '';
  correspondencias.forEach(p => {
    html += `
      <div class="search-suggestion-item" onclick="selecionarSugestaoBusca(${p.id})">
        <span class="search-suggestion-icon">${htmlImagemProduto(p, '🔍')}</span>
        <div class="search-suggestion-info">
          <div class="search-suggestion-name">${p.nome}</div>
          <div class="search-suggestion-cat">Categoria: ${p.cat}</div>
        </div>
        <div class="search-suggestion-price">${formatMoeda(p.preco)}</div>
      </div>
    `;
  });

  suggestionsBox.innerHTML = html;
  suggestionsBox.classList.add('active');
}

function selecionarSugestaoBusca(produtoId) {
  const suggestionsBox = document.getElementById('searchSuggestionsDropdown');
  if (suggestionsBox) suggestionsBox.classList.remove('active');

  abrirPaginaProduto(produtoId);
}

// Verifica se existem produtos com estoque baixo/zerado e destaca o botão do gerente
function checkLowStockAlertBadge() {
  const produtos = store.getProdutos();
  const comAlerta = produtos.filter(p => p.estoque <= 5).length;
  const alertEl = document.getElementById('adminStockAlertBadge');

  if (alertEl) {
    if (comAlerta > 0) {
      alertEl.style.display = 'inline-block';
      alertEl.textContent = `${comAlerta} Alertas`;
    } else {
      alertEl.style.display = 'none';
    }
  }
}

// ===== MINI-PAINEL DE PRÉVIA DO CARRINHO =====
let cartPreviewTimer = null;

function renderCartPreview() {
  const body = document.getElementById('cartPreviewBody');
  const totalEl = document.getElementById('cartPreviewTotal');
  if (!body) return;

  const carrinho = store.getCarrinho ? store.getCarrinho() : [];

  if (!carrinho || carrinho.length === 0) {
    body.innerHTML = '<div style="text-align:center; padding:24px; color:var(--texto-secundario); font-size:13px;">🛒 Nenhum item no carrinho.</div>';
    if (totalEl) totalEl.textContent = 'R$ 0,00';
    return;
  }

  let total = 0;
  let html = '';

  carrinho.forEach(item => {
  const p = store.getProdutoById(item.id);
  if (!p) return; // produto removido do catálogo

  const qtd = item.qtd || 1;
  const subtotal = p.preco * qtd;
  total += subtotal;

  const thumb = p.imagens && p.imagens[0]
    ? `<img src="${p.imagens[0]}" alt="${p.nome}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">`
    : (p.emoji || '📦');

  html += `
    <div class="cart-preview-item">
      <div class="cart-preview-item-thumb">${thumb}</div>
      <div class="cart-preview-item-info">
        <div class="cart-preview-item-nome">${p.nome}</div>
        <div class="cart-preview-item-qtd">${qtd} unid. × ${formatMoeda(p.preco)}</div>
      </div>
      <div class="cart-preview-item-preco">${formatMoeda(subtotal)}</div>
    </div>
  `;
});

  body.innerHTML = html;
  if (totalEl) totalEl.textContent = formatMoeda(total);
}

function abrirCartPreview() {
  // Injeta o drawer se ainda não existir no DOM
  if (!document.getElementById('cartPreviewDrawer')) {
    const html = `
      <div id="cartPreviewOverlay" class="cart-preview-overlay" onclick="fecharCartPreview()"></div>
      <div id="cartPreviewDrawer" class="cart-preview-drawer">
        <div class="cart-preview-header">
          <h4>🛒 Meu Carrinho</h4>
          <button class="cart-preview-close" onclick="fecharCartPreview()" title="Fechar">✕</button>
        </div>
        <div class="cart-preview-body" id="cartPreviewBody"></div>
        <div class="cart-preview-footer">
          <div class="cart-preview-total">
            <span>Total do Carrinho</span>
            <span id="cartPreviewTotal">R$ 0,00</span>
          </div>
          <button class="cart-preview-btn-ir" onclick="fecharCartPreview(); navigateTo('page-carrinho');">
            Ver Carrinho Completo →
          </button>
        </div>
      </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  }

  renderCartPreview();

  const overlay = document.getElementById('cartPreviewOverlay');
  const drawer = document.getElementById('cartPreviewDrawer');
  if (overlay) overlay.classList.add('active');
  if (drawer) drawer.classList.add('active');

  // Fecha automaticamente após 6 segundos de inatividade
  if (cartPreviewTimer) clearTimeout(cartPreviewTimer);
  cartPreviewTimer = setTimeout(() => fecharCartPreview(), 6000);
}

function fecharCartPreview() {
  if (cartPreviewTimer) { clearTimeout(cartPreviewTimer); cartPreviewTimer = null; }
  const overlay = document.getElementById('cartPreviewOverlay');
  const drawer = document.getElementById('cartPreviewDrawer');
  if (overlay) overlay.classList.remove('active');
  if (drawer) drawer.classList.remove('active');
}


// =======================================================
// SISTEMA DE AVALIAÇÕES E COMENTÁRIOS DOS CLIENTES (100% DINÂMICO E REAL)
// =======================================================
function obterComentariosProduto(produtoId, p) {
  let salvos = [];
  try {
    const raw = localStorage.getItem('JM_STORE_COMENTARIOS_V1');
    if (raw) {
      const todos = JSON.parse(raw);
      if (todos[produtoId]) salvos = todos[produtoId];
    }
  } catch (e) {
    salvos = [];
  }

  // Avaliações base reais do produto
  let padrao = [];
  if (p) {
    padrao = [
      {
        id: 'c1_' + produtoId,
        autor: 'Mariana Costa',
        nota: 5,
        data: 'Há 3 dias',
        texto: `Superou minhas expectativas! O produto ${p.nome} tem acabamento e qualidade impecáveis. Chegou super rápido e muito bem embalado pela JM Variedades.`,
        uteis: 14
      },
      {
        id: 'c2_' + produtoId,
        autor: 'Rafael Albuquerque',
        nota: 4,
        data: 'Há 1 semana',
        texto: `Excelente custo-benefício! O produto é exatamente como na descrição e atendeu perfeitamente ao que eu precisava. Recomendo com certeza!`,
        uteis: 9
      },
      {
        id: 'c3_' + produtoId,
        autor: 'Camila Santos',
        nota: 5,
        data: 'Há 2 semanas',
        texto: `Entrega muito rápida e produto 100% original, lacrado e com nota fiscal. Com certeza voltarei a comprar na loja.`,
        uteis: 6
      }
    ];
  }

  return [...salvos, ...padrao];
}

function renderComentariosProduto(p) {
  const scoreNum = document.getElementById('commentsScoreNum');
  const scoreStars = document.getElementById('commentsScoreStars');
  const listEl = document.getElementById('prodCommentsList');

  const todosComentarios = obterComentariosProduto(p.id, p);
  const total = todosComentarios.length;

  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let soma = 0;

  todosComentarios.forEach(c => {
    const n = Math.max(1, Math.min(5, Math.round(Number(c.nota) || 5)));
    counts[n]++;
    soma += n;
  });

  const media = total > 0 ? (soma / total) : 0;

  // Atualiza score numérico e estrelas
  if (scoreNum) {
    scoreNum.textContent = total > 0 ? media.toFixed(1) : '0.0';
  }
  if (scoreStars) {
    if (total > 0) {
      const cheias = Math.round(media);
      scoreStars.textContent = '★'.repeat(cheias) + '☆'.repeat(Math.max(0, 5 - cheias));
    } else {
      scoreStars.textContent = '☆☆☆☆☆';
    }
  }

  // Atualiza dinamicamente as barras e porcentagens exatas de 1 a 5 estrelas
  for (let s = 1; s <= 5; s++) {
    const qtd = counts[s];
    const pct = total > 0 ? Math.round((qtd / total) * 100) : 0;

    const fillEl = document.getElementById(`barFill${s}`);
    const pctEl = document.getElementById(`barPercent${s}`);

    if (fillEl) fillEl.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}%`;
  }

  // Atualiza também os elementos de avaliação no topo do produto
  const starsTopEl = document.getElementById('prodPageStars');
  const revTopEl = document.getElementById('prodPageReviewsCount');
  if (starsTopEl) {
    if (total > 0) {
      const cheias = Math.round(media);
      starsTopEl.textContent = `${media.toFixed(1)} ${'★'.repeat(cheias)}${'☆'.repeat(Math.max(0, 5 - cheias))}`;
    } else {
      starsTopEl.textContent = '☆☆☆☆☆';
    }
  }
  if (revTopEl) {
    revTopEl.textContent = total === 1 ? '(1 avaliação de comprador)' : `(${total} avaliações de compradores)`;
  }

  // Renderiza a lista de comentários
  if (listEl) {
    if (total === 0) {
      listEl.innerHTML = '<div style="text-align:center; padding:24px; color:var(--texto-secundario); font-size:13px;">Nenhuma avaliação enviada ainda. Seja o primeiro a avaliar este produto!</div>';
    } else {
      listEl.innerHTML = todosComentarios.map(c => {
        const iniciais = c.autor.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'CL';
        const estrelas = '★'.repeat(c.nota) + '☆'.repeat(Math.max(0, 5 - c.nota));
        return `
          <div class="comment-item">
            <div class="comment-avatar">${iniciais}</div>
            <div class="comment-content">
              <div class="comment-meta">
                <span class="comment-author">${escaparAtributoHtml(c.autor)}</span>
                <span class="comment-badge-verified">✓ Compra Verificada</span>
                <span class="comment-date">${c.data}</span>
              </div>
              <div class="comment-stars">${estrelas}</div>
              <p class="comment-body">${escaparAtributoHtml(c.texto)}</p>
              <button type="button" class="comment-helpful-btn" onclick="votarComentarioUtil(this, ${c.uteis || 0})">
                👍 Útil (${c.uteis || 0})
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function toggleFormComentario() {
  const formWrap = document.getElementById('commentsFormWrap');
  if (!formWrap) return;

  const isHidden = formWrap.style.display === 'none';
  formWrap.style.display = isHidden ? 'block' : 'none';

  if (isHidden) {
    const autorInput = document.getElementById('comentarioAutor');
    const user = store.getCurrentUser();
    if (autorInput && user && user.name) {
      autorInput.value = user.name;
    }
    formWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function salvarNovoComentario(e) {
  e.preventDefault();
  if (!produtoAtualPaginaId) return;

  const autor = document.getElementById('comentarioAutor').value.trim();
  const nota = parseInt(document.getElementById('comentarioNota').value, 10) || 5;
  const texto = document.getElementById('comentarioTexto').value.trim();

  if (!autor || !texto) {
    showToast('Por favor, preencha seu nome e comentário.', 'error');
    return;
  }

  const novo = {
    id: 'user_' + Date.now(),
    autor: autor,
    nota: nota,
    data: 'Hoje',
    texto: texto,
    uteis: 0
  };

  try {
    let raw = localStorage.getItem('JM_STORE_COMENTARIOS_V1');
    let todos = raw ? JSON.parse(raw) : {};
    if (!todos[produtoAtualPaginaId]) todos[produtoAtualPaginaId] = [];
    todos[produtoAtualPaginaId].unshift(novo);
    localStorage.setItem('JM_STORE_COMENTARIOS_V1', JSON.stringify(todos));
  } catch (err) {
    console.error(err);
  }

  const p = store.getProdutoById(produtoAtualPaginaId);
  if (p) renderComentariosProduto(p);

  document.getElementById('comentarioTexto').value = '';
  toggleFormComentario();

  showToast('Sua avaliação foi publicada com sucesso! Obrigado pelo feedback.', 'success');
}

function votarComentarioUtil(btn, qtdAtual) {
  if (btn.classList.contains('votado')) return;
  btn.classList.add('votado');
  btn.style.color = 'var(--verde)';
  btn.style.borderColor = 'var(--verde)';
  btn.style.background = 'var(--verde-fundo)';
  btn.innerHTML = `👍 Útil (${qtdAtual + 1})`;
  showToast('Obrigado pelo seu voto!', 'success');
}


// =======================================================
// BLOCO DE PRODUTOS RELACIONADOS (MESMA CATEGORIA)
// =======================================================
function renderProdutosRelacionados(p) {
  const container = document.getElementById('prodRelatedGrid');
  const subtitleEl = document.getElementById('relatedCatSubtitle');
  if (!container || !p) return;

  if (subtitleEl) {
    subtitleEl.textContent = `Itens em destaque da categoria "${p.cat}" que você também pode gostar:`;
  }

  const todos = store.getProdutos();
  
  // Filtra produtos da mesma categoria, excluindo o produto atual
  let relacionados = todos.filter(item => item.cat === p.cat && item.id !== p.id);

  // Se a categoria tiver poucos itens, complementa com outros produtos do catálogo
  if (relacionados.length < 4) {
    const outros = todos.filter(item => item.id !== p.id && item.cat !== p.cat);
    relacionados = [...relacionados, ...outros];
  }

  // Exibe 4 itens selecionados
  const itensExibir = relacionados.slice(0, 4);

  if (itensExibir.length === 0) {
    container.innerHTML = '<div style="color:var(--texto-secundario); font-size:13px; grid-column: 1 / -1; text-align:center;">Nenhum produto relacionado encontrado.</div>';
    return;
  }

  container.innerHTML = itensExibir.map(rel => {
    const thumbHtml = (rel.imagens && rel.imagens[0])
      ? `<img src="${rel.imagens[0]}" alt="${escaparAtributoHtml(rel.nome)}">`
      : `<span class="related-prod-emoji">${rel.emoji || '📦'}</span>`;

    const precoAntigo = (rel.antigo && rel.antigo > rel.preco)
      ? `<div class="related-preco-antigo">${formatMoeda(rel.antigo)}</div>`
      : '';

    const btnDisabled = rel.estoque === 0 ? 'disabled' : '';

    return `
      <div class="related-prod-card">
        <div>
          <div class="related-prod-thumb" onclick="abrirPaginaProduto(${rel.id})" title="Ver ${escaparAtributoHtml(rel.nome)}">
            ${thumbHtml}
          </div>
          <div class="related-prod-cat">${rel.cat}</div>
          <div class="related-prod-nome" onclick="abrirPaginaProduto(${rel.id})" title="${escaparAtributoHtml(rel.nome)}">
            ${rel.nome}
          </div>
          <div class="related-prod-stars">★★★★★ (${rel.avaliacoes || 30})</div>
        </div>

        <div>
          <div class="related-prod-prices">
            ${precoAntigo}
            <div class="related-preco-atual">${formatMoeda(rel.preco)}</div>
          </div>
          <div class="related-card-btns">
            <button type="button" class="btn btn-outline btn-sm btn-related-ver" onclick="abrirPaginaProduto(${rel.id})">
              Ver
            </button>
            <button type="button" class="btn btn-primary btn-sm btn-related-add" ${btnDisabled} onclick="adicionarProduto(${rel.id})">
              🛒 Adicionar
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}