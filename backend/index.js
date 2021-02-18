const { json } = require("express");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
const fs = require("fs");
const uuid = require("uuid");

//create file with the corresponding id as name
app.post("/b", (req, res) => {
  const { body } = req;
  const id = uuid.v4();
  if (Object.keys(body).length === 0) {
    res.status(400).send(`{
      "message": "Bin cannot be blank"
    }`);
  } else {
    body.id = id;
    fs.writeFile(
      `./src/backend/database/${id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).send("error " + err);
        } else {
          res.send(body);
        }
      }
    );
  }
});

//get file with using the id
app.get("/b/:id", (req, res) => {
  if (!fs.existsSync(`./src/backend/database/${req.params.id}.json`)) {
    res.status(400).send(`{
      "message": "Invalid Bin Id provided"
    }`);
  } else {
    fs.readFile(`./src/backend/database/${req.params.id}.json`, (err, data) => {
      if (err) {
        res.status(500).send("error" + err);
      } else {
        res.send(data);
      }
    });
  }
});

//updates task by its id
app.put("/b/:id", (req, res) => {
  const { body } = req;
  body.id = req.params.id;
  if (!fs.existsSync(`./src/backend/database/${req.params.id}.json`)) {
    res.status(404).send(`{
      "message": "Bin not found"
    }`);
  } else {
    fs.writeFile(
      `./src/backend/database/${req.params.id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).send("error" + err);
        } else {
          res.send(body);
        }
      }
    );
  }
});

//deletes an item using the id
app.delete("/b/:id", (req, res) => {
  if (!fs.existsSync(`./src/backend/database/${req.params.id}.json`)) {
    res.status(401).send(`{
      "message": "Bin not found or it doesn't belong to your account"
    }`);
  } else {
    fs.unlink(`./src/backend/database/${req.params.id}.json`, (err) => {
      if (err) {
        res.status(500).send("error" + err);
      } else {
        res.send("success!");
      }
    });
  }
});

// gets the array of all the objects in the database folder
app.get("/b", (req, res) => {
  const objects = fs.readdirSync("./src/backend/database");
  const arr = [];
  if (objects.length === 0) {
    res.send("you have no objects");
  } else {
    try {
      for (const object of objects) {
        const obj = fs.readFileSync(`./src/backend/database/${object}`);
        arr.push(JSON.parse(obj));
      }
      res.send(arr);
    } catch (error) {
      res.send("error" + er);
    }
  }
});

app.listen(PORT);
console.log(`listening on port: ${PORT}`);
