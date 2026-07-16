import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Favorites', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/products');
    await page.getByTestId('product-card').first().waitFor();
  });

  // TestRail C58
  test('[C58] user can add an item to favorites', async ({ page }) => {
    const favoriteBtn = page.getByTestId('favorite-btn').first();
    const productName = await page.getByTestId('product-link').first().getAttribute('aria-label');
    if ((await favoriteBtn.getAttribute('data-active')) === 'true') {
      await favoriteBtn.click();
      await expect(favoriteBtn).toHaveAttribute('data-active', 'false');
    }

    await favoriteBtn.click();
    await expect(favoriteBtn).toHaveAttribute('data-active', 'true');

    await page.getByTestId('favorites-link').click();
    await expect(page).toHaveURL(/favorites/);
    await expect(page.getByRole('link', { name: productName ?? '' }).first()).toBeVisible();
  });

});
