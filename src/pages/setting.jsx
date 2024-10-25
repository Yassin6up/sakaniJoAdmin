import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { SettingView } from 'src/sections/setting/view';

// ----------------------------------------------------------------------

export default function SettingPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('setting_title_t')} </title>
      </Helmet>

      <SettingView />
    </>
  );
}
