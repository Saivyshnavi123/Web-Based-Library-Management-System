swagger: "2.0"
info:
  title: Library Management API
  description: API for managing users, books, and reservations in a library system.
  version: "1.0"
basePath: /
schemes:
  - https
  - http
consumes:
  - application/json
produces:
  - application/json

paths:
  /register:
    post:
      tags: [Auth]
      summary: Register a new user
      parameters:
        - in: body
          name: user
          required: true
          schema:
            type: object
            required: [username, password, role, email]
            properties:
              username:
                type: string
              password:
                type: string
              role:
                type: string
              email:
                type: string
      responses:
        201:
          description: User registered successfully

  /login:
    post:
      tags: [Auth]
      summary: Authenticate user
      parameters:
        - in: body
          name: credentials
          required: true
          schema:
            type: object
            required: [username, password]
            properties:
              username:
                type: string
              password:
                type: string
      responses:
        200:
          description: Login successful

  /books:
    get:
      tags: [Books]
      summary: List all books
      responses:
        200:
          description: List of books
    post:
      tags: [Books]
      summary: Add a new book (librarians only)
      consumes:
        - multipart/form-data
      parameters:
        - in: formData
          name: user_id
          type: integer
          required: true
        - in: formData
          name: title
          type: string
          required: true
        - in: formData
          name: author
          type: string
        - in: formData
          name: quantity
          type: string
          required: true
        - in: formData
          name: file
          type: file
      responses:
        201:
          description: Book added successfully

  /books/{book_id}:
    put:
      tags:
        - Books
      summary: Update an existing book
      consumes:
        - multipart/form-data
      parameters:
        - name: book_id
          in: path
          required: true
          type: integer
          description: ID of the book to update
        - name: user_id
          in: formData
          required: true
          type: integer
          description: Librarian user ID
        - name: title
          in: formData
          type: string
          description: New title (optional)
        - name: author
          in: formData
          type: string
          description: New author (optional)
        - name: quantity
          in: formData
          type: integer
          description: New quantity (optional)
        - name: file
          in: formData
          type: file
          description: New book cover image (optional)
      responses:
        200:
          description: Book updated successfully
          schema:
            type: object
            properties:
              message:
                type: string
                example: Book updated
              image_url:
                type: string
                example: /static/uploads/new-cover.jpg
        400:
          description: Validation error
        403:
          description: Only librarians can update books
        404:
          description: Book not found

  /reserve:
    post:
      tags: [Reservations]
      summary: Reserve books (students only)
      parameters:
        - in: body
          name: reservation
          required: true
          schema:
            type: object
            properties:
              user_id:
                type: integer
              books:
                type: array
                items:
                  type: object
                  properties:
                    book_id:
                      type: integer
                    quantity:
                      type: integer
      responses:
        200:
          description: Books reserved successfully

  /reservations/{reservation_id}/fulfill:
    patch:
      tags: [Reservations]
      summary: Fulfill a reservation (librarians only)
      parameters:
        - in: path
          name: reservation_id
          type: integer
          required: true
        - in: body
          name: request
          schema:
            type: object
            properties:
              user_id:
                type: integer
      responses:
        200:
          description: Reservation marked as fulfilled

  /reservations/{reservation_id}/return:
    patch:
      tags: [Reservations]
      summary: Return reserved books (librarians only)
      parameters:
        - in: path
          name: reservation_id
          type: integer
          required: true
        - in: body
          name: request
          schema:
            type: object
            properties:
              user_id:
                type: integer
      responses:
        200:
          description: Books returned and inventory updated

  /reservations/user/{user_id}:
    get:
      tags: [Reservations]
      summary: View a student's reservations
      parameters:
        - in: path
          name: user_id
          type: integer
          required: true
      responses:
        200:
          description: List of user reservations

  /reservations:
    get:
      tags: [Reservations]
      summary: View all reservations (librarians only)
      parameters:
        - in: query
          name: user_id
          type: integer
          required: true
      responses:
        200:
          description: List of all reservations

  /users:
    get:
      tags: [Users]
      summary: Get list of all student users
      responses:
        200:
          description: List of users

  /users/{user_id}:
    get:
      tags: [Users]
      summary: Get user by ID
      parameters:
        - in: path
          name: user_id
          type: integer
          required: true
      responses:
        200:
          description: User info
    put:
      tags: [Users]
      summary: Update user info
      parameters:
        - in: path
          name: user_id
          type: integer
          required: true
        - in: body
          name: user
          schema:
            type: object
            properties:
              username:
                type: string
              password:
                type: string
      responses:
        200:
          description: User updated
    delete:
      tags: [Users]
      summary: Delete a user
      parameters:
        - in: path
          name: user_id
          type: integer
          required: true
      responses:
        200:
          description: User deleted

  /upload-image:
    post:
      tags: [Images]
      summary: Upload an image (librarians only)
      consumes:
        - multipart/form-data
      parameters:
        - in: formData
          name: user_id
          type: integer
          required: true
        - in: formData
          name: file
          type: file
          required: true
      responses:
        200:
          description: Image uploaded successfully
