import { test, expect } from '@playwright/test';

test.describe('Cart & Checkout', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill('e2e@test.com');
    await page.getByTestId('login-password-input').fill('123456');
    await page.getByTestId('login-btn').click();
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/products');
    await page.getByTestId('product-card').first().waitFor();
  });

  // TestRail C56
  test('[C56] user can add a product to the cart', async ({ page }) => {
    const startCount = Number(await page.getByTestId('cart-count').innerText());

    await page.getByTestId('add-to-cart-btn').first().click();

    await expect(page.getByTestId('cart-count')).toHaveText(String(startCount + 1));
  });

  test('[C56] added product appears in the cart', async ({ page }) => {
    const startCount = Number(await page.getByTestId('cart-count').innerText());

    await page.getByTestId('add-to-cart-btn').first().click();
    await expect(page.getByTestId('cart-count')).toHaveText(String(startCount + 1));

    await page.getByTestId('cart-link').click();
    await expect(page).toHaveURL(/cart/);
    await expect(page.getByTestId('remove-cart-item-btn').first()).toBeVisible();
  });

  // TestRail C57
  test('[C57] user can complete checkout', async ({ page }) => {
    const startCount = Number(await page.getByTestId('cart-count').innerText());

    await page.getByTestId('add-to-cart-btn').first().click();
    await expect(page.getByTestId('cart-count')).toHaveText(String(startCount + 1));

    await page.getByTestId('cart-link').click();
    await page.getByTestId('checkout-btn').click();

    await expect(page.getByText('Order placed successfully!')).toBeVisible();
  });

});
