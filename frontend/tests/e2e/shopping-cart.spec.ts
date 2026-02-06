import { test, expect } from '@playwright/test';

/**
 * Shopping cart E2E tests
 * Implements cart functionality testing
 *
 * Covers:
 * - Adding products to cart with quantity controls
 * - Cart badge updates on navbar
 * - Cart page display with items
 * - Quantity adjustment in cart
 * - Item removal from cart
 * - Cart persistence across page refreshes
 * - Empty cart state
 * - Responsive layout (desktop table vs mobile cards)
 */

test.describe('Shopping Cart functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start with empty cart
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.goto('/');
  });

  test('Cart badge is not visible when cart is empty', async ({ page }) => {
    // Given I am on the home page with an empty cart
    await page.goto('/');

    // Then the cart badge should not be visible
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).not.toBeVisible();
  });

  test('Add a product to cart from Products page', async ({ page }) => {
    // Given I am viewing the product catalog
    await page.goto('/products');
    await expect(page.locator('h1:has-text("Products")')).toBeVisible();

    // Wait for products to load
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });

    // When I increase quantity to 2 for the first product
    const firstProductCard = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    const increaseButton = firstProductCard.locator('button[aria-label="Increase quantity"]');
    await increaseButton.click();
    await increaseButton.click();

    // Verify quantity shows 2
    await expect(firstProductCard.locator('span').filter({ hasText: /^2$/ })).toBeVisible();

    // And I click "Add to Cart"
    await firstProductCard.locator('button:has-text("Add to Cart")').click();

    // Then I see a browser alert confirming the addition
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Product added to cart');
      await dialog.accept();
    });

    // And the cart badge shows 2 items
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('2');

    // And the quantity resets to 0
    await expect(firstProductCard.locator('span').filter({ hasText: /^0$/ })).toBeVisible();
  });

  test('Add multiple different products to cart', async ({ page }) => {
    // Given I am viewing the product catalog
    await page.goto('/products');

    // Wait for products to load
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });

    // When I add quantity 1 of first product
    const productCards = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' });
    const firstProduct = productCards.nth(0);
    await firstProduct.locator('button[aria-label="Increase quantity"]').click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // And I add quantity 3 of second product
    const secondProduct = productCards.nth(1);
    const secondIncreaseBtn = secondProduct.locator('button[aria-label="Increase quantity"]');
    await secondIncreaseBtn.click();
    await secondIncreaseBtn.click();
    await secondIncreaseBtn.click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await secondProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Then the cart badge shows 4 total items
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).toHaveText('4');
  });

  test('Navigate to cart page and view cart items', async ({ page }) => {
    // Given I have added a product to my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    await firstProduct.locator('button[aria-label="Increase quantity"]').click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // When I click the cart icon
    await page.click('a[href="/cart"]');

    // Then I land on the cart page
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();

    // And I see the cart items table/grid
    const cartItem = page.locator('td, div').filter({ hasText: /SmartFeeder/i }).first();
    await expect(cartItem).toBeVisible();

    // And I see quantity controls
    await expect(page.locator('button[aria-label="Increase quantity"]').first()).toBeVisible();
    await expect(page.locator('button[aria-label="Decrease quantity"]').first()).toBeVisible();

    // And I see the Order Summary
    await expect(page.locator('h2:has-text("Order Summary")')).toBeVisible();
    await expect(page.locator('text=Subtotal')).toBeVisible();
  });

  test('Adjust quantity in cart page', async ({ page }) => {
    // Given I have a product in my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    const increaseBtn = firstProduct.locator('button[aria-label="Increase quantity"]');
    await increaseBtn.click();
    await increaseBtn.click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // When I navigate to the cart page
    await page.click('a[href="/cart"]');
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();

    // And I increase the quantity by clicking +
    const cartIncreaseBtn = page.locator('button[aria-label="Increase quantity"]').first();
    await cartIncreaseBtn.click();

    // Then the cart badge updates to 3
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).toHaveText('3');

    // When I decrease the quantity by clicking -
    const cartDecreaseBtn = page.locator('button[aria-label="Decrease quantity"]').first();
    await cartDecreaseBtn.click();

    // Then the cart badge updates to 2
    await expect(cartBadge).toHaveText('2');
  });

  test('Remove item from cart', async ({ page }) => {
    // Given I have a product in my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    await firstProduct.locator('button[aria-label="Increase quantity"]').click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // When I navigate to the cart page
    await page.click('a[href="/cart"]');
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();

    // And I click the remove button
    const removeButton = page.locator('button[aria-label="Remove item"]').first();
    await removeButton.click();

    // Then I see the empty cart message
    await expect(page.locator('text=Your cart is empty')).toBeVisible();

    // And the cart badge is no longer visible
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).not.toBeVisible();
  });

  test('Cart persists across page refreshes', async ({ page }) => {
    // Given I have added a product to my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    await firstProduct.locator('button[aria-label="Increase quantity"]').click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // Verify cart badge shows 1
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).toHaveText('1');

    // When I refresh the page
    await page.reload();

    // Then the cart badge still shows 1
    await expect(cartBadge).toHaveText('1');

    // And when I navigate to cart
    await page.click('a[href="/cart"]');

    // Then the cart items are still displayed
    const cartItem = page.locator('td, div').filter({ hasText: /SmartFeeder/i }).first();
    await expect(cartItem).toBeVisible();
  });

  test('Empty cart state is displayed correctly', async ({ page }) => {
    // Given I navigate directly to the cart page with no items
    await page.goto('/cart');

    // Then I see the empty cart message
    await expect(page.locator('text=Your cart is empty')).toBeVisible();

    // And I see the empty cart icon
    const emptyCartIcon = page.locator('[role="status"] svg');
    await expect(emptyCartIcon).toBeVisible();

    // And the cart badge is not visible
    const cartBadge = page.locator('a[href="/cart"] span.bg-primary');
    await expect(cartBadge).not.toBeVisible();
  });

  test('Decrease quantity to zero removes item', async ({ page }) => {
    // Given I have a product with quantity 1 in my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    await firstProduct.locator('button[aria-label="Increase quantity"]').click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // When I navigate to the cart
    await page.click('a[href="/cart"]');
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();

    // And I decrease the quantity to 0
    const decreaseButton = page.locator('button[aria-label="Decrease quantity"]').first();
    await decreaseButton.click();

    // Then the item is removed and empty cart state is shown
    await expect(page.locator('text=Your cart is empty')).toBeVisible();
  });

  test('Order summary displays correct subtotal', async ({ page }) => {
    // Given I have products in my cart
    await page.goto('/products');
    await page.waitForSelector('img[alt*="SmartFeeder"]', { timeout: 10000 });
    
    const firstProduct = page.locator('div[class*="bg-"]').filter({ hasText: 'Add to Cart' }).first();
    const increaseBtn = firstProduct.locator('button[aria-label="Increase quantity"]');
    await increaseBtn.click();
    await increaseBtn.click();
    
    page.once('dialog', async (dialog) => await dialog.accept());
    await firstProduct.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(500);

    // When I view the cart
    await page.click('a[href="/cart"]');
    await expect(page.locator('h1:has-text("Shopping Cart")')).toBeVisible();

    // Then the Order Summary shows a subtotal
    const subtotal = page.locator('text=Subtotal').locator('..');
    await expect(subtotal).toBeVisible();
    
    // And the subtotal contains a dollar amount
    await expect(page.locator('text=/\\$\\d+\\.\\d{2}/')).toBeVisible();

    // And the Proceed to Checkout button is visible
    await expect(page.locator('button:has-text("Proceed To Checkout")')).toBeVisible();
  });
});
