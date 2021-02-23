const request = require("supertest");
const app = require("./app");

describe("GET route", () => {
  const expectedJson = {
    "my-todo": [],
    "id": "test",
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
    "message": "hello",
  };
  const illegalTask = {};
  it("Should add a new todo item", async () => {
    const response = await request(app).post("/b").send(taskToPost);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("hello");
  });
  it("Should add a new todo item", async () => {
    const response = await request(app).post("/b").send(illegalTask);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Bin cannot be blank",
    });
  });
});
