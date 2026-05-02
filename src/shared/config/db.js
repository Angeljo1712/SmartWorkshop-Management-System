const { pool } = require("./pool");

const query = async (sql, params = []) => {
  const [rows] = await pool.query(sql, params);
  return rows;
};

const withTransaction = async (handler) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const result = await handler(connection);
    await connection.commit();
    return result;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = { pool, query, withTransaction };
