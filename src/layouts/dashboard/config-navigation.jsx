import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {

    title: 'لوحه التحكم',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {

    title: 'المستخدمون',
    path: '/user',
    icon: icon('ic_user'),
  },
  {

    title: 'الاعلانات',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {

    title: 'الحجوزات',
    path: '/bookingsAll',
    icon: icon('ic_cart'),
  },
  {
    
    title: 'الخدمات',
    path: '/services',
    icon: icon('ic_blog'),
  },
  {
    title: 'مسؤل',
    path: '/admin',
    icon: icon('ic_user'),
  },
  {  
    title: 'الشكاوي',
    path: '/reports',
    icon: icon('ic_lock'),
  },
  {

    title: 'الاعدادات',
    path: '/setting',
    icon: icon('ic_disabled'),
  },
 
 
  
];

export default navConfig;
