import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Scrollbar from 'src/components/scrollbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import TableNoData from '../table-no-data';
import UserTableRow from '../user-table-row';
import UserTableHead from '../user-table-head';
import TableEmptyRows from '../table-empty-rows';
import UserTableToolbar from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', phone: '', password: '' });
  const [appliedFilters, setAppliedFilters] = useState({
    verified: false,
    blocked: false,
    phoneVerified: false,
    newest: false,
    oldest: false,
    placesCount: false,
    sponsoredPlaces: false,
    bookingsCount: false,
  });

  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [filterNumber, setFilterNumber] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Parse the URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const filterParam = urlParams.get('filter');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/admin/users');
        const data = await response.json();
        console.log(data);

        // Filter users if the URL parameter is "trustable"
        let filteredUsers = data;
        if (filterParam === 'trustable') {
          filteredUsers = data.filter((user) => user.trustable === 1);
        }

        setUsers(filteredUsers);
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error);
      }
    };

    fetchUsers();
  }, [filterParam]); // Re-fetch users when the filterParam changes

  const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    setPage(0); // Reset to first page when filters change
  };

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
    filters: appliedFilters,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleRemovekUser = (id)=>{
    const newUsers = users.filter((user) => user.id !== id);
    setUsers(newUsers)
  }
  const handleBlockUser = (id, blockedState) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, blocked: blockedState } : user
      )
    );
  };

  const handelTrustUser = (id, trustableState) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, trustable: trustableState } : user
      )
    );
  };

  const handelLimitUser = (id, limitNumber, desc) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, limitPosts: limitNumber, description: desc } : user
      )
    );
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.phone.startsWith('+962')) {
        alert('يرجى إضافة رمز الدولة الأردنية (+962) إلى رقم الهاتف.');
        return;
      }

      const response = await axios.post('https://backend.sakanijo.com/api/admin/add-user', newUser);

      const message = encodeURIComponent(`
        مرحبًا، نحن في سكني جو.
        لقد تم إنشاء حسابك باستخدام رقم الهاتف: ${newUser.phone}
        وكلمة المرور: ${newUser.password}
        شكرًا لاختيارك سكني جو.
      `);

      const whatsappURL = `https://wa.me/${newUser.phone}?text=${message}`;
      window.open(whatsappURL, '_blank');

      setUsers((prevUsers) => [...prevUsers, response.data]);
      setOpen(false);
      setNewUser({ name: '', phone: '', password: '' });

      alert('تمت إضافة المستخدم بنجاح. يمكنك الآن إرسال الرسالة عبر الواتساب.');
    } catch (error) {
      alert('خطأ في إضافة المستخدم:');
      console.error('خطأ في إضافة المستخدم:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        {t(' المستخدمين')}
      </Typography>

      <Button variant="contained" color="primary" onClick={handleOpen} sx={{ mb: 3 }}>
        {t('إضافة مستخدم جديد')}
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{t('إضافة مستخدم جديد')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('الاسم')}
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label={t('رقم الهاتف')}
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label={t('كلمة المرور')}
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            {t('إلغاء')}
          </Button>
          <Button onClick={handleAddUser} color="primary">
            {t('إضافة')}
          </Button>
        </DialogActions>
      </Dialog>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onApplyFilters={handleApplyFilters}
          selectedUsers={selected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={order}
                orderBy={orderBy}
                rowCount={users.length}
                numSelected={selected.length}
                onRequestSort={handleSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'name', label: t('اسم') },
                  { id: 'phone', label: t('هاتف') },
                  { id: 'status', label: t('حالة') },
                  { id: 'posts', label: t('عدد المنشورات') },
                  { id: 'postsSponsored', label: t('عدد المنشورات المميزة') },
                  { id: 'bookings', label: t('عدد الحجوزات') },
                  { id: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <UserTableRow
                      key={row.id}
                      id={row.id}
                      name={row.name}
                      status={row.phone_verified}
                      phone={row.phone}
                      avatarUrl={row.image_name}
                      picture_url={row.picture_url}
                      postsCount={row.postsCount}
                      bookingCount={row.bookingsCount}
                      favoritesCount={row.favoritesCount}
                      sponsoredCount={row.sponsoredPostsCount}
                      description={row.description}
                      blocked={row.blocked}
                      trustable={row.trustable}
                      limitPosts={row.limitPosts}
                      created={row.created}
                      selected={selected.includes(row.id)}
                      handleClick={(event) => handleClick(event, row.id)}
                      onDelete={handleBlockUser}
                      onRemoveUser={handleRemovekUser}
                      onTrust={handelTrustUser}
                      changeLimitPost={handelLimitUser}
                    />
                  ))}

                <TableEmptyRows
                  height={77}
                  emptyRows={emptyRows(page, rowsPerPage, users.length)}
                />

                {notFound && <TableNoData query={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage={t('عدد الصفوف في الصفحة')}
        />
      </Card>
    </Container>
  );
}