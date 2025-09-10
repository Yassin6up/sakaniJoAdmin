import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductAddPopover from '../product-add';
import ProductFilters from '../product-filters';

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [closeFilter, setCloseFilter] = useState(false);
  const { t } = useTranslation();
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false); // State to control visibility of the button

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/api/admin/places');
        const data = await response.json();
        console.log(data.results);

        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        let filteredProducts = data.results;

        if (filterParam === 'active') {
          filteredProducts = data.results.filter(product => product.approved === 0);
        } else if (filterParam === 'premium') {
          filteredProducts = data.results.filter(product => product.sponsored === 1);
        }
        setProducts(filteredProducts);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();

    // Add event listener for scroll detection
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollToTop(true); // Show button when scrolled beyond 200px
      } else {
        setShowScrollToTop(false); // Hide button when scrolled less than 200px
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [closeFilter]);

  const handleClosePopover = () => {
    setOpenAddProduct(false);
  };

  const handleOpenPopover = () => {
    setOpenAddProduct(true);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  const filterData = async (address, selectedGender, selectedCategory, selectedState) => {
    const queryParams = new URLSearchParams({
      address,
      byorRent: selectedGender,
      category: selectedCategory,
      state: selectedState
    });
    const url = `https://backend.sakanijo.com/admin/filter-places?${queryParams.toString()}`;
    console.log(url);
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
    setProducts(data);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Smooth scrolling to the top
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">{t('عنوان المنتجات')}</Typography>
        <div style={{ position: "fixed", top: 100, right: 10, zIndex: 100, gap: 10, display: "flex" }}>
          <Button
            variant="contained"
            onClick={handleOpenPopover}
            color="inherit"
            dir="ltr"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            {t('منتج جديد')}
          </Button>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            filterData={filterData}
            closeFilter={() => { setCloseFilter(!closeFilter) }}
          />
        </div>
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }} />
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

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <Button
          variant="contained"
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            borderRadius: '50%',
            padding: '10px',
            minWidth: '40px',
            minHeight: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Iconify icon="eva:arrow-up-fill" />
        </Button>
      )}
    </Container>
  );
}