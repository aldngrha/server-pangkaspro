// Import mongoose
const mongoose = require("mongoose");

// create image schema
const imageSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
  },
});

// exports imageSchema
module.exports = mongoose.model("Image", imageSchema);
