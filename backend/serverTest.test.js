const request = require("supertest");
const app = require("./app");
const fs = require("fs");
afterAll(() => {
  const files = fs.readdirSync("./backend/database");
  for (const file of files) {
    if (
      file !== "6013b6761de5467ca6bdb0ce.json" &&
      file !== "test.json" &&
      file !== "testUpdate.json"
    ) {
      fs.unlinkSync(`./backend/database/${file}`);
    }
  }
  const data = `{
    "message": "delete",
    "id": "delete"
}`;
  fs.writeFileSync("./backend/database/delete.json", data);
});

describe("GET route", () => {
  const expectedJson = {
    "my-todo": [],
    id: "test",
  };
  it("Should return a json with a given id", async () => {
    const response = await request(app).get("/b/test");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedJson);
  });
  it("Should return error duo to illegal id", async () => {
    const response = await request(app).get("/b/@*@#$");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid Id provided",
    });
  });
  it("Should return error duo to bin that doesnt exist", async () => {
    const response = await request(app).get("/b/no-bin");
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "No bin with matching id",
    });
  });
});

describe("POST route", () => {
  const taskToPost = {
    message: "hello",
  };
  it("Should add a new todo item", async () => {
    const response = await request(app).post("/b").send(taskToPost);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("hello");
  });
  it("Should add a new todo item", async () => {
    const response = await request(app).post("/b").send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Bin cannot be blank",
    });
  });
});

describe("PUT route", () => {
  const files = fs.readdirSync("./backend/database");
  const taskToPut = {
    message: "bye",
  };
  it("Should update the todo item and should not create a new file", async () => {
    const beforeLength = files.length;
    const response = await request(app).put("/b/testUpdate").send(taskToPut);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "bye",
      id: "testUpdate",
    });
    const afterLength = fs.readdirSync("./backend/database").length - 1;
    expect(beforeLength).toBe(afterLength);
  });
  it("Should not input illegal id", async () => {
    const response = await request(app).put("/b/@*@#$").send(taskToPut);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid Id provided",
    });
  });
  it("Should not put into a not found bin id", async () => {
    const response = await request(app).put("/b/not-found").send(taskToPut);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Bin not found",
    });
  });
});

describe("DELETE route", () => {
  it("should not delete illegal id", async () => {
    const response = await request(app).delete("/b/@*@#$");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Invalid Id provided",
    });
  });
  it("should not delete a not found bin", async () => {
    const response = await request(app).delete("/b/not-found");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({
        "message": "Bin not found or it doesn't belong to your account"
      });
  });
  it("should delete item with the corresponding bin id", async () => {
    const response = await request(app).delete("/b/delete.json");
    expect(response.status).toBe(200);
    expect(response.body).toBe("success!");
  });
});
