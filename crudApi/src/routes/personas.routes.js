import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get("/add", (request, response) => {
   response.render("personas/add");
});

router.post("/add", async (request, response) => {
   try {
      const { name, lastname, age } = request.body;

      const newPersona = {
         name,
         lastname,
         age,
      };

      await pool.query("INSERT INTO personas SET ? ", [newPersona]);
      response.redirect("/list");
   } catch (err) {
      response.status(500).json({ message: err.message });
   }
});

router.get("/list", async (request, response) => {
   try {
      const [result] = await pool.query("SELECT * FROM personas");

      response.render("personas/list", { personas: result });
   } catch (err) {
      response.status(500).json({
         message: err.message,
      });
   }
});

router.get("/edit/:id", async (request, response) => {
   try {
      const { id } = request.params;

      const [persona] = await pool.query(
         "SELECT * FROM personas WHERE id = ?",
         [id]
      );

      const personaEdit = persona[0];

      response.render("personas/edit", { persona: personaEdit });
   } catch (err) {
      response.status(500).json({
         message: err.message,
      });
   }
});

router.post("/edit/:id", async (request, response) => {
   try {
      const { name, lastname, age } = request.body;

      const { id } = request.params;

      const editPersona = { name, lastname, age };

      await pool.query("UPDATE personas SET ? WHERE id =?", [editPersona, id]);

      response.redirect("/list");
   } catch (err) {
      response.status(500).json({
         message: err.message,
      });
   }
});

router.get("/delete/:id", async (request, response) => {
   try {
      const { id } = request.params;
      await pool.query("DELETE FROM personas WHERE id = ?", [id]);

      response.redirect("/list");
   } catch (err) {
      response.status(500).json({
         message: err.message,
      });
   }
});

export default router;
