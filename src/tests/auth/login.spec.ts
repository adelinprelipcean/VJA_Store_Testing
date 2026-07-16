import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // TestRail C48
  test('[C48] user can log in with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    
    await expect(page).not.toHaveURL('/login');
  });

  // TestRail C50
  test('[C50] shows error with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '12344');

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C50
  test('[C50] shows error with non-existent email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e2@test.com', '123456');

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C71
  test('[C71] shows validation error with empty email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '123456');

    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C72
  test('[C72] shows validation error with empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '');

    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

});

test.describe('Logout', () => {

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('e2e@test.com', '123456');
    await page.waitForURL((url) => !url.pathname.includes('/login'));
  });

  // TestRail C51
  test('[C51] logout then browser back does not restore the session', async ({ page }) => {
    await page.getByTestId('logout-btn').click();
    await expect(page).toHaveURL(/login/);

    await page.goBack();
    await expect(page).toHaveURL(/login/);
  });

});
