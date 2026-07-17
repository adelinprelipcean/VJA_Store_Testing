import { Page } from '@playwright/test';

export const loginLocators = (page: Page) => ({
    emailInput: () =>  page.getByRole('textbox', { name: 'Email' }),
    passwordInput: () => page.getByRole('textbox', { name: 'Password' }),
    submitBtn: () => page.getByRole('button', { name: 'Sign in' })
});