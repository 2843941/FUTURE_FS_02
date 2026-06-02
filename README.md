# Client Lead Management System (Mini CRM)

A complete CRM system for managing client leads built with **React** and **Firebase**.

## Live Demo

🔗 **https://crm-lead-system-94fc0.web.app**

---

## Features

| Feature | Description |
|---------|-------------|
|  Public Contact Form | Anyone can submit name, email, and message |
|  Secure Admin Login | Only authenticated admins can access the dashboard |
|  Lead Dashboard | View all leads in a clean table |
|  Status Updates | Change status: NEW → CONTACTED → CONVERTED |
|  Follow-up Notes | Add and view notes for each lead |
|  Delete Leads | Remove leads when no longer needed |
|  Statistics | Real-time counts of New/Contacted/Converted leads |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React.js |
| Backend & Database | Firebase Firestore |
| Authentication | Firebase Auth |
| Routing | React Router DOM |
| Hosting | Firebase Hosting |


---

## How It Works

### For Clients (Public)
1. Client visits the website
2. Fills out the contact form (Name, Email, Message)
3. Clicks "Send Message"
4. Data is saved to Firebase automatically
5. Client sees "Thank You" confirmation

### For Admins (Private)
1. Admin clicks "Admin Login" in navigation
2. Enters email and password
3. Views all leads in the dashboard
4. Can change lead status (NEW → CONTACTED → CONVERTED)
5. Can add follow-up notes to each lead
6. Can delete leads if needed




