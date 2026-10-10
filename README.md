# Student Management System (SCMS)

A web-based Student Management System designed to manage student information, attendance, marks, and role-based access for administrators, faculty, and students.

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- HTML and CSS

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT authentication
- BCrypt password hashing

### Database
- MySQL 8

## User Roles

- **Admin:** Manages student records and administrative operations.
- **Faculty:** Accesses student information and manages attendance and marks.
- **Student:** Accesses their permitted student-specific information.

## Features

- User authentication using JWT.
- Password hashing using BCrypt.
- Role-based authorization.
- React frontend with protected routes.
- Student record management.
- Faculty and student dashboards.
- Attendance management.
- Marks management.
- MySQL database integration.

## Project Structure

```text
student-management-system/
├── backend/
│   ├── src/
│   └── pom.xml
├── frontend/
│   ├── src/
│   ├── package.json
│   └── index.html
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before running the project:

- Java JDK 21
- Apache Maven
- Node.js and npm
- MySQL Server 8

## Database Setup

1. Start your MySQL server.
2. Create the database:

```sql
CREATE DATABASE student_management_system;
```

3. Configure the database connection using environment variables.

## Environment Variables

Configure these variables before starting the backend:

| Variable | Purpose |
|---|---|
| `DB_URL` | MySQL JDBC connection URL |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key used for JWT signing |

**Security:** Never commit real passwords, JWT secrets, or `.env` files to GitHub.

## Running the Backend

From the project root, open a terminal and run:

```bash
cd backend
mvn spring-boot:run
```

Configure the required environment variables in the terminal before starting the application.

The backend is configured to run on port `8080`.

## Running the Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local development URL printed by Vite, usually:

`http://localhost:5173`

## Development Status

This project is being developed incrementally. Features and workflows are tested as implementation progresses.

## Future Improvements

- Registration approval workflows.
- Additional validation and error handling.
- Automated testing.
- Deployment and CI/CD integration.

## Author

Developed as an academic software project.