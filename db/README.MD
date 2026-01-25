# Database Initialisation

The database is automatically created and initialised using Docker.  
When the MySQL container is started for the first time, all SQL scripts located in the `db/init/` directory are executed in alphanumeric order.

This ensures that:

1. The database schema is created first.
2. Initial reference and demo data are inserted afterwards.

## SQL Scripts

## 01_schema.sql

Defines the full relational schema, including:

- Tables and relationships
- Primary and foreign keys
- Constraints and indexes
- Referential integrity rules

The schema follows a normalised relational design to reduce data redundancy and improve consistency.

### 02_seed.sql

Inserts initial data required for development and demonstration purposes, such as:

- User roles
- Sample users
- Example workshops and service requests

No real or sensitive data is included in this script.

---

## Docker Integration

The database layer is integrated using Docker Compose.  
The SQL initialisation scripts are mounted into the MySQL container using the `/docker-entrypoint-initdb.d/` mechanism.

This allows the database to be fully reproducible and environment-independent.

---

## Database Access

For development and demonstration purposes, the database can be accessed via phpMyAdmin.

Default connection details are defined in the `.env` file and include:

- Host
- Database name
- User credentials

---

## Design Considerations

- The database is designed using a relational model to ensure data integrity.
- Schema and seed data are separated to improve maintainability.
- Foreign key constraints enforce ownership and role-based access patterns.
- The database structure aligns with the backend repository and service layers.

---

## Notes

If changes are made to the schema or seed scripts, the database container must be rebuilt to reapply the initialisation scripts.
