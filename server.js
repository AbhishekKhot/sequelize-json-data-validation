const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "localhost",
    dialect: "postgres",
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully!");
    var schema_validation = sequelize.define(
      "schema_validation",
      {
        schema_name: {
          type: Sequelize.STRING,
        },
        schema_description: {
          type: Sequelize.STRING,
        },
        schema_data: {
          type: Sequelize.JSONB,
        },
      },
      {
        freezeTableName: true,
      }
    );

    const registration_schema = {
      type: "object",
      properties: {
        email: {
          type: "string",
          format: "email",
        },
        password: {
          type: "string",
          format: "password",
        },
      },
    };

    const data = {
      schema_name: "registration schema name",
      schema_description:
        "this is the registration schema used for data validation",
      schema_data: registration_schema,
    };

    schema_validation.sync({}).then(async () => {
      await schema_validation.create(data);
    });

    schema_validation.sync({}).then(async () => {
      const data = await schema_validation.findAll();
      console.log(JSON.stringify(data));
    });
  })
  .catch((error) => {
    console.log(error);
  });
