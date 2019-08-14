const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const baseUrl = "/todos";

describe("TodoRoutes", () => {
  it("POST " + baseUrl, () => {
    return request(app)
      .post(baseUrl)
      .send(newTodo)
      .then(response => {
        expect(response.statusCode).toBe(201);
        expect(response.body.title).toEqual(newTodo.title);
        expect(response.body.done).toEqual(newTodo.done);
        expect(response.body._id).toBeDefined();
      });
  });
  test("ERROR POST " + baseUrl, () => {
    return request(app)
      .post(baseUrl)
      .send({ title: "wash dishes" })
      .catch(response => {
        expect(response.statusCode(500));
        expect(response.body).ToEqual({
          message: "Todo validation failed: done: Path `done` is required."
        });
      });
  });
});
