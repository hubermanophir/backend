const request = require("supertest");
const app = require("./app");

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
    const response = await request(app).get("/b/*illegal*");
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
        "message": "No bin with matching id"
    });
  });
});
