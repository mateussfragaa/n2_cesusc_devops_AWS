
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const app = require('../src/app');

describe('Teste de interface - TaskFlow', () => {

    jest.setTimeout(40000);

    let driver;
    let servidor;

    beforeAll(async () => {
        servidor = app.listen(0);

        const porta = servidor.address().port;
        const options = new chrome.Options();

        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        if (process.env.CHROME_BIN) {
            options.setChromeBinaryPath(process.env.CHROME_BIN);
        }

        const builder = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options);

        if (process.env.CHROMEDRIVER_PATH) {
            const service = new chrome.ServiceBuilder(
                process.env.CHROMEDRIVER_PATH
            );

            builder.setChromeService(service);
        }

        driver = await builder.build();

        await driver.get(`http://localhost:${porta}`);
    });

afterAll(async () => {
    if (driver) {
        await driver.quit();
    }

    if (servidor) {
        await new Promise(resolve => servidor.close(resolve));
    }
});

test('Deve cadastrar uma tarefa pela interface', async () => {

    const campoTarefa = await driver.wait(
        until.elementLocated(By.id('tituloTarefa')),
        10000
    );

    await campoTarefa.sendKeys('Estudar para a N3 de DevOps');

    const botaoAdicionar = await driver.findElement(
        By.css('#formTarefa button[type="submit"]')
    );

    await botaoAdicionar.click();

    const tarefaCriada = await driver.wait(
        until.elementLocated(
            By.xpath("//*[contains(text(), 'Estudar para a N3 de DevOps')]")
        ),
        10000
    );

    expect(await tarefaCriada.isDisplayed()).toBe(true);
});

});
