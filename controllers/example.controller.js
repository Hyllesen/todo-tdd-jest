const mockFunction = require("./functionfile");

function thisCallsAnotherModule() {
  console.log("Let's see if you can mock this!");
  const result = mockFunction.mockMe();
  return result;
}

module.exports = {
  thisCallsAnotherModule
};
