
import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.util.Random;

public class HomeApp{

    private final Random random = new Random();

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new HomeApp().abrirTela());
    }

    private void abrirTela() {

        JFrame janela = new JFrame("MinhaLoja");
        janela.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        janela.setSize(1200, 750);
        janela.setLocationRelativeTo(null);

        JPanel principal = new JPanel(new BorderLayout());
        principal.setBackground(new Color(245, 245, 245));

        JPanel topo = new JPanel(new BorderLayout(15, 0));
        topo.setBackground(new Color(255, 87, 34));
        topo.setBorder(new EmptyBorder(15, 20, 15, 20));

        JLabel logo = new JLabel("🛒 MinhaLoja");
        logo.setForeground(Color.WHITE);
        logo.setFont(new Font("Arial", Font.BOLD, 26));

        JPanel pesquisa = new JPanel(new BorderLayout());
        pesquisa.setBackground(Color.WHITE);
        pesquisa.setBorder(new LineBorder(Color.WHITE, 2, true));

        JTextField campoPesquisa =
                new JTextField("Buscar produtos, marcas e categorias...");

        campoPesquisa.setFont(new Font("Arial", Font.PLAIN, 15));
        campoPesquisa.setBorder(new EmptyBorder(10, 12, 10, 12));

        JButton botaoPesquisar = new JButton("🔎");
        botaoPesquisar.setBackground(new Color(255, 224, 178));
        botaoPesquisar.setBorderPainted(false);
        botaoPesquisar.setFocusPainted(false);

        pesquisa.add(campoPesquisa, BorderLayout.CENTER);
        pesquisa.add(botaoPesquisar, BorderLayout.EAST);

        JPanel botoes = new JPanel(new FlowLayout(FlowLayout.RIGHT, 8, 0));
        botoes.setOpaque(false);

        JButton conta = criarBotaoTopo("👤 Conta");
        JButton pedidos = criarBotaoTopo("📦 Pedidos");
        JButton carrinho = criarBotaoTopo("🛒 Carrinho");

        botoes.add(conta);
        botoes.add(pedidos);
        botoes.add(carrinho);

        topo.add(logo, BorderLayout.WEST);
        topo.add(pesquisa, BorderLayout.CENTER);
        topo.add(botoes, BorderLayout.EAST);

        principal.add(topo, BorderLayout.NORTH);

        JPanel conteudo = new JPanel();
        conteudo.setLayout(new BoxLayout(conteudo, BoxLayout.Y_AXIS));
        conteudo.setBackground(new Color(245, 245, 245));
        conteudo.setBorder(new EmptyBorder(18, 25, 25, 25));

        JScrollPane scroll = new JScrollPane(conteudo);
        scroll.setBorder(null);
        scroll.getVerticalScrollBar().setUnitIncrement(18);

        principal.add(scroll, BorderLayout.CENTER);

        JPanel banner = new JPanel(new BorderLayout());
        banner.setBackground(new Color(255, 193, 7));
        banner.setBorder(new EmptyBorder(25, 30, 25, 30));
        banner.setMaximumSize(new Dimension(Integer.MAX_VALUE, 170));

        JPanel textosBanner = new JPanel();
        textosBanner.setOpaque(false);
        textosBanner.setLayout(new BoxLayout(textosBanner, BoxLayout.Y_AXIS));

        JLabel tituloBanner = new JLabel("🔥 SUPER OFERTAS");
        tituloBanner.setFont(new Font("Arial", Font.BOLD, 30));

        JLabel subtituloBanner =
                new JLabel("Até 70% OFF em produtos selecionados!");

        subtituloBanner.setFont(new Font("Arial", Font.PLAIN, 18));

        JButton comprar = new JButton("Comprar agora →");
        comprar.setFont(new Font("Arial", Font.BOLD, 14));
        comprar.setBackground(Color.WHITE);
        comprar.setFocusPainted(false);
        comprar.setBorderPainted(false);

        textosBanner.add(tituloBanner);
        textosBanner.add(Box.createVerticalStrut(8));
        textosBanner.add(subtituloBanner);
        textosBanner.add(Box.createVerticalStrut(15));
        textosBanner.add(comprar);

        JLabel emoji = new JLabel("🛍️");
        emoji.setFont(new Font("Arial", Font.PLAIN, 75));

        banner.add(textosBanner, BorderLayout.CENTER);
        banner.add(emoji, BorderLayout.EAST);

        conteudo.add(banner);
        conteudo.add(Box.createVerticalStrut(20));

        JLabel tituloCategorias = criarTitulo("Categorias");

        conteudo.add(tituloCategorias);
        conteudo.add(Box.createVerticalStrut(10));

        JPanel categorias = new JPanel(new GridLayout(1, 8, 10, 0));
        categorias.setOpaque(false);
        categorias.setMaximumSize(new Dimension(Integer.MAX_VALUE, 115));

        String[][] listaCategorias = {
                {"📱", "Celulares"},
                {"👕", "Moda"},
                {"💻", "Eletrônicos"},
                {"🏠", "Casa"},
                {"💄", "Beleza"},
                {"⚽", "Esportes"},
                {"📚", "Livros"},
                {"🛒", "Mercado"}
        };

        for (String[] categoria : listaCategorias) {
            categorias.add(criarCategoria(categoria[0], categoria[1]));
        }

        conteudo.add(categorias);
        conteudo.add(Box.createVerticalStrut(25));

        JPanel cabecalhoProdutos = new JPanel(new BorderLayout());
        cabecalhoProdutos.setOpaque(false);
        cabecalhoProdutos.setMaximumSize(
                new Dimension(Integer.MAX_VALUE, 40)
        );

        JLabel tituloProdutos = criarTitulo("🔥 Ofertas para você");

        JLabel verTudo = new JLabel("Ver tudo →");
        verTudo.setForeground(new Color(255, 87, 34));
        verTudo.setFont(new Font("Arial", Font.BOLD, 14));

        cabecalhoProdutos.add(tituloProdutos, BorderLayout.WEST);
        cabecalhoProdutos.add(verTudo, BorderLayout.EAST);

        conteudo.add(cabecalhoProdutos);
        conteudo.add(Box.createVerticalStrut(10));

        JPanel produtos = new JPanel(new GridLayout(2, 4, 15, 15));
        produtos.setOpaque(false);

        String[] nomes = {
                "Smartphone Pro",
                "Fone Bluetooth",
                "Tênis Esportivo",
                "Relógio Digital",
                "Notebook Ultra",
                "Camiseta Premium",
                "Mochila Executiva",
                "Caixa de Som"
        };

        for (int i = 0; i < 8; i++) {

            double preco = random.nextInt(250) + 49;

            produtos.add(
                    criarProduto(
                            nomes[i],
                            preco,
                            89 + random.nextInt(200)
                    )
            );
        }

        conteudo.add(produtos);

        conteudo.add(Box.createVerticalStrut(30));

        JPanel rodape = new JPanel();
        rodape.setBackground(Color.WHITE);
        rodape.setBorder(new EmptyBorder(20, 20, 20, 20));
        rodape.setMaximumSize(new Dimension(Integer.MAX_VALUE, 80));

        JLabel textoRodape = new JLabel(
                "© 2026 MinhaLoja • Compra segura • Atendimento ao cliente"
        );

        textoRodape.setFont(new Font("Arial", Font.PLAIN, 14));

        rodape.add(textoRodape);

        conteudo.add(rodape);

        janela.setContentPane(principal);
        janela.setVisible(true);
    }

    private JButton criarBotaoTopo(String texto) {

        JButton botao = new JButton(texto);

        botao.setForeground(Color.WHITE);
        botao.setBackground(new Color(255, 87, 34));
        botao.setFont(new Font("Arial", Font.BOLD, 13));
        botao.setBorderPainted(false);
        botao.setFocusPainted(false);

        return botao;
    }

    private JLabel criarTitulo(String texto) {

        JLabel titulo = new JLabel(texto);

        titulo.setFont(new Font("Arial", Font.BOLD, 21));
        titulo.setForeground(new Color(35, 35, 35));

        return titulo;
    }

    private JPanel criarCategoria(String emoji, String nome) {

        JPanel painel = new JPanel();
        painel.setBackground(Color.WHITE);
        painel.setLayout(new BorderLayout());

        painel.setBorder(
                new LineBorder(
                        new Color(230, 230, 230),
                        1,
                        true
                )
        );

        JLabel imagem = new JLabel(emoji, SwingConstants.CENTER);
        imagem.setFont(new Font("Arial", Font.PLAIN, 35));

        JLabel texto = new JLabel(nome, SwingConstants.CENTER);
        texto.setFont(new Font("Arial", Font.BOLD, 13));
        texto.setBorder(new EmptyBorder(5, 2, 10, 2));

        painel.add(imagem, BorderLayout.CENTER);
        painel.add(texto, BorderLayout.SOUTH);

        return painel;
    }

    private JPanel criarProduto(
            String nome,
            double preco,
            double precoAntigo
    ) {

        JPanel produto = new JPanel();
        produto.setBackground(Color.WHITE);
        produto.setLayout(new BorderLayout());

        produto.setBorder(
                new LineBorder(
                        new Color(225, 225, 225),
                        1,
                        true
                )
        );

        JPanel imagem = new JPanel(new GridBagLayout());
        imagem.setBackground(new Color(248, 248, 248));
        imagem.setPreferredSize(new Dimension(0, 135));

        JLabel emojiProduto = new JLabel("🛍️");
        emojiProduto.setFont(new Font("Arial", Font.PLAIN, 55));

        imagem.add(emojiProduto);

        JPanel info = new JPanel();
        info.setBackground(Color.WHITE);
        info.setLayout(new BoxLayout(info, BoxLayout.Y_AXIS));
        info.setBorder(new EmptyBorder(10, 12, 10, 12));

        JLabel nomeProduto = new JLabel(nome);
        nomeProduto.setFont(new Font("Arial", Font.BOLD, 14));

        JLabel estrelas = new JLabel(
                "⭐ 4." + random.nextInt(9) + "  |  " +
                (10 + random.nextInt(500)) + " vendidos"
        );

        estrelas.setFont(new Font("Arial", Font.PLAIN, 11));
        estrelas.setForeground(new Color(100, 100, 100));

        JLabel antigo = new JLabel(
                "De R$ " + dinheiro(precoAntigo)
        );

        antigo.setFont(new Font("Arial", Font.PLAIN, 11));
        antigo.setForeground(Color.GRAY);

        JLabel valor = new JLabel(
                "R$ " + dinheiro(preco)
        );

        valor.setFont(new Font("Arial", Font.BOLD, 20));
        valor.setForeground(new Color(220, 50, 30));

        JButton adicionar = new JButton("Adicionar 🛒");

        adicionar.setBackground(new Color(255, 87, 34));
        adicionar.setForeground(Color.WHITE);
        adicionar.setFont(new Font("Arial", Font.BOLD, 12));
        adicionar.setFocusPainted(false);
        adicionar.setBorderPainted(false);

        info.add(nomeProduto);
        info.add(Box.createVerticalStrut(5));
        info.add(estrelas);
        info.add(Box.createVerticalStrut(8));
        info.add(antigo);
        info.add(valor);
        info.add(Box.createVerticalStrut(8));
        info.add(adicionar);

        produto.add(imagem, BorderLayout.NORTH);
        produto.add(info, BorderLayout.CENTER);

        return produto;
    }

    private String dinheiro(double valor) {

        return String.format(
                java.util.Locale.US,
                "%.2f",
                valor
        ).replace(".", ",");
    }
}