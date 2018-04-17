## Nick Palmucci - Analytics Engineering Interview Task #1
 
 #Usage
 
 activate your python environment and run the following
 
 ```
 pip install -r requirements.txt
 export FLASK_APP=api.py
 flask run
  ```
  
  Flask should serve at `localhost:5000`. That is the port the client code will call.
  
  api.py has `SQLALCHEMY_DATABASE_URI = postgres://localhost:5432`
   this can be reset to the SQL db and port of your choosing