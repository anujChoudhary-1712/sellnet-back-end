const { connect } = require("mongoose");

const dbConnect = () => {
  connect(process.env.MONGO_URL).then(
    () => console.log("Database Connected Successfully"),
    (error) => console.log(error)
  );
};

module.exports = dbConnect