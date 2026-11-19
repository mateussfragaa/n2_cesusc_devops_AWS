
const request = require('supertest');
const app = require('../src/app');

describe('Testes das tarefas', () => {

    test('Deve cadastrar uma tarefa', async () => {
        const resposta = await request(app)
            .post('/tarefas')
            .send({ titulo: 'Estudar DevOps' });

        expect(resposta.status).toBe(201);
        expect(resposta.body.titulo).toBe('Estudar DevOps');
        expect(resposta.body.concluida).toBe(false);
    });

    test('Não deve cadastrar tarefa sem título', async () => {
        const resposta = await request(app)
            .post('/tarefas')
            .send({ titulo: '' });

        expect(resposta.status).toBe(400);
    });

    test('Deve listar as tarefas', async () => {
        const resposta = await request(app).get('/tarefas');

        expect(resposta.status).toBe(200);
        expect(Array.isArray(resposta.body)).toBe(true);
    });

    test('Deve concluir uma tarefa', async () => {
        const cadastro = await request(app)
            .post('/tarefas')
            .send({ titulo: 'Fazer atividade' });

        const resposta = await request(app)
            .patch(`/tarefas/${cadastro.body.id}`);

        expect(resposta.status).toBe(200);
        expect(resposta.body.concluida).toBe(true);
    });

    test('Deve retornar 404 ao tentar concluir tarefa inexistente', async () => {
        const resposta = await request(app).patch('/tarefas/99999');

        expect(resposta.status).toBe(404);
    });

    test('Deve excluir uma tarefa', async () => {
        const cadastro = await request(app)
            .post('/tarefas')
            .send({ titulo: 'Tarefa para excluir' });

        const resposta = await request(app)
            .delete(`/tarefas/${cadastro.body.id}`);

        expect(resposta.status).toBe(200);
    });

    test('Deve retornar 404 ao excluir tarefa inexistente', async () => {
        const resposta = await request(app).delete('/tarefas/99999');

        expect(resposta.status).toBe(404);
    });

});
