import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { productsLocators } from '../../locators/products.locators';

test.describe('Pagination', () => {

  // TestRail C64
  test('[C64] pagination state persists after using the browser Back button', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goToNextPage();
    await productsPage.goToNextPage();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 3 of 42');
    const card = productsPage.getCard(0);
    const firstName = await productsPage.getCardName(card);

    await productsPage.openProduct(card);
    await page.waitForURL(/\/products\/.+/);

    await page.goBack();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 3 of 42');
    await expect(await productsPage.getCardName(productsPage.getCard(0))).toBe(firstName);
  });

  // TestRail C65
  test('[C65] pagination state persists after using the "Back to products" link', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goToPage(2);
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');
    const card = productsPage.getCard(0);
    const firstName = await productsPage.getCardName(card);

    await productsPage.openProduct(card);
    await page.waitForURL(/\/products\/.+/);

    await productsPage.goBackToProducts();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');
    await expect(await productsPage.getCardName(productsPage.getCard(0))).toBe(firstName);
  });

  // TestRail C66
  // Note: the catalog has 500 products, which isn't itself a multiple of 12
  // (that part of the original TestRail precondition doesn't hold), but every
  // page before the last one should still be a full page of 12 items.
  test('[C66] full pages display exactly 12 products', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await expect(productsLocators(page).productCard()).toHaveCount(12);

    await productsPage.goToNextPage();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');
    await expect(productsLocators(page).productCard()).toHaveCount(12);
  });

  // TestRail C67
  test('[C67] the "Next" button advances a page and survives Back navigation', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await expect(productsLocators(page).pageInfo()).toHaveText('Page 1 of 42');
    await expect(productsLocators(page).paginationPrev()).toBeDisabled();

    await productsPage.goToNextPage();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');

    await productsPage.openProduct(productsPage.getCard(0));
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');
  });

  // TestRail C68
  test('[C68] the "Previous" button returns a page and survives Back navigation', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goToNextPage();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 2 of 42');

    await productsPage.goToPreviousPage();
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 1 of 42');

    await productsPage.openProduct(productsPage.getCard(0));
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(productsLocators(page).pageInfo()).toHaveText('Page 1 of 42');
  });

  // TestRail C69
  test('[C69] clicking a page number navigates directly and survives Back navigation', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.goToNextPage(); // reveals the "Go to page 3" button
    await productsPage.goToPage(3);
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 3 of 42');

    await productsPage.openProduct(productsPage.getCard(0));
    await page.waitForURL(/\/products\/.+/);
    await page.goBack();

    await expect(productsLocators(page).pageInfo()).toHaveText('Page 3 of 42');
  });

  // TestRail C70
  test('[C70] the "Previous" button is disabled on the first page', async ({ page }) => {
    await expect(productsLocators(page).paginationPrev()).toBeDisabled();

    await productsLocators(page).paginationPrev().click({ force: true }).catch(() => {});
    await expect(productsLocators(page).pageInfo()).toHaveText('Page 1 of 42');
  });

});
