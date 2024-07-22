import swaggerJSDoc from "swagger-jsdoc";
import { paths } from "./swagger.routes";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "XRP Wager System",
      version: "V1",
      description: "NEED PROJECT DESCRIPTION FROM PROJECT LEAD"
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Authentication with JWT token."
        }
      }
    },
    servers: [
      { url: "http://localhost:4000" },
      { url: "https://wagerapi.thecbt.live" }
    ],
    tags: [
      {
        name: "Client Auth",
        description: "User Authentication Management"
      },
      {
        name: "Client API KEY",
        description: "Client API key management"
      },
      {
        name: "User Auth",
        description: "User Authentication Management"
      }
    ],
    paths,
  },
  apis: ["src/routes/v2/**/*.ts"]
};

const swaggerSpecs = swaggerJSDoc(options);
export default swaggerSpecs;
