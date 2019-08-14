const request = require("supertest");
const app = require("../../app");
const newTodo = require("../mock-data/new-todo.json");

const baseUrl = "/todos/";

let todoId;

describe("TodoRoutes", () => {
  test("POST " + baseUrl, () => {
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
  test("GET " + baseUrl, () => {
    return request(app)
      .get(baseUrl)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBe({});
        expect(response.body[0]._id).toBeDefined();
        todoId = response.body[0]._id;
      });
  });
  test("GET " + baseUrl + ":todoId", () => {
    return request(app)
      .get(baseUrl + todoId)
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.body).not.toBe({});
        expect(response.body._id).toBeDefined();
      });
  });
  test("GET " + baseUrl + ":todoId that doesn't exists", () => {
    return request(app)
      .get(baseUrl + "not-existing-id")
      .then(response => {
        expect(response.statusCode).toBe(404);
      });
  });
});
