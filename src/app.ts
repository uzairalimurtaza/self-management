import express from "express";
import dotenv from "dotenv";
import path from "path";
import morgan from "morgan";
import cors from "cors";
import './services/databases/ormconfig.service'; // Adjust the path as necessary
import routes from "./routes";
import swagger_specs from "./services/swagger-documentation/swagger.config";
import swaggerUi from 'swagger-ui-express';

dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();

class App {
  constructor() {
    this.server_configurations();
    this.databaseConnection();
    // this.swagger_documentation();
    app.use(express.static(path.join(__dirname, 'public')));
    // app.use(routes); // Ensure routes are applied
  }

  private server_configurations(): void {
    app.use(express.json({ limit: "25mb" }));
    app.use(express.urlencoded({ limit: "25mb", extended: false }));
    app.use(cors());
    app.use(morgan("dev"));
  }

  private async databaseConnection() {
    try {
      await AppDataSource.initialize();
      console.log("Database connected successfully.");
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1); // Exit the app if the database connection fails
    }
  }

  private swagger_documentation() {
    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger_specs));
  }
}

new App();
export default app;
