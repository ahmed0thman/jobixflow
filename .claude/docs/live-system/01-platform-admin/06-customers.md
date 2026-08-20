# Platform Admin: Customers Directory

## 1. Page Metadata
- **Route:** `/platform/customers`
- **Role Permission:** `platform_admin`
- **Page Title:** `JobixFlow - customers`
- **Screenshot:** [Platform Customers List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-customers-list.png)

---

## 2. Business Logic & Constraints
1. **Centralized Customer Repository:**
   - Aggregates all end-customers who have requested locksmith services across any company or dispatcher.
2. **Customer Data Points:**
   - `Customer Name`: Full primary contact name.
   - `Email`: Optional customer email address.
   - `Phone`: Unique mobile/telephone contact number.
   - `Address`: Primary service address or last known location.
   - `Jobs`: Real-time computed count of lifetime jobs initiated by this customer.
3. **Customer Search:**
   - Multi-field search filtering by name, address fragment, or phone substring.

---

## 3. User Flows & Interactions
1. Administrator navigates to `/platform/customers`.
2. Uses the search bar to look up customer contact records or verify past job volumes associated with a phone number.

---

## 4. Component Dependencies & Data Schema

### Entity Model (`App\Models\Customer`):
- `id`: integer, primary key
- `name`: string, required
- `phone`: string, required, indexed
- `email`: string, nullable
- `address`: text, nullable
- Relationships: `hasMany(Job::class)`
