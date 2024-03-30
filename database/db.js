import getConfig from "next/config";
import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import { userModel } from "./models/user";
const { serverRuntimeConfig } = getConfig();

export const db = {
    initialized: false,
    initialize,
};
async function initialize() {
    try {
        const { host, port, user, password, database } =
            serverRuntimeConfig.dbConfig;

        // Create MySQL connection using mysql2/promise
        const connection = await mysql.createConnection({
            host,
            port,
            user,
            password,
        });

        // Create database if it doesn't exist
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);

        // Create Sequelize instance with mysql2 dialect
        const sequelize = new Sequelize(database, user, password, {
            dialect: "mysql",
            dialectModule: require("mysql2"), // Use require() to ensure correct module is used
        });

        // Initialize User model
        db.User = await userModel(sequelize);

        // Sync models with the database
        await sequelize.sync({ alter: true });

        // Set initialized flag to true
        db.initialized = true;
    } catch (error) {
        console.error("Error initializing database:", error);
        throw error; // Rethrow error to indicate initialization failure
    }
}
