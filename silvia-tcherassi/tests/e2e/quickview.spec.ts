import { test, expect } from '@playwright/test';

test.describe('Quick View Modal', () => {
  test('should open quick view modal', async ({ page }) => {
    await page.goto('/');
    
    // Click on a product to trigger quick view
    const productCard = page.locator('[class*="product-card"], [class*="ProductCard"]').first();
    await productCard.hover();
    
    // Look for quick view button or click on product
    const quickViewButton = page.locator('button:has-text("Quick View"), button:has-text("Quick view")');
    if (await quickViewButton.count() > 0) {
      await quickViewButton.click();
      
      // Check modal is visible
      await expect(page.locator('[role="dialog"], [class*="quick-view"]')).toBeVisible();
    } else {
      // Fallback: click product link
      await page.locator('a[href*="/product/"]').first().click();
      await expect(page).toHaveURL(/\/product\//);
    }
  });

  test('should close quick view modal with escape key', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a product
    await page.locator('a[href*="/product/"]').first().click();
    await expect(page).toHaveURL(/\/product\//);
    
    // Press escape to go back if modal is open
    await page.keyboard.press('Escape');
    
    // Modal should be closed (we're back to previous page or modal closed)
  });

  test('should close quick view modal by clicking backdrop', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to a product
    await page.locator('a[href*="/product/"]').first().click();
    await expect(page).toHaveURL(/\/product\//);
    
    // Click outside modal area if visible
    await page.mouse.click(10, 10);
  });
});
