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
    return (uEmail && pEmail === uEmail) || (uNome && pNome === uNome);
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
    const statusIcon = isPago ? '✓' : '⏳';

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

// Modal de Detalhes do Produto (Inspirado no LEGO Ferrari SF-24)
let produtoDetalhesAtualId = null;

// Galeria de imagens no modal de detalhes do produto
function renderGaleriaDetalhe(p) {
  const principal = document.getElementById('modalDetEmoji');
  const miniaturas = document.getElementById('modalDetMiniaturas');
  const imgs = obterImagensProduto(p);

  if (imgs.length > 0) {
    principal.innerHTML = `<img id="modalDetImgPrincipal" src="${imgs[0]}" alt="${escaparAtributoHtml(p.nome)}" class="img-prod img-prod-detalhe">`;
    if (miniaturas) {
      miniaturas.innerHTML = imgs.length > 1
        ? imgs.map((src, i) => `<img src="${src}" alt="Imagem ${i + 1}" class="mini-img ${i === 0 ? 'ativa' : ''}" onclick="trocarImagemDetalhe(this)">`).join('')
        : '';
    }
  } else {
    principal.textContent = p.emoji || '📦';
    if (miniaturas) miniaturas.innerHTML = '';
  }
}

function trocarImagemDetalhe(miniEl) {
  const principal = document.getElementById('modalDetImgPrincipal');
  if (principal) principal.src = miniEl.src;
  document.querySelectorAll('#modalDetMiniaturas .mini-img').forEach(el => el.classList.remove('ativa'));
  miniEl.classList.add('ativa');
}

function abrirModalDetalhes(produtoId) {
  const p = store.getProdutoById(produtoId);
  if (!p) return;

  produtoDetalhesAtualId = produtoId;
  const modal = document.getElementById('modalDetalhesProduto');
  if (!modal) return;

  document.getElementById('modalDetCat').textContent = `${p.cat} › Produto Oficial`;
  renderGaleriaDetalhe(p);
  document.getElementById('modalDetNome').textContent = p.nome;
  document.getElementById('modalDetNota').textContent = `${p.nota || 4.9} ★★★★★`;
  document.getElementById('modalDetAvaliacoes').textContent = `(${p.avaliacoes || 120} avaliações de compradores)`;
  document.getElementById('modalDetPreco').textContent = formatMoeda(p.preco);
  
  const antigoEl = document.getElementById('modalDetAntigo');
  const badgeEl = document.getElementById('modalDetDescontoBadge');
  if (p.antigo && p.antigo > p.preco) {
    antigoEl.style.display = 'inline';
    antigoEl.textContent = `De: ${formatMoeda(p.antigo)}`;
    badgeEl.style.display = 'inline-block';
    badgeEl.textContent = p.desconto || `-${Math.round((1 - p.preco / p.antigo) * 100)}% OFERTA`;
  } else {
    antigoEl.style.display = 'none';
    badgeEl.style.display = 'none';
  }

  const parcVal = (p.preco / 4).toFixed(2).replace('.', ',');
  document.getElementById('modalDetParcelas').textContent = `Em até 4x de R$ ${parcVal} sem juros no cartão`;
  document.getElementById('modalDetDesc').textContent = p.desc || `${p.nome} - Produto original com garantia de fábrica e entrega rápida JM Variedades.`;
  document.getElementById('modalDetBarcode').textContent = p.barcode || '7890001000000';

  const statusEst = document.getElementById('modalDetEstoqueStatus');
  if (p.estoque === 0) {
    statusEst.style.background = 'var(--vermelho-fundo)';
    statusEst.style.color = 'var(--vermelho)';
    statusEst.style.borderColor = 'var(--vermelho)';
    statusEst.textContent = '🔴 Esgotado no Momento';
  } else if (p.estoque <= 5) {
    statusEst.style.background = 'var(--laranja-pastel)';
    statusEst.style.color = 'var(--laranja-escuro)';
    statusEst.style.borderColor = 'var(--laranja-escuro)';
    statusEst.textContent = `⚡ Poucas Unidades (Restam ${p.estoque})`;
  } else {
    statusEst.style.background = 'var(--verde-fundo)';
    statusEst.style.color = 'var(--verde)';
    statusEst.style.borderColor = 'var(--verde)';
    statusEst.textContent = `✓ Em Estoque (${p.estoque} unidades à pronta entrega)`;
  }

  const btnAdd = document.getElementById('btnModalAddCarrinho');
  const btnBuy = document.getElementById('btnModalComprarAgora');
  if (btnAdd) {
    btnAdd.disabled = p.estoque === 0;
    btnAdd.onclick = () => {
      adicionarProduto(p.id);
      fecharModalDetalhes();
    };
  }
  if (btnBuy) {
    btnBuy.disabled = p.estoque === 0;
    btnBuy.onclick = () => {
      adicionarProduto(p.id);
      fecharModalDetalhes();
      navigateTo('page-carrinho');
    };
  }

  const inputFreteMod = document.getElementById('cepModalProduto');
  const resFreteMod = document.getElementById('resultadoFreteModalProduto');
  if (resFreteMod) resFreteMod.innerHTML = '';
  if (inputFreteMod) {
    const cotacao = typeof store.getFreteCotacao === 'function' ? store.getFreteCotacao() : null;
    if (cotacao && cotacao.cep) {
      inputFreteMod.value = cotacao.cep;
      if (typeof calcularFreteProdutoModal === 'function') {
        calcularFreteProdutoModal();
      }
    } else {
      inputFreteMod.value = '';
    }
  }

  modal.classList.add('active');
}

function fecharModalDetalhes() {
  const modal = document.getElementById('modalDetalhesProduto');
  if (modal) modal.classList.remove('active');
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
        <div class="prod-thumb" onclick="abrirModalDetalhes(${p.id})" style="cursor:pointer;" title="Clique para ver todos os detalhes do produto">${htmlImagemProduto(p)}</div>
        <div class="prod-body">
          <div class="prod-cat">${p.cat}</div>
          <div class="prod-nome" onclick="abrirModalDetalhes(${p.id})" style="cursor:pointer;" title="Clique para ver os detalhes">${p.nome}</div>
          <div class="prod-barcode" title="Código EAN-13">║▌ ${p.barcode}</div>
          <div class="prod-stars">★★★★★ (${p.avaliacoes || 50})</div>
          
          <div class="prod-precos">
            ${p.antigo ? `<div class="preco-antigo">${formatMoeda(p.antigo)}</div>` : ''}
            <div class="preco-atual">${formatMoeda(p.preco)}</div>
            ${stockText}
          </div>

          <div style="display:flex; gap:8px; margin-top:12px;">
            <button class="btn btn-outline btn-sm" onclick="abrirModalDetalhes(${p.id})" style="flex:1;">ℹ️ Detalhes</button>
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

function adicionarProduto(id) {
  // Validação: usuário deve estar logado para adicionar ao carrinho
  if (!store.getCurrentUser()) {
    showToast('Faça login para prosseguir com a compra.', 'error');
    abrirModalLogin();
    return;
  }

  const res = store.adicionarAoCarrinho(id, 1);
  if (res.success) {
    showToast(res.msg, 'success');
    renderCarrinho();
  } else {
    showToast(res.msg, 'error');
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

  abrirModalDetalhes(produtoId);
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
