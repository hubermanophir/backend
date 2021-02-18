const { json } = require("express");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
const fs = require("fs");
const uuid = require("uuid");
const delay = function (req, res, next) {
  setTimeout(next, 1000);
};

app.use(delay);
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
      `./backend/database/${id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).send("error " + err);
        } else {
          res.status(200).send(body);
        }
      }
    );
  }
});

//get file with using the id
app.get("/b/:id", (req, res) => {
  if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
    res.status(400).send(`{
      "message": "Invalid Bin Id provided"
    }`);
  } else {
    fs.readFile(`./backend/database/${req.params.id}.json`, (err, data) => {
      if (err) {
        res.status(500).send("error" + err);
      } else {
        res.status(200).send(data);
      }
    });
  }
});

//updates task by its id
app.put("/b/:id", (req, res) => {
  const { body } = req;
  body.id = req.params.id;
  if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
    res.status(404).send(`{
      "message": "Bin not found"
    }`);
  } else {
    fs.writeFile(
      `./backend/database/${req.params.id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).send("error" + err);
        } else {
          res.status(200).send(body);
        }
      }
    );
  }
});

//deletes an item using the id
app.delete("/b/:id", (req, res) => {
  if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
    res.status(401).send(`{
      "message": "Bin not found or it doesn't belong to your account"
    }`);
  } else {
    fs.unlink(`./backend/database/${req.params.id}.json`, (err) => {
      if (err) {
        res.status(500).send("error" + err);
      } else {
        res.status(200).send("success!");
      }
    });
  }
});

// gets the array of all the objects in the database folder
app.get("/b", (req, res) => {
  const objects = fs.readdirSync("./backend/database");
  const arr = [];
  if (objects.length === 0) {
    res.status(404).send("you have no objects");
  } else {
    try {
      for (const object of objects) {
        const obj = fs.readFileSync(`./backend/database/${object}`);
        arr.push(JSON.parse(obj));
      }
      res.status(200).send(arr);
    } catch (error) {
      res.status(500).send("error" + er);
    }
  }
});

app.listen(PORT);
console.log(`listening on port: ${PORT}`);
