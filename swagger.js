import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Dia-Tasks",
    description: "Api Docs",
  },
  host: "localhost:7777",
  securityDefinitions: {
    Bearer: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
};
const outputFile = "./swagger-output.json";
const routes = ["./server.js"];

swaggerAutogen()(outputFile, routes, doc);
