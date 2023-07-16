import sqlite3

connection = sqlite3.connect('database.db')

with open('sql_scripts/show_tables.sql') as f:
    connection.executescript(f.read())

