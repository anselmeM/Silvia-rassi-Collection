# Implementation Plan: Returns & Refunds

## Phase 1: Return Request UI (COMPLETED)
1.  **Order Fetching:** Update `ReturnRequestPage.tsx` to fetch order details using the `orderId` param. (DONE)
2.  **Item Selection:** Build a multi-select interface for order line items. (DONE)
3.  **Reason Selection:** Implement a dropdown for standard return reasons. (DONE)

## Phase 2: API Integration (COMPLETED)
1.  **Reason Fetching:** Fetch available return reasons from Medusa. (DONE)
2.  **Submission Logic:** Implement the `POST /store/returns` call using `medusaFetch`. (DONE)

## Phase 3: Confirmation & Feedback (COMPLETED)
1.  **Success State:** Build a confirmation view after successful submission. (DONE)
2.  **Navigation:** Ensure users are redirected to their order history or the confirmation page. (DONE)

## Phase 4: Backend Configuration (Verification)
1.  **Return Reasons:** Verify return reasons exist in the Medusa database via seed or admin.
2.  **Testing:** Manually verify the return appears in the Medusa Admin dashboard.