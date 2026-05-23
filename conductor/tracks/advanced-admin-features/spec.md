# Specification: Advanced Admin Features

## Overview
This specification details the technical requirements for advanced operational features within the MedusaJS backend to support better inventory management and sales insight.

## Requirements

### 1. Inventory Thresholds
- **Requirement:** Allow setting a "Minimum Stock Level" (threshold) per product variant.
- **Details:** When the stock level drops below this threshold, the variant should be flagged.

### 2. Low-Stock Alerts
- **Requirement:** Automatically notify administrators when inventory hits the defined threshold.
- **Implementation:** 
  - A scheduled job (subscriber) that checks inventory levels.
  - Integration with an email provider (e.g., SendGrid/Mailgun) or a simple internal notification log.

### 3. Sales Analytics Backend
- **Requirement:** Provide aggregated data for sales performance.
- **Details:** Endpoints to retrieve:
  - Total Revenue (daily/weekly/monthly).
  - Best-selling products.
  - Conversion rates (optional for MVP).

### 4. Admin Integration
- **Requirement:** Expose this data to the Medusa Admin via custom endpoints or UI extensions.

## Success Criteria
- [ ] Admin can define a threshold for a variant.
- [ ] A notification is triggered (logged or emailed) when stock falls below the threshold.
- [ ] A custom API endpoint returns accurate sales summaries for the last 30 days.