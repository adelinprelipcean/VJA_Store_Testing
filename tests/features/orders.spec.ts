import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
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

  // TestRail C59
  test('[C59] a single-item order displays the correct item, quantity and total', async ({ page }) => {
    const card = page.getByTestId('product-card').first();
    const name = await card.getByTestId('product-link').getAttribute('aria-label');
    const priceMatch = (await card.textContent())?.match(/\$([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : NaN;

    await card.getByTestId('add-to-cart-btn').click();
    await page.getByTestId('cart-link').click();
    await page.getByTestId('checkout-btn').click();

    await page.getByTestId('orders-link').click();
    const latestOrder = page.getByTestId('order-card').first();
    await expect(latestOrder).toContainText(name ?? '');
    await expect(latestOrder).toContainText('Qty 1');
    await expect(latestOrder.getByTestId('order-total')).toHaveText(`$${price.toFixed(2)}`);
  });

  // TestRail C60
  test('[C60] a multi-item order displays every item with the correct quantity', async ({ page }) => {
    const firstCard = page.getByTestId('product-card').nth(0);
    const secondCard = page.getByTestId('product-card').nth(1);
    const firstName = await firstCard.getByTestId('product-link').getAttribute('aria-label');
    const secondName = await secondCard.getByTestId('product-link').getAttribute('aria-label');

    await firstCard.getByTestId('add-to-cart-btn').click();
    await firstCard.getByTestId('add-to-cart-btn').click(); // qty 2
    await secondCard.getByTestId('add-to-cart-btn').click();
    await secondCard.getByTestId('add-to-cart-btn').click();
    await secondCard.getByTestId('add-to-cart-btn').click(); // qty 3

    await page.getByTestId('cart-link').click();
    await page.getByTestId('checkout-btn').click();

    await page.getByTestId('orders-link').click();
    const latestOrder = page.getByTestId('order-card').first();
    await expect(latestOrder).toContainText(`${firstName}Qty 2`);
    await expect(latestOrder).toContainText(`${secondName}Qty 3`);
  });

  // TestRail C61
  test('[C61] the order total matches the sum of (unit price * quantity) for every line', async ({ page }) => {
    const firstCard = page.getByTestId('product-card').nth(0);
    const secondCard = page.getByTestId('product-card').nth(1);
    const firstPrice = parseFloat((await firstCard.textContent())?.match(/\$([\d.]+)/)?.[1] ?? 'NaN');
    const secondPrice = parseFloat((await secondCard.textContent())?.match(/\$([\d.]+)/)?.[1] ?? 'NaN');

    await firstCard.getByTestId('add-to-cart-btn').click(); // qty 1
    await secondCard.getByTestId('add-to-cart-btn').click();
    await secondCard.getByTestId('add-to-cart-btn').click(); // qty 2

    await page.getByTestId('cart-link').click();
    await page.getByTestId('checkout-btn').click();

    await page.getByTestId('orders-link').click();
    const latestOrder = page.getByTestId('order-card').first();
    const expectedTotal = firstPrice * 1 + secondPrice * 2;
    await expect(latestOrder.getByTestId('order-total')).toHaveText(`$${expectedTotal.toFixed(2)}`);
  });

  // TestRail C63
  test('[C63] orders are listed with the most recently placed one first', async ({ page }) => {
    const names: string[] = [];

    for (let i = 0; i < 3; i++) {
      const card = page.getByTestId('product-card').nth(i);
      names.push((await card.getByTestId('product-link').getAttribute('aria-label')) ?? '');

      await card.getByTestId('add-to-cart-btn').click();
      await page.getByTestId('cart-link').click();
      await page.getByTestId('checkout-btn').click();
      await page.goto('/products');
      await page.getByTestId('product-card').first().waitFor();
    }

    await page.getByTestId('orders-link').click();
    await page.getByTestId('order-card').first().waitFor();
    const topThree = await page.getByTestId('order-card').evaluateAll((cards) =>
      cards.slice(0, 3).map((c) => c.textContent ?? '')
    );

    expect(topThree[0]).toContain(names[2]);
    expect(topThree[1]).toContain(names[1]);
    expect(topThree[2]).toContain(names[0]);
  });

});
