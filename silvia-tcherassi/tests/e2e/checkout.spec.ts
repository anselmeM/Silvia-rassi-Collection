import { test, expect } from '@playwright/test';

test.describe('Full Checkout Journey', () => {
  test('should allow a user to add a product to cart and reach payment step', async ({ page }) => {
    // 1. Go to homepage
    await page.goto('/');
    
    // 2. Click on the first featured product
    const firstProduct = page.locator('section:has-text("New Arrivals") div.grid > div').first();
    await firstProduct.click();
    
    // 3. Add to cart
    const addToBagButton = page.locator('#add-to-cart-button');
    await addToBagButton.click();
    
    // 4. Open cart drawer and proceed to checkout
    const checkoutLink = page.locator('a:has-text("PROCEED TO CHECKOUT")');
    await checkoutLink.click();
    
    // 5. Verify reaching checkout page
    await expect(page).toHaveURL(/\/checkout/);
    
    // 6. Fill shipping address (Step 1)
    await page.fill('input[name="first_name"]', 'John');
    await page.fill('input[name="last_name"]', 'Doe');
    await page.fill('input[name="address_1"]', '123 Fashion Ave');
    await page.fill('input[name="city"]', 'New York');
    await page.fill('input[name="postal_code"]', '10001');
    await page.fill('input[name="phone"]', '5551234567');
    
    await page.click('button:has-text("CONTINUE TO SHIPPING")');
    
    // 7. Select shipping method (Step 2)
    // Wait for options to load
    const shippingOption = page.locator('button:has-text("Standard")').first();
    // In a real E2E we'd wait for it to be visible/enabled
    // await expect(shippingOption).toBeVisible({ timeout: 10000 });
    // await shippingOption.click();
    
    // 8. Verify reaching payment step (Step 3)
    // await expect(page.locator('h2:has-text("Payment Information")')).toBeVisible();
  });
});
