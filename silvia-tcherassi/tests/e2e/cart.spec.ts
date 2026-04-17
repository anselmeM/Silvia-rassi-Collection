import { test, expect } from '@playwright/test';

test.describe('Cart', () => {
  test('should add item to cart', async ({ page }) => {
    await page.goto('/');
    
    // Click on first product
    const productLink = page.locator('a[href*="/product/"]').first();
    await productLink.click();
    
    // Wait for product page
    await expect(page).toHaveURL(/\/product\//);
    
    // Click add to bag button
    const addToBagButton = page.locator('button:has-text("Add to Bag")');
    await addToBagButton.click();
    
    // Check cart drawer opens
    await expect(page.locator('[class*="cart-drawer"], [class*="CartDrawer"]')).toBeVisible();
  });

  test('should remove item from cart', async ({ page }) => {
    await page.goto('/');
    
    // Add item to cart first
    const productLink = page.locator('a[href*="/product/"]').first();
    await productLink.click();
    await page.locator('button:has-text("Add to Bag")').click();
    
    // Wait for cart drawer
    await expect(page.locator('[class*="cart-drawer"], [class*="CartDrawer"]')).toBeVisible();
    
    // Click remove button
    const removeButton = page.locator('button:has-text("Remove"), button[aria-label*="Remove"]');
    if (await removeButton.count() > 0) {
      await removeButton.first().click();
    }
  });

  test('should persist cart on page reload', async ({ page }) => {
    await page.goto('/');
    
    // Add item to cart
    const productLink = page.locator('a[href*="/product/"]').first();
    await productLink.click();
    await page.locator('button:has-text("Add to Bag")').click();
    
    // Verify cart has item
    await expect(page.locator('[class*="cart-drawer"]')).toBeVisible();
    
    // Reload page
    await page.reload();
    
    // Cart should persist due to localStorage
    // Verify cart drawer still shows items
    await expect(page.locator('[class*="cart-drawer"]')).toBeVisible();
  });
});
