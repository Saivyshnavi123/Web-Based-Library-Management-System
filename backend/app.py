from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flasgger import Swagger
import yaml
import os
from werkzeug.utils import secure_filename
from flask_cors import CORS
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash

# Configuration
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# Flask app setup
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://saichowdhary:pg0Udn6GG3bCEAiWLgi39c6srydZQ408@dpg-d1vs5ubuibrs739n9hdg-a/library_assignment')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SWAGGER'] = {'title': 'Library Management API', 'uiversion': 3}
CORS(app, resources={r"/*": {"origins": "*"}})

# Load Swagger documentation template
with open("swagger.yaml", "r") as f:
    swagger_template = yaml.safe_load(f)

# Initialize extensions
swagger = Swagger(app, template=swagger_template)
db = SQLAlchemy(app)

# ------------------- Models -------------------

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)  # Note: should be hashed in production
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(200), nullable=False)

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    author = db.Column(db.String(100))
    quantity = db.Column(db.Integer, default=1)
    image_url = db.Column(db.String(300))  # New column for image URL

class Reservation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    status = db.Column(db.String(20), default='reserved')

    user = db.relationship('User', backref='reservations')
    book = db.relationship('Book', backref='reservations')

# ------------------- Helper Functions -------------------

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_user(user_id):
    return User.query.get(user_id)

def is_librarian(user):
    return user and user.role == 'librarian'

def is_student(user):
    return user and user.role == 'student'

