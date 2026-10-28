const fs = require('fs');

const path = 'C:/Users/THIAGOFERREIRAAGUIAR.AzureAD/Downloads/loja/catalogo_loja_variedades_100_itens.txt';
const text = fs.readFileSync(path, 'utf8');

const items = [];
const blocks = text.split(/------------------------------------------------------------------------------------------------------------------------/);

const categoryEmojis = {
  "Casa e Cozinha": "🍳",
  "Limpeza": "🧹",
  "Eletrônicos e Acessórios": "💻",
  "Papelaria e Escritório": "📝",
  "Beleza e Cuidados Pessoais": "💄",
  "Pet Shop": "🐶",
  "Ferramentas e Utilidades": "🛠️",
  "Organização e Decoração": "📦",
  "Acessórios Automotivos": "🚗",
  "Lazer e Esportes": "⚽",
  "Moda e Acessórios": "👕",
  "Infantil": "🧸"
};

let id = 1;
for (const block of blocks) {
  if (!block.includes("Código de barras:")) continue;

  const barcodeMatch = block.match(/Código de barras:\s*(\d+)/);
  const prodMatch = block.match(/Produto:\s*(.+)/);
  const catMatch = block.match(/Categoria:\s*(.+)/);
  const descMatch = block.match(/Descrição:\s*(.+)/);
  const precoMatch = block.match(/Preço:\s*R\$\s*([\d\.]+)/);
  const estMatch = block.match(/Quantidade em estoque:\s*(\d+)/);
  const avalMatch = block.match(/Avaliação:\s*([\d\.\,]+)/);
  const avalQtdMatch = block.match(/Quantidade de avaliações:\s*(\d+)/);

  if (barcodeMatch && prodMatch && catMatch && precoMatch) {
    const cat = catMatch[1].trim();
    const barcode = barcodeMatch[1].trim();
    const nome = prodMatch[1].trim();
    const desc = descMatch ? descMatch[1].trim() : "";
    const preco = parseFloat(precoMatch[1]);
    const estoque = parseInt(estMatch[1], 10);
    const avaliacaoStr = avalMatch ? avalMatch[1].replace(',', '.') : "4.5";
    const avaliacoes = avalQtdMatch ? parseInt(avalQtdMatch[1], 10) : 50;

    items.push({
      id: id++,
      barcode: barcode,
      emoji: categoryEmojis[cat] || "📦",
      nome: nome,
      cat: cat,
      desc: desc,
      preco: preco,
      antigo: Math.round(preco * 1.25 * 100) / 100,
      estoque: estoque,
      avaliacoes: avaliacoes,
      nota: parseFloat(avaliacaoStr),
      oferta: estoque < 40 || id % 5 === 0,
      novidade: id % 7 === 0
    });
  }
}

console.log("Parsed total items:", items.length);

// Save output JS code
const jsContent = `// Catalogo completo de 100 itens extraidos do arquivo de catalogo da loja
const PRODUTOS_INICIAIS = ${JSON.stringify(items, null, 2)};
`;

fs.writeFileSync('C:/Users/THIAGOFERREIRAAGUIAR.AzureAD/Downloads/loja/parsed_items.js', jsContent);
