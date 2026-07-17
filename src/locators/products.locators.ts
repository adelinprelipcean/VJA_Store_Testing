import { Page, Locator } from '@playwright/test';

export const productsLocators = (page: Page) => ({
    productCard: () =>
        page.getByTestId('product-card'),
    outOfStockCard: () =>
        page.getByTestId('product-card').filter({ hasText: 'Out of stock' }),
    cardProductLink: (card: Locator) =>
        card.getByTestId('product-link'),
    cardAddToCartBtn: (card: Locator) =>
        card.getByTestId('add-to-cart-btn'),
    cardFavoriteBtn: (card: Locator) =>
        card.getByRole('button', { name: 'Favorite' }),

    resultsCount: () =>
        page.getByTestId('results-count'),
    categoryOption: (name: string) =>
        page.getByRole('button', { name }),
    priceMinInput: () =>
        page.getByRole('spinbutton', { name: 'Min price' }),
    priceMaxInput: () =>
        page.getByRole('spinbutton', { name: 'Max price' }),
    colorOption: (name: string) =>
        page.getByRole('checkbox', { name }),

    paginationNext: () =>
        page.getByRole('button', { name: 'Next', exact: true }),
    paginationPrev: () =>
        page.getByRole('button', { name: 'Previous' }),
    paginationPage: (num: number) =>
        page.getByRole('button', { name: `Go to page ${num}` }),
    pageInfo: () =>
        page.getByTestId('page-info'),

    backToProductsLink: () =>
        page.getByRole('link', { name: 'Back to products' }),
});
