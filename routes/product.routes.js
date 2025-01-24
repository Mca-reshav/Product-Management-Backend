const express = require("express");
const productsRoutes = express.Router();
const mw = require("../middlewares/main.mw");
const { validate, _404, role, webAuth,upload } = mw.one;
productsRoutes.use(mw.global);

const productController = require("../modules/product/product.controller");
const productValidator = require("../validators/product.validator");
const { roleType } = require("../utils/constants.utils");

const admin = Object.keys(roleType)[0];
const user = Object.keys(roleType)[1];

const routes = [//validate(productValidator.listAll)
  {
    method: "get",
    path: "/listAll",
    middlewares: [webAuth, role(user)],
    handler: productController.listAll,
  },
  {
    method: "get",
    path: "/list/:productId",
    middlewares: [webAuth, role(user), validate(productValidator.list)],
    handler: productController.list,
  },
  {//upload.single('image'),
    method: "post",
    path: "/add",
    middlewares: [webAuth, role(admin), validate(productValidator.add)],
    handler: productController.add,
  },
  {
    method: "put",
    path: "/edit/:productId",
    middlewares: [webAuth, role(admin), validate(productValidator.edit)],
    handler: productController.edit,
  },
  {
    method: "delete",
    path: "/remove/:productId",
    middlewares: [webAuth, role(admin), validate(productValidator.remove)],
    handler: productController.remove,
  },
];

routes.forEach(({ method, path, middlewares, handler }) => {
  productsRoutes[method](path, ...middlewares, handler);
});

productsRoutes.use("**", _404);
module.exports = productsRoutes;
