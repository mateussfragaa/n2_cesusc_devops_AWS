
const request = require('supertest');
const app = require('../src/app');

describe('Testes da aplicação Express', () => {

    test('Deve acessar a página inicial com sucesso', async () => {
        const resposta = await request(app).get('/index');

        expect(resposta.status).toBe(200);
        expect(resposta.headers['content-type']).toMatch(/html/);
    });

});
