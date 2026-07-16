import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Product detail', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/products');
    await page.getByTestId('product-card').first().waitFor();
  });

  // TestRail C55
  test('[C55] "Add to cart" button is disabled for an out-of-stock product', async ({ page }) => {
    const outOfStockCard = page.getByTestId('product-card').filter({ hasText: 'Out of stock' });
   for (let i = 0; i < 20 && (await outOfStockCard.count()) === 0; i++) {
      const nextBtn = page.getByTestId('pagination-next');
      if (await nextBtn.isDisabled()) break;
      await nextBtn.click();
    }

    await expect(outOfStockCard.first()).toBeVisible();
    await expect(outOfStockCard.first().getByTestId('add-to-cart-btn')).toBeDisabled();
  });

});
