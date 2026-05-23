import { test, expect } from '@playwright/test';

test.describe('Product Page', () => {
  test('should view product details', async ({ page }) => {
    await page.goto('/');
    
    // Wait for products
    await page.waitForSelector('.product-item-container');
    
    // Click on a product name
    const productLink = page.locator('.product-item-container a p').first();
    await productLink.click();
    
    // Wait for product page to load
    await expect(page).toHaveURL(/\/product\//);
    
    // Check product details are displayed
    await expect(page.locator('h1, h2').first()).toBeVisible();
    await expect(page.locator('button:has-text("Add to Bag")')).toBeVisible();
  });

  test('should display product gallery', async ({ page }) => {
    await page.goto('/collections');
    
    // Wait for products
    await page.waitForSelector('.product-item-container');
    
    // Go to product page
    await page.locator('.product-item-container a p').first().click();
    await expect(page).toHaveURL(/\/product\//);
    
    // Check images are visible
    const images = page.locator('img');
    await expect(images.first()).toBeVisible();
  });
});
