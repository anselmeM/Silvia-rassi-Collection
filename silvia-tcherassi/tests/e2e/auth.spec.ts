import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should redirect unauthenticated users from protected routes', async ({ page }) => {
    // Navigate directly to a protected route
    await page.goto('/my-orders');
    // Wait for the redirect to happen
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('h1')).toHaveText('Sign In');
  });

  test('should show validation errors on registration', async ({ page }) => {
    await page.goto('/register');
    
    // Submit empty form
    await page.click('button:has-text("CREATE ACCOUNT")');
    
    // Check for validation messages
    await expect(page.locator('text=First name is required')).toBeVisible();
    await expect(page.locator('text=Last name is required')).toBeVisible();
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();

    // Fill invalid password (too short)
    await page.fill('input[id="password"]', 'short');
    await page.click('button:has-text("CREATE ACCOUNT")');
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();

    // Password missing uppercase
    await page.fill('input[id="password"]', 'lowercase1');
    await page.click('button:has-text("CREATE ACCOUNT")');
    await expect(page.locator('text=Password must contain at least one uppercase letter')).toBeVisible();

    // Password missing number
    await page.fill('input[id="password"]', 'UPPERCASE');
    await page.click('button:has-text("CREATE ACCOUNT")');
    await expect(page.locator('text=Password must contain at least one number')).toBeVisible();
  });

  test('should show validation errors on login', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[id="email"]', 'invalid-email');
    await page.click('button:has-text("SIGN IN")');
    await expect(page.locator('text=Invalid email address')).toBeVisible();
    
    await page.fill('input[id="password"]', 'short');
    await page.click('button:has-text("SIGN IN")');
    await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible();
  });

  test('should navigate to forgot password and back', async ({ page }) => {
    await page.goto('/login');
    await page.click('text=Forgot password?');
    await expect(page).toHaveURL(/\/forgot-password/);
    await expect(page.locator('h1')).toHaveText('Reset Password');
    
    await page.click('text=Cancel');
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show success message on forgot password submission', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("SEND RESET LINK")');
    
    await expect(page.locator('text=If an account with that email exists, we have sent password reset instructions.')).toBeVisible();
    await expect(page.locator('text=Return to Sign In')).toBeVisible();
  });
});
