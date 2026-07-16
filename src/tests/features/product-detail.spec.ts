import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { productsLocators } from '../../locators/products.locators';

test.describe('Product detail', () => {

  // TestRail C55
  test('[C55] "Add to cart" button is disabled for an out-of-stock product', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    const outOfStockCard = await productsPage.findOutOfStockCard();

    await expect(outOfStockCard).toBeVisible();
    await expect(productsLocators(page).cardAddToCartBtn(outOfStockCard)).toBeDisabled();
  });

});
