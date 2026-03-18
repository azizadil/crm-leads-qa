import { test, expect } from '@playwright/test';
import { loginAs } from '../helpers/auth.helper';

test.describe('⚙️ Gestion des campagnes — CRM Assurym', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'client');
    await page.goto('/client/campaigns/gestion');
    await page.waitForURL(/campaigns\/gestion/);
  });

  test('Page gestion affiche les campagnes', async ({ page }) => {
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(
      page.getByRole('cell', { name: 'Campagne Auto Test QA' }).first()
    ).toBeVisible();
  });

  test('Mettre une campagne en pause → confirmer', async ({ page }) => {
    // Cliquer sur Pause
    await page.locator('button[title="Mettre en pause"]').first().click();

    // Confirmer dans la popup
    await page.locator('button:has-text("Confirmer le changement")').click();
    await page.waitForTimeout(1500);

    // Re-chercher le bouton Activer après rafraîchissement
    await expect(
      page.locator('button[title="Activer"]').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('Activer une campagne en pause → confirmer', async ({ page }) => {
    // Si la campagne est déjà en pause, on teste Activer
    // Sinon on met d'abord en pause
    const pauseBtn = page.locator('button[title="Mettre en pause"]').first();
    const activerBtn = page.locator('button[title="Activer"]').first();

    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
      await page.locator('button:has-text("Confirmer le changement")').click();
      await page.waitForTimeout(1500);
    }

    // Maintenant activer
    await page.locator('button[title="Activer"]').first().click();
    await page.locator('button:has-text("Confirmer le changement")').click();
    await page.waitForTimeout(1500);

    // Le bouton Pause doit réapparaître
    await expect(
      page.locator('button[title="Mettre en pause"]').first()
    ).toBeVisible({ timeout: 8000 });
  });

  test('Modifier une campagne → contenu visible', async ({ page }) => {
    await page.locator('button[title="Modifier la campagne"]').first().click();
    await page.waitForTimeout(500);

    // Vérifier que du contenu de la campagne est visible
    await expect(
      page.locator('text=Campagne Auto Test QA').first()
    ).toBeVisible({ timeout: 5000 });
  });

  test('Supprimer → popup confirmation visible', async ({ page }) => {
    await page.locator('button[title="Supprimer"]').first().click();
    await page.waitForTimeout(500);

    // Vérifier que la popup de confirmation apparaît
    await expect(
      page.locator('button:has-text("Confirmer")').first()
    ).toBeVisible({ timeout: 5000 });

    // Annuler pour ne pas supprimer
    await page.locator('button:has-text("Plus tard"), button:has-text("Annuler")').first().click();

    // La campagne doit toujours être là
    await expect(
      page.getByRole('cell', { name: 'Campagne Auto Test QA' }).first()
    ).toBeVisible();
  });

});