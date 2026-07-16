import { Page, Locator, test } from '@playwright/test';
import { ordersLocators } from '../locators/orders.locators';

export class OrdersPage {
    constructor(private page: Page) {}

    async waitForOrders() {
        await test.step('Wait for the orders list to load', async () => {
            await ordersLocators(this.page).orderCard().first().waitFor();
        });
    }

    getLatestOrder(): Locator {
        return ordersLocators(this.page).orderCard().first();
    }

    getOrderTotal(order: Locator): Locator {
        return ordersLocators(this.page).orderTotal(order);
    }

    async getTopOrderTexts(count: number): Promise<string[]> {
        return ordersLocators(this.page).orderCard().evaluateAll(
            (cards, n) => cards.slice(0, n).map((c) => c.textContent ?? ''),
            count
        );
    }
}
