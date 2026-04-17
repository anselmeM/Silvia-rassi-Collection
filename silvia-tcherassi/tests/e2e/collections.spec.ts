import { test, expect } from '@playwright/test';

test.describe('Collections Page', () => {
  test('should browse collections and view products', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to collections
    await page.click('nav >> text=Collections');
    await expect(page).toHaveURL(/\/collections/);
    
    // Check page heading
    await expect(page.locator('h1, h2').first()).toContainText('Collections');
    
    // Check products are displayed
    const productCards = page.locator('[class*="product-card"], [class*="ProductCard"]');
    await expect(productCards.first()).toBeVisible();
  });

  test('should filter products by category', async ({ page }) => {
    await page.goto('/collections/dresses');
    
    // Check category heading
    await expect(page.locator('h1, h2').first()).toContainText(/dress/i);
    
    // Check products are displayed
    const productCards = page.locator('[class*="product-card"], [class*="ProductCard"]');
    const count = await productCards.count();
    expect(count).toBeGreaterThan(0);
  });
});
