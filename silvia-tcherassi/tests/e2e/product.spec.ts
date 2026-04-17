import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should view product details', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a product - clicking on first product card
    const productLink = page.locator('a[href*="/product/"]').first();
    await productLink.click();
    
    // Wait for product page to load
    await expect(page).toHaveURL(/\/product\//);
    
    // Check product details are displayed
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Check add to bag button exists
    const addToBagButton = page.locator('button:has-text("Add to Bag"), button:has-text("Add to Bag")');
    await expect(addToBagButton.first()).toBeVisible();
  });

  test('should display product gallery', async ({ page }) => {
    await page.goto('/product/1');
    
    // Check main image is visible
    const mainImage = page.locator('img').first();
    await expect(mainImage).toBeVisible();
    
    // Check product name and price are displayed
    await expect(page.locator('[class*="price"], text=$').first()).toBeVisible();
  });
});
