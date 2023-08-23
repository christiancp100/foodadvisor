'use strict';

/**
 * A set of functions called "actions" for `review`
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::review.review', ({ strapi }) => ({
  async create(ctx) {
    const newReview = await strapi.service('api::review.review').create(ctx);
    console.log('newReview', newReview);
    // Send the email to here to the restaurant owner with the review
    if (newReview.restaurant?.owner) {
      await strapi.service('api::email.email').send({
        to: newReview.restaurant.owner.email,
        subject: 'You have a new review!',
        html: `You've received a ${newReview.note} star review: ${newReview.content}`,
      });
    }

    const sanitizedReview = await this.sanitizeOutput(newReview, ctx);

    ctx.body = sanitizedReview;
  },
}));
