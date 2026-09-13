Happy Missy: Company Management System

Happy Missy is a web-based "Company Management System" designed to manage suppliers, banks, purchases, cheque payments, reports, and system users.

The system has two types of access:

- Admin
- User

The Admin has full control over the system, while normal Users can perform daily company operations but cannot modify or delete important records.

---

🔐 Login System

The system has a common login page for both Admin and Users.

### Admin Login

The Admin account is created/configured from the backend.

Only the authorized Admin username and password can access the Admin dashboard.

After logging in, the Admin can:

- Manage suppliers
- Manage banks
- Manage purchases
- Issue cheques
- View purchase reports
- View cheque reports
- Create users
- Edit users
- Manage user access
- Logout from the system

### User Login

Users cannot register themselves.

The Admin creates a user account and provides the user with:

- Username
- Password

The user can then use the same login page to access the system.

Users have limited permissions and cannot manage other users.

---

👨‍💼 Admin Dashboard

After successful Admin login, the Admin is taken to the dashboard.

The dashboard contains:

- Supplier
- Bank
- Purchase
- Issue Cheque
- Reports
- Users
- Settings
- Logout

🏢 Supplier Management

The Admin can manage the company's suppliers.

### Admin can:

- Add a new supplier
- View existing suppliers
- Remove suppliers

Supplier information can later be used while creating purchase records.

---

# 🏦 Bank Management

The Admin can manage the company's bank list.

### Admin can:

- Add a bank
- View added banks
- Delete a bank

The banks added by the Admin are automatically available when creating an Issue Cheque record.


# 🛒 Purchase Management

The Purchase section is used when Happy Missy purchases items from a supplier.

The purchase form includes information such as:

- Issue Date
- Supplier Name
- Purchase Amount
- Tax/VAT
- Total Amount

The supplier name can be selected from the suppliers previously added by the Admin.

The system calculates the VAT/tax and displays the final amount.

# Purchase Flow

Select Supplier
       ↓
Enter Purchase Amount
       ↓
Calculate VAT/Tax
       ↓
Calculate Total Amount
       ↓
Submit Purchase
       ↓
Purchase Report
