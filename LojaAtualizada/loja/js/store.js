// ===== LOJA JM VARIEDADES: CAMADA DE DADOS E ESTADO (STORE - RESET PRIMEIRO ACESSO) =====

const STORAGE_KEYS = {
  PRODUTOS: 'JM_STORE_PRODUTOS_V4',
  CARRINHO: 'JM_STORE_CARRINHO_V4',
  PEDIDOS: 'JM_STORE_PEDIDOS_V4',
  HISTORICO: 'JM_STORE_HISTORICO_V4',
  CLIENTES: 'JM_STORE_CLIENTES_V4',
  CUPOM: 'JM_STORE_CUPOM_V4',
  CURRENT_USER: 'JM_CURRENT_USER_V4',
  ADMIN_LOGGED: 'JM_ADMIN_LOGGED_V4',
  FRETE_COTACAO: 'JM_STORE_FRETE_COTACAO_V4',
  FRETE_SELECIONADO: 'JM_STORE_FRETE_SELECIONADO_V4',
  ENDERECO_ENTREGA: 'JM_STORE_ENDERECO_ENTREGA_V4'
};

// ===== BANCO DE DADOS INICIAL: CLIENTES PRÉ-EXISTENTES CADASTRADOS =====
const CLIENTES_INICIAIS = [
  {
    id: 'CLI-100001',
    nome: 'João da Silva',
    email: 'joao.silva@email.com',
    senha: '123456',
    cpf: '123.456.789-00',
    telefone: '(11) 98765-4321',
    dataCadastro: '15/01/2026'
  },
  {
    id: 'CLI-100002',
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    senha: '123456',
    cpf: '234.567.890-11',
    telefone: '(21) 97654-3210',
    dataCadastro: '20/02/2026'
  },
  {
    id: 'CLI-100003',
    nome: 'Cliente Exemplo',
    email: 'cliente@jm.com',
    senha: '123456',
    cpf: '345.678.901-22',
    telefone: '(31) 96543-2109',
    dataCadastro: '10/03/2026'
  }
];

