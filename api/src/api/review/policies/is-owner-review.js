const { errors } = require('@strapi/utils');
const { PolicyError } = errors;

module.exports = async (policyContext, config, { strapi }) => {
  const { body } = policyContext.request;
  const { user } = policyContext.state;

  console.log('body', body);

  if (!user) {
    return false;
  }
  const filteredRestaurants = await strapi.entityService.findMany(
    'api::restaurant.restaurant',
    {
      filters: {
        slug: body.restaurant,
      },
      populate: ['owner'],
    }
  );

  const restaurant = filteredRestaurants[0];

  if (!restaurant) {
    return false;
  }

  console.log('restaurant.owner', restaurant);

  // If the user submitting the request is the owner of the restaurant we don't allow the review creation
  if (user.id !== restaurant.owner.id) {
    throw new PolicyError('The owner of the restaurant cannot submit reviews', {
      policy: 'is-owner-review',
      errCode: 'RESTAURANT_OWNER_REVIEW',
    });
  }

  return true;
};
