import { Page, Locator } from '@playwright/test';

export const ordersLocators = (page: Page) => ({
    orderCard: () =>
        page.getByTestId('order-card'),
    orderTotal: (order: Locator) =>
        order.getByTestId('order-total'),
});
