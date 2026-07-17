import { test, expect } from '../../fixtures/api-auth.fixture';

test('user is authenticated via API without visiting the login page', async ({ page }) => {
  await page.goto('/products');

  await expect(page).not.toHaveURL(/\/login/);
  await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
});
