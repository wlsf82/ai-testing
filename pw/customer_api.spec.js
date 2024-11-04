const { test, expect } = require('@playwright/test');

test.describe('Customer API Tests', () => {
  const baseUrl = 'http://localhost:3001';

  test('should return a list of customers with default pagination', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(200);
    expect(body.customers.length).toBe(10);
    expect(body.pageInfo.currentPage).toBe(1);
  });

  test('should paginate the customer list based on page and limit query parameters', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?page=2&limit=5`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(200);
    expect(body.customers.length).toBe(5);
    expect(body.pageInfo.currentPage).toBe(2);
  });

  test('should filter customers by size', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?size=Medium`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(200);
    body.customers.forEach(customer => {
      expect(customer.size).toBe('Medium');
    });
  });

  test('should filter customers by industry', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?industry=Technology`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(200);
    body.customers.forEach(customer => {
      expect(customer.industry).toBe('Technology');
    });
  });

  test('should return 400 for unsupported size value', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?size=Gigantic`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(400);
    expect(body.error).toContain('Unsupported size value');
  });

  test('should return 400 for unsupported industry value', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?industry=Biotech`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(400);
    expect(body.error).toContain('Unsupported industry value');
  });

  test('should return 400 for invalid page value', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?page=-1&limit=10`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(400);
    expect(body.error).toContain('Invalid page or limit. Both must be positive numbers.');
  });

  test('should return 400 for invalid limit value', async ({ request }) => {
    const response = await request.get(`${baseUrl}/customers?page=1&limit=0`);
    const status = response.status();
    const body = await response.json();

    expect(status).toBe(400);
    expect(body.error).toContain('Invalid page or limit. Both must be positive numbers.');
  });
});
