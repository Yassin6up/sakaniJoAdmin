import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Services } from 'src/sections/services/view';

// ----------------------------------------------------------------------

export default function ServicePage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('services')} </title>
      </Helmet>

      <Services />
    </>
  );
}
