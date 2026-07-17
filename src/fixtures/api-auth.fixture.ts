import { test as base } from '@playwright/test';

export const test = base.extend({
    page: async ({ page, context, request }, use) => {
        const response = await request.post('/api/auth/login', {
            data: {
                email: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD,
            },
        });

        if (!response.ok()) {
            throw new Error(
                `API login failed with status ${response.status()}: ${await response.text()}`
            );
        }

        const state = await request.storageState();
        await context.addCookies(state.cookies);

        await use(page);
    },
});

export { expect } from '@playwright/test';
