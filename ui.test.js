const assert = require('assert');
const puppeteer = require('puppeteer');

describe('user interface tests', function() {
    const TIMEOUT=20*1000;
    let browser, page;

    before(async function() {
        this.timeout(TIMEOUT);
        browser = await puppeteer.launch({headless:false,slowMo:200});
    });

    it('must load page and display it', async function() {
        this.timeout(TIMEOUT);
        page = (await browser.pages())[0];
        await page.goto(`file:///${__dirname}/index.html`);
        await page.waitForFunction('!X.is_busy');
    });


    async function click_and_check (id, number_of_clicks, expected_value) {
        while(number_of_clicks--) {
            await page.click(`#game #${id}`);
        }
        const result = (await page.evaluate(`jQuery("#game #${id}").text()`)).trim();
        assert(result===expected_value);
    }

    it('must set square A to 1 when clicking for the first time', async function() {
        this.timeout(TIMEOUT);
        await click_and_check('A', 1, '1');
    });

    it('must set square A to 3 when clicking two more times', async function() {
        this.timeout(TIMEOUT);
        await click_and_check('A', 2, '3');
    });

    it('must set square A to empty again when clicking two more times', async function() {
        this.timeout(TIMEOUT);
        await click_and_check('A', 2, '');
    });

    it('must set operator to < when clicking for the first time', async function() {
        this.timeout(TIMEOUT);
        await click_and_check('AB', 1, '<');
    });

    it('must set operator to > when clicking a second time', async function() {
        this.timeout(TIMEOUT);
        await click_and_check('AB', 1, '>');
    });

    it('must display solution', async function() {
        this.timeout(TIMEOUT);
        await page.click('#game #EF');
        await page.click('#game #FG');
        await page.click('#game #GH');
        await page.click('#run');
        const result = (await page.evaluate('jQuery("#solution-container #E").text()')).trim();
        assert(result==='1');
    });

    it('must empty solution grid when clicking the puzzle', async function() {
       this.timeout(TIMEOUT);
       await page.click("#game #A");
       const result = (await page.evaluate('jQuery("#solution-container #A").text()')).trim();
       assert(result==='');
    });

    it('must empty puzzle grid when clicking the reset button', async function() {
        this.timeout(TIMEOUT);
        await page.click("#game #A");
        await page.click("#reset");
        const result = (await page.evaluate('jQuery("#solution-container #A").text()')).trim();
        assert(result==='');
    });

    after(async function () {
        this.timeout(TIMEOUT);
        browser.close();
    })
});
