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
  Purchase: 'للبيع',
  Rent: 'للإيجار',
  Booking: "الحجز"
};

export const ProductState = {
  Sold: 'Sold',
  InSale: 'In-sale',
};

export const ProductType = {
  Unselected: "الكل", // All
  Apartment: "شقة", // Apartment
  House: "فيلا / منزل", // Villa / House
  Farm: "مزرعة", // Farm
  Land: "أرض", // Land
  Chalets: "شليهات", // Chalets
  Studio: "استوديو", // Studio
  Shops: "محلات ومخازن", // Shops and Warehouses
  Office: "مكاتب وعيادات", // Offices and Clinics
  CampsAndCabins: "مخيمات و اكواخ", // Camps and Cabins
  Swimming_Pool: "مسابح", // Swimming Pools
  Playground: "ملاعب", // Playgrounds
  Gym: "صالات رياضة", // Gyms
  TripOrganization: "تنضيم رحلات", // Trip Organization
  MeetingRooms: "قاعات اجتماعات", // Meeting Rooms
};


export const features = {
  featuresHouse: [
    "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", 
    "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف", "حماية نوافذ", "نظام شمسي", 
    "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", "نوافذ زجاجية مزدوجة", "نظام حماية", "فيها مسبح"
  ],
  featureFarm: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "حارس مزرعة", 
    "منطقة شواء", "منطقة لعب أطفال", "غرفة الحارس", "إنترنت واي فاي", 
    "الطاقة الشمسية", "منظر بانورامي", "منعزلة عن السكان", "نظام صوتي", "فيها مسبح"
  ],
  featureLand: [
    "المياه واصلة", "الكهرباء واصلة", "المجاري واصلة", "مسيجة", 
    "تقع داخل مجمع فيلات", "منظر بانورامي", "مطلّة على الشارع"
  ],
  featureApartment: [
    "مصعد", "مفروشة", "بلكونة", "مطبخ راكب", "حماية نوافذ", 
    "شقة طابقية", "نوافذ زجاجية مزدوجة", "ديكور", "خزانة حائط"
  ],
  featureStudio: [
    "مفروش", "مجهز", "فيه حمام", "مطبخ صغير", "موقع مركزي"
  ],
  featureSwimming_Pool: [
    "مياه دافئة", "محيط مغطى", "إضاءة ليلية", "مناطق استراحة", 
    "مرافق شاملة", "منزلقات مائية", "حراسة أمنية", "مساحة واسعة", 
    "خدمات تنظيف دورية", "مظلات شمسية"
  ],
  featureChalet: [
    "مفروشة", "مصعد", "شقة طابقية", "بلكونة", "حديقة", "مطبخ راكب", 
    "صالون", "غرفة غسيل", "غرفة تخزين", "تكيف", "حماية نوافذ", 
    "نظام شمسي", "حارس", "خزانة حائط", "أجهزة كهربائية", "ديكور", 
    "نوافذ زجاجية مزدوجة", "نظام حماية", "فيها مسبح"
  ],
  featureBarn: [
    "خدمة تنظيف", "سياج أمان", "إضاءة ليلية", "غرفة معدات", 
    "مياه جارية", "مساحة كبيرة", "منطقة تحضير"
  ],
  featurePlayground: [
    "مظلات شمسية", "أرضية آمنة", "معدات حديثة", "منطقة جلوس", 
    "إضاءة مسائية", "مساحة واسعة", "مرافق رياضية"
  ],
  featureTripOrganization: [
    "تنظيم رحلات", "دليل سياحي", "جدولة مواعيد", "خدمة نقل", 
    "وجبات طعام", "أنشطة ترفيهية", "حجز مسبق"
  ],
  featureMeetingRooms: [
    "مجهزة بالكامل", "أجهزة عرض", "إنترنت عالي السرعة", "أماكن جلوس مريحة", 
    "إضاءة قابلة للتعديل", "أنظمة صوت", "تكييف مركزي"
  ],
  featureCampsAndCabins: [
    "خيم مفروشة", "أماكن شواء", "إطلالات خلابة", "أماكن للجلوس", 
    "أنشطة ترفيهية", "مرافق مشتركة", "منطقة مخصصة للأطفال"
  ],
  featureGym: [
    "أجهزة حديثة", "مدربين محترفين", "غرف تغيير", "مرافق صحية", 
    "مواعيد مرنة", "مساحات واسعة", "دروس جماعية"
  ],
  featureOffice: [
    "مفروشة بالكامل", "إنترنت عالي السرعة", "غرف اجتماعات", "إضاءة طبيعية", 
    "تكييف مركزي", "قرب وسائل النقل", "تصميم حديث"
  ],
  featureShops: [
    "تصاميم جذابة", "موقع مركزي", "مخازن واسعة", "أماكن انتظار", 
    "أمن وحماية", "خدمات توصيل", "مرافق مشتركة"
  ]
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
