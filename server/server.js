const app = require("express")();
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("/api");
});
app.get("/api", (req, res) => {
  res.send(
    `/${process.env.API_TYPE.toLowerCase()}/${process.env.API_VERSION.toLowerCase()}/`
  );
});

if (process.env.API_TYPE === "REST") {
  var apiRouter = require(`./api/rest/${process.env.API_VERSION.toLowerCase()}/routers`);
  app.use(`/api/rest/${process.env.API_VERSION.toLowerCase()}`, apiRouter);
} else {
  const { graphqlHTTP } = require("express-graphql");
  const schema = require(`./api/graphql/${process.env.API_VERSION.toLowerCase()}/Schema`);

  app.use(
    `/api/graphql/${process.env.API_VERSION.toLowerCase()}`,
    graphqlHTTP({
      schema: schema,
      graphiql: process.env.NODE_ENV === "development",
    })
  );
}

app.listen(process.env.SERVER_PORT, () => {
  console.log(`🚀  Server is running on port ${process.env.SERVER_PORT}`);
});
