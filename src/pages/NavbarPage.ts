import { Page, test } from '@playwright/test';
import { navbarLocators } from '../locators/navbar.locators';

export class NavbarPage {
    constructor(private page: Page) {}

    async goToFavorites() {
        await test.step('Navigate to Favorites', async () => {
            await navbarLocators(this.page).favoritesLink().click();
        });
    }

    async goToOrders() {
        await test.step('Navigate to Orders', async () => {
            await navbarLocators(this.page).ordersLink().click();
        });
    }

    async logout() {
        await test.step('Log out', async () => {
            await navbarLocators(this.page).logoutBtn().click();
        });
    }
}
