import { test, expect } from '../../fixtures/auth.fixture';
import { CartPage } from '../../pages/CartPage';
import { cartLocators } from '../../locators/cart.locators';

test.describe('Cart & Checkout', () => {
  test.describe.configure({ mode: 'serial' });

  // TestRail C56
  test('[C56] user can add a product to the cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    const startCount = Number(await cartLocators(page).cartCount().innerText());

    await cartPage.addToCart();

    await expect(cartLocators(page).cartCount()).toHaveText(String(startCount + 1));
  });

  test('[C56] added product appears in the cart', async ({ page }) => {
    const cartPage = new CartPage(page);
    const startCount = Number(await cartLocators(page).cartCount().innerText());

    await cartPage.addToCart();
    await expect(cartLocators(page).cartCount()).toHaveText(String(startCount + 1));

    await cartPage.goToCart();
    await expect(page).toHaveURL(/cart/);
    await expect(cartLocators(page).removeItemBtn()).toBeVisible();
  });

  // TestRail C57
  test('[C57] user can complete checkout', async ({ page }) => {
    const cartPage = new CartPage(page);
    const startCount = Number(await cartLocators(page).cartCount().innerText());

    await cartPage.addToCart();
    await expect(cartLocators(page).cartCount()).toHaveText(String(startCount + 1));

    await cartPage.goToCart();
    await cartPage.checkout();

    await expect(cartLocators(page).orderSuccessMessage()).toBeVisible();
  });

});
