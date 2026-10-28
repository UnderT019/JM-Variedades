// ===== MÓDULO LOGÍSTICO: CÁLCULO DE FRETE E PRAZOS DE ENTREGA (JM VARIEDADES) =====
// Implementação completa da inteligência logística para determinação do valor de frete
// baseado no CEP do cliente, dimensões e cubagem dos produtos, e autopreenchimento de endereço via ViaCEP.
// REGRA RESTRITIVA: Entregas são realizadas EXCLUSIVAMENTE para a Região Sudeste do Brasil (SP, RJ, MG, ES).

const FreteLogistica = (function () {
  'use strict';

  // 1. Estados atendidos: SOMENTE a Região Sudeste do Brasil
  const ESTADOS_ATENDIDOS_SUDESTE = ['SP', 'RJ', 'MG', 'ES'];

  // 2. Centro de Distribuição Central (Origem da Carga)
  const ORIGEM_CD = {
    nome: 'Centro de Distribuição Central JM Variedades',
    cidade: 'São Paulo',
    uf: 'SP',
    cep: '01001-000',
    logradouro: 'Praça da Sé, 1 - Centro Histórico'
  };

  // 3. Tabela de Regiões Tarifárias e Prazos Específicos da Região Sudeste
  const TABELA_REGIOES_SUDESTE = {
    sp_capital: {
      chave: 'sp_capital',
      uf: 'SP',
      nome: 'São Paulo (Capital e Região Metropolitana)',
      distanciaKm: 25,
      servicos: [
        {
          id: 'sedex',
          nome: 'SEDEX Express',
          descricao: 'Entrega prioritária Correios com rastreamento hora a hora',
          prazo: 'Até 1 dia útil',
          base: 18.90,
          porKg: 2.20,
          badge: 'MAIS RÁPIDO'
        },
        {
          id: 'pac',
          nome: 'PAC Convencional',
          descricao: 'Remessa econômica Correios para todo o Sudeste',
          prazo: '2 a 3 dias úteis',
          base: 11.50,
          porKg: 1.40,
          badge: null
        },
        {
          id: 'jmexp',
          nome: 'JM Express Sudeste',
          descricao: 'Transportadora expressa oficial JM — Frota própria dedicada',
          prazo: 'Entrega expressa (até 24h)',
          base: 15.90,
          porKg: 1.80,
          badge: 'MAIS VENDIDO'
        },
        {
          id: 'retirada',
          nome: 'Retirada no CD JM (São Paulo)',
          descricao: 'Retire seu pedido sem custos em nosso Centro de Distribuição Central',
          prazo: 'Disponível em 1 dia útil',
          base: 0.00,
          porKg: 0.00,
          badge: 'GRÁTIS'
        }
      ]
    },

    sp_interior: {
      chave: 'sp_interior',
      uf: 'SP',
      nome: 'São Paulo (Interior e Litoral)',
      distanciaKm: 180,
      servicos: [
        {
          id: 'sedex',
          nome: 'SEDEX Express',
          descricao: 'Entrega rápida Correios para o interior e litoral paulista',
          prazo: '1 a 2 dias úteis',
          base: 23.90,
          porKg: 2.80,
          badge: 'MAIS RÁPIDO'
        },
        {
          id: 'pac',
          nome: 'PAC Convencional',
          descricao: 'Custo-benefício ideal para o interior do estado',
          prazo: '3 a 4 dias úteis',
          base: 14.80,
          porKg: 1.80,
          badge: null
        },
        {
          id: 'jmexp',
          nome: 'JM Express Sudeste',
          descricao: 'Linha direta rodoviária JM Express com rastreamento online',
          prazo: '2 dias úteis',
          base: 24.90,
          porKg: 2.20,
          badge: 'MAIS VENDIDO'
        }
      ]
    },

    rj: {
      chave: 'rj',
      uf: 'RJ',
      nome: 'Rio de Janeiro (Capital e Interior)',
      distanciaKm: 430,
      servicos: [
        {
          id: 'sedex',
          nome: 'SEDEX Express',
          descricao: 'Entrega aérea/expressa interestadual rápida Correios',
          prazo: '1 a 2 dias úteis',
          base: 29.90,
          porKg: 3.40,
          badge: 'MAIS RÁPIDO'
        },
        {
          id: 'pac',
          nome: 'PAC Convencional',
          descricao: 'Modalidade econômica para o estado do Rio de Janeiro',
          prazo: '4 a 6 dias úteis',
          base: 18.50,
          porKg: 2.30,
          badge: null
        },
        {
          id: 'jmexp',
          nome: 'JM Express Sudeste',
          descricao: 'Rota expressa rodoviária SP-RJ com frota dedicada',
          prazo: '2 a 3 dias úteis',
          base: 31.00,
          porKg: 3.00,
          badge: 'MAIS VENDIDO'
        }
      ]
    },

    mg: {
      chave: 'mg',
      uf: 'MG',
      nome: 'Minas Gerais (BH e Interior)',
      distanciaKm: 580,
      servicos: [
        {
          id: 'sedex',
          nome: 'SEDEX Express',
          descricao: 'Entrega prioritária para Belo Horizonte e cidades de MG',
          prazo: '2 a 3 dias úteis',
          base: 31.50,
          porKg: 3.50,
          badge: 'MAIS RÁPIDO'
        },
        {
          id: 'pac',
          nome: 'PAC Convencional',
          descricao: 'Modalidade econômica dos Correios para Minas Gerais',
          prazo: '4 a 6 dias úteis',
          base: 19.20,
          porKg: 2.40,
          badge: null
        },
        {
          id: 'jmexp',
          nome: 'JM Express Sudeste',
          descricao: 'Linha integrada de distribuição no estado de Minas Gerais',
          prazo: '2 a 4 dias úteis',
          base: 33.50,
          porKg: 3.10,
          badge: 'MAIS VENDIDO'
        }
      ]
    },

    es: {
      chave: 'es',
      uf: 'ES',
      nome: 'Espírito Santo (Vitória e Interior)',
      distanciaKm: 880,
      servicos: [
        {
          id: 'sedex',
          nome: 'SEDEX Express',
          descricao: 'Entrega expressa para Vitória e cidades do Espírito Santo',
          prazo: '2 a 3 dias úteis',
          base: 34.00,
          porKg: 3.80,
          badge: 'MAIS RÁPIDO'
        },
        {
          id: 'pac',
          nome: 'PAC Convencional',
          descricao: 'Modalidade econômica padrão Correios para o Espírito Santo',
          prazo: '5 a 7 dias úteis',
          base: 21.00,
          porKg: 2.50,
          badge: null
        },
        {
          id: 'jmexp',
          nome: 'JM Express Sudeste',
          descricao: 'Conexão rodoviária expressa JM com centros capixabas',
          prazo: '3 a 4 dias úteis',
          base: 36.50,
          porKg: 3.40,
          badge: 'MAIS VENDIDO'
        }
      ]
    }
  };

  // 4. Utilitários de Limpeza e Formatação
  function limparCEP(cep) {
    return String(cep || '').replace(/\D/g, '').slice(0, 8);
  }

  function formatarCEP(cep) {
    const limpo = limparCEP(cep);
    return limpo.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  function formatarMoeda(val) {
    return Number(val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  // 5. Verificação da Região Sudeste (SP, RJ, MG, ES)
  function isRegiaoSudeste(uf, cepLimpo) {
    const ufUpper = (uf || '').toUpperCase().trim();
    if (ufUpper) {
      return ESTADOS_ATENDIDOS_SUDESTE.includes(ufUpper);
    }
    const cepNum = parseInt(limparCEP(cepLimpo), 10);
    // Faixas de CEPs dos estados do Sudeste brasileiro:
    // SP: 01000-000 a 19999-999
    // RJ: 20000-000 a 28999-999
    // ES: 29000-000 a 29999-999
    // MG: 30000-000 a 39999-999
    return cepNum >= 1000000 && cepNum <= 39999999;
  }

  // 6. Detecção da Região Logística Tarifária dentro do Sudeste (ou fora)
  function detectarRegiaoLogistica(cepLimpo, ufOpcional) {
    const cepNum = parseInt(limparCEP(cepLimpo), 10);
    const uf = (ufOpcional || '').toUpperCase().trim();

    // 6.1 Identificação por UF
    if (uf) {
      if (!ESTADOS_ATENDIDOS_SUDESTE.includes(uf)) {
        return { atendido: false, chave: 'fora_sudeste', nome: `Estado (${uf}) - Fora do Sudeste`, uf: uf };
      }
      if (uf === 'SP') {
        if ((cepNum >= 1000000 && cepNum <= 5999999) ||
            (cepNum >= 8000000 && cepNum <= 8499999) ||
            (cepNum >= 6000000 && cepNum <= 9999999)) {
          return { atendido: true, ...TABELA_REGIOES_SUDESTE.sp_capital };
        }
        return { atendido: true, ...TABELA_REGIOES_SUDESTE.sp_interior };
      }
      if (uf === 'RJ') return { atendido: true, ...TABELA_REGIOES_SUDESTE.rj };
      if (uf === 'MG') return { atendido: true, ...TABELA_REGIOES_SUDESTE.mg };
      if (uf === 'ES') return { atendido: true, ...TABELA_REGIOES_SUDESTE.es };
    }

    // 6.2 Fallback numérico por faixa de CEP
    if (cepNum >= 1000000 && cepNum <= 9999999) {
      return { atendido: true, ...TABELA_REGIOES_SUDESTE.sp_capital };
    }
    if (cepNum >= 11000000 && cepNum <= 19999999) {
      return { atendido: true, ...TABELA_REGIOES_SUDESTE.sp_interior };
    }
    if (cepNum >= 20000000 && cepNum <= 28999999) {
      return { atendido: true, ...TABELA_REGIOES_SUDESTE.rj };
    }
    if (cepNum >= 29000000 && cepNum <= 29999999) {
      return { atendido: true, ...TABELA_REGIOES_SUDESTE.es };
    }
    if (cepNum >= 30000000 && cepNum <= 39999999) {
      return { atendido: true, ...TABELA_REGIOES_SUDESTE.mg };
    }

    // CEPs fora da Região Sudeste (>= 40.000-000 ou < 01.000-000)
    let regiaoFora = 'Outra Região';
    let ufEstimada = 'BR';
    if (cepNum >= 80000000 && cepNum <= 99999999) { regiaoFora = 'Região Sul (PR, SC, RS)'; ufEstimada = 'PR'; }
    else if (cepNum >= 70000000 && cepNum <= 79999999) { regiaoFora = 'Região Centro-Oeste (DF, GO, MT, MS)'; ufEstimada = 'DF'; }
    else if (cepNum >= 40000000 && cepNum <= 65999999) { regiaoFora = 'Região Nordeste'; ufEstimada = 'BA'; }
    else if (cepNum >= 66000000 && cepNum <= 69999999) { regiaoFora = 'Região Norte'; ufEstimada = 'AM'; }

    return { atendido: false, chave: 'fora_sudeste', nome: regiaoFora, uf: ufEstimada };
  }

  // 7. Consulta de Endereço via API Pública ViaCEP com Autopreenchimento & Fallback Offline
  async function consultarEnderecoViaCEP(cepLimpo) {
    const limpo = limparCEP(cepLimpo);
    if (limpo.length !== 8) return null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3800);

      const resp = await fetch(`https://viacep.com.br/ws/${limpo}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!resp.ok) throw new Error('Falha na resposta HTTP');
      const data = await resp.json();

      if (data && !data.erro) {
        const ufFinal = (data.uf || 'SP').toUpperCase();
        return {
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || 'São Paulo',
          uf: ufFinal,
          cep: formatarCEP(limpo),
          isSudeste: ESTADOS_ATENDIDOS_SUDESTE.includes(ufFinal),
          online: true
        };
      }
    } catch (e) {
      // Falha de rede ou timeout: segue para fallback offline inteligente
    }

    // Fallback Geográfico Offline por faixa de CEP
    const cepNum = parseInt(limpo, 10);
    let fallbackInfo = { uf: 'SP', cidade: 'São Paulo', bairro: 'Centro', logradouro: '', isSudeste: true };

    if (cepNum >= 1000000 && cepNum <= 5999999) {
      fallbackInfo = { uf: 'SP', cidade: 'São Paulo', bairro: 'Centro / Capital', logradouro: '', isSudeste: true };
    } else if (cepNum >= 6000000 && cepNum <= 9999999) {
      fallbackInfo = { uf: 'SP', cidade: 'São Paulo', bairro: 'Grande São Paulo', logradouro: '', isSudeste: true };
    } else if (cepNum >= 11000000 && cepNum <= 19999999) {
      fallbackInfo = { uf: 'SP', cidade: 'Campinas / Interior SP', bairro: 'Interior', logradouro: '', isSudeste: true };
    } else if (cepNum >= 20000000 && cepNum <= 28999999) {
      fallbackInfo = { uf: 'RJ', cidade: 'Rio de Janeiro', bairro: 'Centro', logradouro: '', isSudeste: true };
    } else if (cepNum >= 29000000 && cepNum <= 29999999) {
      fallbackInfo = { uf: 'ES', cidade: 'Vitória', bairro: 'Centro', logradouro: '', isSudeste: true };
    } else if (cepNum >= 30000000 && cepNum <= 39999999) {
      fallbackInfo = { uf: 'MG', cidade: 'Belo Horizonte', bairro: 'Centro', logradouro: '', isSudeste: true };
    } else if (cepNum >= 80000000 && cepNum <= 99999999) {
      fallbackInfo = { uf: 'PR', cidade: 'Curitiba', bairro: 'Centro', logradouro: '', isSudeste: false };
    } else if (cepNum >= 70000000 && cepNum <= 79999999) {
      fallbackInfo = { uf: 'DF', cidade: 'Brasília', bairro: 'Asa Sul', logradouro: '', isSudeste: false };
    } else if (cepNum >= 40000000 && cepNum <= 65999999) {
      fallbackInfo = { uf: 'BA', cidade: 'Salvador', bairro: 'Centro', logradouro: '', isSudeste: false };
    } else {
      fallbackInfo = { uf: 'AM', cidade: 'Manaus', bairro: 'Centro', logradouro: '', isSudeste: false };
    }

    return {
      ...fallbackInfo,
      cep: formatarCEP(limpo),
      online: false
    };
  }

  // 8. Cálculo de Cubagem e Dimensões do Pacote
  // Fator padrão Correios e logística nacional = 6.000 cm³/kg
  function calcularCubagemPacote({ dimensoes = null, pesoKg = 0.5 }) {
    const FATOR_CUBAGEM = 6000;

    let altura = 10;
    let largura = 15;
    let comprimento = 20;
    let volumeCm3 = 3000;
    let pesoReal = Math.max(0.1, Number(pesoKg) || 0.5);

    if (dimensoes && typeof dimensoes === 'object') {
      altura = Math.max(1, Number(dimensoes.altura) || 10);
      largura = Math.max(1, Number(dimensoes.largura) || 15);
      comprimento = Math.max(1, Number(dimensoes.comprimento) || 20);
      volumeCm3 = Number(dimensoes.volumeCm3) || Math.round(altura * largura * comprimento);
      if (dimensoes.pesoReal) pesoReal = Math.max(0.1, Number(dimensoes.pesoReal));
    } else {
      // Estimativa baseada no peso
      volumeCm3 = Math.max(1200, Math.round(pesoReal * 3500));
      const lado = Math.round(Math.cbrt(volumeCm3));
      altura = Math.max(8, lado - 2);
      largura = Math.max(12, lado);
      comprimento = Math.max(15, lado + 4);
    }

    // Peso Cúbico (Volumétrico): (A * L * C) / 6000
    const pesoCubico = Math.max(0.1, Math.round((volumeCm3 / FATOR_CUBAGEM) * 100) / 100);
    // Peso Tarifado: maior entre o peso real e o peso cúbico
    const pesoTarifado = Math.max(pesoReal, pesoCubico);
    const volumeM3 = volumeCm3 / 1000000;

    let tipoEmbalagem = 'Pacote Padrão';
    let taxaVolumosa = 0;
    if (volumeCm3 > 30000) {
      tipoEmbalagem = 'Pacote Grande / Volumoso';
      taxaVolumosa = 5.00;
    } else if (volumeCm3 > 12000) {
      tipoEmbalagem = 'Pacote Médio';
      taxaVolumosa = 2.00;
    }

    return {
      altura: Math.round(altura),
      largura: Math.round(largura),
      comprimento: Math.round(comprimento),
      volumeCm3: Math.round(volumeCm3),
      volumeM3: volumeM3.toFixed(4),
      volumeLitros: (volumeCm3 / 1000).toFixed(1),
      pesoRealKg: Math.round(pesoReal * 100) / 100,
      pesoCubicoKg: pesoCubico,
      pesoTarifadoKg: Math.round(pesoTarifado * 100) / 100,
      fatorCubagem: FATOR_CUBAGEM,
      tipoEmbalagem,
      taxaVolumosa,
      textoDimensoes: `${Math.round(altura)} × ${Math.round(largura)} × ${Math.round(comprimento)} cm`
    };
  }

  // 9. Motor Central de Cálculo de Frete e Prazos com Validação Exclusiva do Sudeste
  async function calcularCotacao({ cep, pesoKg = 0.5, subtotal = 0, cupom = null, dimensoes = null }) {
    const cepLimpo = limparCEP(cep);

    if (cepLimpo.length !== 8) {
      return {
        sucesso: false,
        msg: 'CEP inválido. Por favor, digite os 8 dígitos (ex.: 01001-000).'
      };
    }

    // Consulta e autopreenchimento de endereço de destino
    const endereco = await consultarEnderecoViaCEP(cepLimpo);
    const ufDestino = endereco ? endereco.uf : '';

    // VALIDAÇÃO ESTRITA: Entregas realizadas SOMENTE para a Região Sudeste do Brasil (SP, RJ, MG, ES)
    if (!isRegiaoSudeste(ufDestino, cepLimpo)) {
      const ufNome = ufDestino ? ufDestino : 'outros estados';
      const cidadeNome = endereco && endereco.cidade ? `${endereco.cidade} - ${ufNome}` : ufNome;
      return {
        sucesso: false,
        foraRegiao: true,
        cep: formatarCEP(cepLimpo),
        cepLimpo: cepLimpo,
        endereco: endereco,
        regiao: 'Região Não Atendida',
        uf: ufDestino,
        msg: `🚫 Entregas indisponíveis para ${cidadeNome}. No momento, a JM Variedades realiza entregas exclusivamente para os estados da Região Sudeste do Brasil (São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo).`
      };
    }

    const regiao = detectarRegiaoLogistica(cepLimpo, ufDestino);
    if (!regiao || !regiao.atendido) {
      return {
        sucesso: false,
        foraRegiao: true,
        cep: formatarCEP(cepLimpo),
        cepLimpo: cepLimpo,
        endereco: endereco,
        regiao: 'Região Não Atendida',
        msg: '🚫 Entregas indisponíveis. Atualmente atendemos exclusivamente os estados da Região Sudeste (SP, RJ, MG e ES).'
      };
    }

    // Cálculo da cubagem levando em consideração as dimensões dos produtos do pedido
    const cubagem = calcularCubagemPacote({ dimensoes, pesoKg });
    const subtotalVal = Number(subtotal) || 0;

    // Regra de Frete Grátis da Loja (Compras >= R$ 199,00 ou cupom FRETEGRATIS)
    const temCupomFrete = !!(cupom && (cupom.freteGratis || cupom.codigo === 'FRETEGRATIS'));
    const temFreteGratisValor = subtotalVal >= 199.00;
    const elegivelFreteGratis = temCupomFrete || temFreteGratisValor;

    // Cálculo do excedente com base no PESO TARIFADO (maior entre peso real e cúbico)
    const pesoExcedente = Math.max(0, Math.ceil(cubagem.pesoTarifadoKg - 1.0));

    // Valor de referência PAC para desconto promocional
    const pacServico = regiao.servicos.find(s => s.id === 'pac');
    const valorPacCheio = pacServico
      ? (pacServico.base + (pesoExcedente * pacServico.porKg) + cubagem.taxaVolumosa)
      : 15.00;

    const opcoes = regiao.servicos.map(serv => {
      const valorBruto = serv.base + (pesoExcedente * serv.porKg) + (serv.id === 'retirada' ? 0 : cubagem.taxaVolumosa);
      let valorFinal = valorBruto;
      let badge = serv.badge;
      let isGratis = false;

      if (serv.id === 'retirada') {
        valorFinal = 0.00;
        isGratis = true;
        badge = 'GRÁTIS';
      } else if (elegivelFreteGratis) {
        if (serv.id === 'pac') {
          valorFinal = 0.00;
          isGratis = true;
          badge = 'FRETE GRÁTIS 🎉';
        } else {
          valorFinal = Math.max(8.90, valorBruto - (valorPacCheio * 0.7));
          badge = 'SUPER DESCONTO';
        }
      }

      return {
        id: serv.id,
        nome: serv.nome,
        descricao: serv.descricao,
        prazo: serv.prazo,
        valorOriginal: Math.round(valorBruto * 100) / 100,
        valor: Math.round(valorFinal * 100) / 100,
        valorFormatado: isGratis || valorFinal === 0 ? 'GRÁTIS' : formatarMoeda(valorFinal),
        badge: badge,
        isGratis: isGratis
      };
    });

    return {
      sucesso: true,
      foraRegiao: false,
      cep: formatarCEP(cepLimpo),
      cepLimpo: cepLimpo,
      endereco: endereco,
      regiao: regiao.nome,
      uf: regiao.uf,
      distanciaKm: regiao.distanciaKm,
      origem: ORIGEM_CD,
      cubagem: cubagem,
      pesoKg: cubagem.pesoRealKg,
      pesoFormatado: cubagem.pesoRealKg.toFixed(1).replace('.', ',') + ' kg',
      pesoTarifadoFormatado: cubagem.pesoTarifadoKg.toFixed(2).replace('.', ',') + ' kg',
      subtotal: subtotalVal,
      elegivelFreteGratis: elegivelFreteGratis,
      motivoFreteGratis: temCupomFrete ? 'Cupom FRETEGRATIS' : (temFreteGratisValor ? 'Compras acima de R$ 199,00' : null),
      opcoes: opcoes
    };
  }

  // 10. Renderizador HTML das Opções de Frete
  function gerarHtmlOpcoes(cotacao, opcaoSelecionadaId, callbackOnClickNome) {
    if (!cotacao || !cotacao.sucesso || !cotacao.opcoes) return '';

    return cotacao.opcoes.map(opcao => {
      const selecionada = opcao.id === opcaoSelecionadaId ? 'selecionada' : '';
      const checked = opcao.id === opcaoSelecionadaId ? 'checked' : '';
      const badgeHtml = opcao.badge ? `<span class="badge ${opcao.isGratis ? 'badge-gratis' : ''}">${opcao.badge}</span>` : '';
      const clickAction = `${callbackOnClickNome}('${opcao.id}', ${opcao.valor}, this)`;

      return `
        <div class="opcao ${selecionada}" onclick="${clickAction}" data-frete-id="${opcao.id}" data-valor="${opcao.valor}">
          <input type="radio" name="frete_opcao" id="frete_opt_${opcao.id}" ${checked}>
          <div class="t">
            <div style="display:flex; align-items:center; gap:8px;">
              <span>${opcao.nome}</span>
              ${badgeHtml}
            </div>
            <div class="p">⏱️ ${opcao.prazo} · ${opcao.descricao}</div>
          </div>
          <div class="v ${opcao.isGratis ? 'valor-gratis' : ''}">${opcao.valorFormatado}</div>
        </div>
      `;
    }).join('');
  }

  return {
    ESTADOS_ATENDIDOS_SUDESTE,
    ORIGEM_CD,
    TABELA_REGIOES_SUDESTE,
    limparCEP,
    formatarCEP,
    formatarMoeda,
    isRegiaoSudeste,
    detectarRegiaoLogistica,
    consultarEnderecoViaCEP,
    calcularCubagemPacote,
    calcularCotacao,
    gerarHtmlOpcoes
  };
})();

// Exportação compatível com ambientes de navegador e Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FreteLogistica;
}
