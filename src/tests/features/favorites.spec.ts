import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { NavbarPage } from '../../pages/NavbarPage';
import { clearFavorites } from '../../utils/cleanup';

test.describe('Favorites', () => {

  test.afterEach(async ({ page }) => {
    await clearFavorites(page.request);
  });

  // TestRail C58
  test('[C58] user can add an item to favorites', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const navbar = new NavbarPage(page);

    const card = productsPage.getCard(0);
    const productName = await productsPage.getCardName(card);

    if (await productsPage.isFavorited(card)) {
      await productsPage.toggleFavorite(card);
      expect(await productsPage.isFavorited(card)).toBe(false);
    }

    await productsPage.toggleFavorite(card);
    expect(await productsPage.isFavorited(card)).toBe(true);

    await navbar.goToFavorites();
    await expect(page).toHaveURL(/favorites/);
    await expect(page.getByRole('link', { name: productName ?? '' }).first()).toBeVisible();
  });

});
