import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Products & Filters', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/products');
    await page.getByTestId('product-card').first().waitFor();
  });

  // TestRail C52
  test('[C52] filtering by category shows only products from that category', async ({ page }) => {
    const totalText = await page.getByTestId('results-count').innerText();

    await page.getByTestId('category-option-electronics').click();
    await expect(page.getByTestId('results-count')).not.toHaveText(totalText);

    const cardTexts = await page.getByTestId('product-card').evaluateAll((cards) =>
      cards.map((c) => c.textContent ?? '')
    );
    for (const text of cardTexts) {
      expect(text).toContain('Electronics');
    }
  });

  // TestRail C53
  test('[C53] setting a price range only shows products within that range', async ({ page }) => {
    const totalText = await page.getByTestId('results-count').innerText();

    await page.getByTestId('price-min-input').fill('1000');
    await page.getByTestId('price-max-input').fill('2000');
    await expect(page.getByTestId('results-count')).not.toHaveText(totalText);

    const prices = await page.getByTestId('product-card').evaluateAll((cards) =>
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
    const totalText = await page.getByTestId('results-count').innerText();

    await page.getByTestId('color-option').first().click();

    await expect(page.getByTestId('results-count')).not.toHaveText(totalText);
  });

});