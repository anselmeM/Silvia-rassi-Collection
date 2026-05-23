# Specification: Customer Portal

## Overview
The Customer Portal allows authenticated users to manage their relationship with the Silvia Tcherassi store, viewing past purchases and maintaining their personal information.

## Requirements

### 1. Order History (`/my-orders`)
- **Requirement:** Display a list of all past and current orders.
- **Details:** Each order card should show order number, date, total, status, and a list of items.
- **Interaction:** Allow users to click into an order for more details or to initiate a return (linked to Phase H).

### 2. Profile Management (`/profile`)
- **Requirement:** Allow users to update their basic account information.
- **Fields:** First Name, Last Name, Email, Phone.
- **Validation:** Use Zod schemas to ensure data integrity.

### 3. Address Book (`/profile/addresses`)
- **Requirement:** Manage multiple shipping/billing addresses.
- **Operations:** Add, Edit, Delete, and Set as Default.
- **Integration:** These addresses should be selectable during the checkout process (future enhancement for checkout).

### 4. Security
- **Requirement:** All portal pages MUST be wrapped in the `ProtectedRoute` component.

## Success Criteria
- [ ] User can view their actual order data from Medusa on the `my-orders` page.
- [ ] User can successfully update their profile name and email.
- [ ] User can add a new address to their account.