import { test, expect } from '@playwright/test';

const PAGES = [
  { name: 'Home', path: '/' },
  { name: 'Collections', path: '/collections' },
  { name: 'Dresses', path: '/dresses' },
  { name: 'Handbags', path: '/handbags' },
  { name: 'Accessories', path: '/accessories' },
  { name: 'About', path: '/about' },
  { name: 'Login', path: '/login' },
  { name: 'Register', path: '/register' },
];

test.describe('Comprehensive Verification', () => {
  
  test.beforeEach(async ({ page }) => {
    // Wait for backend to be ready
    await page.waitForTimeout(2000);
  });

  // Helper to check for console errors and broken images
  const verifyPageIntegrity = async (page, pageName) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore known CORS/CSP noise if they don't break functionality
        if (!text.includes('CORS') && !text.includes('frame-ancestors')) {
          consoleErrors.push(text);
        }
      }
    });

    await page.goto(page.url(), { waitUntil: 'networkidle' });
    
    // 1. Check for basic load
    await expect(page).not.toHaveTitle(/Error/i);
    
    // 2. Check for console errors (filtered)
    expect(consoleErrors, `Page ${pageName} has console errors: ${consoleErrors.join(', ')}`).toHaveLength(0);

    // 3. Check for broken images
    // Wait for images to likely be loaded
    await page.waitForTimeout(1000);
    const images = await page.locator('img').all();
    for (const img of images) {
      const isVisible = await img.isVisible();
      if (isVisible) {
        const naturalWidth = await img.evaluate((node: HTMLImageElement) => node.naturalWidth);
        const src = await img.getAttribute('src');
        // Skip placeholder or small icons if needed, but here we want to catch broken product images
        if (!src?.includes('placeholder')) {
          expect(naturalWidth, `Image ${src} on ${pageName} is broken`).toBeGreaterThan(0);
        }
      }
    }
  };

  for (const { name, path } of PAGES) {
    test(`Verify ${name} page integrity`, async ({ page }) => {
      await page.goto(path);
      await verifyPageIntegrity(page, name);
    });
  }

  test('Verify Cart Operations', async ({ page }) => {
    await page.goto('/collections');
    
    // Wait for products to load
    await page.waitForSelector('.product-item-container');
    
    // 1. Open Quick View
    const firstProduct = page.locator('.product-item-container').first();
    // Hover to reveal the Quick View button
    await firstProduct.hover();
    const quickViewBtn = page.locator('button:has-text("Quick View")').first();
    await quickViewBtn.click();
    
    // Wait for content to load (it might show a loader first)
    await expect(page.locator('.quick-view-content')).toBeVisible({ timeout: 10000 });

    // 2. Add to Bag
    await page.click('#quick-view-add-to-cart');
    
    // 3. Verify Cart Drawer is open and has items
    await expect(page.getByRole('dialog', { name: 'Shopping Bag' })).toBeVisible();
    await expect(page.locator('.cart-item')).toHaveCount(1);
    
    // 4. Update Quantity
    const initialSubtotal = await page.locator('#cart-subtotal').textContent();
    // Use a more specific selector for the plus button
    await page.click('button[aria-label="Increase quantity"]');
    // Wait for potential network/state update
    await page.waitForTimeout(2000);
    const updatedSubtotal = await page.locator('#cart-subtotal').textContent();
    expect(initialSubtotal).not.toBe(updatedSubtotal);

    // 5. Remove Item
    await page.click('button:has-text("Remove")');
    await expect(page.locator('#empty-cart-message')).toBeVisible();
  });

  test('Verify Navigation Flow', async ({ page }) => {
    await page.goto('/');
    
    // Hero to Collections
    await page.click('a:has-text("Shop Now")');
    await expect(page).toHaveURL(/\/collections/);
    
    // Collections to Product Page
    await page.waitForSelector('.product-item-container');
    // Click on the product name link which is now wrapped in a Link component
    await page.locator('.product-item-container a p').first().click();
    await expect(page).toHaveURL(/\/product\//);
    
    // Product Page to Home via Logo
    await page.click('text=SILVIA TCHERASSI');
    await expect(page).toHaveURL('/');
  });

  test('Verify Responsive Design (Mobile)', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is specifically for mobile viewport');
    
    await page.goto('/');
    
    // Check if desktop nav is hidden
    await expect(page.locator('nav.hidden.md\\:flex')).not.toBeVisible();
    
    // Open Mobile Menu
    await page.click('#menu-button');
    await expect(page.locator('role=dialog[aria-label="Mobile Menu"]')).toBeVisible();
    
    // Navigate via mobile menu
    await page.click('text=Collections');
    await expect(page).toHaveURL(/\/collections/);
  });
});
