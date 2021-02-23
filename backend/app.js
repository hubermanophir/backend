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
    return res.status(400).json({
      "message": "Bin cannot be blank"
    });
  } else {
    body.id = id;
    fs.writeFile(
      `./backend/database/${id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          return res.status(500).send("error " + err);
        } else {
          return res.status(200).json(body);
        }
      }
    );
  }
});

//get file with using the id
app.get("/b/:id", (req, res) => {
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).json({
      "message": "Invalid Id provided"
    });
  } else {
    if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
      return res.status(404).json({
        "message": "No bin with matching id"
      });
    } else {
      fs.readFile(`./backend/database/${req.params.id}.json`, (err, data) => {
        if (err) {
          return res.status(500).send("error" + err);
        } else {
          return res.status(200).json(JSON.parse(data));
        }
      });
    }
  }
});

//updates task by its id
app.put("/b/:id", (req, res) => {
  const { body } = req;
  body.id = req.params.id;
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).json({
      "message": "Invalid Id provided"
    });
  } else {
    if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
      return res.status(404).json({
        "message": "Bin not found"
      });
    } else {
      fs.writeFile(
        `./backend/database/${req.params.id}.json`,
        JSON.stringify(body, null, 4),
        (err) => {
          if (err) {
            return res.status(500).send("error" + err);
          } else {
            return res.status(200).send(body);
          }
        }
      );
    }
  }
});

//deletes an item using the id
app.delete("/b/:id", (req, res) => {
  if (!req.params.id.match(/[a-zA-Z0-9]/)) {
    return res.status(400).json({
      "message": "Invalid Id provided"
    });
  } else {
    if (!fs.existsSync(`./backend/database/${req.params.id}.json`)) {
      return res.status(401).json({
        "message": "Bin not found or it doesn't belong to your account"
      });
    } else {
      fs.unlink(`./backend/database/${req.params.id}.json`, (err) => {
        if (err) {
          return res.status(500).send("error" + err);
        } else {
          return res.status(200).send("success!");
        }
      });
    }
  }
});

// gets the array of all the objects in the database folder
app.get("/b", (req, res) => {
  const objects = fs.readdirSync("./backend/database");
  const arr = [];
  if (objects.length === 0) {
    return res.status(404).send("you have no objects");
  } else {
    try {
      for (const object of objects) {
        const obj = fs.readFileSync(`./backend/database/${object}`);
        return arr.push(JSON.parse(obj));
      }
      res.status(200).send(arr);
    } catch (error) {
      return res.status(500).send("error" + error);
    }
  }
});



app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);

});

module.exports = app;