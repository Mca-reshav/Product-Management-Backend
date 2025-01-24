const express = require('express');
const usersRoutes = express.Router();

const mw = require('../middlewares/main.mw');
const { validate, _404, webAuth, role } = mw.one;

usersRoutes.use(mw.global);

const userController = require('../modules/user/user.controller');
const userValidator = require('../validators/user.validator');
const { roleType } = require('../utils/constants.utils');
const admin = Object.keys(roleType)[0];
const routes = [
  {
    method: 'post',
    path: '/login',
    middlewares: [validate(userValidator.login)],
    handler: userController.login,
  },
  {
    method: 'post',
    path: '/register',
    middlewares: [validate(userValidator.register)],
    handler: userController.register,
  },
  {
    method: 'get',
    path: '/profile',
    middlewares: [webAuth],
    handler: userController.profile,
  },
  {
    method: 'get',
    path: '/list',
    middlewares: [webAuth, role(admin)],
    handler: userController.list,
  },
  {
    method: 'put',
    path: '/toggleRole',
    middlewares: [
      webAuth,
      role(admin),
      validate(userValidator.toggleRole),
    ],
    handler: userController.toggleRole,
  },
];

routes.forEach((route) => {
  const { method, path, middlewares, handler } = route;
  usersRoutes[method](path, ...middlewares, handler);
});

usersRoutes.use('**', _404);

module.exports = usersRoutes;
