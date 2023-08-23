'use strict';

/**
 * email service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::email.email', ({ strapi }) => ({
  async send({ to, subject, html }) {
    const emailConfig = await strapi.entityService.findOne(
      'api::email.email',
      1
    );

    console.log('Sending email to: ', to);
    try {
      await strapi.plugins['email'].services.email.send({
        to,
        subject,
        html,
        from: emailConfig.from,
      });
    } catch (err) {}
  },
}));
