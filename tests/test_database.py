from database.database import engine

with engine.connect() as connection:
    print("Database is successfully connected")