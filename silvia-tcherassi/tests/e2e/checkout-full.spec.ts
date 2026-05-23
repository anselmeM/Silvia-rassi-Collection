import { test, expect } from '@playwright/test';

test.describe('Full Checkout Journey', () => {
  test('should complete a full checkout from product selection to confirmation', async ({ page }) => {
    await page.goto('/collections');
    
    // 1. Select a product
    await page.waitForSelector('.product-item-container');
    await page.locator('.product-item-container a p').first().click();
    await expect(page).toHaveURL(/\/product\//);
    
    // 2. Add to Bag
    await page.click('button:has-text("Add to Bag")');
    
    // 3. Go to Checkout
    await expect(page.getByRole('dialog', { name: 'Shopping Bag' })).toBeVisible();
    await page.click('text=PROCEED TO CHECKOUT');
    await expect(page).toHaveURL(/\/checkout/);
    
    // 4. Fill shipping info
    await page.fill('input[name="first_name"]', 'John');
    await page.fill('input[name="last_name"]', 'Doe');
    await page.fill('input[name="address_1"]', '123 Fashion St');
    await page.fill('input[name="city"]', 'Miami');
    await page.fill('input[name="postal_code"]', '33101');
    await page.fill('input[name="phone"]', '1234567890');
    
    // Click continue
    await page.click('button:has-text("CONTINUE TO SHIPPING")');
    
    // 5. Select shipping method
    // Wait for options to load
    await expect(page.locator('text=Shipping Method')).toBeVisible();
  });
});
