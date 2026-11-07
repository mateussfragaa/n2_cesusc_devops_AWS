
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('Teste de interface - Google', () => {

    jest.setTimeout(40000);

    test('Deve acessar o Google e encontrar o campo de pesquisa', async () => {

        const options = new chrome.Options();

        options.addArguments('--headless=new');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');

        // Utiliza o Chrome instalado pelo GitHub Actions
        if (process.env.CHROME_BIN) {
            options.setChromeBinaryPath(process.env.CHROME_BIN);
        }

        const builder = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options);

        // Utiliza o ChromeDriver instalado pelo GitHub Actions
        if (process.env.CHROMEDRIVER_PATH) {
            const service = new chrome.ServiceBuilder(
                process.env.CHROMEDRIVER_PATH
            );

            builder.setChromeService(service);
        }

        const driver = await builder.build();

        try {
            await driver.get('https://www.google.com');

            const campoPesquisa = await driver.wait(
                until.elementLocated(By.name('q')),
                20000
            );

            expect(await campoPesquisa.isDisplayed()).toBe(true);

            expect(await driver.getTitle()).toMatch(/Google/i);

        } finally {
            await driver.quit();
        }
    });
});