// Catalogo completo de 100 itens extraidos do arquivo de catalogo da loja
const PRODUTOS_INICIAIS = [
  {
    "id": 101,
    "barcode": "78900010077242",
    "emoji": "🏎️",
    "nome": "LEGO Speed Champions Carro de Corrida Ferrari SF-24 F1® 77242",
    "cat": "Brinquedos e Jogos",
    "desc": "Kit de Construir e de Montar LEGO Speed Champions Ferrari SF-24 Formula 1®. Contém 275 peças com piloto oficial Ferrari F1 (capacete e macacão), asas aerodinâmicas, cockpit ajustável e pneus slick Pirelli.",
    "preco": 148.29,
    "antigo": 249.99,
    "estoque": 45,
    "avaliacoes": 3547,
    "nota": 4.9,
    "oferta": true,
    "desconto": "-40%",
    "novidade": true,
    "peso": 0.45,
    "dimensoes": {
      "altura": 7,
      "largura": 14,
      "comprimento": 26
    },
    "imagens": [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 102,
    "barcode": "78900010077243",
    "emoji": "🧩",
    "nome": "Quebra-Cabeça 1000 Peças Mapa Múndi Vintage",
    "cat": "Brinquedos e Jogos",
    "desc": "Quebra-cabeça panorâmico de alta qualidade com acabamento fosco anti-reflexo e peças de encaixe preciso. Ideal para toda a família.",
    "preco": 69.9,
    "antigo": 89.9,
    "estoque": 30,
    "avaliacoes": 420,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.7,
    "dimensoes": {
      "altura": 5,
      "largura": 27,
      "comprimento": 37
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585504198199-20277593b31f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 103,
    "barcode": "78900010077244",
    "emoji": "🎲",
    "nome": "Jogo de Tabuleiro Galápagos Catan O Jogo",
    "cat": "Brinquedos e Jogos",
    "desc": "O renomado jogo de estratégia de negociação e colonização. Inclui peças em madeira, cartas de recursos e tabuleiro modular.",
    "preco": 239.9,
    "antigo": 289.9,
    "estoque": 18,
    "avaliacoes": 1280,
    "nota": 5,
    "oferta": true,
    "desconto": "-17%",
    "novidade": false,
    "peso": 1.25,
    "dimensoes": {
      "altura": 8,
      "largura": 30,
      "comprimento": 30
    },
    "imagens": [
      "https://images.unsplash.com/photo-1606503153255-59d5e417c0e9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 104,
    "barcode": "78900010077245",
    "emoji": "🧸",
    "nome": "Urso de Pelúcia Gigante 80cm Macio",
    "cat": "Brinquedos e Jogos",
    "desc": "Urso de pelúcia hipoalergênico ultra macio, preenchido com fibra siliconada atóxica.",
    "preco": 119.9,
    "antigo": 159.9,
    "estoque": 22,
    "avaliacoes": 310,
    "nota": 4.7,
    "oferta": false,
    "novidade": true,
    "peso": 1.8,
    "dimensoes": {
      "altura": 40,
      "largura": 35,
      "comprimento": 50
    },
    "imagens": [
      "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 1,
    "barcode": "7890001000001",
    "emoji": "🍳",
    "nome": "Jogo de Potes Herméticos 5 peças",
    "cat": "Casa e Cozinha",
    "desc": "Conjunto de potes transparentes com tampas de fechamento hermético.",
    "preco": 106,
    "antigo": 132.5,
    "estoque": 78,
    "avaliacoes": 83,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.85,
    "dimensoes": {
      "altura": 15,
      "largura": 20,
      "comprimento": 25
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 2,
    "barcode": "7890001000002",
    "emoji": "🍳",
    "nome": "Frigideira Antiaderente 20cm",
    "cat": "Casa e Cozinha",
    "desc": "Frigideira compacta com revestimento antiaderente e cabo ergonômico.",
    "preco": 49.9,
    "antigo": 62.38,
    "estoque": 159,
    "avaliacoes": 27,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.6,
    "dimensoes": {
      "altura": 8,
      "largura": 22,
      "comprimento": 38
    },
    "imagens": [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 3,
    "barcode": "7890001000003",
    "emoji": "🍳",
    "nome": "Panela de Pressão 4,5L",
    "cat": "Casa e Cozinha",
    "desc": "Panela de pressão de alumínio para preparo rápido de carnes, feijão e legumes.",
    "preco": 99.9,
    "antigo": 124.88,
    "estoque": 137,
    "avaliacoes": 299,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 1.7,
    "dimensoes": {
      "altura": 22,
      "largura": 24,
      "comprimento": 40
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 4,
    "barcode": "7890001000004",
    "emoji": "🍳",
    "nome": "Escorredor de Louça",
    "cat": "Casa e Cozinha",
    "desc": "Escorredor de pratos e copos com bandeja coletora de água.",
    "preco": 42.99,
    "antigo": 53.74,
    "estoque": 64,
    "avaliacoes": 154,
    "nota": 4.3,
    "oferta": true,
    "novidade": false,
    "peso": 0.95,
    "dimensoes": {
      "altura": 18,
      "largura": 35,
      "comprimento": 45
    },
    "imagens": [
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 5,
    "barcode": "7890001000005",
    "emoji": "🍳",
    "nome": "Tábua de Corte de Bambu",
    "cat": "Casa e Cozinha",
    "desc": "Tábua resistente para cortar carnes, frutas, verduras e pães.",
    "preco": 131,
    "antigo": 163.75,
    "estoque": 48,
    "avaliacoes": 186,
    "nota": 4.6,
    "oferta": false,
    "novidade": false,
    "peso": 0.75,
    "dimensoes": {
      "altura": 2,
      "largura": 25,
      "comprimento": 35
    },
    "imagens": [
      "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 6,
    "barcode": "7890001000006",
    "emoji": "🍳",
    "nome": "Garrafa Térmica 1L",
    "cat": "Casa e Cozinha",
    "desc": "Garrafa térmica para manter bebidas quentes ou frias por mais tempo.",
    "preco": 59.9,
    "antigo": 74.88,
    "estoque": 94,
    "avaliacoes": 206,
    "nota": 3.9,
    "oferta": false,
    "novidade": true,
    "peso": 0.65,
    "dimensoes": {
      "altura": 30,
      "largura": 12,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 7,
    "barcode": "7890001000007",
    "emoji": "🍳",
    "nome": "Kit 6 Copos de Vidro",
    "cat": "Casa e Cozinha",
    "desc": "Conjunto de seis copos transparentes para uso diário.",
    "preco": 27.9,
    "antigo": 34.88,
    "estoque": 162,
    "avaliacoes": 34,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 1.1,
    "dimensoes": {
      "altura": 14,
      "largura": 16,
      "comprimento": 24
    },
    "imagens": [
      "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 8,
    "barcode": "7890001000008",
    "emoji": "🍳",
    "nome": "Caneca Cerâmica 350ml",
    "cat": "Casa e Cozinha",
    "desc": "Caneca de cerâmica para café, chá e outras bebidas.",
    "preco": 120,
    "antigo": 150,
    "estoque": 104,
    "avaliacoes": 162,
    "nota": 3.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.35,
    "dimensoes": {
      "altura": 11,
      "largura": 10,
      "comprimento": 13
    },
    "imagens": [
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 9,
    "barcode": "7890001000009",
    "emoji": "🍳",
    "nome": "Pano de Prato Kit 5",
    "cat": "Casa e Cozinha",
    "desc": "Kit com cinco panos de prato de algodão para uso doméstico.",
    "preco": 134.9,
    "antigo": 168.63,
    "estoque": 155,
    "avaliacoes": 47,
    "nota": 4,
    "oferta": true,
    "novidade": false,
    "peso": 0.25,
    "dimensoes": {
      "altura": 4,
      "largura": 18,
      "comprimento": 25
    },
    "imagens": [
      "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 10,
    "barcode": "7890001000010",
    "emoji": "🧹",
    "nome": "Kit Esponjas Multiuso 10 un.",
    "cat": "Limpeza",
    "desc": "Pacote com esponjas para limpeza geral de louças e superfícies.",
    "preco": 10.5,
    "antigo": 13.13,
    "estoque": 82,
    "avaliacoes": 449,
    "nota": 5,
    "oferta": false,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 8,
      "largura": 12,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 11,
    "barcode": "7890001000011",
    "emoji": "🧹",
    "nome": "Rodo 40cm",
    "cat": "Limpeza",
    "desc": "Rodo com borracha dupla para limpeza de pisos.",
    "preco": 26,
    "antigo": 32.5,
    "estoque": 105,
    "avaliacoes": 337,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.45,
    "dimensoes": {
      "altura": 120,
      "largura": 42,
      "comprimento": 8
    },
    "imagens": [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 12,
    "barcode": "7890001000012",
    "emoji": "🧹",
    "nome": "Vassoura Multiuso",
    "cat": "Limpeza",
    "desc": "Vassoura de cerdas resistentes para áreas internas e externas.",
    "preco": 76.5,
    "antigo": 95.63,
    "estoque": 102,
    "avaliacoes": 355,
    "nota": 4.2,
    "oferta": false,
    "novidade": false,
    "peso": 0.55,
    "dimensoes": {
      "altura": 130,
      "largura": 28,
      "comprimento": 8
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 13,
    "barcode": "7890001000013",
    "emoji": "🧹",
    "nome": "Balde 12L",
    "cat": "Limpeza",
    "desc": "Balde plástico com alça reforçada para limpeza doméstica.",
    "preco": 29,
    "antigo": 36.25,
    "estoque": 163,
    "avaliacoes": 285,
    "nota": 4.6,
    "oferta": false,
    "novidade": true,
    "peso": 0.5,
    "dimensoes": {
      "altura": 32,
      "largura": 30,
      "comprimento": 30
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 14,
    "barcode": "7890001000014",
    "emoji": "🧹",
    "nome": "Pano de Microfibra Kit 5",
    "cat": "Limpeza",
    "desc": "Panos reutilizáveis de microfibra para remover poeira e sujeira.",
    "preco": 67.5,
    "antigo": 84.38,
    "estoque": 126,
    "avaliacoes": 339,
    "nota": 4.3,
    "oferta": true,
    "novidade": false,
    "peso": 0.18,
    "dimensoes": {
      "altura": 5,
      "largura": 16,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 15,
    "barcode": "7890001000015",
    "emoji": "🧹",
    "nome": "Luva de Limpeza M",
    "cat": "Limpeza",
    "desc": "Luva doméstica reutilizável para proteger as mãos durante a limpeza.",
    "preco": 64.5,
    "antigo": 80.63,
    "estoque": 91,
    "avaliacoes": 409,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 2,
      "largura": 12,
      "comprimento": 22
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584744982491-665216d95f8b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 16,
    "barcode": "7890001000016",
    "emoji": "🧹",
    "nome": "Escova Sanitária",
    "cat": "Limpeza",
    "desc": "Escova para limpeza interna de vasos sanitários com suporte.",
    "preco": 11,
    "antigo": 13.75,
    "estoque": 88,
    "avaliacoes": 45,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.25,
    "dimensoes": {
      "altura": 38,
      "largura": 12,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 17,
    "barcode": "7890001000017",
    "emoji": "🧹",
    "nome": "Flanela Multiuso Kit 3",
    "cat": "Limpeza",
    "desc": "Kit com três flanelas para móveis, vidros e superfícies delicadas.",
    "preco": 24.9,
    "antigo": 31.13,
    "estoque": 62,
    "avaliacoes": 214,
    "nota": 4.6,
    "oferta": false,
    "novidade": false,
    "peso": 0.1,
    "dimensoes": {
      "altura": 3,
      "largura": 15,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 18,
    "barcode": "7890001000018",
    "emoji": "🧹",
    "nome": "Mop Giratório",
    "cat": "Limpeza",
    "desc": "Mop com balde e sistema de centrifugação para facilitar a limpeza.",
    "preco": 79.9,
    "antigo": 99.88,
    "estoque": 44,
    "avaliacoes": 138,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 1.9,
    "dimensoes": {
      "altura": 30,
      "largura": 28,
      "comprimento": 48
    },
    "imagens": [
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 19,
    "barcode": "7890001000019",
    "emoji": "💻",
    "nome": "Fone Bluetooth TWS",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Fone sem fio compacto com estojo de carregamento.",
    "preco": 79.9,
    "antigo": 99.88,
    "estoque": 59,
    "avaliacoes": 216,
    "nota": 4.9,
    "oferta": true,
    "novidade": false,
    "peso": 0.15,
    "dimensoes": {
      "altura": 4,
      "largura": 9,
      "comprimento": 11
    },
    "imagens": [
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 20,
    "barcode": "7890001000020",
    "emoji": "💻",
    "nome": "Caixa de Som Bluetooth",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Caixa de som portátil com conexão Bluetooth e bateria recarregável.",
    "preco": 119.9,
    "antigo": 149.88,
    "estoque": 68,
    "avaliacoes": 36,
    "nota": 3.9,
    "oferta": false,
    "novidade": true,
    "peso": 0.45,
    "dimensoes": {
      "altura": 9,
      "largura": 9,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 21,
    "barcode": "7890001000021",
    "emoji": "💻",
    "nome": "Carregador USB-C 20W",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Carregador compacto com saída USB-C para smartphones e acessórios.",
    "preco": 59.9,
    "antigo": 74.88,
    "estoque": 25,
    "avaliacoes": 228,
    "nota": 4.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.1,
    "dimensoes": {
      "altura": 4,
      "largura": 8,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 22,
    "barcode": "7890001000022",
    "emoji": "💻",
    "nome": "Cabo USB-C 1m",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Cabo USB-C para carregamento e transferência de dados.",
    "preco": 19.9,
    "antigo": 24.88,
    "estoque": 64,
    "avaliacoes": 295,
    "nota": 4.4,
    "oferta": false,
    "novidade": false,
    "peso": 0.06,
    "dimensoes": {
      "altura": 2,
      "largura": 6,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 23,
    "barcode": "7890001000023",
    "emoji": "💻",
    "nome": "Cabo Lightning 1m",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Cabo compatível com dispositivos que utilizam conector Lightning.",
    "preco": 24.9,
    "antigo": 31.13,
    "estoque": 73,
    "avaliacoes": 405,
    "nota": 4.7,
    "oferta": false,
    "novidade": false,
    "peso": 0.06,
    "dimensoes": {
      "altura": 2,
      "largura": 6,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 24,
    "barcode": "7890001000024",
    "emoji": "💻",
    "nome": "Power Bank 10.000mAh",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Bateria portátil para recarregar smartphones e outros dispositivos.",
    "preco": 89.9,
    "antigo": 112.38,
    "estoque": 60,
    "avaliacoes": 13,
    "nota": 4,
    "oferta": true,
    "novidade": false,
    "peso": 0.28,
    "dimensoes": {
      "altura": 3,
      "largura": 8,
      "comprimento": 16
    },
    "imagens": [
      "https://images.unsplash.com/photo-1609592424361-b4dcf3a89e47?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 25,
    "barcode": "7890001000025",
    "emoji": "💻",
    "nome": "Suporte Veicular para Celular",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Suporte para fixação de smartphone no painel ou saída de ar do veículo.",
    "preco": 153.9,
    "antigo": 192.38,
    "estoque": 27,
    "avaliacoes": 66,
    "nota": 4.4,
    "oferta": true,
    "novidade": false,
    "peso": 0.14,
    "dimensoes": {
      "altura": 8,
      "largura": 10,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 26,
    "barcode": "7890001000026",
    "emoji": "💻",
    "nome": "Mouse Sem Fio",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Mouse óptico sem fio com receptor USB para uso em computadores.",
    "preco": 141.9,
    "antigo": 177.38,
    "estoque": 69,
    "avaliacoes": 90,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 5,
      "largura": 8,
      "comprimento": 13
    },
    "imagens": [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 27,
    "barcode": "7890001000027",
    "emoji": "💻",
    "nome": "Teclado USB ABNT2",
    "cat": "Eletrônicos e Acessórios",
    "desc": "Teclado com layout brasileiro ABNT2 para computadores.",
    "preco": 72.5,
    "antigo": 90.63,
    "estoque": 72,
    "avaliacoes": 318,
    "nota": 4.9,
    "oferta": false,
    "novidade": true,
    "peso": 0.55,
    "dimensoes": {
      "altura": 4,
      "largura": 15,
      "comprimento": 45
    },
    "imagens": [
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 28,
    "barcode": "7890001000028",
    "emoji": "📝",
    "nome": "Caderno Universitário 10 matérias",
    "cat": "Papelaria e Escritório",
    "desc": "Caderno com divisórias para organização de várias disciplinas.",
    "preco": 18,
    "antigo": 22.5,
    "estoque": 36,
    "avaliacoes": 461,
    "nota": 4.9,
    "oferta": true,
    "novidade": false,
    "peso": 0.48,
    "dimensoes": {
      "altura": 3,
      "largura": 21,
      "comprimento": 28
    },
    "imagens": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 29,
    "barcode": "7890001000029",
    "emoji": "📝",
    "nome": "Caderno Espiral 96 folhas",
    "cat": "Papelaria e Escritório",
    "desc": "Caderno espiral para anotações escolares e profissionais.",
    "preco": 49.9,
    "antigo": 62.38,
    "estoque": 69,
    "avaliacoes": 461,
    "nota": 3.9,
    "oferta": true,
    "novidade": false,
    "peso": 0.32,
    "dimensoes": {
      "altura": 2,
      "largura": 21,
      "comprimento": 28
    },
    "imagens": [
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 30,
    "barcode": "7890001000030",
    "emoji": "📝",
    "nome": "Kit Canetas Esferográficas 10",
    "cat": "Papelaria e Escritório",
    "desc": "Kit com dez canetas esferográficas de escrita suave.",
    "preco": 29,
    "antigo": 36.25,
    "estoque": 29,
    "avaliacoes": 429,
    "nota": 4.7,
    "oferta": true,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 2,
      "largura": 8,
      "comprimento": 16
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585336261026-41ff36081e7d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 31,
    "barcode": "7890001000031",
    "emoji": "📝",
    "nome": "Kit Marca-Texto 6 cores",
    "cat": "Papelaria e Escritório",
    "desc": "Conjunto com seis marca-textos em cores variadas.",
    "preco": 6.5,
    "antigo": 8.13,
    "estoque": 40,
    "avaliacoes": 293,
    "nota": 4.6,
    "oferta": false,
    "novidade": false,
    "peso": 0.14,
    "dimensoes": {
      "altura": 2,
      "largura": 9,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 32,
    "barcode": "7890001000032",
    "emoji": "📝",
    "nome": "Lápis Preto HB Kit 12",
    "cat": "Papelaria e Escritório",
    "desc": "Doze lápis HB para escrita e desenho.",
    "preco": 11.99,
    "antigo": 14.99,
    "estoque": 62,
    "avaliacoes": 398,
    "nota": 4.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.1,
    "dimensoes": {
      "altura": 2,
      "largura": 6,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585336261026-41ff36081e7d?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 33,
    "barcode": "7890001000033",
    "emoji": "📝",
    "nome": "Borracha Branca Kit 4",
    "cat": "Papelaria e Escritório",
    "desc": "Quatro borrachas brancas para apagar grafite sem danificar o papel.",
    "preco": 37.5,
    "antigo": 46.88,
    "estoque": 87,
    "avaliacoes": 355,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 2,
      "largura": 5,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 34,
    "barcode": "7890001000034",
    "emoji": "📝",
    "nome": "Apontador com Depósito",
    "cat": "Papelaria e Escritório",
    "desc": "Apontador compacto com reservatório para aparas.",
    "preco": 33.99,
    "antigo": 42.49,
    "estoque": 140,
    "avaliacoes": 138,
    "nota": 4.3,
    "oferta": true,
    "novidade": true,
    "peso": 0.05,
    "dimensoes": {
      "altura": 5,
      "largura": 4,
      "comprimento": 5
    },
    "imagens": [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 35,
    "barcode": "7890001000035",
    "emoji": "📝",
    "nome": "Tesoura Escolar 13cm",
    "cat": "Papelaria e Escritório",
    "desc": "Tesoura de ponta arredondada indicada para uso escolar.",
    "preco": 13.9,
    "antigo": 17.38,
    "estoque": 13,
    "avaliacoes": 129,
    "nota": 4.5,
    "oferta": true,
    "novidade": false,
    "peso": 0.06,
    "dimensoes": {
      "altura": 1,
      "largura": 7,
      "comprimento": 14
    },
    "imagens": [
      "https://images.unsplash.com/photo-1503792501406-2c40da09e1e2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 36,
    "barcode": "7890001000036",
    "emoji": "📝",
    "nome": "Cola Bastão 20g",
    "cat": "Papelaria e Escritório",
    "desc": "Cola em bastão para papel, cartolina e trabalhos escolares.",
    "preco": 30,
    "antigo": 37.5,
    "estoque": 26,
    "avaliacoes": 42,
    "nota": 4.6,
    "oferta": true,
    "novidade": false,
    "peso": 0.04,
    "dimensoes": {
      "altura": 10,
      "largura": 3,
      "comprimento": 3
    },
    "imagens": [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 37,
    "barcode": "7890001000037",
    "emoji": "💄",
    "nome": "Escova de Cabelo Raquete",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Escova com base ampla para desembaraçar cabelos no dia a dia.",
    "preco": 24,
    "antigo": 30,
    "estoque": 92,
    "avaliacoes": 133,
    "nota": 3.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.18,
    "dimensoes": {
      "altura": 5,
      "largura": 9,
      "comprimento": 25
    },
    "imagens": [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 38,
    "barcode": "7890001000038",
    "emoji": "💄",
    "nome": "Pente de Madeira",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Pente resistente de madeira para desembaraçar e pentear os cabelos.",
    "preco": 27.99,
    "antigo": 34.99,
    "estoque": 62,
    "avaliacoes": 382,
    "nota": 4.4,
    "oferta": false,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 1,
      "largura": 5,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1590159763121-7c9ff3149e0a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 39,
    "barcode": "7890001000039",
    "emoji": "💄",
    "nome": "Espelho de Mesa",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Espelho compacto com apoio para bancada ou penteadeira.",
    "preco": 75.99,
    "antigo": 94.99,
    "estoque": 70,
    "avaliacoes": 425,
    "nota": 4.7,
    "oferta": true,
    "novidade": false,
    "peso": 0.35,
    "dimensoes": {
      "altura": 22,
      "largura": 18,
      "comprimento": 5
    },
    "imagens": [
      "https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 40,
    "barcode": "7890001000040",
    "emoji": "💄",
    "nome": "Necessaire Média",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Necessaire com zíper para organizar produtos de higiene e beleza.",
    "preco": 37,
    "antigo": 46.25,
    "estoque": 32,
    "avaliacoes": 193,
    "nota": 4.6,
    "oferta": true,
    "novidade": false,
    "peso": 0.15,
    "dimensoes": {
      "altura": 12,
      "largura": 14,
      "comprimento": 22
    },
    "imagens": [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 41,
    "barcode": "7890001000041",
    "emoji": "💄",
    "nome": "Kit 3 Lixas de Unha",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Conjunto com três lixas para cuidados básicos das unhas.",
    "preco": 38.99,
    "antigo": 48.74,
    "estoque": 21,
    "avaliacoes": 342,
    "nota": 4.6,
    "oferta": true,
    "novidade": true,
    "peso": 0.04,
    "dimensoes": {
      "altura": 1,
      "largura": 4,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 42,
    "barcode": "7890001000042",
    "emoji": "💄",
    "nome": "Kit Pincéis de Maquiagem 8 peças",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Conjunto com oito pincéis para maquiagem facial e dos olhos.",
    "preco": 14.99,
    "antigo": 18.74,
    "estoque": 94,
    "avaliacoes": 67,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.16,
    "dimensoes": {
      "altura": 4,
      "largura": 12,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 43,
    "barcode": "7890001000043",
    "emoji": "💄",
    "nome": "Esponja de Maquiagem",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Esponja macia para aplicação e acabamento de maquiagem.",
    "preco": 25.5,
    "antigo": 31.88,
    "estoque": 145,
    "avaliacoes": 228,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.03,
    "dimensoes": {
      "altura": 7,
      "largura": 5,
      "comprimento": 5
    },
    "imagens": [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 44,
    "barcode": "7890001000044",
    "emoji": "💄",
    "nome": "Touca de Banho",
    "cat": "Beleza e Cuidados Pessoais",
    "desc": "Touca reutilizável para proteger os cabelos durante o banho.",
    "preco": 21.99,
    "antigo": 27.49,
    "estoque": 71,
    "avaliacoes": 50,
    "nota": 4.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.03,
    "dimensoes": {
      "altura": 2,
      "largura": 10,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 45,
    "barcode": "7890001000045",
    "emoji": "🐶",
    "nome": "Pote para Ração 1,5L",
    "cat": "Pet Shop",
    "desc": "Pote plástico com tampa para armazenar ração seca.",
    "preco": 62,
    "antigo": 77.5,
    "estoque": 20,
    "avaliacoes": 288,
    "nota": 4.6,
    "oferta": true,
    "novidade": false,
    "peso": 0.4,
    "dimensoes": {
      "altura": 20,
      "largura": 15,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 46,
    "barcode": "7890001000046",
    "emoji": "🐶",
    "nome": "Comedouro Inox Médio",
    "cat": "Pet Shop",
    "desc": "Comedouro de aço inoxidável para cães e gatos.",
    "preco": 110,
    "antigo": 137.5,
    "estoque": 68,
    "avaliacoes": 260,
    "nota": 4,
    "oferta": false,
    "novidade": false,
    "peso": 0.3,
    "dimensoes": {
      "altura": 7,
      "largura": 20,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 47,
    "barcode": "7890001000047",
    "emoji": "🐶",
    "nome": "Bebedouro Plástico 2L",
    "cat": "Pet Shop",
    "desc": "Recipiente plástico de dois litros para água de pets.",
    "preco": 67.99,
    "antigo": 84.99,
    "estoque": 23,
    "avaliacoes": 13,
    "nota": 4,
    "oferta": true,
    "novidade": false,
    "peso": 0.38,
    "dimensoes": {
      "altura": 22,
      "largura": 18,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 48,
    "barcode": "7890001000048",
    "emoji": "🐶",
    "nome": "Brinquedo Mordedor de Borracha",
    "cat": "Pet Shop",
    "desc": "Mordedor resistente para cães de porte pequeno e médio.",
    "preco": 128.9,
    "antigo": 161.13,
    "estoque": 124,
    "avaliacoes": 368,
    "nota": 4.1,
    "oferta": false,
    "novidade": true,
    "peso": 0.22,
    "dimensoes": {
      "altura": 8,
      "largura": 8,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 49,
    "barcode": "7890001000049",
    "emoji": "🐶",
    "nome": "Bola para Cachorro Média",
    "cat": "Pet Shop",
    "desc": "Bola de borracha para brincadeiras e exercícios.",
    "preco": 124.99,
    "antigo": 156.24,
    "estoque": 47,
    "avaliacoes": 123,
    "nota": 4,
    "oferta": true,
    "novidade": false,
    "peso": 0.15,
    "dimensoes": {
      "altura": 9,
      "largura": 9,
      "comprimento": 9
    },
    "imagens": [
      "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 50,
    "barcode": "7890001000050",
    "emoji": "🐶",
    "nome": "Arranhador de Cartão",
    "cat": "Pet Shop",
    "desc": "Arranhador compacto de papelão para gatos.",
    "preco": 126,
    "antigo": 157.5,
    "estoque": 88,
    "avaliacoes": 311,
    "nota": 3.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.65,
    "dimensoes": {
      "altura": 6,
      "largura": 24,
      "comprimento": 46
    },
    "imagens": [
      "https://images.unsplash.com/photo-1545249390-6880f6233761?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 51,
    "barcode": "7890001000051",
    "emoji": "🐶",
    "nome": "Varinha com Pena para Gatos",
    "cat": "Pet Shop",
    "desc": "Brinquedo interativo com haste e pena para estimular a atividade do gato.",
    "preco": 66.5,
    "antigo": 83.13,
    "estoque": 22,
    "avaliacoes": 53,
    "nota": 5,
    "oferta": true,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 3,
      "largura": 5,
      "comprimento": 55
    },
    "imagens": [
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 52,
    "barcode": "7890001000052",
    "emoji": "🐶",
    "nome": "Coleira Ajustável M",
    "cat": "Pet Shop",
    "desc": "Coleira com regulagem para cães de porte pequeno e médio.",
    "preco": 111,
    "antigo": 138.75,
    "estoque": 160,
    "avaliacoes": 453,
    "nota": 3.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 3,
      "largura": 5,
      "comprimento": 25
    },
    "imagens": [
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 53,
    "barcode": "7890001000053",
    "emoji": "🛠️",
    "nome": "Kit Chaves de Fenda 6 peças",
    "cat": "Ferramentas e Utilidades",
    "desc": "Conjunto de chaves com diferentes tamanhos para pequenos reparos.",
    "preco": 35,
    "antigo": 43.75,
    "estoque": 36,
    "avaliacoes": 32,
    "nota": 4.5,
    "oferta": true,
    "novidade": false,
    "peso": 0.55,
    "dimensoes": {
      "altura": 4,
      "largura": 14,
      "comprimento": 26
    },
    "imagens": [
      "https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 54,
    "barcode": "7890001000054",
    "emoji": "🛠️",
    "nome": "Fita Isolante 10m",
    "cat": "Ferramentas e Utilidades",
    "desc": "Fita isolante para pequenos reparos e organização de fios.",
    "preco": 78.99,
    "antigo": 98.74,
    "estoque": 79,
    "avaliacoes": 173,
    "nota": 4.5,
    "oferta": true,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 2,
      "largura": 7,
      "comprimento": 7
    },
    "imagens": [
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 55,
    "barcode": "7890001000055",
    "emoji": "🛠️",
    "nome": "Trena 5m",
    "cat": "Ferramentas e Utilidades",
    "desc": "Trena retrátil de cinco metros com trava.",
    "preco": 112.5,
    "antigo": 140.63,
    "estoque": 45,
    "avaliacoes": 214,
    "nota": 4.1,
    "oferta": false,
    "novidade": true,
    "peso": 0.26,
    "dimensoes": {
      "altura": 5,
      "largura": 8,
      "comprimento": 8
    },
    "imagens": [
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 56,
    "barcode": "7890001000056",
    "emoji": "🛠️",
    "nome": "Alicate Universal 8",
    "cat": "Ferramentas e Utilidades",
    "desc": "Alicate para cortes e pequenos trabalhos de manutenção.",
    "preco": 24.9,
    "antigo": 31.13,
    "estoque": 45,
    "avaliacoes": 49,
    "nota": 4.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.38,
    "dimensoes": {
      "altura": 3,
      "largura": 7,
      "comprimento": 21
    },
    "imagens": [
      "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 57,
    "barcode": "7890001000057",
    "emoji": "🛠️",
    "nome": "Martelo de Unha 25mm",
    "cat": "Ferramentas e Utilidades",
    "desc": "Martelo para trabalhos domésticos e montagem.",
    "preco": 10,
    "antigo": 12.5,
    "estoque": 73,
    "avaliacoes": 147,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.65,
    "dimensoes": {
      "altura": 4,
      "largura": 14,
      "comprimento": 32
    },
    "imagens": [
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 58,
    "barcode": "7890001000058",
    "emoji": "🛠️",
    "nome": "Estilete Reforçado",
    "cat": "Ferramentas e Utilidades",
    "desc": "Estilete com trava de segurança e lâmina substituível.",
    "preco": 24.9,
    "antigo": 31.13,
    "estoque": 36,
    "avaliacoes": 92,
    "nota": 4.2,
    "oferta": true,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 3,
      "largura": 5,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 59,
    "barcode": "7890001000059",
    "emoji": "🛠️",
    "nome": "Kit Buchas e Parafusos 50",
    "cat": "Ferramentas e Utilidades",
    "desc": "Kit com buchas e parafusos para fixações domésticas.",
    "preco": 58.9,
    "antigo": 73.63,
    "estoque": 72,
    "avaliacoes": 430,
    "nota": 3.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.28,
    "dimensoes": {
      "altura": 4,
      "largura": 10,
      "comprimento": 16
    },
    "imagens": [
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 60,
    "barcode": "7890001000060",
    "emoji": "🛠️",
    "nome": "Lanterna LED",
    "cat": "Ferramentas e Utilidades",
    "desc": "Lanterna portátil de LED para iluminação em emergências e atividades externas.",
    "preco": 70,
    "antigo": 87.5,
    "estoque": 38,
    "avaliacoes": 66,
    "nota": 3.9,
    "oferta": true,
    "novidade": false,
    "peso": 0.22,
    "dimensoes": {
      "altura": 5,
      "largura": 6,
      "comprimento": 17
    },
    "imagens": [
      "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 61,
    "barcode": "7890001000061",
    "emoji": "📦",
    "nome": "Caixa Organizadora 15L",
    "cat": "Organização e Decoração",
    "desc": "Caixa plástica empilhável para guardar objetos diversos.",
    "preco": 107.5,
    "antigo": 134.38,
    "estoque": 77,
    "avaliacoes": 119,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.85,
    "dimensoes": {
      "altura": 20,
      "largura": 28,
      "comprimento": 39
    },
    "imagens": [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 62,
    "barcode": "7890001000062",
    "emoji": "📦",
    "nome": "Cesto Organizador Grande",
    "cat": "Organização e Decoração",
    "desc": "Cesto para roupas, brinquedos, acessórios e itens domésticos.",
    "preco": 104.5,
    "antigo": 130.63,
    "estoque": 170,
    "avaliacoes": 270,
    "nota": 4.8,
    "oferta": false,
    "novidade": true,
    "peso": 0.75,
    "dimensoes": {
      "altura": 35,
      "largura": 32,
      "comprimento": 42
    },
    "imagens": [
      "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 63,
    "barcode": "7890001000063",
    "emoji": "📦",
    "nome": "Cabides Kit 10",
    "cat": "Organização e Decoração",
    "desc": "Kit com dez cabides plásticos para organização de roupas.",
    "preco": 74,
    "antigo": 92.5,
    "estoque": 31,
    "avaliacoes": 436,
    "nota": 4.6,
    "oferta": true,
    "novidade": false,
    "peso": 0.6,
    "dimensoes": {
      "altura": 12,
      "largura": 22,
      "comprimento": 42
    },
    "imagens": [
      "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 64,
    "barcode": "7890001000064",
    "emoji": "📦",
    "nome": "Colmeia Organizadora",
    "cat": "Organização e Decoração",
    "desc": "Organizador com divisórias para gavetas e roupas pequenas.",
    "preco": 48,
    "antigo": 60,
    "estoque": 93,
    "avaliacoes": 338,
    "nota": 4.7,
    "oferta": true,
    "novidade": false,
    "peso": 0.2,
    "dimensoes": {
      "altura": 10,
      "largura": 16,
      "comprimento": 36
    },
    "imagens": [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 65,
    "barcode": "7890001000065",
    "emoji": "📦",
    "nome": "Almofada Decorativa 45x45",
    "cat": "Organização e Decoração",
    "desc": "Almofada macia para sofá, cama ou poltrona.",
    "preco": 137.5,
    "antigo": 171.88,
    "estoque": 121,
    "avaliacoes": 230,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 0.45,
    "dimensoes": {
      "altura": 15,
      "largura": 45,
      "comprimento": 45
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 66,
    "barcode": "7890001000066",
    "emoji": "📦",
    "nome": "Cortina Blackout 1,40x2,20",
    "cat": "Organização e Decoração",
    "desc": "Cortina com tecido que reduz a entrada de luz no ambiente.",
    "preco": 84,
    "antigo": 105,
    "estoque": 27,
    "avaliacoes": 365,
    "nota": 4.9,
    "oferta": true,
    "novidade": false,
    "peso": 0.95,
    "dimensoes": {
      "altura": 6,
      "largura": 26,
      "comprimento": 34
    },
    "imagens": [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 67,
    "barcode": "7890001000067",
    "emoji": "📦",
    "nome": "Tapete Antiderrapante 60x90",
    "cat": "Organização e Decoração",
    "desc": "Tapete para banheiro, quarto ou entrada com base antiderrapante.",
    "preco": 127,
    "antigo": 158.75,
    "estoque": 102,
    "avaliacoes": 87,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 0.8,
    "dimensoes": {
      "altura": 3,
      "largura": 60,
      "comprimento": 90
    },
    "imagens": [
      "https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 68,
    "barcode": "7890001000068",
    "emoji": "📦",
    "nome": "Vaso Decorativo 20cm",
    "cat": "Organização e Decoração",
    "desc": "Vaso de acabamento simples para decoração de ambientes.",
    "preco": 67,
    "antigo": 83.75,
    "estoque": 86,
    "avaliacoes": 419,
    "nota": 4.2,
    "oferta": false,
    "novidade": false,
    "peso": 0.65,
    "dimensoes": {
      "altura": 22,
      "largura": 14,
      "comprimento": 14
    },
    "imagens": [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 69,
    "barcode": "7890001000069",
    "emoji": "🚗",
    "nome": "Suporte de Celular para Painel",
    "cat": "Acessórios Automotivos",
    "desc": "Suporte ajustável para smartphone com base adesiva.",
    "preco": 146,
    "antigo": 182.5,
    "estoque": 99,
    "avaliacoes": 139,
    "nota": 4.1,
    "oferta": true,
    "novidade": true,
    "peso": 0.16,
    "dimensoes": {
      "altura": 8,
      "largura": 10,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 70,
    "barcode": "7890001000070",
    "emoji": "🚗",
    "nome": "Flanela Automotiva Kit 3",
    "cat": "Acessórios Automotivos",
    "desc": "Kit de panos macios para limpeza e acabamento do veículo.",
    "preco": 103.9,
    "antigo": 129.88,
    "estoque": 151,
    "avaliacoes": 220,
    "nota": 4.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.2,
    "dimensoes": {
      "altura": 4,
      "largura": 16,
      "comprimento": 22
    },
    "imagens": [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 71,
    "barcode": "7890001000071",
    "emoji": "🚗",
    "nome": "Aromatizador Automotivo",
    "cat": "Acessórios Automotivos",
    "desc": "Aromatizador compacto para deixar o interior do carro perfumado.",
    "preco": 146.5,
    "antigo": 183.13,
    "estoque": 68,
    "avaliacoes": 421,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 8,
      "largura": 5,
      "comprimento": 5
    },
    "imagens": [
      "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 72,
    "barcode": "7890001000072",
    "emoji": "🚗",
    "nome": "Lixeira Veicular",
    "cat": "Acessórios Automotivos",
    "desc": "Pequena lixeira para manter o interior do veículo organizado.",
    "preco": 123.99,
    "antigo": 154.99,
    "estoque": 14,
    "avaliacoes": 182,
    "nota": 4,
    "oferta": true,
    "novidade": false,
    "peso": 0.14,
    "dimensoes": {
      "altura": 22,
      "largura": 15,
      "comprimento": 15
    },
    "imagens": [
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 73,
    "barcode": "7890001000073",
    "emoji": "🚗",
    "nome": "Cabo de Transferência de Bateria",
    "cat": "Acessórios Automotivos",
    "desc": "Par de cabos para auxiliar em partidas emergenciais de veículos.",
    "preco": 119.99,
    "antigo": 149.99,
    "estoque": 179,
    "avaliacoes": 427,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 1.1,
    "dimensoes": {
      "altura": 8,
      "largura": 24,
      "comprimento": 26
    },
    "imagens": [
      "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 74,
    "barcode": "7890001000074",
    "emoji": "🚗",
    "nome": "Kit Limpa Vidros Automotivo",
    "cat": "Acessórios Automotivos",
    "desc": "Conjunto básico para limpeza de vidros automotivos.",
    "preco": 44.5,
    "antigo": 55.63,
    "estoque": 35,
    "avaliacoes": 31,
    "nota": 4.3,
    "oferta": true,
    "novidade": false,
    "peso": 0.6,
    "dimensoes": {
      "altura": 24,
      "largura": 10,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 75,
    "barcode": "7890001000075",
    "emoji": "🚗",
    "nome": "Organizador de Porta-Malas",
    "cat": "Acessórios Automotivos",
    "desc": "Organizador dobrável com divisórias para objetos e ferramentas.",
    "preco": 130.5,
    "antigo": 163.13,
    "estoque": 59,
    "avaliacoes": 247,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.85,
    "dimensoes": {
      "altura": 8,
      "largura": 32,
      "comprimento": 50
    },
    "imagens": [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 76,
    "barcode": "7890001000076",
    "emoji": "🚗",
    "nome": "Capa para Volante Universal",
    "cat": "Acessórios Automotivos",
    "desc": "Capa de tamanho universal para proteção e conforto no volante.",
    "preco": 58.5,
    "antigo": 73.13,
    "estoque": 65,
    "avaliacoes": 110,
    "nota": 3.8,
    "oferta": false,
    "novidade": true,
    "peso": 0.25,
    "dimensoes": {
      "altura": 5,
      "largura": 38,
      "comprimento": 38
    },
    "imagens": [
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 77,
    "barcode": "7890001000077",
    "emoji": "⚽",
    "nome": "Bola de Futebol Campo",
    "cat": "Lazer e Esportes",
    "desc": "Bola para partidas recreativas de futebol em campo.",
    "preco": 69.9,
    "antigo": 87.38,
    "estoque": 25,
    "avaliacoes": 154,
    "nota": 5,
    "oferta": true,
    "novidade": false,
    "peso": 0.43,
    "dimensoes": {
      "altura": 22,
      "largura": 22,
      "comprimento": 22
    },
    "imagens": [
      "https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 78,
    "barcode": "7890001000078",
    "emoji": "⚽",
    "nome": "Bola de Vôlei",
    "cat": "Lazer e Esportes",
    "desc": "Bola para prática recreativa de vôlei.",
    "preco": 48.99,
    "antigo": 61.24,
    "estoque": 145,
    "avaliacoes": 26,
    "nota": 4.2,
    "oferta": false,
    "novidade": false,
    "peso": 0.28,
    "dimensoes": {
      "altura": 21,
      "largura": 21,
      "comprimento": 21
    },
    "imagens": [
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 79,
    "barcode": "7890001000079",
    "emoji": "⚽",
    "nome": "Corda de Pular",
    "cat": "Lazer e Esportes",
    "desc": "Corda ajustável para exercícios aeróbicos e recreação.",
    "preco": 22.9,
    "antigo": 28.63,
    "estoque": 53,
    "avaliacoes": 147,
    "nota": 4.5,
    "oferta": true,
    "novidade": false,
    "peso": 0.18,
    "dimensoes": {
      "altura": 5,
      "largura": 12,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 80,
    "barcode": "7890001000080",
    "emoji": "⚽",
    "nome": "Garrafa Esportiva 750ml",
    "cat": "Lazer e Esportes",
    "desc": "Garrafa reutilizável para hidratação durante treinos e atividades.",
    "preco": 14.99,
    "antigo": 18.74,
    "estoque": 96,
    "avaliacoes": 172,
    "nota": 4.7,
    "oferta": false,
    "novidade": false,
    "peso": 0.15,
    "dimensoes": {
      "altura": 26,
      "largura": 8,
      "comprimento": 8
    },
    "imagens": [
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 81,
    "barcode": "7890001000081",
    "emoji": "⚽",
    "nome": "Kit Peteca 2 un.",
    "cat": "Lazer e Esportes",
    "desc": "Duas petecas para brincadeiras e atividades ao ar livre.",
    "preco": 57,
    "antigo": 71.25,
    "estoque": 106,
    "avaliacoes": 109,
    "nota": 4.9,
    "oferta": false,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 20,
      "largura": 10,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 82,
    "barcode": "7890001000082",
    "emoji": "⚽",
    "nome": "Baralho Tradicional 54 cartas",
    "cat": "Lazer e Esportes",
    "desc": "Baralho com cinquenta e quatro cartas para jogos clássicos.",
    "preco": 37.99,
    "antigo": 47.49,
    "estoque": 8,
    "avaliacoes": 424,
    "nota": 4.4,
    "oferta": true,
    "novidade": false,
    "peso": 0.1,
    "dimensoes": {
      "altura": 2,
      "largura": 7,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1541278107931-e006523892df?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 83,
    "barcode": "7890001000083",
    "emoji": "⚽",
    "nome": "Jogo de Dominó 28 peças",
    "cat": "Lazer e Esportes",
    "desc": "Conjunto tradicional de dominó com vinte e oito peças.",
    "preco": 69.5,
    "antigo": 86.88,
    "estoque": 101,
    "avaliacoes": 352,
    "nota": 4.3,
    "oferta": false,
    "novidade": true,
    "peso": 0.35,
    "dimensoes": {
      "altura": 4,
      "largura": 12,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1563941402830-3bf420566373?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 84,
    "barcode": "7890001000084",
    "emoji": "⚽",
    "nome": "Quebra-Cabeça 500 peças",
    "cat": "Lazer e Esportes",
    "desc": "Quebra-cabeça com quinhentas peças para entretenimento.",
    "preco": 39.9,
    "antigo": 49.88,
    "estoque": 177,
    "avaliacoes": 380,
    "nota": 4.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.45,
    "dimensoes": {
      "altura": 5,
      "largura": 22,
      "comprimento": 30
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585504198199-20277593b31f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 85,
    "barcode": "7890001000085",
    "emoji": "👕",
    "nome": "Boné Unissex",
    "cat": "Moda e Acessórios",
    "desc": "Boné de modelo casual com regulagem traseira.",
    "preco": 81.9,
    "antigo": 102.38,
    "estoque": 178,
    "avaliacoes": 218,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.14,
    "dimensoes": {
      "altura": 12,
      "largura": 20,
      "comprimento": 26
    },
    "imagens": [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 86,
    "barcode": "7890001000086",
    "emoji": "👕",
    "nome": "Cinto Casual Masculino",
    "cat": "Moda e Acessórios",
    "desc": "Cinto sintético com fivela metálica para uso diário.",
    "preco": 65.5,
    "antigo": 81.88,
    "estoque": 57,
    "avaliacoes": 206,
    "nota": 4.3,
    "oferta": false,
    "novidade": false,
    "peso": 0.22,
    "dimensoes": {
      "altura": 5,
      "largura": 14,
      "comprimento": 14
    },
    "imagens": [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 87,
    "barcode": "7890001000087",
    "emoji": "👕",
    "nome": "Carteira Masculina",
    "cat": "Moda e Acessórios",
    "desc": "Carteira compacta com divisórias para cartões e dinheiro.",
    "preco": 64.5,
    "antigo": 80.63,
    "estoque": 165,
    "avaliacoes": 219,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 0.12,
    "dimensoes": {
      "altura": 2,
      "largura": 10,
      "comprimento": 12
    },
    "imagens": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 88,
    "barcode": "7890001000088",
    "emoji": "👕",
    "nome": "Carteira Feminina",
    "cat": "Moda e Acessórios",
    "desc": "Carteira compacta com compartimentos para cartões, documentos e notas.",
    "preco": 53,
    "antigo": 66.25,
    "estoque": 85,
    "avaliacoes": 232,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.18,
    "dimensoes": {
      "altura": 3,
      "largura": 11,
      "comprimento": 20
    },
    "imagens": [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 89,
    "barcode": "7890001000089",
    "emoji": "👕",
    "nome": "Óculos de Sol Casual",
    "cat": "Moda e Acessórios",
    "desc": "Óculos de sol de estilo básico para uso cotidiano.",
    "preco": 72.9,
    "antigo": 91.13,
    "estoque": 127,
    "avaliacoes": 357,
    "nota": 4.3,
    "oferta": true,
    "novidade": false,
    "peso": 0.09,
    "dimensoes": {
      "altura": 6,
      "largura": 8,
      "comprimento": 17
    },
    "imagens": [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 90,
    "barcode": "7890001000090",
    "emoji": "👕",
    "nome": "Guarda-Chuva Compacto",
    "cat": "Moda e Acessórios",
    "desc": "Guarda-chuva dobrável para carregar na mochila ou bolsa.",
    "preco": 29.9,
    "antigo": 37.38,
    "estoque": 51,
    "avaliacoes": 157,
    "nota": 4.6,
    "oferta": false,
    "novidade": true,
    "peso": 0.36,
    "dimensoes": {
      "altura": 6,
      "largura": 6,
      "comprimento": 28
    },
    "imagens": [
      "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 91,
    "barcode": "7890001000091",
    "emoji": "👕",
    "nome": "Meias Cano Médio Kit 3",
    "cat": "Moda e Acessórios",
    "desc": "Kit com três pares de meias de cano médio.",
    "preco": 51.9,
    "antigo": 64.88,
    "estoque": 31,
    "avaliacoes": 396,
    "nota": 4.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.14,
    "dimensoes": {
      "altura": 6,
      "largura": 10,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1582966772680-860e372bb558?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 92,
    "barcode": "7890001000092",
    "emoji": "👕",
    "nome": "Chaveiro Metálico",
    "cat": "Moda e Acessórios",
    "desc": "Chaveiro simples com argola metálica resistente.",
    "preco": 28.9,
    "antigo": 36.13,
    "estoque": 65,
    "avaliacoes": 87,
    "nota": 4.8,
    "oferta": false,
    "novidade": false,
    "peso": 0.05,
    "dimensoes": {
      "altura": 2,
      "largura": 5,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 93,
    "barcode": "7890001000093",
    "emoji": "🧸",
    "nome": "Caderno de Desenho",
    "cat": "Infantil",
    "desc": "Caderno com folhas para desenhos e atividades criativas.",
    "preco": 8.5,
    "antigo": 10.63,
    "estoque": 129,
    "avaliacoes": 405,
    "nota": 4.5,
    "oferta": false,
    "novidade": false,
    "peso": 0.25,
    "dimensoes": {
      "altura": 2,
      "largura": 22,
      "comprimento": 30
    },
    "imagens": [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 94,
    "barcode": "7890001000094",
    "emoji": "🧸",
    "nome": "Kit Lápis de Cor 12",
    "cat": "Infantil",
    "desc": "Conjunto com doze lápis de cor para atividades escolares e artísticas.",
    "preco": 11.99,
    "antigo": 14.99,
    "estoque": 169,
    "avaliacoes": 379,
    "nota": 4.5,
    "oferta": true,
    "novidade": false,
    "peso": 0.16,
    "dimensoes": {
      "altura": 2,
      "largura": 10,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 95,
    "barcode": "7890001000095",
    "emoji": "🧸",
    "nome": "Massinha de Modelar 6 cores",
    "cat": "Infantil",
    "desc": "Kit com seis potes de massinha colorida para modelagem.",
    "preco": 50.99,
    "antigo": 63.74,
    "estoque": 110,
    "avaliacoes": 347,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.35,
    "dimensoes": {
      "altura": 7,
      "largura": 12,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 96,
    "barcode": "7890001000096",
    "emoji": "🧸",
    "nome": "Quebra-Cabeça Infantil 60 peças",
    "cat": "Infantil",
    "desc": "Quebra-cabeça com peças maiores indicado para crianças.",
    "preco": 50,
    "antigo": 62.5,
    "estoque": 116,
    "avaliacoes": 423,
    "nota": 4.1,
    "oferta": false,
    "novidade": false,
    "peso": 0.22,
    "dimensoes": {
      "altura": 4,
      "largura": 16,
      "comprimento": 22
    },
    "imagens": [
      "https://images.unsplash.com/photo-1585504198199-20277593b31f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 97,
    "barcode": "7890001000097",
    "emoji": "🧸",
    "nome": "Jogo da Memória Animais",
    "cat": "Infantil",
    "desc": "Jogo de memória com ilustrações de animais.",
    "preco": 67.99,
    "antigo": 84.99,
    "estoque": 20,
    "avaliacoes": 446,
    "nota": 4.5,
    "oferta": true,
    "novidade": true,
    "peso": 0.2,
    "dimensoes": {
      "altura": 4,
      "largura": 15,
      "comprimento": 18
    },
    "imagens": [
      "https://images.unsplash.com/photo-1541278107931-e006523892df?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 98,
    "barcode": "7890001000098",
    "emoji": "🧸",
    "nome": "Carrinho Miniatura",
    "cat": "Infantil",
    "desc": "Carrinho de brinquedo em escala pequena para brincar e colecionar.",
    "preco": 14.5,
    "antigo": 18.13,
    "estoque": 126,
    "avaliacoes": 298,
    "nota": 4.6,
    "oferta": false,
    "novidade": false,
    "peso": 0.1,
    "dimensoes": {
      "altura": 5,
      "largura": 6,
      "comprimento": 10
    },
    "imagens": [
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 99,
    "barcode": "7890001000099",
    "emoji": "🧸",
    "nome": "Kit Bolhas de Sabão",
    "cat": "Infantil",
    "desc": "Frascos com solução para produzir bolhas de sabão.",
    "preco": 44.99,
    "antigo": 56.24,
    "estoque": 164,
    "avaliacoes": 468,
    "nota": 4.8,
    "oferta": true,
    "novidade": false,
    "peso": 0.18,
    "dimensoes": {
      "altura": 14,
      "largura": 8,
      "comprimento": 8
    },
    "imagens": [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80"
    ]
  },
  {
    "id": 100,
    "barcode": "7890001000100",
    "emoji": "🧸",
    "nome": "Pipa Infantil",
    "cat": "Infantil",
    "desc": "Pipa leve para atividades recreativas ao ar livre.",
    "preco": 38.99,
    "antigo": 48.74,
    "estoque": 48,
    "avaliacoes": 255,
    "nota": 4.7,
    "oferta": false,
    "novidade": false,
    "peso": 0.08,
    "dimensoes": {
      "altura": 2,
      "largura": 15,
      "comprimento": 60
    },
    "imagens": [
      "https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=600&auto=format&fit=crop&q=80"
    ]
  }
];

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
      localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(CLIENTES_INICIAIS));
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

  restaurarProdutosApenas() {
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    return PRODUTOS_INICIAIS;
  }

  // --- PRODUTOS ---
  getProdutos() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PRODUTOS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let modificado = false;
          parsed.forEach(p => {
            const inicial = PRODUTOS_INICIAIS.find(item => item.id === p.id);
            if (inicial) {
              if (p.peso === undefined && inicial.peso !== undefined) {
                p.peso = inicial.peso;
                modificado = true;
              }
              if (!p.dimensoes && inicial.dimensoes) {
                p.dimensoes = inicial.dimensoes;
                modificado = true;
              }
              if ((!p.imagens || p.imagens.length === 0) && inicial.imagens && inicial.imagens.length > 0) {
                p.imagens = inicial.imagens;
                modificado = true;
              }
            }
          });
          if (modificado) {
            localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler produtos do localStorage:', e);
    }
    localStorage.setItem(STORAGE_KEYS.PRODUTOS, JSON.stringify(PRODUTOS_INICIAIS));
    return PRODUTOS_INICIAIS;
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

  // --- CARRINHO DINÂMICO POR USUÁRIO ---
  getCartStorageKey() {
    const user = this.getCurrentUser();
    if (user && user.id) {
      return 'JM_STORE_CARRINHO_USER_' + user.id;
    }
    if (user && user.email) {
      const emailSafe = user.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
      return 'JM_STORE_CARRINHO_USER_' + emailSafe;
    }
    return STORAGE_KEYS.CARRINHO;
  }

  getCarrinho() {
    const key = this.getCartStorageKey();
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      // Se não houver carrinho específico para este usuário, mas houver carrinho global legado, migra:
      const globalData = localStorage.getItem(STORAGE_KEYS.CARRINHO);
      if (globalData && this.getCurrentUser()) {
        const parsed = JSON.parse(globalData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localStorage.setItem(key, globalData);
          localStorage.removeItem(STORAGE_KEYS.CARRINHO);
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler carrinho do usuário:', e);
    }
    return [];
  }

  saveCarrinho(carrinho) {
    const key = this.getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(carrinho));
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
      return { success: false, msg: `Estoque insuficiente! Disponível: ${produto.estoque} unidades.` };
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
        return { success: false, msg: `Estoque máximo atingido (${produto.estoque} unid).` };
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
    this.limparFrete();
  }

  // --- LOGÍSTICA, DIMENSÕES & PESO DE PRODUTOS ---
  obterPesoProduto(produto) {
    if (produto && typeof produto.peso === 'number' && produto.peso > 0) {
      return produto.peso;
    }
    const dim = this.obterDimensoesProduto(produto);
    return dim.peso;
  }

  obterDimensoesProduto(produto) {
    if (!produto) {
      return {
        altura: 10,
        largura: 15,
        comprimento: 20,
        volume: 3000,
        peso: 0.50,
        pesoCubico: 0.50,
        textoDimensoes: '10 × 15 × 20 cm'
      };
    }

    // Se o produto tiver dimensões próprias já cadastradas
    if (produto.dimensoes && typeof produto.dimensoes === 'object') {
      const a = Number(produto.dimensoes.altura) || 10;
      const l = Number(produto.dimensoes.largura) || 15;
      const c = Number(produto.dimensoes.comprimento) || 20;
      const v = Number(produto.dimensoes.volume) || (a * l * c);
      const p = Number(produto.peso) || Number(produto.dimensoes.peso) || 0.5;
      const pc = Math.max(0.1, Math.round((v / 6000) * 100) / 100);
      return {
        altura: a,
        largura: l,
        comprimento: c,
        volume: v,
        peso: p,
        pesoCubico: pc,
        textoDimensoes: `${a} × ${l} × ${c} cm`
      };
    }

    // Tabela refinada de dimensões por item específico ou categoria de variedades
    const id = Number(produto.id);
    let altura = 12, largura = 18, comprimento = 22, peso = 0.50;

    if (id === 101) { // LEGO F1 Ferrari
      altura = 7; largura = 14; comprimento = 26; peso = 0.45;
    } else if (id === 102) { // Quebra-Cabeça 1000 peças
      altura = 5; largura = 27; comprimento = 37; peso = 0.70;
    } else if (id === 103) { // Catan
      altura = 8; largura = 30; comprimento = 30; peso = 1.25;
    } else if (id === 104) { // Urso Pelúcia
      altura = 35; largura = 30; comprimento = 45; peso = 0.85;
    } else if (id === 1) { // Potes Herméticos
      altura = 16; largura = 18; comprimento = 28; peso = 0.90;
    } else if (id === 2) { // Frigideira
      altura = 7; largura = 22; comprimento = 38; peso = 0.55;
    } else if (id === 3) { // Panela Pressão 4,5L
      altura = 22; largura = 24; comprimento = 30; peso = 1.80;
    } else if (id === 4) { // Escorredor
      altura = 14; largura = 32; comprimento = 44; peso = 0.95;
    } else if (id === 5) { // Tábua de corte
      altura = 2; largura = 25; comprimento = 35; peso = 0.80;
    } else if (id === 6) { // Garrafa térmica
      altura = 32; largura = 12; comprimento = 12; peso = 0.60;
    } else if (id === 7) { // 6 copos de vidro
      altura = 14; largura = 16; comprimento = 24; peso = 1.40;
    } else if (id === 8) { // Caneca
      altura = 10; largura = 10; comprimento = 12; peso = 0.35;
    } else if (id === 9) { // Panos de Prato
      altura = 4; largura = 15; comprimento = 20; peso = 0.25;
    } else if (id === 10) { // Esponjas
      altura = 7; largura = 12; comprimento = 18; peso = 0.12;
    } else if (id === 11) { // Rodo
      altura = 6; largura = 40; comprimento = 120; peso = 0.65;
    } else if (id === 12) { // Vassoura
      altura = 6; largura = 25; comprimento = 125; peso = 0.60;
    } else {
      // Estimativa inteligente por Categoria de Produto
      const cat = (produto.cat || '').toLowerCase();
      if (cat.includes('brinquedos') || cat.includes('jogos')) {
        altura = 12; largura = 20; comprimento = 28; peso = 0.50;
      } else if (cat.includes('casa') || cat.includes('cozinha')) {
        altura = 16; largura = 22; comprimento = 30; peso = 0.80;
      } else if (cat.includes('limpeza')) {
        altura = 14; largura = 20; comprimento = 32; peso = 1.10;
      } else if (cat.includes('eletr')) {
        altura = 6; largura = 14; comprimento = 20; peso = 0.35;
      } else if (cat.includes('papelaria')) {
        altura = 4; largura = 22; comprimento = 30; peso = 0.30;
      } else if (cat.includes('beleza')) {
        altura = 8; largura = 12; comprimento = 16; peso = 0.25;
      } else if (cat.includes('pet')) {
        altura = 18; largura = 24; comprimento = 34; peso = 1.40;
      } else if (cat.includes('ferramenta')) {
        altura = 14; largura = 22; comprimento = 35; peso = 1.30;
      } else if (cat.includes('organiza')) {
        altura = 20; largura = 26; comprimento = 36; peso = 0.70;
      } else if (cat.includes('auto')) {
        altura = 10; largura = 18; comprimento = 26; peso = 0.80;
      } else if (cat.includes('lazer') || cat.includes('esporte')) {
        altura = 15; largura = 22; comprimento = 32; peso = 0.75;
      } else if (cat.includes('moda')) {
        altura = 5; largura = 20; comprimento = 28; peso = 0.35;
      } else if (cat.includes('infantil')) {
        altura = 14; largura = 18; comprimento = 24; peso = 0.45;
      } else {
        altura = 10; largura = 15; comprimento = 20; peso = 0.50;
      }
    }

    const volume = Math.round(altura * largura * comprimento);
    const pesoCubico = Math.max(0.1, Math.round((volume / 6000) * 100) / 100);

    return {
      altura,
      largura,
      comprimento,
      volume,
      peso: Math.round(peso * 100) / 100,
      pesoCubico,
      textoDimensoes: `${altura} × ${largura} × ${comprimento} cm`
    };
  }

  calcularDimensoesCarrinho() {
    const carrinho = this.getCarrinho();
    if (carrinho.length === 0) {
      return {
        volumeTotalCm3: 0,
        volumeM3: '0,0000',
        volumeLitros: '0,0',
        pesoRealTotal: 0,
        pesoCubicoTotal: 0,
        pesoTarifado: 0,
        caixaEstimada: { altura: 0, largura: 0, comprimento: 0, texto: '0 × 0 × 0 cm' },
        totalItens: 0
      };
    }

    let volumeTotal = 0;
    let pesoRealTotal = 0;
    let totalItens = 0;

    carrinho.forEach(item => {
      const p = this.getProdutoById(item.id);
      const dim = this.obterDimensoesProduto(p);
      volumeTotal += dim.volume * item.qtd;
      pesoRealTotal += dim.peso * item.qtd;
      totalItens += item.qtd;
    });

    const pesoCubicoTotal = Math.max(0.1, Math.round((volumeTotal / 6000) * 100) / 100);
    const pesoTarifado = Math.max(pesoRealTotal, pesoCubicoTotal);
    const volumeM3 = volumeTotal / 1000000;

    // Dimensões estimadas da caixa consolidada que comporta os itens
    const raiz = Math.cbrt(volumeTotal || 1000);
    const altCaixa = Math.max(10, Math.round(raiz * 0.85));
    const largCaixa = Math.max(15, Math.round(raiz * 1.05));
    const compCaixa = Math.max(20, Math.round(raiz * 1.25));

    return {
      volumeTotalCm3: Math.round(volumeTotal),
      volumeM3: volumeM3.toFixed(4),
      volumeLitros: (volumeTotal / 1000).toFixed(1),
      pesoRealTotal: Math.round(pesoRealTotal * 100) / 100,
      pesoCubicoTotal: pesoCubicoTotal,
      pesoTarifado: Math.round(pesoTarifado * 100) / 100,
      caixaEstimada: {
        altura: altCaixa,
        largura: largCaixa,
        comprimento: compCaixa,
        texto: `${altCaixa} × ${largCaixa} × ${compCaixa} cm`
      },
      totalItens
    };
  }

  calcularPesoCarrinho() {
    const cubagem = this.calcularDimensoesCarrinho();
    return Math.max(0.1, cubagem.pesoRealTotal || 0.5);
  }

  // --- FRETE (COTAÇÃO & SELEÇÃO) ---
  getFreteCotacao() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FRETE_COTACAO)) || null;
    } catch (e) {
      return null;
    }
  }

  saveFreteCotacao(cotacao) {
    if (cotacao) {
      localStorage.setItem(STORAGE_KEYS.FRETE_COTACAO, JSON.stringify(cotacao));
    } else {
      localStorage.removeItem(STORAGE_KEYS.FRETE_COTACAO);
    }
  }

  getFreteSelecionado() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.FRETE_SELECIONADO)) || null;
    } catch (e) {
      return null;
    }
  }

  saveFreteSelecionado(opcao) {
    if (opcao) {
      localStorage.setItem(STORAGE_KEYS.FRETE_SELECIONADO, JSON.stringify(opcao));
    } else {
      localStorage.removeItem(STORAGE_KEYS.FRETE_SELECIONADO);
    }
  }

  limparFrete() {
    localStorage.removeItem(STORAGE_KEYS.FRETE_COTACAO);
    localStorage.removeItem(STORAGE_KEYS.FRETE_SELECIONADO);
  }

  // --- PERSISTÊNCIA DO ENDEREÇO DE ENTREGA AUTOPREENCHIDO ---
  getEnderecoEntrega() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ENDERECO_ENTREGA)) || null;
    } catch (e) {
      return null;
    }
  }

  saveEnderecoEntrega(dadosEndereco) {
    if (dadosEndereco) {
      localStorage.setItem(STORAGE_KEYS.ENDERECO_ENTREGA, JSON.stringify(dadosEndereco));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ENDERECO_ENTREGA);
    }
  }

  limparEnderecoEntrega() {
    localStorage.removeItem(STORAGE_KEYS.ENDERECO_ENTREGA);
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
        msg: `Valor mínimo não atingido para este cupom! Adicione pelo menos R$ ${cupom.minVal.toFixed(2)} em produtos elegíveis.` 
      };
    }

    localStorage.setItem(STORAGE_KEYS.CUPOM, JSON.stringify(cupom));
    return { success: true, msg: `Cupom ${cupom.codigo} (${cupom.desc}) aplicado com sucesso!`, cupom };
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
        return { success: false, msg: `Estoque insuficiente para o produto ${p ? p.nome : 'desconhecido'}` };
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
        obs: `Venda para cliente ${dadosCheckout.cliente.nome}`
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

    return { success: true, msg: `Estoque de ${p.nome} atualizado para ${p.estoque} unidades.`, produto: p };
  }

    // --- BANCO DE DADOS DE CLIENTES ---
  getClientes() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CLIENTES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          let atualizou = false;
          parsed.forEach(c => {
            if (!c.senha) {
              c.senha = '123456';
              atualizou = true;
            }
          });
          if (atualizou) {
            localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(parsed));
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error('Erro ao ler clientes do banco de dados:', e);
    }
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(CLIENTES_INICIAIS));
    return CLIENTES_INICIAIS;
  }

  saveClientes(clientes) {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
  }

  getClienteById(id) {
    return this.getClientes().find(c => c.id === id);
  }

  getClienteByEmail(email) {
    const clean = String(email).trim().toLowerCase();
    return this.getClientes().find(c => c.email && c.email.toLowerCase() === clean);
  }

  // --- ATUALIZAÇÃO DE IMAGENS DO PRODUTO (REPOSIÇÃO/EDIÇÃO) ---
  atualizarImagensProduto(produtoId, imagens) {
    const produtos = this.getProdutos();
    const p = produtos.find(item => item.id === Number(produtoId));
    if (!p) return { success: false, msg: 'Produto não encontrado!' };
    p.imagens = Array.isArray(imagens) ? imagens : [];
    this.saveProdutos(produtos);
    return { success: true, produto: p };
  }

  // --- ATUALIZAÇÃO DE PESO E DIMENSÕES DO PRODUTO ---
  atualizarDimensoesProduto(produtoId, peso, dimensoes) {
    const produtos = this.getProdutos();
    const p = produtos.find(item => item.id === Number(produtoId));
    if (!p) return { success: false, msg: 'Produto não encontrado!' };
    
    if (typeof peso === 'number' && !isNaN(peso) && peso > 0) {
      p.peso = peso;
    }
    if (dimensoes && typeof dimensoes === 'object') {
      p.dimensoes = {
        altura: parseFloat(dimensoes.altura) || (p.dimensoes?.altura || 12),
        largura: parseFloat(dimensoes.largura) || (p.dimensoes?.largura || 18),
        comprimento: parseFloat(dimensoes.comprimento) || (p.dimensoes?.comprimento || 22)
      };
    }
    this.saveProdutos(produtos);
    return { success: true, produto: p };
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
      return { success: false, msg: 'Informe o nome de usuário ou e-mail!' };
    }
    if (!password) {
      return { success: false, msg: 'Informe a senha da sua conta!' };
    }

    // 1. Validação do Login de Gerente (admin / admin123)
    if (username.toLowerCase() === 'admin') {
      if (password !== 'admin123') {
        return { success: false, msg: 'Senha incorreta para as credenciais de Gerente!' };
      }
      const session = { 
        id: 'ADMIN-01',
        name: 'Gerente (admin)', 
        role: 'admin', 
        email: 'admin@jmvariedades.com.br', 
        cpf: '000.000.000-00', 
        telefone: '(11) 99999-9999' 
      };
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
      localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED, 'true');
      return { success: true, isManager: true, msg: 'Login de Gerente efetuado com sucesso! Acesso do Gerente liberado.', user: session };
    } else {
      // 2. Validação do Login de Cliente no Banco de Dados:
      // REGRA: O usuário só pode logar se possuir uma conta pré-existente
      const clientes = this.getClientes();
      const cleanUser = username.toLowerCase();
      const clienteExistente = clientes.find(c => 
        (c.email && c.email.toLowerCase() === cleanUser) || 
        (c.nome && c.nome.toLowerCase() === cleanUser)
      );

      // Validação estrita: Não cria conta automática, exige conta pré-existente!
      if (!clienteExistente) {
        return { 
          success: false, 
          msg: 'Conta não encontrada! O login só é permitido para contas pré-existentes. Cadastre-se na aba "Criar Conta de Cliente".' 
        };
      }

      // Validação da senha da conta pré-existente
      if (clienteExistente.senha && password !== clienteExistente.senha) {
        return { 
          success: false, 
          msg: 'Senha incorreta! Verifique sua senha e tente novamente.' 
        };
      }

      const session = { 
        id: clienteExistente.id,
        name: clienteExistente.nome, 
        role: 'customer', 
        email: clienteExistente.email || '', 
        cpf: clienteExistente.cpf || '', 
        telefone: clienteExistente.telefone || '' 
      };

      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
      localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
      return { success: true, isManager: false, msg: 'Bem-vindo(a) de volta, ' + clienteExistente.nome + '!', user: session };
    }
  }

  cadastrarCliente(dados) {
    if (!dados.nome || !dados.email || !dados.senha) {
      return { success: false, msg: 'Preencha os campos obrigatórios (Nome, E-mail e Senha)!' };
    }

    if (dados.senha.trim().length < 4) {
      return { success: false, msg: 'A senha deve conter no mínimo 4 caracteres!' };
    }

    const emailNormalizado = dados.email.trim().toLowerCase();
    const clientes = this.getClientes();
    const jaExiste = clientes.some(c => c.email && c.email.toLowerCase() === emailNormalizado);

    if (jaExiste) {
      return { success: false, msg: 'Este e-mail já está cadastrado no banco de dados! Faça o login ou use outro e-mail.' };
    }

    const novoCliente = {
      id: 'CLI-' + Math.floor(Math.random() * 899999 + 100000),
      nome: dados.nome.trim(),
      email: emailNormalizado,
      senha: dados.senha.trim(),
      cpf: (dados.cpf || '').trim(),
      telefone: (dados.telefone || '').trim(),
      dataCadastro: new Date().toLocaleDateString('pt-BR')
    };

    clientes.push(novoCliente);
    this.saveClientes(clientes);

    const session = { 
      id: novoCliente.id,
      name: novoCliente.nome, 
      role: 'customer', 
      email: novoCliente.email, 
      cpf: novoCliente.cpf, 
      telefone: novoCliente.telefone 
    };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(session));
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);

    return { success: true, msg: 'Conta salva no banco de dados com sucesso! Bem-vindo(a), ' + dados.nome + '!', user: session };
  }

  atualizarDadosCliente(dados) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      return { success: false, msg: 'Nenhum usuário logado!' };
    }
    if (!dados.nome || !dados.email) {
      return { success: false, msg: 'Nome e E-mail são campos obrigatórios!' };
    }

    currentUser.name = dados.nome.trim();
    currentUser.email = dados.email.trim();
    currentUser.cpf = (dados.cpf || '').trim();
    currentUser.telefone = (dados.telefone || '').trim();
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));

    const clientes = this.getClientes();
    const idx = clientes.findIndex(c => 
      (currentUser.id && c.id === currentUser.id) || 
      (c.email && c.email.toLowerCase() === currentUser.email.toLowerCase())
    );

    if (idx !== -1) {
      clientes[idx].nome = currentUser.name;
      clientes[idx].email = currentUser.email;
      clientes[idx].cpf = currentUser.cpf;
      clientes[idx].telefone = currentUser.telefone;
      this.saveClientes(clientes);
    } else {
      clientes.push({
        id: currentUser.id || ('CLI-' + Math.floor(Math.random() * 899999 + 100000)),
        nome: currentUser.name,
        email: currentUser.email,
        senha: '123456',
        cpf: currentUser.cpf,
        telefone: currentUser.telefone,
        dataCadastro: new Date().toLocaleDateString('pt-BR')
      });
      this.saveClientes(clientes);
    }

    return { success: true, msg: 'Dados cadastrais atualizados no banco de dados com sucesso!', user: currentUser };
  }

    logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED);
  }
}

const store = new Store();

// ===== IMAGENS DE PRODUTO (upload do gerente) =====
// Os produtos podem ter p.imagens = [dataURL, ...]; a 1ª é a principal. Sem imagem, usa o emoji.
function obterImagensProduto(p) {
  return (p && Array.isArray(p.imagens)) ? p.imagens.filter(Boolean) : [];
}

function escaparAtributoHtml(texto) {
  return String(texto == null ? '' : texto)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Retorna <img> da imagem principal ou o emoji de fallback
function htmlImagemProduto(p, emojiFallback, classeExtra) {
  const imgs = obterImagensProduto(p);
  if (imgs.length > 0) {
    return `<img src="${imgs[0]}" alt="${escaparAtributoHtml(p.nome)}" class="img-prod ${classeExtra || ''}">`;
  }
  return (p && p.emoji) || emojiFallback || '📦';
}