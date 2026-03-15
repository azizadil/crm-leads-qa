import { test, expect } from '@playwright/test';
import { loginAs, USERS } from '../helpers/auth.helper';

test.describe('🔐 Login — CRM Assurym', () => {

  test('Login client valide → accès dashboard', async ({ page }) => {
    await loginAs(page, 'client');
    await expect(page).not.toHaveURL(/login/);
  });

  test('Login admin valide → accès admin panel', async ({ page }) => {
    await loginAs(page, 'admin');
    await expect(page).not.toHaveURL(/login/);
  });

  test('Mauvais mot de passe → reste sur login', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', USERS.client.email);
    await page.fill('input[type="password"]', 'mauvaismdp_incorrect_123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login|\/$/);
  });

  test('Champs vides → formulaire bloqué', async ({ page }) => {
    await page.goto('/');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login|\/$/);
  });

  test('Email sans @ → validation bloquée', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'emailinvalide');
    await page.fill('input[type="password"]', 'unmdp');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/login|\/$/);
  });

});
