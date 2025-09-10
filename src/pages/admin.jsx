import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { AdminView } from 'src/sections/admin/view';

// ----------------------------------------------------------------------

export default function AdminPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('users_title_t')} </title>
      </Helmet>

      <AdminView />
    </>
  );
}
