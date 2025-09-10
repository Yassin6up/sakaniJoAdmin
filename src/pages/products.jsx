import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { ProductsView } from 'src/sections/products/view';

// ----------------------------------------------------------------------

export default function ProductsPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('products_title_t')} </title>
      </Helmet>

      <ProductsView />
    </>
  );
}
