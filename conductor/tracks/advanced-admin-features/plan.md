# Implementation Plan: Advanced Admin Features

## Phase 1: Inventory Thresholds (COMPLETED)
1.  **Schema Extension:** Use Medusa's variant metadata to store `inventory_threshold`. (DONE - Subscriber implemented to read this)
2.  **API Update:** Ensure the threshold can be updated via the admin API. (DONE - Native Medusa Admin supports metadata updates)

## Phase 2: Low-Stock Alert System (COMPLETED)
1.  **Subscriber:** Create a subscriber to the `inventory-item.updated` event. (DONE)
2.  **Logic:** Check if the new stock level is below the threshold. (DONE)
3.  **Notification:** Implement a notification service. (DONE - Initial console logging implemented)

## Phase 3: Sales Analytics Logic (COMPLETED)
1.  **Custom Workflow:** Implement aggregation logic directly in the API route for MVP. (DONE)
2.  **API Route:** Implement a custom GET route `/admin/analytics` to serve the data. (DONE)

## Phase 4: Verification & Dashboard
1.  **Manual Test:** Simulate stock reductions to verify alerts.
2.  **API Test:** Use `curl` or Postman to verify analytics data accuracy.