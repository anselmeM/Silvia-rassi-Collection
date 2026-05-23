import { test, expect } from '@playwright/test';

test.describe('Quick View Modal', () => {
  test('should open quick view modal', async ({ page }) => {
    await page.goto('/collections');
    
    // Wait for products to load
    await page.waitForSelector('.product-item-container');
    
    // Click on a product to trigger quick view
    const productCard = page.locator('.product-item-container').first();
    await productCard.hover();
    
    // Look for quick view button
    const quickViewButton = page.locator('button:has-text("Quick View")').first();
    await quickViewButton.click();
    
    // Check modal content is visible
    await expect(page.locator('.quick-view-content')).toBeVisible({ timeout: 10000 });
  });

  test('should close quick view modal with escape key', async ({ page }) => {
    await page.goto('/collections');
    
    await page.waitForSelector('.product-item-container');
    await page.locator('.product-item-container').first().hover();
    await page.locator('button:has-text("Quick View")').first().click();
    await expect(page.locator('.quick-view-content')).toBeVisible({ timeout: 10000 });
    
    // Small delay to ensure focus is correct
    await page.waitForTimeout(500);
    
    // Press escape
    await page.keyboard.press('Escape');
    
    // Modal should be closed
    await expect(page.locator('.quick-view-content')).not.toBeVisible();
  });

  test('should close quick view modal by clicking backdrop', async ({ page }) => {
    await page.goto('/collections');
    
    await page.waitForSelector('.product-item-container');
    await page.locator('.product-item-container').first().hover();
    await page.locator('button:has-text("Quick View")').first().click();
    await expect(page.locator('.quick-view-content')).toBeVisible({ timeout: 10000 });
    
    // Click on backdrop (the outer div with class quick-view-modal)
    // We click at a small offset to ensure we hit the backdrop and not the content
    await page.locator('.quick-view-modal').click({ position: { x: 5, y: 5 } });
    
    // Modal should be closed
    await expect(page.locator('.quick-view-content')).not.toBeVisible();
  });
});
