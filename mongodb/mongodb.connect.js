const mongoose = require("mongoose");

async function connect() {
  mongoose.connect(
    "mongodb://testuser:ATestUser1@ds261377.mlab.com:61377/todo-tdd",
    { useNewUrlParser: true },
    err => {
      if (err) {
        console.error("Error connecting to mongodb: " + err);
      }
      console.log("Now connected to mongodb");
    }
  );
}

module.exports = { connect };
