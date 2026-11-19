
const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// Lista de tarefas
let tarefas = [];
let proximoId = 1;

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Listar tarefas
app.get('/tarefas', (req, res) => {
    res.json(tarefas);
});

// Cadastrar tarefa
app.post('/tarefas', (req, res) => {
    const { titulo } = req.body;

    if (!titulo || !titulo.trim()) {
        return res.status(400).json({
            mensagem: 'O título da tarefa é obrigatório.'
        });
    }

    const tarefa = {
        id: proximoId++,
        titulo: titulo.trim(),
        concluida: false
    };

    tarefas.push(tarefa);

    res.status(201).json(tarefa);
});

// Concluir tarefa
app.patch('/tarefas/:id', (req, res) => {
    const tarefa = tarefas.find(
        tarefa => tarefa.id === Number(req.params.id)
    );

    if (!tarefa) {
        return res.status(404).json({
            mensagem: 'Tarefa não encontrada.'
        });
    }

    tarefa.concluida = !tarefa.concluida;

    res.json(tarefa);
});

// Excluir tarefa
app.delete('/tarefas/:id', (req, res) => {
    const indice = tarefas.findIndex(
        tarefa => tarefa.id === Number(req.params.id)
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: 'Tarefa não encontrada.'
        });
    }

    tarefas.splice(indice, 1);

    res.status(200).json({
        mensagem: 'Tarefa excluída com sucesso.'
    });
});

module.exports = app;
