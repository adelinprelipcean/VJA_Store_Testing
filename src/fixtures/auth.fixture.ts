import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';

export const test = base.extend({
    page: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login('e2e@test.com', '123456');
        await page.waitForURL((url) => !url.pathname.includes('/login'));

        const productsPage = new ProductsPage(page);
        await productsPage.goto();

        await use(page);
    },
});

export { expect } from '@playwright/test';
