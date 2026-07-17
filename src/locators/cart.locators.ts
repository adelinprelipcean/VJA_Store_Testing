import { Page } from '@playwright/test';

export const cartLocators = (page: Page) => ({
    addToCartBtn: () => page.getByRole('button', { name: 'Add to cart'}).first(),
    cartBtn: () => page.getByRole('link', { name: 'Cart'}),
    cartCount: () => page.getByTestId('cart-count'),
    checkoutBtn: () => page.getByRole('button', { name: 'Checkout' }),
    removeItemBtn: () => page.getByRole('button', { name: 'Remove' }).first(),
    orderSuccessMessage: () => page.getByText('Order placed successfully!'),
})