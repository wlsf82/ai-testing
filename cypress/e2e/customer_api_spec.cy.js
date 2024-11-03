describe('Customer API Tests', () => {
  const baseUrl = 'http://localhost:3001';

  it('should return a list of customers with default pagination', () => {
    cy.request(`${baseUrl}/customers`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.customers).to.have.length(10);
      expect(body.pageInfo.currentPage).to.eq(1);
    });
  });

  it('should paginate the customer list based on page and limit query parameters', () => {
    cy.request(`${baseUrl}/customers?page=2&limit=5`).then(({ status, body }) => {
      expect(status).to.eq(200);
      expect(body.customers).to.have.length(5);
      expect(body.pageInfo.currentPage).to.eq(2);
    });
  });

  it('should filter customers by size', () => {
    cy.request(`${baseUrl}/customers?size=Medium`).then(({ status, body }) => {
      expect(status).to.eq(200);
      body.customers.forEach(({ size }) => {
        expect(size).to.eq('Medium');
      });
    });
  });

  it('should filter customers by industry', () => {
    cy.request(`${baseUrl}/customers?industry=Technology`).then(({ status, body }) => {
      expect(status).to.eq(200);
      body.customers.forEach(({ industry }) => {
        expect(industry).to.eq('Technology');
      });
    });
  });

  it('should return 400 for unsupported size value', () => {
    cy.request({
      url: `${baseUrl}/customers?size=Gigantic`,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.error).to.include('Unsupported size value');
    });
  });

  it('should return 400 for unsupported industry value', () => {
    cy.request({
      url: `${baseUrl}/customers?industry=Biotech`,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.error).to.include('Unsupported industry value');
    });
  });

  it('should return 400 for invalid page value', () => {
    cy.request({
      url: `${baseUrl}/customers?page=-1&limit=10`,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.error).to.include('Invalid page or limit. Both must be positive numbers.');
    });
  });

  it('should return 400 for invalid limit value', () => {
    cy.request({
      url: `${baseUrl}/customers?page=1&limit=0`,
      failOnStatusCode: false,
    }).then(({ status, body }) => {
      expect(status).to.eq(400);
      expect(body.error).to.include('Invalid page or limit. Both must be positive numbers.');
    });
  });
});
