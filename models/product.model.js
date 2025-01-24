const { mongoose } = require("../database/mongo.conn");
const { getCurrentTimeStamp } = require("../services/common.service");
const { productCategory, productRating } = require("../utils/constants.utils");

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
  },
  brand: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    required: true,
    enum: Object.keys(productCategory),
    default: Object.keys(productCategory)[1],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: String,
    required: true,
    enum: Object.keys(productRating),
    default: Object.keys(productRating)[1],
  },
  filename: {
    type: String, 
    required: false,
  },
  contentType: {
    type: String, 
    required: false,
  },
  imageBase64: {
    type: Buffer,
    required: false,
  },
  createdBy: {
    type: String,
    required: false,
    allowNull: false,
  },
  updatedBy: {
    type: String,
    required: false,
    allowNull: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: getCurrentTimeStamp(),
  },
  updatedAt: {
    type: String,
    default: getCurrentTimeStamp(),
  },
});

productSchema.pre("save", function (next) {
  this.updatedAt = getCurrentTimeStamp();
  next();
});

exports.ProductECOM = mongoose.model("ProductECOM", productSchema);
