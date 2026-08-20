# Platform Admin: Countries Configuration

## 1. Page Metadata
- **Route:** `/platform/countries`
- **Role Permission:** `platform_admin`
- **Page Title:** `JobixFlow - Countries`
- **Screenshots:**
  - Countries List: [Platform Countries List](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-countries.png)
  - Add Country Modal: [Add Country Modal](file:///Users/ahmedhisham/Work/Deltana/jobixflow/.claude/docs/live-system/screenshots/platform-add-country-modal.png)

---

## 2. Business Logic & Constraints
1. **Predefined Country Binding:**
   - Countries serve as the fundamental geopolitical partition for the platform.
   - Every company, user, and job can be linked to a specific country record.
2. **Provider Bindings:**
   - **Call Provider:** Name/identifier of the telephony gateway service configured for phone operations in this country.
   - **Whatsapp Provider:** Name/identifier of the WhatsApp messaging gateway service configured for notifications in this country.
3. **Usage Integrity Counters:**
   - Each country row computes aggregate counts of associated resources:
     - `Companies`: Total companies registered under this country.
     - `Jobs`: Total jobs created within this country.
     - `Users`: Total users belonging to this country.
   - Prevents deletion of countries actively referenced by jobs or companies.

---

## 3. User Flows & Interactions

### Flow 1: Add New Country & Gateway Bindings
1. Administrator clicks "Add Country" button on `/platform/countries`.
2. "Add New Country" modal appears.
3. Administrator inputs:
   - `Country Name *` (e.g., "United Arab Emirates", "Saudi Arabia", "USA").
   - `Country Code` (e.g., `AE`, `SA`, `US`).
   - `Call Provider` (e.g., Twilio, local SIP gateway).
   - `Whatsapp Provider` (e.g., Twilio WhatsApp, MessageBird).
4. Administrator clicks "Create Country".
5. System persists the country and immediately exposes it across all country selector dropdowns platform-wide.

### Flow 2: Search & Filter Countries
1. Administrator types into "Search by name" input.
2. Table filters country entries on keyup.

---

## 4. Use Cases & Edge Cases

| Case | Scenario | Expected Behavior |
|---|---|---|
| **Country In Use Deletion** | Attempting to delete a country with `Companies > 0` or `Jobs > 0` | Deletion blocked with reference constraint error. |
| **Missing Gateway Provider** | Adding country without specifying Call/WhatsApp provider | Country created successfully, telephony features fallback to platform default gateway. |

---

## 5. Component Dependencies & Data Schema

### Entity Model (`App\Models\Country`):
- `id`: integer, primary key
- `name`: string, required
- `code`: string (ISO-2 code)
- `call_provider`: string, nullable
- `whatsapp_provider`: string, nullable
- Relationships: `hasMany(Company::class)`, `hasMany(Job::class)`, `hasMany(User::class)`
