from api import db

class Fruits(db.Model):
    Food = db.Column(db.String(60), primary_key=True)
    portionSize = db.Column(db.Float, unique=False, nullable=False)
    pricePortionRatio = db.Column(db.Float, unique=False, nullable=False)
    caloriesPortionRatio = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<Fruits %r>' % self.Food

class Snacks(db.Model):
    Food = db.Column(db.String(60), primary_key=True)
    portionSize = db.Column(db.Float, unique=False, nullable=False)
    pricePortionRatio = db.Column(db.Float, unique=False, nullable=False)
    caloriesPortionRatio = db.Column(db.Integer, unique=False, nullable=False)

    def __repr__(self):
        return '<Snacks %r>' % self.Food