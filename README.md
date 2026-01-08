# StoreRate Pro - Store Management & Rating Platform

StoreRate Pro is a comprehensive web application designed for the **FullStack Intern Coding Challenge**. It provides a robust interface for users to rate local businesses, for store owners to monitor their performance, and for system administrators to manage the entire ecosystem.

## 🚀 Features

### 1. Multi-Role Authentication
*   **System Administrator**: Full control over user accounts and store listings.
*   **Store Owner**: Access to business-specific analytics and customer feedback.
*   **Normal User**: Ability to search, discover, and rate stores.
*   **Secure Validation**: Strict validation for names (20-60 chars), passwords (8-16 chars, uppercase + special char), and email formats.

### 2. Administrator Dashboard
*   **Real-time Stats**: Track total users, registered stores, and cumulative ratings.
*   **User Management**: Add new users (Admin, Owner, or User roles).
*   **Store Management**: Register new stores and link them to owners.
*   **Data Table**: Filterable and sortable tables for auditing system data.

### 3. Store Owner Portal
*   **Performance Metrics**: View average store ratings and total customer engagement.
*   **Customer Feedback**: Detailed list of ratings provided by specific users.
*   **Security**: Ability to update business-owner credentials.

### 4. User Experience
*   **Discovery**: Search for stores by name or location with real-time filtering.
*   **Interactive Rating**: 5-star rating system with the ability to modify previous feedback.
*   **Modern UI**: Fully responsive design built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS (PostCSS)
*   **Icons**: Lucide/SVG based custom icon set
*   **Architecture**: Service-oriented architecture with a mocked API layer.
*   **Data Persistence**: Simulated Backend using `localStorage` to ensure data persists across browser refreshes.

## 📦 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/storerate-pro.git
    cd storerate-pro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    Navigate to `http://localhost:3000` (or the port specified by Vite).

## 🗄️ Database Structure

While this version uses a simulated frontend database (`mockApi.ts`), a `schema.sql` file is included in the root directory. This provides the blueprint for migrating to a production-ready **MySQL** or **PostgreSQL** database.

### Core Tables:
*   `users`: Stores credentials, roles, and addresses.
*   `stores`: Stores business details and owner relationships.
*   `ratings`: Tracks the junction between users and stores with scores.

## 🧪 Test Credentials

To quickly explore the different roles, use the "Quick Actions" panel on the Login page or use the following:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `AdminPassword1!` |
| **User** | `user@example.com` | `UserPassword1!` |
| **Owner** | `owner@example.com` | `OwnerPassword1!` |

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

