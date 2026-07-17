import {Page, test} from '@playwright/test';
import { cartLocators } from '../locators/cart.locators';

export class CartPage {
    constructor(private page: Page) {};
    async addToCart(){
        const locators = cartLocators(this.page);
        await test.step('Click the "Add to cart" button', async () => {
            await locators.addToCartBtn().click();
        });
    }

    async goToCart(){
        const locators = cartLocators(this.page);
        await test.step('Navigate to the cart page', async () => {
            await locators.cartBtn().click();
        });
    }

    async checkout(){
        const locators = cartLocators(this.page);
        await test.step('Complete the checkout', async () => {
            await locators.checkoutBtn().click();
        });
    }
};