# Library Management API

A Flask-based backend application for managing a digital library system, featuring student and librarian roles, book inventory management, reservations, and image uploads. Swagger UI is provided for interactive API documentation.

---

## 📄 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Usage Examples](#usage-examples)
  - [Register & Login](#register--login)
  - [Books Endpoints](#books-endpoints)
  - [Reservations](#reservations)
  - [User Management](#user-management)
  - [Image Upload](#image-upload)
- [Project Structure](#project-structure)
- [Frontend](#frontend)
- [Resources](#resources)
- [Contributing](#contributing)

- [Contributing](#contributing)


---

## Overview

The Library Management API enables two roles:

- **Students**: Browse, reserve, and view reservations.
- **Librarians**: Manage book inventory (add/update), fulfill/return reservations, and upload book cover images.

It uses Flask for the web framework, SQLAlchemy for ORM, and PostgreSQL as the database. Swagger (Flasgger) provides interactive API docs at `/apidocs`.

---

## Tech Stack

- Python 3.9+
- Flask
- Flask-SQLAlchemy
- Flask-CORS
- Flasgger (Swagger UI)
- PostgreSQL
- Werkzeug for password hashing
- psycopg2-binary

---

## Prerequisites

- Python 3.9+ installed
- PostgreSQL installed and running
- `virtualenv` (optional but recommended)

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/library-management-api.git
   cd library-management-api
   ```

2. **Create a virtual environment**

   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

---

## Configuration

1. **Environment Variables**
   - Create a `.env` file or set env vars directly:
     ```bash
     export DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DBNAME
     export FLASK_APP=app.py
     export FLASK_ENV=development
     ```
2. **Upload Folder** Ensure the `static/uploads/` directory exists:
   ```bash
   mkdir -p static/uploads
   ```

---

## Database Setup

1. **Create the database** (replace placeholders):

   ```bash
   psql -U postgres -c "CREATE DATABASE library_db;"
   ```

2. **Initialize tables**

   ```bash
   flask shell  # or python REPL
   >>> from app import db
   >>> db.create_all()
   >>> exit()
   ```

3. **(Optional) Reset schema**

   ```python
   # In your app entrypoint for dev:
   with app.app_context():
       db.drop_all()
       db.create_all()
   ```

---

## Running the Application

```bash
# Activate venv if not already
flask run --host=0.0.0.0 --port=5000
```

Access the API at `http://localhost:5000/`.

---

## API Documentation

Swagger UI is available at:

```
http://localhost:5000/apidocs
```

Explore all endpoints interactively and try out requests.

---

## Usage Examples

### Register & Login

```bash
# Register student or librarian
curl -X POST http://localhost:5000/register \
     -H 'Content-Type: application/json' \
     -d '{"username":"john","password":"pass123","role":"student","email":"john@example.com"}'

# Login
echo '{"username":"john","password":"pass123"}' | \
  curl -X POST http://localhost:5000/login -H 'Content-Type: application/json' -d @-
```

### Books Endpoints

```bash
# List all books
go to http://localhost:5000/books

# Add a book (librarian only)
curl -X POST http://localhost:5000/books \
  -F "user_id=1" -F "title=Clean Code" -F "quantity=5" -F "file=@clean_code.jpg"

# Update a book (librarian only)
# Use multipart/form-data to optionally upload new image
curl -X PUT http://localhost:5000/books/1 \
  -F "user_id=1" -F "title=Clean Architecture" -F "quantity=3" -F "file=@new_cover.jpg"
```

### Reservations

```bash
# Reserve books (student only)
curl -X POST http://localhost:5000/reserve \
  -H 'Content-Type: application/json' \
  -d '{"user_id":2,"books":[{"book_id":1,"quantity":1}]}'

# Fulfill reservation (librarian)
curl -X PATCH http://localhost:5000/reservations/1/fulfill \
  -H 'Content-Type: application/json' \
  -d '{"user_id":1}'

# Return books\>curl -X PATCH http://localhost:5000/reservations/1/return \
  -H 'Content-Type: application/json' \
  -d '{"user_id":1}'
```

### User Management

```bash
# List students (librarian only)
curl http://localhost:5000/users

# Update student info
curl -X PUT http://localhost:5000/users/2 \
  -H 'Content-Type: application/json' \
  -d '{"username":"jane","password":"newpass"}'

# Delete student
curl -X DELETE http://localhost:5000/users/2
```

### Image Upload

```bash
curl -X POST http://localhost:5000/upload-image \
  -F "user_id=1" -F "file=@cover.jpg"
```

---

## Project Structure

```
library_app/
├── app.py
├── swagger.yaml
├── requirements.txt
├── static/uploads/
└── README.md
```

---

## Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add new feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a pull request

---

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Swagger UI (Flasgger)](https://flasgger.pythonanywhere.com/)
- [Create React App](https://create-react-app.dev/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Werkzeug Security Utilities](https://werkzeug.palletsprojects.com/en/latest/utils/)

