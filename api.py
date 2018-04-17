from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from flask import jsonify
from fruit_data import f_data
from snack_data import s_data
from util import loadDb
from util import callDb


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost:5432'
db = SQLAlchemy(app)

from models import Fruits
from models import Snacks

db.drop_all()
db.create_all()

loadDb(db, Snacks, s_data)
loadDb(db, Fruits, f_data)

@app.route('/')
def root_route():
    return 'available routes are /fruits and /snacks'

@app.route('/fruits')
def fruit_route():
    fruit_list = callDb(db, Fruits)
    return jsonify(fruit_list)

@app.route('/snacks')
def snack_route():
    snack_list = callDb(db, Snacks)
    return jsonify(snack_list)
