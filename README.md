# Shortify

This is the official frontend for Shortify, a powerful and efficient URL shortener service. This web application provides a clean, responsive user interface for users and administrators to manage links, built with React, Vite, and Tailwind CSS.

## ✨ Features

### User Features
* **Secure Authentication:** Easy and secure user registration and login.
* **URL Shortening:** A simple form to submit long URLs and receive a shortened link.
* **Personal Dashboard:** View, manage, copy, and delete all URLs you have created.
* **Click Analytics:** Track the number of clicks for each of your shortened links.

### Admin Features
* **Separate Admin Panel:** A dedicated and secure login and registration for administrators.
* **System-Wide View:** Admins can view and manage a comprehensive list of all URLs created by all users in the system.
* **Protected Routes:** Access to the admin dashboard is restricted to authenticated administrators only.

## 🛠️ Tech Stack

* **Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **API Communication:** [Axios](https://axios-http.com/)

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

You need to have the following software installed on your machine:
* [Node.js](https://nodejs.org/en/) (v16 or higher)
* [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/aaditya-ahire-dev/shortify.git](https://github.com/aaditya-ahire-dev/shortify.git)
    cd shortify-frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root of the project and add the following variables.

    ```env
    # The base URL of your deployed backend API
    VITE_BACKEND_API_URL=[https://shortify-backend-zypg.onrender.com](https://shortify-backend-zypg.onrender.com)

    # The base URL used for opening the short but add a short id after url/shortID
    VITE_BACKEND_API_URL_COPY=[https://shortify-backend-zypg.onrender.com/url](https://shortify-backend-zypg.onrender.com/url)
    ```

4.  **Start the development server:**
    ```sh
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or the port specified by Vite).

## 🗺️ Available Pages & Routes

This project uses React Router DOM for navigation. Here are the main routes available in the application:

| Path                 | Component            | Protection       | Description                                  |
| :------------------- | :------------------- | :--------------- | :------------------------------------------- |
| `/login`             | `LoginPage`          | Public           | Page for users to log in.                    |
| `/signup`            | `SignupPage`         | Public           | Page for new users to register.              |
| `/admin/login`       | `AdminLoginPage`     | Public           | Dedicated login page for administrators.     |
| `/admin/signup`      | `AdminSignUpPage`    | Public           | Dedicated registration page for administrators.|
| `/`                  | `HomePage`           | User Protected   | Main dashboard for logged-in users.          |
| `/admin/dashboard`   | `AdminHomePage`      | Admin Protected  | Main dashboard for logged-in administrators. |

## 🔗 Backend Repository

The backend for this project is built with Node.js, Express, and MongoDB. You can find the repository here:
* **[Shortify - Backend Repository](https://github.com/aaditya-ahire-dev/short-urls-backend.git)** *(Please link to your backend repo)*