const exampleController = require("../../controllers/example.controller");
const functionFile = require("../../controllers/functionfile");

functionFile.mockMe = jest.fn();
functionFile.mockMe.mockReturnValue(42);

describe("ExampleController", () => {
  it("calls mock function 1 time", () => {
    exampleController.thisCallsAnotherModule();
    expect(functionFile.mockMe).toHaveBeenCalled();
  });

  it("call mock function instead of actual function", () => {
    const result = exampleController.thisCallsAnotherModule();
    expect(result).toBe(42);
  });
});
