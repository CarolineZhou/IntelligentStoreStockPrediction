const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
let dbInstance = null;

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    port: process.env.DB_PORT
});

// connect to the database
connection.connect((err) => {
    if(err) {
        console.log(err.message);
    }
    console.log("DB state: " + connection.state);
});

class DBService {
    static getDBInstance() {
        return dbInstance ? dbInstance : new DBService();
    }
 
    // used only for testing
    async getAllAisles() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM departments;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response);
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getMinDate() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT timestamp FROM orders ORDER BY order_id LIMIT 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getMaxDate() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT timestamp FROM orders ORDER BY order_id DESC LIMIT 1;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllDepartments() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM departments;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getAllAisles() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "SELECT * FROM aisles;";

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductList(aisle_id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT id, name FROM products WHERE aisle_id=${aisle_id} ORDER BY name ASC;`;

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getProductName(id) {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = `SELECT name FROM products WHERE id=${id};`;

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    async getWarnings() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = ` SELECT products.id, name, w.quantity
                                FROM products, warn as w
                                WHERE products.id IN (SELECT id FROM warn) AND products.id = w.id;`;

                connection.query(query, (err, results) => {
                    if (err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = DBService;