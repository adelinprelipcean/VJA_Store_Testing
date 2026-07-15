import { test, expect } from '@playwright/test';

test.describe('Login', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // TestRail C48
  test('[C48] user can log in with valid credentials', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('e2e@test.com');
    await page.getByTestId('login-password-input').fill('123456');
    await page.getByTestId('login-btn').click();

    await expect(page).not.toHaveURL('/login');
  });

  // TestRail C50
  test('[C50] shows error with wrong password', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('e2e@test.com');
    await page.getByTestId('login-password-input').fill('1233');
    await page.getByTestId('login-btn').click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C50
  test('[C50] shows error with non-existent email', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('wut@test.com');
    await page.getByTestId('login-password-input').fill('password123');
    await page.getByTestId('login-btn').click();

    await expect(page.getByText('Invalid email or password')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C71
  test('[C71] shows validation error with empty email', async ({ page }) => {
    await page.getByTestId('login-password-input').fill('password123');
    await page.getByTestId('login-btn').click();

    await expect(page.getByText('Enter a valid email')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

  // TestRail C72
  test('[C72] shows validation error with empty password', async ({ page }) => {
    await page.getByTestId('login-email-input').fill('user@test.com');
    await page.getByTestId('login-btn').click();

    await expect(page.getByText('Password is required')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });

});

test.describe('Logout', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-email-input').fill('e2e@test.com');
    await page.getByTestId('login-password-input').fill('123456');
    await page.getByTestId('login-btn').click();
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
