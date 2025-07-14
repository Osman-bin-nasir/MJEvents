# MJEvents - College Event Management

MJEvents is a web application designed to streamline event management within a college campus. It provides a centralized platform for students and faculty to discover, register for, and manage college events. The application is built with Node.js, Express, and MongoDB, featuring user authentication, event creation, and a searchable event directory.

## Features

- **Event Directory:** Browse a comprehensive list of all upcoming and past college events.
- **Event Details:** View detailed information for each event, including date, time, location, organizer, and a full description.
- **User Authentication:** Secure sign-up and login system restricted to college members with an official email domain (`@mjcollege.ac.in`).
- **Event Creation:** Authenticated users can add new events to the directory.
- **Event Registration:** Seamlessly register for events via a direct link to a registration form (e.g., Google Forms).
- **Search Functionality:** Quickly find events by searching for keywords in the event name or organizer.
- **Authorization:** Users can only delete events they have organized.
- **Dark Mode:** A user-friendly toggle for a comfortable viewing experience in low-light conditions.

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Templating Engine:** EJS (Embedded JavaScript) with `ejs-mate` for layouts.
- **Authentication:** Passport.js with `passport-local` and `passport-local-mongoose`.
- **Middleware:** `express-session`, `method-override`, `multer`.

## Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/MJEvents.git
    cd MJEvents
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment:**
    - Make sure you have MongoDB installed and running.
    - The application connects to `mongodb://127.0.0.1:27017/Project1` by default. You can change this in `app.js`.

4.  **Start the server:**
    ```bash
    node app.js
    ```
    The application will be running at `http://localhost:3000`.

## Usage

- **Home Page:** Visit `http://localhost:3000` to see the list of all events.
- **Sign Up:** Create a new account using an email ending in `@mjcollege.ac.in`.
- **Login:** Log in to your account to access features like adding events.
- **Add an Event:** Navigate to the "Add Event" page to create a new event listing.
- **Search:** Use the search bar to find specific events.
- **Toggle Dark Mode:** Click the dark mode toggle to switch between light and dark themes.

## Routes

| Method | Path                  | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/`                   | Display all events.                              |
| GET    | `/search`             | Search for events.                               |
| GET    | `/events/add`         | Display the form to add a new event.             |
| POST   | `/events/add`         | Create a new event.                              |
| GET    | `/details/:id`        | Display details for a specific event.            |
| DELETE | `/details/:id`        | Delete a specific event.                         |
| POST   | `/register/:id`       | Redirect to the event's registration link.       |
| GET    | `/users/login`        | Display the login page.                          |
| POST   | `/login`              | Authenticate and log in a user.                  |
| GET    | `/users/signup`       | Display the signup page.                         |
| POST   | `/signup`             | Register a new user.                             |
| GET    | `/toggle-dark-mode`   | Toggle the dark mode session setting.            |

## Contributing

Contributions are welcome! If you have suggestions for improvements, please feel free to fork the repository and submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

