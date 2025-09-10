import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { AppView } from 'src/sections/overview/view';

// ----------------------------------------------------------------------

export default function AppPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('dashboard_title')} </title>
      </Helmet>

      <AppView />
    </>
  );
}
