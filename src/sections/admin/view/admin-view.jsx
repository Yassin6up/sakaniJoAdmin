import axios from "axios"
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';  
import TextField from '@mui/material/TextField';  
import Typography from '@mui/material/Typography';  
import InputLabel from '@mui/material/InputLabel';  
import FormControl from '@mui/material/FormControl';  
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
import UserTableRow from '../admin-table-row';
import UserTableHead from '../admin-table-head';
import TableEmptyRows from '../table-empty-row';
import UserTableToolbar from '../admin-table-toolbar';
import { emptyRows, applyFilter, getComparator } from './utils';

// ----------------------------------------------------------------------

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);  
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    phone: '',
    password:'',
    role: 'admin'
  });
  const [errors, setErrors] = useState({});  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://backend.sakanijo.com/admins');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('خطأ في جلب المستخدمين:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
    console.log(`تم حذف المستخدم ذو المعرف: ${id}`);
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
      const newSelecteds = users.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleAddAdminToggle = () => {
    setIsAddingAdmin(!isAddingAdmin);
    if (isAddingAdmin) {

      setNewAdmin({
        name: '',
        phone: '',
        status: '',
        role: 'admin'
      });
      setErrors({});
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAdmin({
      ...newAdmin,
      [name]: value,
    });
  };

  const handleRoleChange = (event) => {
    setNewAdmin({
      ...newAdmin,
      role: event.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!newAdmin.name) newErrors.name = t('error_name_required');
    if (!newAdmin.phone) newErrors.phone = t('error_phone_required');
    if (newAdmin.phone.length < 10) newErrors.phone = t('error_phone_length');
 
    return newErrors;
  };

  const handleAddAdmin = async() => {

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try{
      const respone= await axios.post(`https://backend.sakanijo.com/admins`,newAdmin)
      console.log(respone);
      if(respone.status === 201){
        setUsers([...users, { id: respone.data.adminId, ...newAdmin }]); 
       alert('تم الاضافه بنجاح')
      }
    }
    catch(error){
      console.log(error);
    }

 
   
    setNewAdmin({
      name: '',
      phone: '',
      status: '',
      role: 'admin'
    });
    setIsAddingAdmin(false);
    setErrors({});
  };

  const dataFiltered = applyFilter({
    inputData: users,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {i18n.language === 'ar' ? t('admins') : 'المسؤولين'}
        <Button
          variant="contained"
          onClick={handleAddAdminToggle}
          sx={{ ml: 2 }}
        >

          {isAddingAdmin ? t('cancel') : 'إضافة مسؤول'}
        </Button>
      </Typography>

      {isAddingAdmin && (
        <Card sx={{ p: 2, mb: 2 }}>
          <TextField

            label="اسم المسؤول"
            name="name"
            value={newAdmin.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            sx={{ m: 2 }}
          />
          <TextField

            label='كلمه المرور'
            name="password"
            value={newAdmin.password}
            onChange={handleInputChange}
           
            sx={{ m: 2 }}
          />
          <TextField

            label="هاتف المسؤول"
            name="phone"
            value={newAdmin.phone}
            onChange={handleInputChange}
            error={!!errors.phone}
            helperText={errors.phone}
            sx={{ m: 2 }}
          />
       
          <FormControl fullWidth sx={{ mb: 2 }}>

            <InputLabel>الدور</InputLabel>
            <Select
              value={newAdmin.role}
              onChange={handleRoleChange}
              name="role"
            >
              <MenuItem value="admin">مدير</MenuItem>
              <MenuItem value="manager">مشرف</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAddAdmin}
          >
            إضافة
          </Button>
        </Card>
      )}

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
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

                { id: 'name', label: 'الاسم' },
                { id: 'phone', label: 'الهاتف' },
                { id: 'status', label: 'الحالة' }
          
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
                    status={row.role}
                    phone={row.phone}
                    avatarUrl={row.avatarUrl}
                    role={row.role}
                    selected={selected.indexOf(row.name) !== -1}
                    handleClick={(event) => handleClick(event, row.name)}
                    onDelete={handleDeleteUser}
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

        labelRowsPerPage="الصفوف لكل صفحة"
      />
    </Card>
  </Container>
);
}