import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Pagination', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    await page.waitForURL((url) => !url.pathname.includes('/login'));

    await page.goto('/products');
    await page.getByTestId('product-card').first().waitFor();
  });

  // TestRail C64
  test('[C64] pagination state persists after using the browser Back button', async ({ page }) => {
    await page.getByTestId('pagination-next').click();
    await page.getByTestId('pagination-next').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 3 of 42');
    const firstName = await page.getByTestId('product-link').first().getAttribute('aria-label');

    await page.getByTestId('product-link').first().click();
    await page.waitForURL(/\/products\/.+/);

    await page.goBack();
    await expect(page.getByTestId('page-info')).toHaveText('Page 3 of 42');
    await expect(page.getByTestId('product-link').first()).toHaveAttribute('aria-label', firstName ?? '');
  });

  // TestRail C65
  test('[C65] pagination state persists after using the "Back to products" link', async ({ page }) => {
    await page.getByTestId('pagination-page').filter({ hasText: /^2$/ }).click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');
    const firstName = await page.getByTestId('product-link').first().getAttribute('aria-label');

    await page.getByTestId('product-link').first().click();
    await page.waitForURL(/\/products\/.+/);

    await page.getByTestId('product-detail-back').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');
    await expect(page.getByTestId('product-link').first()).toHaveAttribute('aria-label', firstName ?? '');
  });

  test('[C66] full pages display exactly 12 products', async ({ page }) => {
    await expect(page.getByTestId('product-card')).toHaveCount(12);

    await page.getByTestId('pagination-next').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');
    await expect(page.getByTestId('product-card')).toHaveCount(12);
  });

  // TestRail C67
  test('[C67] the "Next" button advances a page and survives Back navigation', async ({ page }) => {
    await expect(page.getByTestId('page-info')).toHaveText('Page 1 of 42');
    await expect(page.getByTestId('pagination-prev')).toBeDisabled();

    await page.getByTestId('pagination-next').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');

    await page.getByTestId('product-link').first().click();
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');
  });

  // TestRail C68
  test('[C68] the "Previous" button returns a page and survives Back navigation', async ({ page }) => {
    await page.getByTestId('pagination-next').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 2 of 42');

    await page.getByTestId('pagination-prev').click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 1 of 42');

    await page.getByTestId('product-link').first().click();
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(page.getByTestId('page-info')).toHaveText('Page 1 of 42');
  });

  // TestRail C69
  test('[C69] clicking a page number navigates directly and survives Back navigation', async ({ page }) => {
    await page.getByTestId('pagination-next').click(); // reveals the "3" button
    await page.getByTestId('pagination-page').filter({ hasText: /^3$/ }).click();
    await expect(page.getByTestId('page-info')).toHaveText('Page 3 of 42');

    await page.getByTestId('product-link').first().click();
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(page.getByTestId('page-info')).toHaveText('Page 3 of 42');
  });

  // TestRail C70
  test('[C70] the "Previous" button is disabled on the first page', async ({ page }) => {
    await expect(page.getByTestId('pagination-prev')).toBeDisabled();

    await page.getByTestId('pagination-prev').click({ force: true }).catch(() => {});
    await expect(page.getByTestId('page-info')).toHaveText('Page 1 of 42');
  });

});
