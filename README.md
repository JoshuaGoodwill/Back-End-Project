You will need to create two .env files for this project to connect to the databases:
.env.test
and
.env.development.
Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).
