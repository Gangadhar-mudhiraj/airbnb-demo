const mongoose = require("mongoose");
const Data = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));

const intDb = async () => {
  await Listing.deleteMany({});
  Data.data = Data.data.map((obj) => ({
    ...obj,
    owner: "6532326a8eb0bcc5bb7c2534",
  }));
  await Listing.insertMany(Data.data);
  console.log("data inserted");
};
intDb();
