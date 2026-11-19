const formTarefa = document.getElementById('formTarefa');
const tituloTarefa = document.getElementById('tituloTarefa');
const listaTarefas = document.getElementById('listaTarefas');

const totalTarefas = document.getElementById('totalTarefas');
const tarefasPendentes = document.getElementById('tarefasPendentes');
const tarefasConcluidas = document.getElementById('tarefasConcluidas');

const filtros = document.querySelectorAll('.filtro');

let tarefas = [];
let filtroAtual = 'todas';

// Buscar tarefas no backend
async function carregarTarefas() {
    try {
        const resposta = await fetch('/tarefas');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar tarefas.');
        }

        tarefas = await resposta.json();

        atualizarInterface();
    } catch (erro) {
        listaTarefas.innerHTML = `
<li class="mensagem-vazia">
    Não foi possível carregar as tarefas.
</li>
`;
    }
}

// Atualizar contadores e lista
function atualizarInterface() {
    atualizarContadores();
    renderizarTarefas();
}

// Atualizar os números do resumo
function atualizarContadores() {
    const concluidas = tarefas.filter(tarefa => tarefa.concluida).length;
    const pendentes = tarefas.length - concluidas;

    totalTarefas.textContent = tarefas.length;
    tarefasPendentes.textContent = pendentes;
    tarefasConcluidas.textContent = concluidas;
}

// Mostrar tarefas na tela
function renderizarTarefas() {
    listaTarefas.innerHTML = '';

    let tarefasFiltradas = tarefas;

    if (filtroAtual === 'pendentes') {
        tarefasFiltradas = tarefas.filter(tarefa => !tarefa.concluida);
    }

    if (filtroAtual === 'concluidas') {
        tarefasFiltradas = tarefas.filter(tarefa => tarefa.concluida);
    }

    if (tarefasFiltradas.length === 0) {
        listaTarefas.innerHTML = `
<li class="mensagem-vazia">
    Nenhuma tarefa encontrada.
</li>
`;
        return;
    }

    tarefasFiltradas.forEach(tarefa => {
        const item = document.createElement('li');

        item.className = tarefa.concluida
            ? 'tarefa concluida'
            : 'tarefa';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = tarefa.concluida;
        checkbox.addEventListener('change', () => alternarTarefa(tarefa.id));

        const titulo = document.createElement('span');
        titulo.className = 'tarefa-titulo';
        titulo.textContent = tarefa.titulo;

        const botaoExcluir = document.createElement('button');
        botaoExcluir.className = 'btn-excluir';
        botaoExcluir.type = 'button';
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.addEventListener('click', () => excluirTarefa(tarefa.id));

        item.appendChild(checkbox);
        item.appendChild(titulo);
        item.appendChild(botaoExcluir);

        listaTarefas.appendChild(item);
    });
}

// Cadastrar tarefa
formTarefa.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const titulo = tituloTarefa.value.trim();

    if (!titulo) {
        return;
    }

    try {
        const resposta = await fetch('/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ titulo })
        });

        if (!resposta.ok) {
            throw new Error('Erro ao cadastrar tarefa.');
        }

        tituloTarefa.value = '';

        await carregarTarefas();
    } catch (erro) {
        alert('Não foi possível cadastrar a tarefa.');
    }
});

// Concluir ou reabrir tarefa
async function alternarTarefa(id) {
    try {
        const resposta = await fetch(`/tarefas/${id}`, {
            method: 'PATCH'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao atualizar tarefa.');
        }

        await carregarTarefas();
    } catch (erro) {
        alert('Não foi possível atualizar a tarefa.');
    }
}

// Excluir tarefa
async function excluirTarefa(id) {
    try {
        const resposta = await fetch(`/tarefas/${id}`, {
            method: 'DELETE'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao excluir tarefa.');
        }

        await carregarTarefas();
    } catch (erro) {
        alert('Não foi possível excluir a tarefa.');
    }
}

// Trocar filtro
filtros.forEach(filtro => {
    filtro.addEventListener('click', () => {
        filtros.forEach(botao => botao.classList.remove('ativo'));

        filtro.classList.add('ativo');

        filtroAtual = filtro.dataset.filtro;

        renderizarTarefas();
    });
});

// Carregar tarefas ao abrir a página
carregarTarefas();