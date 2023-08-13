const mongoose = require("mongoose");

mongoose.set("strict", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to ", url);

mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect: ", error);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: (number) => {
        return /\d{2,3}-\d+/.test(number);
      },
      message: (props) => `${props.value} is an invalid phone number`,
    },
    required: true,
  },
});

personSchema.set("toJSON", {
  // Convert MongoDB ID to a string and delete id and _v fields
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
