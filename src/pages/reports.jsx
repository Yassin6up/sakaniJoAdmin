import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

import { Report } from 'src/sections/reports/view';


export default function ReportPage() {
  const { t } = useTranslation();
  return (
    <>
      <Helmet>
        <title> {t('الشكايات')} </title>
      </Helmet>

      <Report />
    </>
  );
}
