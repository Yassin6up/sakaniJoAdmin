import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { UserView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('users_title_t')} </title>
      </Helmet>

      <UserView />
    </>
  );
}
