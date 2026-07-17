import { test, expect } from '@playwright/test';
import { clearCart } from '../../utils/cleanup';

test.describe('API - Auth', () => {
  test('POST /api/auth/login - happy path', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: process.env.TEST_EMAIL,
        password: process.env.TEST_PASSWORD,
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.user.email).toBe(process.env.TEST_EMAIL);
  });

  test('POST /api/auth/login - wrong password returns 401', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {
        email: process.env.TEST_EMAIL,
        password: 'wrong-password',
      },
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe('Invalid email or password');
  });
});

test.describe('API - Cart', () => {
  test.afterEach(async ({ request }) => {
    await clearCart(request);
  });

  test('POST /api/cart - happy path (authenticated)', async ({ request }) => {
    await request.post('/api/auth/login', {
      data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
    });

    const response = await request.post('/api/cart', {
      data: { productId: 'p-elec-1' },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.items[0].product.id).toBe('p-elec-1');
  });

  test('POST /api/cart - without auth returns 401', async ({ request }) => {
    const response = await request.post('/api/cart', {
      data: { productId: 'p-elec-1' },
    });

    expect(response.status()).toBe(401);
  });
});

test.describe('API - Orders', () => {
  test.afterEach(async ({ request }) => {
    await clearCart(request);
  });

  test('POST /api/orders - happy path (authenticated, with items in cart)', async ({ request }) => {
    await request.post('/api/auth/login', {
      data: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD },
    });
    await request.post('/api/cart', { data: { productId: 'p-elec-1' } });

    const response = await request.post('/api/orders');

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.orderId).toBeDefined();
  });

  test('POST /api/orders - without auth returns 401', async ({ request }) => {
    const response = await request.post('/api/orders');
    expect(response.status()).toBe(401);
  });
});
