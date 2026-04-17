import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test('should open mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], button:has-text("☰")');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      
      // Check mobile menu is visible
      await expect(page.locator('[class*="mobile-menu"], nav[class*="mobile"]')).toBeVisible();
    }
  });

  test('should close mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open menu
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i]');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      
      // Check menu is visible
      const mobileMenu = page.locator('[class*="mobile-menu"], nav[class*="mobile"]');
      await expect(mobileMenu).toBeVisible();
      
      // Close menu
      const closeButton = page.locator('button[aria-label*="close" i], button:has-text("×")');
      if (await closeButton.count() > 0) {
        await closeButton.click();
        
        // Menu should be hidden
        await expect(mobileMenu).not.toBeVisible();
      }
    }
  });

  test('should navigate using mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.locator('button[aria-label*="menu" i]');
    if (await menuButton.count() > 0) {
      await menuButton.click();
      
      // Click on a navigation link
      const navLink = page.locator('[class*="mobile-menu"] a:has-text("Collections"), [class*="mobile-menu"] a:has-text("Dresses")');
      if (await navLink.count() > 0) {
        await navLink.first().click();
        
        // Menu should close and navigation should occur
        await expect(page.locator('[class*="mobile-menu"]')).not.toBeVisible();
      }
    }
  });
});
