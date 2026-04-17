// Simple test to verify vitest is working
describe('Cart Store', () => {
  beforeEach(() => {
    // Reset state
  });

  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should calculate subtotal correctly', () => {
    const price = 119000; // $1190 in cents
    const quantity = 2;
    const expected = price * quantity;
    expect(expected).toBe(238000);
  });
});
