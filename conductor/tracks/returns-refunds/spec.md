# Specification: Returns & Refunds

## Overview
The Returns & Refunds system provides a self-service way for customers to initiate returns, while ensuring the store can track, approve, and process refunds efficiently.

## Requirements

### 1. Return Request UI (`/return/:orderId`)
- **Requirement:** A dedicated page for customers to select items from an order for return.
- **Details:** 
  - List all items in the order with checkboxes.
  - Require a "Return Reason" for each selected item (e.g., "Too big", "Damaged").
  - Optional: Allow uploading a photo for damaged items.
- **Security:** Must be a protected route; user must own the order.

### 2. Return Submission
- **Requirement:** Submit the return request to the Medusa backend.
- **Implementation:** Use `medusaFetch` to call `/store/returns`.
- **Validation:** Ensure at least one item is selected and reasons are provided.

### 3. Backend Logic (Phase H.2)
- **Requirement:** Configure return reasons in Medusa Admin or via seed script.
- **Requirement:** Ensure Stripe refund logic is triggered upon admin approval (Admin task, but frontend must be ready).

## Success Criteria
- [ ] Customer can select specific items from a past order to return.
- [ ] Submitting the form creates a "Return" record in the Medusa backend.
- [ ] User receives a clear confirmation message with next steps (e.g., "Wait for approval").