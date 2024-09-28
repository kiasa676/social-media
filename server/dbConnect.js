const mongoose = require("mongoose");

module.exports = async () => {
  const mongoUri =
    "mongodb+srv://ritiksingh7762:oPCKt7nWHgHWOHg5@cluster0.p7dt24l.mongodb.net/?retryWrites=true&w=majority";
  try {
    const connect = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB connected ${connect.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
