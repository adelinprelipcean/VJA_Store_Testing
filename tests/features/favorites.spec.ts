import { test, expect } from '@playwright/test';

test.describe('Favorites', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill('e2e@test.com');
    await page.getByTestId('login-password-input').fill('123456');
    await page.getByTestId('login-btn').click();
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
