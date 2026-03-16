import { Page } from '@playwright/test';

export const USERS = {
  client: {
    email:    'adam.brun@assurym.fr',
    password: 'vmdQGwzX85PB49H',      
  },
  admin: {
    email:    'aziz.adil3@gmail.com', 
    password: 'KEnitra59@',     
  },
};

export async function loginAs(page: Page, role: 'client' | 'admin') {
  const user = USERS[role];
await page.goto('/login');
await page.fill('#email', user.email);
await page.fill('#password', user.password);
await page.click('button[type="submit"]');
  await page.waitForURL(/dashboard|accueil|home/, { timeout: 10000 });
}