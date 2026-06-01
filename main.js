const API_URL = 'http://localhost:3000/produtos';

const tbody = document.querySelector('#data');
const form = document.querySelector('#form-produto');
const tituloForm = document.querySelector('#titulo-form');
const inputId = document.querySelector('#produto-id');
const inputNome = document.querySelector('#form-nome');
const inputTipo = document.querySelector('#form-tipo');
const inputStatus = document.querySelector('#form-status');
const inputDescricao = document.querySelector('#form-descricao');
const btnCancelar = document.querySelector('#btn-cancelar');
const divMensagem = document.querySelector('#mensagem');

// Mostra mensagem de sucesso/erro temporária
const mostrarMensagem = (texto, tipo = 'sucesso') => {
    divMensagem.textContent = texto;
    divMensagem.className = `mensagem ${tipo}`;
    setTimeout(() => {
        divMensagem.className = 'mensagem oculto';
    }, 3000);
};

// Listagem com filtros (mantida da aula)
const getProducts = async () => {
    let url = API_URL + '?';

    const tipo = document.querySelector('#tipo').value;
    const status = document.querySelector('#status').value;
    const nome = document.querySelector('#nome').value;
    const descricao = document.querySelector('#descricao').value;

    if (tipo !== '') url += 'tipo=' + tipo + '&';
    if (status !== '') url += 'status=' + status + '&';
    if (nome !== '') url += 'busca=' + nome + '&';
    if (descricao !== '') url += 'descricao=' + descricao + '&';

    try {
        const response = await fetch(url);
        const products = await response.json();

        tbody.innerHTML = '';

        for (const p of products) {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.id}</td>
                <td>${p.nome}</td>
                <td>${p.tipo}</td>
                <td>${p.status}</td>
                <td>${p.descricao}</td>
                <td>
                    <button class="btn-editar" data-id="${p.id}">Editar</button>
                    <button class="btn-excluir" data-id="${p.id}">Excluir</button>
                </td>
            `;
            tbody.appendChild(tr);
        }

        // liga eventos nos botões de cada linha
        document.querySelectorAll('.btn-editar').forEach(b =>
            b.addEventListener('click', () => preencherFormulario(b.dataset.id))
        );
        document.querySelectorAll('.btn-excluir').forEach(b =>
            b.addEventListener('click', () => excluirProduto(b.dataset.id))
        );
    } catch (err) {
        mostrarMensagem('Erro ao carregar produtos: ' + err.message, 'erro');
    }
};

// Limpa o formulário e volta ao modo "cadastrar"
const limparFormulario = () => {
    form.reset();
    inputId.value = '';
    tituloForm.textContent = 'Cadastrar novo produto';
    btnCancelar.classList.add('oculto');
};

// Busca o produto e preenche o formulário para edição
const preencherFormulario = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            mostrarMensagem('Produto não encontrado', 'erro');
            return;
        }
        const p = await response.json();
        inputId.value = p.id;
        inputNome.value = p.nome;
        inputTipo.value = p.tipo;
        inputStatus.value = p.status;
        inputDescricao.value = p.descricao;
        tituloForm.textContent = `Editando produto #${p.id}`;
        btnCancelar.classList.remove('oculto');
        form.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
        mostrarMensagem('Erro ao buscar produto: ' + err.message, 'erro');
    }
};

// Exclui produto após confirmação do usuário
const excluirProduto = async (id) => {
    if (!confirm(`Deseja realmente excluir o produto #${id}?`)) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.status === 204 || response.ok) {
            mostrarMensagem('Produto excluído com sucesso');
            getProducts();
        } else {
            const erro = await response.json();
            mostrarMensagem(erro.erro || 'Erro ao excluir', 'erro');
        }
    } catch (err) {
        mostrarMensagem('Erro ao excluir: ' + err.message, 'erro');
    }
};

// Submit do formulário decide entre POST (novo) e PUT (edição)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
        nome: inputNome.value.trim(),
        tipo: inputTipo.value,
        status: inputStatus.value,
        descricao: inputDescricao.value.trim()
    };

    const id = inputId.value;
    const ehEdicao = id !== '';
    const url = ehEdicao ? `${API_URL}/${id}` : API_URL;
    const metodo = ehEdicao ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            mostrarMensagem(ehEdicao ? 'Produto atualizado com sucesso' : 'Produto criado com sucesso');
            limparFormulario();
            getProducts();
        } else {
            const erro = await response.json();
            mostrarMensagem(erro.erro || 'Erro ao salvar produto', 'erro');
        }
    } catch (err) {
        mostrarMensagem('Erro ao salvar: ' + err.message, 'erro');
    }
});

btnCancelar.addEventListener('click', limparFormulario);

getProducts();
