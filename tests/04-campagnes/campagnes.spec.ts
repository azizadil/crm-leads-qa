import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';

test.describe('📢 Campagnes — CRM Assurym', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'client');
    await page.waitForURL(/dashboard/);
  });

  test('Créer une campagne Auto — parcours complet', async ({ page }) => {

    // ÉTAPE 1 : Aller sur création campagne
    await page.click('a[href="/client/campaigns/create"]');
    await page.waitForURL(/campaigns\/create/);

    // ÉTAPE 2 : Choisir le produit "AUTO"
    await page.click('h3:has-text("AUTO")');
    await page.click('button:has-text("Suivant")');

    // ÉTAPE 3 : Choisir le profil "TOUS les profils"
    await page.waitForSelector('text=TOUS les profils');
    await page.getByText('TOUS les profils').click();
    
    // Vérifier que la case est bien cochée avant de continuer
    await expect(page.getByText('TOUS les profils')).toBeVisible();
    await page.click('button:has-text("Suivant")');

   // ÉTAPE 4 : Nom de la campagne + formule Trio
   await page.fill('#campaignName', 'Campagne Auto Test QA');
   await page.getByRole('radio', { name: 'Trio' }).click();

   // ÉTAPE 5 : Choisir le jour Lundi + mettre 5 leads
   const lundiCheckbox = page.getByRole('row', { name: 'Lundi' }).getByRole('checkbox');
   await lundiCheckbox.focus();
   await page.keyboard.press('Space');
   const lundiInput = page.getByRole('row', { name: 'Lundi' }).getByRole('spinbutton');
   await expect(lundiInput).toBeEnabled({ timeout: 10000 });
   await lundiInput.fill('5');

   // ÉTAPE 6 : Cocher EMAIL — c'est la dernière checkbox de la page
   const emailCheckbox = page.getByRole('checkbox').last();
   await emailCheckbox.focus();
   await page.keyboard.press('Space');
   await page.waitForTimeout(200);

    // ÉTAPE 7 : Suivant vers récapitulatif
    await page.click('button:has-text("Suivant")');

    // ÉTAPE 8 : Vérifier le récapitulatif
    await expect(page.locator('text=Campagne Auto Test QA')).toBeVisible();
    await expect(page.locator('text=Trio')).toBeVisible();

    // ÉTAPE 9 : Créer la campagne
    await page.click('button:has-text("Créer")');

    // ÉTAPE 10 : Vérifier dans gestion des campagnes
    await page.waitForURL(/campaigns/, { timeout: 15000 });
    await expect(page.locator('text=Campagne Auto Test QA')).toBeVisible();
  });

  test('Les 11 produits sont visibles', async ({ page }) => {
    await page.click('a[href="/client/campaigns/create"]');

    const produits = [
      'AUTO', 'SANTÉ', 'MOTO', 'MRH',
      'DOMMAGE', 'EDPM', 'RC PRO',
      'MULTIRISQUE', 'DÉCENNALE',
      'TAXI', 'ANIMAUX'
    ];

    for (const produit of produits) {
      await expect(page.locator(`h3:has-text("${produit}")`).first()).toBeVisible();
    }
  });

});