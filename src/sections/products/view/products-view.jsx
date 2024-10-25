
import { useEffect, useState} from 'react';
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductAddPopover from '../product-add';
import ProductFilters from '../product-filters';


export default  function ProductsView() {
  const [products, setproducts] = useState([]);
  const [closeFIlter , setCloseFIlter] = useState(false)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/api/admin/places');
        const data = await response.json();
        console.log(data.results)
        setproducts(data.results); 

      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [closeFIlter]);
  const { t } = useTranslation();
  const [openAddProduct, setOpenAddProduct] = useState(false);

  const handleClosePopover = () => {
    setOpenAddProduct(false);
  };
  // const handleOpenPopover = () => {
  //   setOpenAddProduct(true);
  // };

  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const filterData = async (address , selectedGender  ,selectedCategory , 
    selecteState
  ) => {
    // Construct the URL with query parameters
    const queryParams = new URLSearchParams({
      address,
      byorRent: selectedGender, // Join selected genders into a comma-separated string
      category: selectedCategory,
      state : selecteState
    });
  
    
    const url = `https://backend.sakanijo.com/admin/filter-places?${queryParams.toString()}`;
  
    console.log(url); // This will log the full URL before sending the request
  
    const response = await fetch(url, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      console.error('Error fetching data:', response.statusText);
      return;
    }
  
    const data = await response.json();
    console.log("Filtered data:", data);
    setproducts(data)
  };
  

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>

        <Typography variant="h4">{t('عنوان المنتجات')}</Typography>

    {/*  <Button
          variant="contained"
          onClick={handleOpenPopover}
          color="inherit"
          dir="ltr"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          {t('منتج جديد')}
        </Button>
   */}
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            filterData={filterData}
            closeFilter={()=>{setCloseFIlter(!closeFIlter)}}
          />

          {/* <ProductSort /> */}
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products?.map((product) => (
          <Grid key={product?.id} xs={12} sm={6} md={3}>
            <ProductCard product={product} />

          </Grid>
        ))}
      </Grid>
      <div style={{ width: '100vw', height: '100vh' }}>
        <ProductAddPopover open={openAddProduct} onClose={handleClosePopover} />
      </div>
    </Container>
  );
}
