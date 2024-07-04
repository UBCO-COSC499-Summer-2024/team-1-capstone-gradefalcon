const { chromium } = require('playwright');

import 'core-js'; 
jest.setTimeout(30000);
describe('E2E Logout Test', () => {
    let browser;
    let page;

    beforeAll(async () => {
        // Polyfill for setImmediate if necessary
        global.setImmediate = setImmediate;
        browser = await chromium.launch({ headless: true }); // toggles browser visiblity
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    const login = async (email, password, expectedRoleUrl) => {
        await page.goto('http://localhost:3000');
        await page.fill('input[aria-label=email]', email);
        await page.fill('input[aria-label=password]', password);
        await page.click('button[aria-label=login]');
        await page.waitForNavigation();

        expect(page.url()).toContain("/Dashboard"); //dashboard is the next step after logging in as an instructor
    };

    const logout = async () => {
        await page.click('a[href="/Logout"]');

        await page.waitForTimeout(1000); // Wait for the timeout to navigate

        expect(page.url()).toBe('http://localhost:3000/'); 
    };

    it('should log out instructor user and redirect to login', async () => {
        await login('instructor@ubc.ca', 'instructor', '/Dashboard');
        await logout();
    });
});
