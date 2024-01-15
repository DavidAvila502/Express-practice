import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const PORT = 3000;

const app = express();
app.use(bodyParser.json());

const readData = () => {
   try {
      const data = fs.readFileSync("./db.json");
      return JSON.parse(data);
   } catch (error) {
      console.log(error);
   }
};

const wirteData = (data) => {
   try {
      fs.writeFileSync("./db.json", JSON.stringify(data));
   } catch (error) {
      console.log(error);
   }
};

app.get("/", (request, response) => {
   response.send("Developer: David Avila 🍃");
});

app.get("/books", (request, response) => {
   const data = readData();
   response.json(data.books);
});

app.get("/books/:id", (request, response) => {
   const data = readData();
   const id = parseInt(request.params.id);
   const book = data.books.find((book) => book.id == id);

   response.json(book);
});

app.post("/books", (request, response) => {
   let data = readData();
   const body = request.body;
   const newBook = {
      id: data.books.length + 1,
      ...body,
   };
   data.books.push(newBook);
   wirteData(data);
   response.json(newBook);
});

app.put("/books/:id", (request, response) => {
   let data = readData();
   const body = request.body;
   const id = parseInt(request.params.id);

   let bookIndex = data.books.findIndex((currentBook) => currentBook.id == id);
   data.books[bookIndex] = {
      ...data.books[bookIndex],
      ...body,
   };

   wirteData(data);
   response.json(data);
});

app.delete("/books/:id", (request, response) => {
   // todo: logica de delete
   const data = readData();
   const id = parseInt(request.params.id);

   const bookIndex = data.books.findIndex(
      (currentBook) => currentBook.id == id
   );

   data.books.splice(bookIndex, 1);

   wirteData(data);
   response.json(data);
});

app.listen(PORT, () => {
   console.log(`Server listening on port: ${[PORT]}`);
});
