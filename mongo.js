const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Please include your Mongo Atlas Password");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://vincentmarklynn:${password}@cluster0.iezelpx.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const phoneBookSchema = new mongoose.Schema({
  name: String,
  phoneNumber: String,
});

const Phonebook = mongoose.model("Phonebook", phoneBookSchema);
mongoose.set("strictQuery", false);
mongoose.connect(url);

if (process.argv.length == 5) {
  const contactName = process.argv[3];
  const phoneNumber = process.argv[4];

  const person = new Phonebook({
    name: contactName,
    phoneNumber: phoneNumber,
  });

  person.save().then((result) => {
    console.log(`Added ${contactName} Number ${phoneNumber} to the phonebook`);
    mongoose.connection.close();
  });
} else if (process.argv.length == 3) {
  console.log("Phonebook: ");
  Phonebook.find({}).then((persons) => {
    persons.forEach((person) => {
      console.log(person.name, person.phoneNumber);
    });
    mongoose.connection.close();
  });
}
