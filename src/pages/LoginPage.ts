import {Page, test} from '@playwright/test';
import {loginLocators} from '../locators/login.locators';

export class LoginPage {
    constructor(private page: Page) {}
    async goto() {await this.page.goto('/login');}
    async login(email: string, password: string){
        
        const locators = loginLocators(this.page);

        await test.step('Fill in the login data', async () => {
            await locators.emailInput().fill(email);
            await locators.passwordInput().fill(password);
        });
        await test.step('Submit the form', async () => {
            await locators.submitBtn().click();
        });
    }
};