# ------------------- Authentication -------------------

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not all([data.get('username'), data.get('password'), data.get('role'), data.get('email')]):
        return jsonify({"message": "All fields are required"}), 400

    if User.query.filter_by(username=data['username']).first():
        return jsonify({"message": "Username already exists"}), 409

    hashed_password = generate_password_hash(data['password'])

    user = User(
        username=data['username'],
        password=hashed_password,
        role=data['role'],
        email=data['email']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not all([data.get('username'), data.get('password')]):
        return jsonify({"message": "Username and password required"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({
            "message": "Login successful",
            "user_id": user.id,
            "role": user.role
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401


# ------------------- Book Management -------------------
@app.route('/books', methods=['GET'])
def list_books():
    books = Book.query.order_by(Book.id.asc()).all()
    return jsonify([{ "id": b.id, "title": b.title, "author": b.author, "quantity": b.quantity, "image_url": b.image_url } for b in books]), 200

@app.route('/books', methods=['POST'])
def add_book():
    user_id = request.form.get('user_id')
    user = get_user(user_id)
    if not is_librarian(user):
        return jsonify({"message": "Only librarians can add books"}), 403

    title = request.form.get('title')
    author = request.form.get('author')
    quantity = request.form.get('quantity')

    if not title or not quantity or not quantity.isdigit():
        return jsonify({"message": "Title and numeric quantity are required"}), 400

    image_url = None
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            image_url = f"/{filepath}"

    book = Book(
        title=title,
        author=author,
        quantity=int(quantity),
        image_url=image_url
    )
    db.session.add(book)
    db.session.commit()
    return jsonify({"message": "Book added successfully", "image_url": image_url}), 201

@app.route('/books/<int:book_id>', methods=['PUT'])
def update_book(book_id):
    user_id = request.form.get('user_id')
    user = get_user(user_id)
    if not is_librarian(user):
        return jsonify({"message": "Only librarians can update books"}), 403

    book = Book.query.get(book_id)
    if not book:
        return jsonify({"message": "Book not found"}), 404

    title = request.form.get('title')
    author = request.form.get('author')
    quantity = request.form.get('quantity')

    if title:
        book.title = title
    if author:
        book.author = author
    if quantity and quantity.isdigit():
        book.quantity = int(quantity)

    # Handle optional new file
    if 'file' in request.files:
        file = request.files['file']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            book.image_url = f"/{filepath}"

    db.session.commit()
    return jsonify({"message": "Book updated", "image_url": book.image_url}), 200
# ------------------- Reservation System -------------------

@app.route('/reserve', methods=['POST'])
def reserve_books():
    data = request.json
    user = get_user(data.get('user_id'))
    if not is_student(user):
        return jsonify({"message": "Only students can reserve books"}), 403

    if not data.get('books') or not isinstance(data['books'], list):
        return jsonify({"message": "A list of books is required"}), 400

    for item in data['books']:
        book = Book.query.get(item['book_id'])
        if not book:
            return jsonify({"message": f"Book ID {item['book_id']} not found"}), 404
        if book.quantity < item['quantity']:
            return jsonify({"message": f"Insufficient stock for '{book.title}'"}), 400

        book.quantity -= item['quantity']
        reservation = Reservation(user_id=user.id, book_id=book.id, quantity=item['quantity'])
        db.session.add(reservation)

    db.session.commit()
    return jsonify({"message": "Books reserved successfully"}), 200

@app.route('/reservations/<int:reservation_id>/fulfill', methods=['PATCH'])
def fulfill_reservation(reservation_id):
    data = request.json
    user = get_user(data.get("user_id"))
    if not is_librarian(user):
        return jsonify({"message": "Only librarians can fulfill reservations"}), 403

    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    if reservation.status == "fulfilled":
        return jsonify({"message": "Reservation already fulfilled"}), 400

    reservation.status = "fulfilled"
    db.session.commit()
    return jsonify({"message": "Reservation marked as fulfilled"}), 200

@app.route('/reservations/<int:reservation_id>/return', methods=['PATCH'])
def return_books(reservation_id):
    data = request.json
    user = get_user(data.get("user_id"))
    if not is_librarian(user):
        return jsonify({"message": "Only librarians can process returns"}), 403

    reservation = Reservation.query.get(reservation_id)
    if not reservation:
        return jsonify({"message": "Reservation not found"}), 404

    if reservation.status != "fulfilled":
        return jsonify({"message": "Only fulfilled reservations can be returned"}), 400

    book = Book.query.get(reservation.book_id)
    if book:
        book.quantity += reservation.quantity
        db.session.delete(reservation)
        db.session.commit()
        return jsonify({"message": "Books returned and inventory updated"}), 200

    return jsonify({"message": "Book record not found"}), 404

@app.route('/reservations/user/<int:user_id>', methods=['GET'])
def get_reservations_by_user(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not is_student(user):
        return jsonify({"message": "Only students can view their reservations"}), 403

    reservations = Reservation.query.filter_by(user_id=user_id).order_by(Reservation.id.asc()).all()
    if not reservations:
        return jsonify({"message": "No reservations found", "data": []}), 200

    result = []
    for r in reservations:
        result.append({
            "reservation_id": r.id,
            "book_id": r.book_id,
            "book_title": r.book.title,
            "quantity": r.quantity,
            "status": r.status,
            "user_id": user.id
        })
    return jsonify(result), 200

@app.route('/reservations', methods=['GET'])
def view_assignments():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if not user or user.role != 'librarian':
        return jsonify({"message": "Only librarians can view assignments"}), 403

    reservations = Reservation.query.order_by(Reservation.id.asc()).all()
    if not reservations:
        return jsonify({"message": "No assignments found", "data": []}), 200

    result = []
    for r in reservations:
        result.append({
            "reservation_id": r.id,
            "student": r.user.username,
            "book": r.book.title,
            "quantity": r.quantity,
            "status": r.status,
            "image_url":r.book.image_url
        })
    return jsonify(result), 200


# ------------------- User Management -------------------

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.filter_by(role='student').all()
    return jsonify([{ "id": u.id, "username": u.username, "role": u.role, "email": u.email } for u in users]), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def get_user_by_id(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify({ "id": user.id, "username": user.username, "role": user.role, "email": user.email}), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.username = data.get('username', user.username)
    user.password = data.get('password', user.password)
    db.session.commit()
    return jsonify({"message": "User updated"}), 200

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted"}), 200

# ------------------- App Entry Point -------------------

if __name__ == '__main__':
    with app.app_context():
        db.drop_all()
        db.create_all()
    app.run(debug=True)
