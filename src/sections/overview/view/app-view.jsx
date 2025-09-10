import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';

// Inside your component

// ----------------------------------------------------------------------

export default function AppView() {
  const [card, setCard] = useState({
    totalUsers: 0,
    totalAdvertient: 0,
    addsnotaprovi: 0,
    bookingNumbe: 0,
  });
  const navigate = useNavigate();

  const [chart, setChart] = useState({
    labels: [],
    series: [],
  });

  const [chartData, setChartData] = useState({
    labels: [],
    series: [],
  });

  const [currentVisitsSeries, setCurrentVisitsSeries] = useState([]);
  const [placesChart, setPlacesChart] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://backend.sakanijo.com/admin/counts`);
        const data = await response.json();
        setCard(data);

        const response2 = await fetch(`https://backend.sakanijo.com/places/category-counts`);
        const data2 = await response2.json();

        // تحديث الرسم البياني بناءً على البيانات المستخرجة
        setChart({
          labels: data2.labels || [],
          series: data2.series || [],
        });
        
      

        const formattedData = Object.entries(data2).map(([label, value]) => ({ label, value }));
        setCurrentVisitsSeries(formattedData);


        const response3 = await fetch(`https://backend.sakanijo.com/places/buyOrRent/count`);
        const data3 = await response3.json();

      
      

        const formattedData3 = Object.entries(data3).map(([label, value]) => ({ label, value }));
        setPlacesChart(formattedData3);


        const response4 = await fetch(`https://backend.sakanijo.com/places/visits`);
        const {labels , series} = await response4.json();

        setChartData({ labels, series });



      
      } catch (error) {
        console.error('Error fetching card:', error);
      }
    };
    fetchProduct();
  }, []);

  const { t } = useTranslation();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        {t('مرحبا بك ')} 👋
      </Typography>

      <Grid container spacing={3}

      >
        <Grid xs={12} sm={6} md={3}
                sx={{ cursor: 'pointer' }} // Add pointer cursor
                >
          <AppWidgetSummary
            title={t('اجمالي الاعلانات')}
            total={card.totalAdvertient || "0"}
            color="success"
            onClick={() => navigate('/products')} // Add this line
            icon={<img alt="icon" src="/assets/icons/glass/advertising.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}
          sx={{ cursor: 'pointer' }} // Add pointer cursor
        >
          <AppWidgetSummary
            title={t('اجمالي المستخدمين')}
            total={card.totalUsers || "0"}
            color="info"
            onClick={() => navigate('/user')} // Add this line
            icon={<img alt="icon" src="/assets/icons/glass/group.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}
        sx={{ cursor: 'pointer' }} 
        >
          <AppWidgetSummary
            title={t('تحتاج الي الموافقه ')}
            total={card.addsnotaprovi || "0"}
            color="warning"
            onClick={() => navigate('/products?filter=active')} // Add this line

            icon={<img alt="icon" src="/assets/icons/glass/search.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}
        sx={{ cursor: 'pointer' }} 

        >
          <AppWidgetSummary
            title={t('رقم الحجز')}
            total={card.bookingNumbe || "0"}
            color="error"
            onClick={() => navigate('/bookingsAll')} // Add this line
            icon={<img alt="icon" src="/assets/icons/glass/reservation.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}
        sx={{ cursor: 'pointer' }} // Add pointer cursor

        >
          <AppWidgetSummary
            title={t('مجموع الشكاوي')}
            total={card.totalReports || "0"}
            color="error"
            onClick={() => navigate('/reports')} // Add this line

            icon={<img alt="icon" src="/assets/icons/glass/warning.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t('الاعلانات المميزة')}
            total={card.totalSponsoredPlaces || "0"}
            color="error"
            onClick={() => navigate('/products?filter=premium')} // Add this line

            icon={<img alt="icon" src="/assets/icons/glass/premium.png" />}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <AppWidgetSummary
            title={t('المستخدمون الموتقون')}
            total={card.totalTrustedUsers || "0"}
            onClick={() => navigate('/user?filter=trustable')} // Add this line

            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/verify.png" />}
          />
        </Grid>
       

 

        <Grid xs={12} md={6} lg={4}>
          <AppCurrentVisits
            title={t('نوع الاعلانات')}
            chart={{
              series: placesChart.length > 0 ? placesChart : [
                { label: 'للبيع', value: 0 },
                { label: 'الحجز', value: 0 },
                { label: 'للإيجار', value: 0 },
                
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
          <AppCurrentVisits
            title={t('مجموع الاعلانات')}
            chart={{
              series: currentVisitsSeries.length > 0 ? currentVisitsSeries : [
                { label: 'المزارع', value: 0 },
                { label: 'الأراضي', value: 0 },
                { label: 'الشقق', value: 0 },
                { label: 'المنازل', value: 0 },
                { label: 'المسابح', value: 0 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6} lg={8}>
        <AppWebsiteVisits
      title="انشطه الموقع" // Arabic for "Website Activities"
      subheader="عدد الاعلانات المنشورة حسب الايام"
      chart={{
        labels: chartData.labels.length > 0 ? chartData.labels : [
          '01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003',
        ], // Default fallback if no data
        series: chartData.series.length > 0 ? chartData.series : [
          {
            name: 'اعلانات', // "Ads" in Arabic
            type: 'line',
            fill: 'solid',
            data: [0, 0, 0, 0, 0], // Default fallback data
          },
        ]
      }}
    />
        </Grid>
      </Grid>
    </Container>
  );
}