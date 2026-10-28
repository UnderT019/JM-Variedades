const fs = require('fs');

const parsedItemsJs = fs.readFileSync('C:/Users/THIAGOFERREIRAAGUIAR.AzureAD/Downloads/loja/parsed_items.js', 'utf8');

const storeCode = `// ===== LOJA JM VARIEDADES: CAMADA DE DADOS E ESTADO (STORE - RESET PRIMEIRO ACESSO) =====

const STORAGE_KEYS = {
  PRODUTOS: 'JM_STORE_PRODUTOS_V4',
  CARRINHO: 'JM_STORE_CARRINHO_V4',
  PEDIDOS: 'JM_STORE_PEDIDOS_V4',
  HISTORICO: 'JM_STORE_HISTORICO_V4',
  CLIENTES: 'JM_STORE_CLIENTES_V4',
  CUPOM: 'JM_STORE_CUPOM_V4',
  CURRENT_USER: 'JM_CURRENT_USER_V4',
  ADMIN_LOGGED: 'JM_ADMIN_LOGGED_V4'
};

${parsedItemsJs}

// Todos os 18 Cupons com Regras de Negócio e Valores Mínimos de Compra
const CUPONS_DISPONIVEIS = {
  'BEMVINDO10': { codigo: 'BEMVINDO10', porcentagem: 10, minVal: 80, categoria: null, desc: '10% OFF em todas as categorias (Mín. R$ 80)' },
  'CASA15': { codigo: 'CASA15', porcentagem: 15, minVal: 100, categoria: ['Casa e Cozinha'], desc: '15% OFF em Casa e Cozinha (Mín. R$ 100)' },
  'LIMPA20': { codigo: 'LIMPA20', porcentagem: 20, minVal: 60, categoria: ['Limpeza'], desc: '20% OFF em Limpeza (Mín. R$ 60)' },
  'TECNO12': { codigo: 'TECNO12', porcentagem: 12, minVal: 120, categoria: ['Eletrônicos e Acessórios'], desc: '12% OFF em Eletrônicos (Mín. R$ 120)' },
  'PAPEL10': { codigo: 'PAPEL10', porcentagem: 10, minVal: 40, categoria: ['Papelaria e Escritório'], desc: '10% OFF em Papelaria (Mín. R$ 40)' },
  'BELEZA15': { codigo: 'BELEZA15', porcentagem: 15, minVal: 70, categoria: ['Beleza e Cuidados Pessoais'], desc: '15% OFF em Beleza (Mín. R$ 70)' },
  'PET10': { codigo: 'PET10', porcentagem: 10, minVal: 80, categoria: ['Pet Shop'], desc: '10% OFF em Pet Shop (Mín. R$ 80)' },
  'FERRAMENTA12': { codigo: 'FERRAMENTA12', porcentagem: 12, minVal: 90, categoria: ['Ferramentas e Utilidades'], desc: '12% OFF em Ferramentas (Mín. R$ 90)' },
  'ORGANIZA20': { codigo: 'ORGANIZA20', porcentagem: 20, minVal: 100, categoria: ['Organização e Decoração'], desc: '20% OFF em Organização (Mín. R$ 100)' },
  'AUTO15': { codigo: 'AUTO15', porcentagem: 15, minVal: 100, categoria: ['Acessórios Automotivos'], desc: '15% OFF em Automotivo (Mín. R$ 100)' },
  'LAZER10': { codigo: 'LAZER10', porcentagem: 10, minVal: 50, categoria: ['Lazer e Esportes'], desc: '10% OFF em Esportes (Mín. R$ 50)' },
  'MODA15': { codigo: 'MODA15', porcentagem: 15, minVal: 60, categoria: ['Moda e Acessórios'], desc: '15% OFF em Moda (Mín. R$ 60)' },
  'KIDS20': { codigo: 'KIDS20', porcentagem: 20, minVal: 50, categoria: ['Infantil'], desc: '20% OFF em Infantil (Mín. R$ 50)' },
  'FRETEGRATIS': { codigo: 'FRETEGRATIS', freteGratis: true, minVal: 150, desc: 'Frete Grátis em compras acima de R$ 150' },
  'PIX5': { codigo: 'PIX5', porcentagem: 5, minVal: 50, exigePix: true, desc: '5% OFF extra para pagamento via PIX (Mín. R$ 50)' },
  '20REAIS': { codigo: '20REAIS', valorFixo: 20, minVal: 180, desc: 'R$ 20,00 OFF em compras acima de R$ 180' },
  'FLASH25': { codigo: 'FLASH25', porcentagem: 25, minVal: 0, produtos: ['Caderno Espiral 96 folhas', 'Bloco Adesivo 4 cores', 'Caneca Cerâmica 350ml', 'Pano de Prato Kit 5', 'Kit Esponjas Multiuso 10 un.', 'Flanela Multiuso Kit 3', 'Pente de Madeira', 'Necessaire Média', 'Chaveiro Metálico', 'Kit Bolhas de Sabão'], desc: '25% OFF em Produtos Selecionados' },
  'VOLTA10': { codigo: 'VOLTA10', porcentagem: 10, minVal: 100, desc: '10% OFF de Volta (Mín. R$ 100)' }
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    // 1. Produtos do Catálogo de 100 Itens
    if (!localStorage.getItem(STORAGE_KEYS.PRODUTOS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    }
    
    // 2. Carrinho ZERADO (Primeiro Acesso)
    if (!localStorage.getItem(STORAGE_KEYS.CARRINHO)) {
      localStorage.setItem(STORAGE_KEYS.CARRINHO, JSON.stringify([]));
    }
    
    // 3. Pedidos ZERADOS (Sem vendas prévias)
    if (!localStorage.getItem(STORAGE_KEYS.PEDIDOS)) {
      localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify([]));
    }

    // 4. Clientes ZERADOS
    if (!localStorage.getItem(STORAGE_KEYS.CLIENTES)) {
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify([]));
    }

    // 5. Histórico Inicial de Estoque (Apenas carga dos 100 itens)
    if (!localStorage.getItem(STORAGE_KEYS.HISTORICO)) {
      const historicoInicial = [];
      PRODUTOS_INICIAIS.forEach(p => {
        historicoInicial.push({
          id: 'HIST-' + Math.floor(Math.random() * 899999 + 100000),
          barcode: p.barcode,
          produtoNome: p.nome,
          timestamp: new Date().toLocaleString('pt-BR'),
          tipo: 'Entrada Inicial',
          qtd: p.estoque,
          pedidoId: 'CARGA-INICIAL',
          saldoResultante: p.estoque,
          obs: 'Carga inicial de estoque dos 100 produtos'
        });
      });
      localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(historicoInicial));
    }
  }

  resetarParaPrimeiroAcesso() {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    this.init();
  }

  // --- PRODUTOS ---
  getProdutos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUTOS)) || PRODUTOS_INICIAIS;
  }

  getProdutoById(id) {
    return this.getProdutos().find(p => p.id === Number(id));
  }

  getProdutoByBarcode(barcode) {
    const clean = String(barcode).trim();
    return this.getProdutos().find(p => p.barcode === clean);
  }

  saveProdutos(produtos) {
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(produtos));
  }

  // --- CARRINHO ---
  getCarrinho() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CARRINHO)) || [];
  }

  saveCarrinho(carrinho) {
    localStorage.setItem(STORAGE_KEYS.CARRINHO, JSON.stringify(carrinho));
  }

  adicionarAoCarrinho(produtoId, qtd = 1) {
    const produto = this.getProdutoById(produtoId);
    if (!produto || produto.estoque <= 0) {
      return { success: false, msg: 'Produto esgotado ou indisponível!' };
    }

    let carrinho = this.getCarrinho();
    const index = carrinho.findIndex(item => item.id === Number(produtoId));

    const qtdAtual = index >= 0 ? carrinho[index].qtd : 0;
    if (qtdAtual + qtd > produto.estoque) {
      return { success: false, msg: \`Estoque insuficiente! Disponível: \${produto.estoque} unidades.\` };
    }

    if (index >= 0) {
      carrinho[index].qtd += qtd;
    } else {
      carrinho.push({ id: Number(produtoId), qtd: qtd });
    }

    this.saveCarrinho(carrinho);
    return { success: true, msg: 'Produto adicionado ao carrinho!' };
  }

  atualizarQtdCarrinho(produtoId, delta) {
    let carrinho = this.getCarrinho();
    const index = carrinho.findIndex(item => item.id === Number(produtoId));
    if (index < 0) return;

    const produto = this.getProdutoById(produtoId);
    const novaQtd = carrinho[index].qtd + delta;

    if (novaQtd <= 0) {
      carrinho.splice(index, 1);
    } else {
      if (produto && novaQtd > produto.estoque) {
        return { success: false, msg: \`Estoque máximo atingido (\${produto.estoque} unid).\` };
      }
      carrinho[index].qtd = novaQtd;
    }

    this.saveCarrinho(carrinho);
    return { success: true };
  }

  removerDoCarrinho(produtoId) {
    let carrinho = this.getCarrinho();
    carrinho = carrinho.filter(item => item.id !== Number(produtoId));
    this.saveCarrinho(carrinho);
  }

  limparCarrinho() {
    this.saveCarrinho([]);
    localStorage.removeItem(STORAGE_KEYS.CUPOM);
  }

  // --- CUPOM ---
  getCupomAplicado() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CUPOM)) || null;
  }

  aplicarCupom(codigo, formaPagamento = 'pix') {
    const code = String(codigo).trim().toUpperCase();
    const cupom = CUPONS_DISPONIVEIS[code];
    if (!cupom) {
      return { success: false, msg: 'Cupom inválido ou expirado!' };
    }

    if (cupom.exigePix && formaPagamento !== 'pix') {
      return { success: false, msg: 'O cupom PIX5 exige que a forma de pagamento selecionada seja PIX!' };
    }

    const carrinho = this.getCarrinho();
    let subtotalElegivel = 0;
    let subtotalGeral = 0;

    carrinho.forEach(item => {
      const p = this.getProdutoById(item.id);
      if (p) {
        const itemSub = p.preco * item.qtd;
        subtotalGeral += itemSub;

        if (!cupom.categoria && !cupom.produtos) {
          subtotalElegivel += itemSub;
        } else if (cupom.categoria && cupom.categoria.includes(p.cat)) {
          subtotalElegivel += itemSub;
        } else if (cupom.produtos && cupom.produtos.includes(p.nome)) {
          subtotalElegivel += itemSub;
        }
      }
    });

    const valorParaMinimo = (cupom.categoria || cupom.produtos) ? subtotalElegivel : subtotalGeral;

    if (cupom.minVal && valorParaMinimo < cupom.minVal) {
      return { 
        success: false, 
        msg: \`Valor mínimo não atingido para este cupom! Adicione pelo menos R$ \${cupom.minVal.toFixed(2)} em produtos elegíveis.\` 
      };
    }

    localStorage.setItem(STORAGE_KEYS.CUPOM, JSON.stringify(cupom));
    return { success: true, msg: \`Cupom \${cupom.codigo} (\${cupom.desc}) aplicado com sucesso!\`, cupom };
  }

  removerCupom() {
    localStorage.removeItem(STORAGE_KEYS.CUPOM);
  }

  // --- PEDIDOS & ESTOQUE ---
  getPedidos() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PEDIDOS)) || [];
  }

  finalizarPedido(dadosCheckout) {
    const carrinho = this.getCarrinho();
    if (carrinho.length === 0) {
      return { success: false, msg: 'O carrinho está vazio!' };
    }

    const produtos = this.getProdutos();
    const historico = this.getHistorico();
    const pedidoId = 'JM-' + Math.floor(Math.random() * 899999 + 100000);
    const dataAtual = new Date().toLocaleString('pt-BR');

    for (const item of carrinho) {
      const p = produtos.find(prod => prod.id === item.id);
      if (!p || p.estoque < item.qtd) {
        return { success: false, msg: \`Estoque insuficiente para o produto \${p ? p.nome : 'desconhecido'}\` };
      }
    }

    const itensPedido = [];
    carrinho.forEach(item => {
      const p = produtos.find(prod => prod.id === item.id);
      p.estoque -= item.qtd;

      historico.unshift({
        id: 'HIST-' + Math.floor(Math.random() * 899999 + 100000),
        barcode: p.barcode,
        produtoNome: p.nome,
        timestamp: dataAtual,
        tipo: 'Venda (Checkout H003)',
        qtd: -item.qtd,
        pedidoId: pedidoId,
        saldoResultante: p.estoque,
        obs: \`Venda para cliente \${dadosCheckout.cliente.nome}\`
      });

      itensPedido.push({
        id: p.id,
        nome: p.nome,
        emoji: p.emoji,
        cat: p.cat,
        preco: p.preco,
        qtd: item.qtd,
        subtotal: p.preco * item.qtd
      });
    });

    this.saveProdutos(produtos);
    localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(historico));

    const novoPedido = {
      id: pedidoId,
      data: dataAtual,
      cliente: dadosCheckout.cliente,
      endereco: dadosCheckout.endereco,
      itens: itensPedido,
      subtotal: dadosCheckout.subtotal,
      desconto: dadosCheckout.desconto,
      cupomCodigo: dadosCheckout.cupomCodigo || null,
      frete: dadosCheckout.frete,
      total: dadosCheckout.total,
      metodoPagamento: dadosCheckout.metodoPagamento,
      status: dadosCheckout.metodoPagamento === 'cartao' ? 'Pago' : 'Aguardando Pagamento'
    };

    const pedidos = this.getPedidos();
    pedidos.unshift(novoPedido);
    localStorage.setItem(STORAGE_KEYS.PEDIDOS, JSON.stringify(pedidos));

    this.limparCarrinho();

    return { success: true, pedido: novoPedido };
  }

  // --- HISTÓRICO DE AUDITORIA DE PRODUTO ---
  getHistorico() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORICO)) || [];
  }

  getHistoricoByBarcode(barcode) {
    const clean = String(barcode).trim();
    return this.getHistorico().filter(h => h.barcode === clean);
  }

  reporEstoque(produtoId, qtdAdicionada, motivo = 'Reabastecimento Gerencial') {
    const produtos = this.getProdutos();
    const p = produtos.find(item => item.id === Number(produtoId));
    if (!p) return { success: false, msg: 'Produto não encontrado!' };

    const qtd = Number(qtdAdicionada);
    if (isNaN(qtd) || qtd <= 0) return { success: false, msg: 'Quantidade inválida!' };

    p.estoque += qtd;
    this.saveProdutos(produtos);

    const historico = this.getHistorico();
    historico.unshift({
      id: 'HIST-' + Math.floor(Math.random() * 899999 + 100000),
      barcode: p.barcode,
      produtoNome: p.nome,
      timestamp: new Date().toLocaleString('pt-BR'),
      tipo: 'Entrada de Estoque',
      qtd: +qtd,
      pedidoId: 'REPOSICAO-GERENTE',
      saldoResultante: p.estoque,
      obs: motivo
    });
    localStorage.setItem(STORAGE_KEYS.HISTORICO, JSON.stringify(historico));

    return { success: true, msg: \`Estoque de \${p.nome} atualizado para \${p.estoque} unidades.\`, produto: p };
  }

  // --- SESSÃO E AUTENTICAÇÃO DO USUÁRIO & GERENTE ---
  getCurrentUser() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) || null;
  }

  isAdminLogged() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  loginUser(user, pass) {
    const username = String(user).trim();
    const password = String(pass).trim();
    if (!username) {
      return { success: false, msg: 'Informe o nome de usuário!' };
    }

    // Aceita 'admin' (maiúsculas/minúsculas) com a senha 'admin123' ou aceita senha padrão
    if (username.toLowerCase() === 'admin' && (password === 'admin123' || password === '')) {
      const session = { name: 'Gerente (admin)', role: 'admin' };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, 'true');
      return { success: true, isManager: true, msg: 'Login de Gerente efetuado com sucesso! O painel do gerente agora está liberado.', user: session };
    } else {
      const session = { name: username, role: 'customer' };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
      localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
      return { success: true, isManager: false, msg: \`Bem-vindo(a), \${username}!\`, user: session };
    }
  }

  cadastrarCliente(dados) {
    if (!dados.nome || !dados.email) {
      return { success: false, msg: 'Preencha os campos obrigatórios (Nome e E-mail)!' };
    }

    const clientes = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLIENTES)) || [];
    const novoCliente = {
      id: 'CLI-' + Math.floor(Math.random() * 899999 + 100000),
      nome: dados.nome,
      email: dados.email,
      cpf: dados.cpf || '',
      telefone: dados.telefone || '',
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    clientes.push(novoCliente);
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));

    const session = { name: dados.nome, role: 'customer', email: dados.email };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);

    return { success: true, msg: \`Conta criada com sucesso! Bem-vindo(a), \${dados.nome}!\`, user: session };
  }

  logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
  }
}

const store = new Store();
`;

fs.writeFileSync('C:/Users/THIAGOFERREIRAAGUIAR.AzureAD/Downloads/loja/loja/jm/js/store.js', storeCode);
console.log("store.js built successfully!");
