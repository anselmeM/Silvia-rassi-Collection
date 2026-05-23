# Implementation Plan: Customer Portal

## Phase 1: Order History
1.  **Data Fetching:** Use `medusaFetch` to retrieve the customer's orders from `/store/customers/me/orders`.
2.  **UI Implementation:** Refactor `MyOrdersPage.tsx` from a placeholder to a rich list of order cards.
3.  **Empty State:** Handle the case where a customer hasn't placed any orders yet.

## Phase 2: Profile Management
1.  **New Page:** Create `ProfilePage.tsx` and add it to the router.
2.  **Form Implementation:** Use `react-hook-form` + `zod` for the profile update form.
3.  **API Integration:** Use `medusaFetch` (POST `/store/customers/me`) to save changes.

## Phase 3: Address Book
1.  **UI Layout:** Create an address management section within the profile or as a separate sub-page.
2.  **CRUD Logic:** Implement the "Add/Edit/Delete" flows using Medusa's customer address endpoints.
3.  **Default Address:** Logic to toggle a "default" flag on one address.

## Phase 4: Integration & Verification
1.  **Navigation:** Update the site Header to include links to "My Orders" and "Profile" when logged in.
2.  **E2E Testing:** Verify the customer can navigate through their portal and update information.