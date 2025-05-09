import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API - V1",
      version: "1.0.6",
      description: "CRUD operations for Blog and Post. Basic-authorization with login\password admin\qwerty",
    },
  },
  apis:["./src/**/*.swagger.yml"], //  ["./src/**/*.router.ts"],//
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const setupSwagger = (app: Express) => {
  app.use("/api", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
