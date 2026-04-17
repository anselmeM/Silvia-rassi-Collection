import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to home page and display hero section', async ({ page }) => {
    // Check hero section is visible
    await expect(page.locator('h1')).toContainText('Effortless elegance');
    
    // Check shop now button exists
    const shopNowButton = page.locator('a:has-text("Shop Now")');
    await expect(shopNowButton).toBeVisible();
  });

  test('should display featured categories', async ({ page }) => {
    // Check featured categories section
    await expect(page.locator('text=The World of Tcherassi')).toBeVisible();
    
    // Check category cards are visible
    await expect(page.locator('text=Dresses')).toBeVisible();
    await expect(page.locator('text=Handbags')).toBeVisible();
    await expect(page.locator('text=Accessories')).toBeVisible();
  });

  test('should display social proof section', async ({ page }) => {
    // Check social proof
    await expect(page.locator('text=As Seen In')).toBeVisible();
    await expect(page.locator('text=VOGUE')).toBeVisible();
    await expect(page.locator('text=Harper\'s BAZAAR')).toBeVisible();
  });
});
