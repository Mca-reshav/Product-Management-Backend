const Joi = require("joi");
const { productRating, productCategory } = require("../utils/constants.utils");

module.exports = {
  add: Joi.object({
    brand: Joi.string().min(2).max(25).required(),
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(200).required(),
    price: Joi.number().min(1).max(500000).required(),
    category: Joi.string().valid(...Object.keys(productCategory)).required(),
    stock: Joi.number().min(1).max(100000).required(),
    rating: Joi.string().valid(...Object.keys(productRating)).required(),
  }),
  remove: Joi.object({
    productId: Joi.string().min(1).required(),
  }),
  edit: Joi.object({
    productId: Joi.string().min(1).required(),
    brand: Joi.string().min(2).max(25).optional(),
    name: Joi.string().min(3).max(50).optional(),
    description: Joi.string().min(3).max(200).optional(),
    price: Joi.number().min(1).max(500000).optional(),
    category: Joi.string().valid(...Object.keys(productCategory)).optional(),
    stock: Joi.number().min(1).max(100000).optional(),
    rating: Joi.string().valid(...Object.keys(productRating)).optional(),
  }),
  listAll: Joi.object({
    searchText: Joi.string().min(1).max(50).optional(),
    page: Joi.number().min(0).optional(),
    limit: Joi.number().min(1).optional()
  }),
  list: Joi.object({
    productId: Joi.string().min(1).required()
  })
};
