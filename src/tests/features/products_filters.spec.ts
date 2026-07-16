import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { productsLocators } from '../../locators/products.locators';

test.describe('Products & Filters', () => {
  test.describe.configure({ mode: 'serial' });

  // TestRail C52
  test('[C52] filtering by category shows only products from that category', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const totalText = await productsLocators(page).resultsCount().innerText();

    await productsPage.filterByCategory('Electronics');
    await expect(productsLocators(page).resultsCount()).not.toHaveText(totalText);

    const cardTexts = await productsLocators(page).productCard().evaluateAll((cards) =>
      cards.map((c) => c.textContent ?? '')
    );
    for (const text of cardTexts) {
      expect(text).toContain('Electronics');
    }
  });

  // TestRail C53
  test('[C53] setting a price range only shows products within that range', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const totalText = await productsLocators(page).resultsCount().innerText();

    await productsPage.setPriceRange('1000', '2000');
    await expect(productsLocators(page).resultsCount()).not.toHaveText(totalText);

    const prices = await productsLocators(page).productCard().evaluateAll((cards) =>
      cards.map((c) => {
        const match = c.textContent?.match(/\$([\d.]+)/);
        return match ? parseFloat(match[1]) : NaN;
      })
    );
    for (const price of prices) {
      expect(price).toBeGreaterThanOrEqual(1000);
      expect(price).toBeLessThanOrEqual(2000);
    }
  });

  // TestRail C54
  test('[C54] filtering by color narrows down the results', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const totalText = await productsLocators(page).resultsCount().innerText();

    await productsPage.filterByColor('Beige');

    await expect(productsLocators(page).resultsCount()).not.toHaveText(totalText);
  });

});
