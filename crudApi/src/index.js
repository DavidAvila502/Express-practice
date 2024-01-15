import express from "express";
import { engine } from "express-handlebars";
import morgan from "morgan";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import personasRoute from "./routes/personas.routes.js";

// initialization
const app = express();
const _dirname = dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", process.env.PORT || 3000);
app.set("views", join(_dirname, "views"));
app.engine(
   ".hbs",
   engine({
      defaultLayout: "main",
      layoutsDir: join(app.get("views"), "layouts"),
      partialsDir: join(app.get("views"), "partials"),
      extname: ".hbs",
   })
);

app.set("view engine", ".hbs");

// midlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes
app.get("/", (request, response) => {
   return response.render("index");
});

app.use(personasRoute);

// public files
app.use(express.static(join(_dirname, "public")));

// run server

app.listen(app.get("port"), () => {
   console.log("Server is listening on port: ", app.get("port"));
});
