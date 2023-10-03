from flask import Flask, request
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
import psycopg2
import re
import requests
from dotenv import load_dotenv
import os
import logging

logging.basicConfig(level=logging.DEBUG)
load_dotenv()

# Now you can access the environment variables using os.getenv
SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
GPT4_API_KEY = os.getenv("GPT4_API_KEY")

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = SQLALCHEMY_TRACK_MODIFICATIONS
app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
db = SQLAlchemy(app)

@app.route('/')
def home():
    return "Welcome to the Finance Tracker!"

@app.route('/user/<string:username>')
def user_profile(username):
    # Fetch user details based on username and display them
    user = User.query.filter_by(username=username).first()
    if not user:
        return "User not found", 404
    return f"Profile for user {user.username}"

# Model for Users
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    transactions = db.relationship('Transaction', backref='user', lazy=True, cascade='all, delete-orphan')
    incomes = db.relationship('Income', backref='user', lazy=True, cascade='all, delete-orphan')
    expenses = db.relationship('Expense', backref='user', lazy=True, cascade='all, delete-orphan')
    savings = db.relationship('Saving', backref='user', lazy=True, cascade='all, delete-orphan')

# Model for Income
class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Model for Expenses
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Model for Savings
class Saving(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

# Model for transaction categories
class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    transactions = db.relationship('Transaction', backref='category', lazy=True)

# Model for individual transactions
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

api = Api(app)
jwt = JWTManager(app)

# User Registration Resource
class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return {"message": "Invalid email format"}, 400

        # Validate username and password length
        if len(username) < 3 or len(password) < 6:
            return {"message": "Username must be at least 3 characters and password at least 6 characters long"}, 400

        # Check if username already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            return {"message": "Username already taken"}, 400

        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        return {"message": "User registered successfully"}, 201

# User Login Resource
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return {"message": "Invalid credentials"}, 401

        access_token = create_access_token(identity=user.id)
        return {"access_token": access_token}, 200

class UserResource(Resource):
    @jwt_required()  # Ensure the user is authenticated
    def get(self, username):
        user = User.query.filter_by(username=username).first()  # Updated query
        if not user:
            return {"message": "User not found"}, 404

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email
        }, 200

    @jwt_required()
    def put(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            return {"message": "User not found"}, 404

        data = request.get_json()
        username = data.get('username', user.username)
        email = data.get('email', user.email)
        password = data.get('password')

        # Validate email format
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return {"message": "Invalid email format"}, 400

        # Validate username and password length
        if len(username) < 3 or (password and len(password) < 6):
            return {"message": "Username must be at least 3 characters and password at least 6 characters long"}, 400

        user.username = username
        user.email = email
        if password:
            user.password = generate_password_hash(password, method='pbkdf2:sha256')

        db.session.commit()

        return {"message": "User updated successfully"}, 200

    @jwt_required()
    def delete(self, username):
        user = User.query.filter_by(username=username).first()
        if not user:
            return {"message": "User not found"}, 404

        db.session.delete(user)
        db.session.commit()

        return {"message": "User deleted successfully"}, 200

# GPT-4 Integration
class GPT4Query(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('query', required=True, help="Query cannot be blank!")
        data = parser.parse_args()

        # Define the GPT-4 API endpoint and your API key
        GPT4_ENDPOINT = "https://api.openai.com/v1/chat/completions"
        HEADERS = {
            "Authorization": f"Bearer {GPT4_API_KEY}",  # Replace with your actual API key or use an environment variable
            "Content-Type": "application/json"
        }

        # Define the payload for the chat endpoint
        payload = {
            "model": "gpt-4",
            "messages": [{"role": "system", "content": "You are a helpful assistant."},
                         {"role": "user", "content": data['query']}]
        }

        # Make the request to GPT-4
        response = requests.post(GPT4_ENDPOINT, headers=HEADERS, json=payload)

        # Check for a valid response
        if response.status_code == 200:
            gpt4_response = response.json()
            return {"response": gpt4_response['choices'][0]['message']['content'].strip()}, 200
        else:
            # Capture the error details from the GPT-4 API response
            error_details = response.json().get('error', 'Unknown error')
            return {"message": f"Error querying GPT-4: {error_details}"}, 500

# Add resources to the API
api.add_resource(UserRegistration, '/register')
api.add_resource(UserLogin, '/login')
api.add_resource(UserResource, '/user/<string:username>')
# Add the GPT-4 resource to the API
api.add_resource(GPT4Query, '/gpt4-query')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)