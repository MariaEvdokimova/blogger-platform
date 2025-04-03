import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "h02 API - V1",
      version: "h02",
      description: "CRUD operations for Blog and Post. Basic-authorization with login\password admin\qwerty",
    },
  },
  apis: ["./src/**/*.swagger.yml"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/ht_02/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
