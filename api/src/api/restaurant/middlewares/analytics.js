'use strict';

const { createGoogleSheetClient } = require('./utils');

const serviceAccountKeyFile = './gs-keys.json';
const sheetId = '1P7Oeh84c18NlHp1Zy-5kXD8zgpoA1WmvYL62T4GWpfk';
const tabName = 'Restaurants';
const range = 'A2:C';

const VIEWS_CELL = 'C';

const transformGSheetToObject = (response) =>
  response.reduce(
    (acc, restaurant) => ({
      ...acc,
      [restaurant[0]]: {
        id: restaurant[0],
        name: restaurant[1],
        views: restaurant[2],
        cellNum: Object.keys(acc).length + 2,
      },
    }),
    {}
  );

module.exports = (config, { strapi }) => {
  return async (context, next) => {
    console.log('Coming to the middleware');
    // Generating google sheet client
    const { readGoogleSheet, updateoogleSheet, writeGoogleSheet } =
      await createGoogleSheetClient({
        keyFile: serviceAccountKeyFile,
        range,
        sheetId,
        tabName,
      });
    const restaurantId = context.params.id;
    const restaurant = await strapi.entityService.findOne(
      'api::restaurant.restaurant',
      restaurantId
    );

    const restaurantAnalytics = await readGoogleSheet();

    const requestedRestaurant =
      transformGSheetToObject(restaurantAnalytics)[restaurantId];

    if (requestedRestaurant) {
      await updateoogleSheet(
        `${VIEWS_CELL}${requestedRestaurant.cellNum}:${VIEWS_CELL}${requestedRestaurant.cellNum}`,
        [[Number(requestedRestaurant.views) + 1]]
      );
    } else {
      console.log('Creating restaurant in analytics');
      const newRestaurant = [[restaurant.id, restaurant.name, 1]];
      await writeGoogleSheet(newRestaurant);
    }

    next();
  };
};
