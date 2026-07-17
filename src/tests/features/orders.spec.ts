import { test, expect } from '../../fixtures/auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';
import { CartPage } from '../../pages/CartPage';
import { NavbarPage } from '../../pages/NavbarPage';
import { OrdersPage } from '../../pages/OrdersPage';

  test.describe('Orders', () => {
  test.describe.configure({ mode: 'serial' });

  // TestRail C59
  test('[C59] a single-item order displays the correct item, quantity and total', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const navbar = new NavbarPage(page);
    const ordersPage = new OrdersPage(page);

    const card = productsPage.getCard(0);
    const name = await productsPage.getCardName(card);
    const priceMatch = (await card.textContent())?.match(/\$([\d.]+)/);
    const price = priceMatch ? parseFloat(priceMatch[1]) : NaN;

    await productsPage.addCardToCart(card);
    await cartPage.goToCart();
    await cartPage.checkout();

    await navbar.goToOrders();
    await ordersPage.waitForOrders();
    const latestOrder = ordersPage.getLatestOrder();
    await expect(latestOrder).toContainText(name ?? '');
    await expect(latestOrder).toContainText('Qty 1');
    await expect(ordersPage.getOrderTotal(latestOrder)).toHaveText(`$${price.toFixed(2)}`);
  });

  // TestRail C60
  test('[C60] a multi-item order displays every item with the correct quantity', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const navbar = new NavbarPage(page);
    const ordersPage = new OrdersPage(page);

    const firstCard = productsPage.getCard(0);
    const secondCard = productsPage.getCard(1);
    const firstName = await productsPage.getCardName(firstCard);
    const secondName = await productsPage.getCardName(secondCard);

    await productsPage.addCardToCart(firstCard);
    await productsPage.addCardToCart(firstCard); // qty 2
    await productsPage.addCardToCart(secondCard);
    await productsPage.addCardToCart(secondCard);
    await productsPage.addCardToCart(secondCard); // qty 3

    await cartPage.goToCart();
    await cartPage.checkout();

    await navbar.goToOrders();
    await ordersPage.waitForOrders();
    const latestOrder = ordersPage.getLatestOrder();
    await expect(latestOrder).toContainText(`${firstName}Qty 2`);
    await expect(latestOrder).toContainText(`${secondName}Qty 3`);
  });

  // TestRail C61
  test('[C61] the order total matches the sum of (unit price * quantity) for every line', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const navbar = new NavbarPage(page);
    const ordersPage = new OrdersPage(page);

    const firstCard = productsPage.getCard(0);
    const secondCard = productsPage.getCard(1);
    const firstPrice = parseFloat((await firstCard.textContent())?.match(/\$([\d.]+)/)?.[1] ?? 'NaN');
    const secondPrice = parseFloat((await secondCard.textContent())?.match(/\$([\d.]+)/)?.[1] ?? 'NaN');

    await productsPage.addCardToCart(firstCard); // qty 1
    await productsPage.addCardToCart(secondCard);
    await productsPage.addCardToCart(secondCard); // qty 2

    await cartPage.goToCart();
    await cartPage.checkout();

    await navbar.goToOrders();
    await ordersPage.waitForOrders();
    const latestOrder = ordersPage.getLatestOrder();
    const expectedTotal = firstPrice * 1 + secondPrice * 2;
    await expect(ordersPage.getOrderTotal(latestOrder)).toHaveText(`$${expectedTotal.toFixed(2)}`);
  });

  // TestRail C63
  test('[C63] orders are listed with the most recently placed one first', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const navbar = new NavbarPage(page);
    const ordersPage = new OrdersPage(page);

    const names: string[] = [];

    for (let i = 0; i < 3; i++) {
      const card = productsPage.getCard(i);
      names.push((await productsPage.getCardName(card)) ?? '');

      await productsPage.addCardToCart(card);
      await cartPage.goToCart();
      await cartPage.checkout();
      await productsPage.goto();
    }

    await navbar.goToOrders();
    await ordersPage.waitForOrders();
    const topThree = await ordersPage.getTopOrderTexts(3);

    expect(topThree[0]).toContain(names[2]);
    expect(topThree[1]).toContain(names[1]);
    expect(topThree[2]).toContain(names[0]);
  });

});
