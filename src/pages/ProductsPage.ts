import { Page, Locator, test } from '@playwright/test';
import { productsLocators } from '../locators/products.locators';

export class ProductsPage {
    constructor(private page: Page) {}

    async goto() {
        await test.step('Navigate to the products page', async () => {
            await this.page.goto('/products');
            await productsLocators(this.page).productCard().first().waitFor();
        });
    }

    getCard(index: number): Locator {
        return productsLocators(this.page).productCard().nth(index);
    }

    async getCardName(card: Locator): Promise<string | null> {
        return productsLocators(this.page).cardProductLink(card).getAttribute('aria-label');
    }

    async addCardToCart(card: Locator) {
        await test.step('Add product to cart', async () => {
            await productsLocators(this.page).cardAddToCartBtn(card).click();
        });
    }

    async toggleFavorite(card: Locator) {
        await test.step('Toggle favorite', async () => {
            await productsLocators(this.page).cardFavoriteBtn(card).click();
        });
    }

    async isFavorited(card: Locator): Promise<boolean> {
        return (await productsLocators(this.page).cardFavoriteBtn(card).getAttribute('data-active')) === 'true';
    }

    async openProduct(card: Locator) {
        await test.step('Open the product detail page', async () => {
            await productsLocators(this.page).cardProductLink(card).click();
        });
    }

    async goBackToProducts() {
        await test.step('Go back to the products listing', async () => {
            await productsLocators(this.page).backToProductsLink().click();
        });
    }

    async filterByCategory(name: string) {
        await test.step(`Filter by category "${name}"`, async () => {
            await productsLocators(this.page).categoryOption(name).click();
        });
    }

    async setPriceRange(min: string, max: string) {
        await test.step(`Set price range ${min}-${max}`, async () => {
            const locators = productsLocators(this.page);
            await locators.priceMinInput().fill(min);
            await locators.priceMaxInput().fill(max);
        });
    }

    async filterByColor(name: string) {
        await test.step(`Filter by color "${name}"`, async () => {
            await productsLocators(this.page).colorOption(name).click();
        });
    }

    async findOutOfStockCard(): Promise<Locator> {
        const locators = productsLocators(this.page);
        const outOfStockCard = locators.outOfStockCard();

        await test.step('Page forward until an out-of-stock product is found', async () => {
            for (let i = 0; i < 20 && (await outOfStockCard.count()) === 0; i++) {
                if (await locators.paginationNext().isDisabled()) break;
                await locators.paginationNext().click();
            }
        });

        return outOfStockCard.first();
    }

    async goToNextPage() {
        await test.step('Go to the next page', async () => {
            await productsLocators(this.page).paginationNext().click();
        });
    }

    async goToPreviousPage() {
        await test.step('Go to the previous page', async () => {
            await productsLocators(this.page).paginationPrev().click();
        });
    }

    async goToPage(num: number) {
        await test.step(`Go directly to page ${num}`, async () => {
            await productsLocators(this.page).paginationPage(num).click();
        });
    }
}
