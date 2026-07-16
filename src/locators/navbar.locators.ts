import { Page } from '@playwright/test';

export const navbarLocators = (page: Page) => ({
    favoritesLink: () =>
        page.getByRole('banner').getByRole('link', { name: 'Favorites' }),
    ordersLink: () =>
        page.getByRole('banner').getByRole('link', { name: 'Orders' }),
    logoutBtn: () =>
        page.getByRole('banner').getByRole('button', { name: 'Logout' }),
});
