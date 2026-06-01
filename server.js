import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

/* AQUI VAI MEU CRUD DE PRODUTOS */
const produtos = [];

const STATUS_VALIDOS = ['disponivel', 'emprestado', 'manutencao'];

/* Adicionano objetos no vetor produtos */
const p1 = {
    id: 1,
    nome: 'Alienware',
    tipo: 'notebook',
    status: 'disponivel',
    descricao: 'Notebook para processamento elevado'
}
const p2 = {
    id: 2,
    nome: 'Chromebook 14',
    tipo: 'notebook',
    status: 'manutencao',
    descricao: 'Notebook leve e portátil'
}
const p3 = {
    id: 3,
    nome: 'Epson Power Lite W39',
    tipo: 'projetor',
    status: 'emprestado',
    descricao: 'Projetor para apresentações'
}
const p4 = {
    id: 4,
    nome: 'MacBook Pro 16',
    tipo: 'notebook',
    status: 'disponivel',
    descricao: 'Notebook profissional com processador M1 ultra rápido'
}
const p5 = {
    id: 5,
    nome: 'Acer Nitro 5',
    tipo: 'notebook',
    status: 'emprestado',
    descricao: 'Notebook gamer com placa de vídeo RTX dedicada'
}
const p6 = {
    id: 6,
    nome: 'Sony VPL-FHZ75',
    tipo: 'projetor',
    status: 'disponivel',
    descricao: 'Projetor 3LCD de alta luminosidade para ambientes corporativos'
}
const p7 = {
    id: 7,
    nome: 'Dell XPS 13',
    tipo: 'notebook',
    status: 'manutencao',
    descricao: 'Ultrabook portátil com tela FHD de alta qualidade'
}
const p8 = {
    id: 8,
    nome: 'Panasonic PT-RZ870',
    tipo: 'projetor',
    status: 'disponivel',
    descricao: 'Projetor laser para salas de reunião profissionais'
}
const p9 = {
    id: 9,
    nome: 'ASUS VivoBook 15',
    tipo: 'notebook',
    status: 'disponivel',
    descricao: 'Notebook versátil com bateria de longa duração'
}
const p10 = {
    id: 10,
    nome: 'BenQ MW535A',
    tipo: 'projetor',
    status: 'emprestado',
    descricao: 'Projetor DLP compacto ideal para apresentações portáteis'
}

produtos.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10);

/* Endpoint para listar todos os produtos */
app.get('/produtos', (req, res) => {
    // verificar os parâmetros de consulta para filtrar
    const { status, tipo, busca, descricao } = req.query;
    let resultado = produtos;

    // filtrar por status
    if(status) resultado = resultado.filter(p => p.status === status);
    // filtrar por tipo
    if(tipo) resultado = resultado.filter(p => p.tipo === tipo);
    // filtrar por busca no nome ou descrição
    if(busca) resultado = resultado.filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    // filtrar por busca na descrição
    if(descricao) resultado = resultado.filter(p => p.descricao.toLowerCase().includes(descricao.toLowerCase()))

    res.json(resultado);
});

/* Endpoint para buscar um produto pelo id */
app.get('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }
    res.json(produto);
});

/* Endpoint para criar um novo produto */
app.post('/produtos', (req, res) => {
    const { nome, tipo, status, descricao } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ erro: 'Os campos nome e tipo são obrigatórios' });
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
            erro: `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}`
        });
    }

    const novoProduto = {
        id: Math.max(0, ...produtos.map(p => p.id)) + 1,
        nome,
        tipo,
        status: status || 'disponivel',
        descricao: descricao || ''
    };

    produtos.push(novoProduto);
    res.status(201).json(novoProduto);
});

/* Endpoint para atualizar um produto */
app.put('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = produtos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const { nome, tipo, status, descricao } = req.body;

    if (!nome || !tipo) {
        return res.status(400).json({ erro: 'Os campos nome e tipo são obrigatórios' });
    }
    if (status && !STATUS_VALIDOS.includes(status)) {
        return res.status(400).json({
            erro: `Status inválido. Use um destes: ${STATUS_VALIDOS.join(', ')}`
        });
    }

    produtos[indice] = {
        id,
        nome,
        tipo,
        status: status || produtos[indice].status,
        descricao: descricao !== undefined ? descricao : produtos[indice].descricao
    };

    res.json(produtos[indice]);
});

/* Endpoint para remover um produto */
app.delete('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const indice = produtos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    produtos.splice(indice, 1);
    res.status(204).send();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
