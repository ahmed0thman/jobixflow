# Stitch UI Prompt — Batch 07: Customer Standalone Payment Link (Mobile Web)

## Context & Role
Generate the standalone responsive mobile-web payment checkout page for **Locksmith Customers** in JobixFlow. This is the only customer-facing screen in the entire product. It must inspire immediate trust, carry zero platform branding, and handle all 4 terminal checkout states.

## Screen Specifications

### 1. Customer Payment Landing Screen (`JOB-001`, `FIN-W-015`)
- Responsive mobile web layout accessible via SMS link (no login, no app install required).
- **Trust & Brand Header:** Locksmith Company Name and Phone prominently at top. Zero JobixFlow platform branding.
- **Job Summary Card:** Job Reference ID, Date, Service Description (e.g. "Emergency Vehicle Unlock & Transponder Key Programming"), and Total Amount Due ($).
- **Secure Card Payment Form:** Credit/debit card inputs (Card Number, Expiry, CVC, Postal Code), Apple Pay / Google Pay 1-tap checkout buttons.

### 2. Four Discrete Terminal States
- **A. Success State:** Animated green checkmark + "Payment of $[Amount] Successful" + "Download Receipt / PDF Invoice" button.
- **B. Failed State:** Red alert banner with specific bank decline reason + "Try Different Card" retry action (preserving input form).
- **C. Expired Link State:** Clock icon + "This payment link has expired. Please contact [Company Name] at [Phone] for an updated link."
- **D. Already Paid State:** Blue badge + "This service bill has already been paid on [Date/Time] via [Method]. No further action required."
