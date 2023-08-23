'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::restaurant.restaurant', {
  config: {
    findOne: {
      auth: false,
      policies: [],
      middlewares: ['api::restaurant.analytics'],
    },
  },
});
