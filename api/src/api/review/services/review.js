'use strict';

/**
 * review service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::review.review', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;

    console.log('user', ctx.state.auth);
    const { body } = ctx.request;

    const restaurants = await strapi.entityService.findMany(
      'api::restaurant.restaurant',
      {
        filters: {
          slug: body.restaurant,
        },
      }
    );

    const newReview = await strapi.entityService.create('api::review.review', {
      data: {
        note: body.note,
        content: body.content,
        restaurant: restaurants[0].id,
        author: user.id,
      },
      populate: ['restaurant.owner.email'],
    });

    return newReview;
  },
}));
