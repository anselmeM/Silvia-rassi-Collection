import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test('should open mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Look for hamburger menu button
    const menuButton = page.locator('#menu-button');
    await menuButton.click();
    
    // Check mobile menu is visible
    await expect(page.getByRole('dialog', { name: 'Navigation menu' })).toBeVisible();
  });

  test('should close mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open menu
    await page.locator('#menu-button').click();
    
    // Check menu is visible
    const mobileMenu = page.getByRole('dialog', { name: 'Navigation menu' });
    await expect(mobileMenu).toBeVisible();
    
    // Close menu
    await page.locator('#close-menu-button').click();
    
    // Menu should be hidden
    await expect(mobileMenu).not.toBeVisible();
  });

  test('should navigate using mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Open mobile menu
    await page.locator('#menu-button').click();
    
    // Click on a navigation link
    await page.locator('.mobile-menu-content a:has-text("Collections")').click();
    
    // Menu should close and navigation should occur
    await expect(page.getByRole('dialog', { name: 'Navigation menu' })).not.toBeVisible();
    await expect(page).toHaveURL(/\/collections/);
  });
});
