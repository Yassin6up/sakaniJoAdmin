import { sample } from 'lodash';
import { faker } from '@faker-js/faker';

// ----------------------------------------------------------------------

const PRODUCT_NAME = [
  'Really Big House',
  'Modern House',
];
const PRODUCT_COLOR = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

// ----------------------------------------------------------------------

export const ProductPurchaseType = {
  Purchase: 'Pruchase',
  Rent: 'Rent',
  Booking: "Booking"
};

export const ProductState = {
  Sold: 'Sold',
  InSale: 'In-sale',
};

export const ProductType = {
  Unselected: "Unselected",
  House: 'House',
  Farm: 'Farm',
  Land: 'Land',
  Apartment: 'Apartment',
  Chalets: 'Chalets',
  Studio: "Studio",
  Swimming_Pool: "Swimming Pool",
  Playground: "Playground",
  Barn: "Barn"
};

/**
  * @typedef  {Object} Product
  * @property {number} id
  * @property {String[]} cover
  * @property {String} name
  * @property {number} price
  * @property {ProductState} status
  * @property {String} description
  * @property {ProductPurchaseType} purchaseType
  * @property {ProductType} productType
  * @property {String} address
  * @property {Boolean} approved
  */

function generateRanged(min, max) {
  return Math.random() * (max - min) + min;
}

/** @type {Product[]} */
export const products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;
  const [one, two] = [Math.floor(generateRanged(1, 3)), Math.floor(generateRanged(1, 3))];
  return {
    id: index, // faker.string.uuid(),
    cover: [
      { original: `/assets/images/products/product_${one}.jpg` },
      { original: `/assets/images/products/product_${two}.jpg` },
    ], // `/assets/images/products/product_${setIndex}.jpg`,
    name: sample(PRODUCT_NAME),
    price: faker.number.int({ min: 4, max: 99, precision: 0.01 }),
    productType: sample(Object.values(ProductType)),
    colors:
      (setIndex === 1 && PRODUCT_COLOR.slice(0, 2)) ||
      (setIndex === 2 && PRODUCT_COLOR.slice(1, 3)) ||
      (setIndex === 3 && PRODUCT_COLOR.slice(2, 4)) ||
      (setIndex === 4 && PRODUCT_COLOR.slice(3, 6)) ||
      (setIndex === 23 && PRODUCT_COLOR.slice(4, 6)) ||
      (setIndex === 24 && PRODUCT_COLOR.slice(5, 6)) ||
      PRODUCT_COLOR,
    status: sample(Object.values(ProductState)),
    purchaseType: sample(Object.values(ProductPurchaseType)),
    description: faker.lorem.paragraph(20),
    address: faker.location.streetAddress(),
    approved: sample([true, false]),
  };
});
