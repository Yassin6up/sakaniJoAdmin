import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import React, { useState, useEffect } from 'react';

import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, TablePagination, CircularProgress, Backdrop , Modal , Box,
  Checkbox, FormControlLabel, List, ListItem, ListItemText  ,
  Typography, TextField, IconButton,RadioGroup , Radio 

} from '@mui/material';  // React Icon for upload
import { FaPlus, FaUpload  ,FaTrashAlt , FaEdit} from 'react-icons/fa'; // Importing icons from react-icons
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};


function Services() {
  const [page, setPage] = useState(0);  // For pagination
  const [rowsPerPage, setRowsPerPage] = useState(5);  // Show 5 slides per page
  const [loading, setLoading] = useState(false);  // Loading state for upload
  const [slides, setSlides] = useState([]);
  const [serviceId, setServiceId] = useState(null);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [fileSlide, setFile] = useState(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredList, setRequiredList] = useState([]);
  const [newRequiredItem, setNewRequiredItem] = useState('');
  const [isCarService, setIsCarService] = useState(false);
  const [icon, setIcon] = useState(null);
  const [selectedService, setSelectedService] = useState('');
  const [selectedServiceEdite, setSelectedServiceEdite] = useState(null);

  const [wtsLink, setWtsLink] = useState('');
  const [phone, setPhone] = useState('');
  const handleAddRequiredItem = () => {
    setRequiredList([...requiredList, newRequiredItem]);
    setNewRequiredItem('');
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setIcon(file);  // This displays the icon preview
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  

  // Fetch all slides when component mounts
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://backend.sakanijo.com/api/slides');  // Fetch slides from the backend
        setSlides(response.data);
        
      } catch (error) {
        console.log('Error fetching slides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);  // Empty dependency array to run only once on component mount

  // Upload slide to backend
  const handleUpload =  (event) => {
    const file = event.target.files[0]; // Get the first file only
    setFile(file)
  };

  const handelSaveSlider = async()=>{
    if (fileSlide) {
      handleClose2()

      const formData = new FormData();
      formData.append('slide', fileSlide); // Append the single file to FormData
      formData.append("serviceId" , selectedService )
      
      setLoading(true); // Show loading indicator

      try {
        const response = await axios.post('https://backend.sakanijo.com/api/slides', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Assuming the response contains the uploaded slide info
        const newSlide = response.data.slide; // Adjust based on your API response
        console.log(newSlide)
        setSlides((prevSlides) => [...prevSlides, newSlide]);
      } catch (error) {
        console.log('Error uploading slide:', error);
      } finally {
        setLoading(false); // Hide loading indicator
      }
    }
  }
  

  // Delete slide from backend
  const handleDelete = async (file) => {
    try {
      console.log(file)
      await axios.delete(`https://backend.sakanijo.com/api/slides/${file}`);
      // Remove slide from state after successful deletion
      setSlides((prevSlides) => prevSlides.filter((slide) => slide.file_path !== file));
    } catch (error) {
      console.error('Error deleting slide:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const handleSaveService = async () => {
    // Prepare the form data to send to the backend
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('required_list', JSON.stringify(requiredList)); // Send the required list as a JSON string
    formData.append('is_car_service', isCarService ? 1 : 0);
    formData.append('LinkWts', wtsLink);
    formData.append('phone', phone);
    console.log("icons :",icon)
    if (icon) {
      formData.append('icon', icon); // Append the file for the icon
    }
    try {
      // Make an Axios POST request to the backend
      const response = await axios.post('https://backend.sakanijo.com/api/services', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Send as multipart/form-data for file upload
        },
      });

      console.log('Service saved successfully:', response.data);
      setServices([...services , response.data.service ]);

      setPhone("")
      setDescription("")
      setTitle("")
      setWtsLink("")
      setIsCarService(false)
      setRequiredList([])
      setIcon(null)

      alert("تم اضافة الخدمة بنجاح")
      // Optionally close the modal or reset the form fields after success
      handleClose();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);



  const [services, setServices] = useState([]);

  // Fetch services from the backend on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://backend.sakanijo.com/api/services');
        setServices(response.data.services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Handle delete service
  const handleDeleteService = async (id) => {
    try {
      await axios.delete(`https://backend.sakanijo.com/api/services/${id}`);
      setServices((prevServices) => prevServices.filter(service => service.service_id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };


  const handleServiceChange = (event) => {
    const selectedValue = event.target.value;  // Get the selected value (service id)
    
    // Debugging output
    console.log('Event target:', event.target);
    console.log('Selected service id:', selectedValue);
    
    setSelectedService(selectedValue);  // Update the state with the selected service id
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };





  
  
  return (
    <div style={{ padding: '20px' }}>
      <h2>خدمات التطبيق</h2>

      {/* Upload Button */}
      <Button
        variant="contained"
        component="label"
        startIcon={<FiUpload />}
        style={{ marginBottom: '20px' }}
        disabled={loading}
        onClick={handleOpen2}  
      >
       <input
        type="file"
        hidden
        accept="image/*"
        multiple
        onChange={handleUpload}
      />
        ارفع سلايدر
      </Button>

      {/* Hidden input for file upload */}
     

      {/* Modal */}
      <Modal open={open2} onClose={handleClose2}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Select a Service for the Slider
          </Typography>

          {/* Radio Buttons for Service Selection */}
          <RadioGroup value={selectedService} onChange={handleServiceChange}>
            {services.map((service) => <FormControlLabel
                  key={service.service_id}  // Use service.id as key
                  value={service.service_id}  // Set the value to the service id
                  control={<Radio />}  // The actual radio button
                  label={service.title}  // Display the service's title
                />
              
            )}
          </RadioGroup>



          {/* Save Button */}
          <Button variant="contained" onClick={handelSaveSlider} style={{ marginTop: '20px' }}>
            Save
          </Button>
        </Box>
      </Modal>

      {/* Loading Indicator */}
      <Backdrop
        open={loading}
        style={{ zIndex: 1000, color: '#fff' }}  // Full screen loading indicator
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/* Display the Table */}
      {slides.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>اسم الصورة</TableCell>
                <TableCell>عرض</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Pagination logic: display only slides for the current page */}
              {slides
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{slide.name?.slice(0 , 50)}</TableCell>
                    <TableCell>
                      <img
                        src={`https://backend.sakanijo.com/api/slides/single/${  slide.file_path}`}  // Assuming backend returns file path or URL
                        alt={slide.name}
                        style={{ width: '100px', height: 'auto' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        color="error"
                        onClick={() => handleDelete(slide.file_path)}
                        startIcon={<FaTrashAlt />}
                      >
                        حدف
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          {/* Pagination controls */}
          <TablePagination
            component="div"
            count={slides.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}  
          />
        </TableContainer>
      )}

   
      {/* Button to open the modal */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleOpen}
        startIcon={<FaPlus />}
        sx={{ borderRadius: '20px', padding: '10px 20px', backgroundColor: '#1976d2' , marginTop : 10 }}
      >
        اضافة خدمة
      </Button>

      {/* Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-service-modal-title"
        aria-describedby="add-service-modal-description"
      >
        <Box
           sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            maxHeight: '80vh',       // Setting max height for the modal
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',       // Enable scrolling inside the modal
          }}
        >
          <Typography id="add-service-modal-title" variant="h6" component="h2" mb={2}>
            اضافة خدمة
          </Typography>

          {/* Service Title */}
          <TextField
            label="عنوان الخدمة"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Upload Icon */}
          <Button
            variant="outlined"
            component="label"
            startIcon={<FaUpload />}
            fullWidth
            sx={{ margin: '10px 0' }}
          >
            ارفع ايقونة
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleIconUpload}
            />
          </Button>
          {icon && <img src={URL.createObjectURL(icon)} alt="Service Icon" style={{ width: '50px', height: '50px', marginTop: '10px' }} />}

          <p>  ننصحك باخد الايقونة من موقع <a href="https://www.flaticon.com/" rel="noreferrer" target='_blank'>Flat icons</a>    </p>
          {/* Description */}
          <TextField
            label="الوصف"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Required List */}
          <Typography variant="subtitle1" component="h3" mb={1}>
            مستلزمات الخدمة
          </Typography>
          <TextField
            label="اضافة عنصر مهم"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newRequiredItem}
            onChange={(e) => setNewRequiredItem(e.target.value)}
          />
          <Button variant="contained" color="secondary" fullWidth onClick={handleAddRequiredItem} sx={{ mb: 2 }}>
            اضافة عنصر
          </Button>
          <List>
            {requiredList.map((item, index) => (
              <ListItem key={index}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          <TextField
            label="رقم واتساب"
            variant="outlined"
            
            rows={3}
            fullWidth
            margin="normal"
            value={wtsLink}
            onChange={(e) => setWtsLink(e.target.value)}
          />
          
          <TextField
            label="رقم هاتف"
            variant="outlined"
            
            rows={3}
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          {/* Car Service Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isCarService}
                onChange={(e) => setIsCarService(e.target.checked)}
              />
            }
            label="اضغط هنا ادا كانت هاده الخدمة حجز سيارة"
          />
          

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button variant="outlined" onClick={handleClose}>
              اغلاق
            </Button>
            <Button variant="contained" color="primary" onClick={handleSaveService}>
              اضافة 
            </Button>
          </Box>
        </Box>
      </Modal>


      <div className="services-container">
      {services.map(service => (
        <div className="service-card" key={service.id}>
          <img
            src={`https://backend.sakanijo.com/api/icons/single/${service.icon}`}
            alt={service.title}
            className="service-icon"
          />
          <div className="service-info">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p><strong>بتاريخ :</strong> {new Date(service.created_at).toLocaleDateString()}</p>
          </div>
          <button
            type="button"
            className="delete-button"
            onClick={() => handleDeleteService(service.service_id)}
          >
            <FaTrashAlt /> حدف
          </button>
          <button
            type="button"
            className="update-button"
            onClick={() => {
              setSelectedServiceEdite(service)
              setPhone(service.phone)
              setDescription(service.description)
              setTitle(service.title)
              setWtsLink(service.wtsLink)
              setIsCarService(service.is_car_service)
              setServiceId(service.service_id)
              const list = JSON.parse(service.required_list)
              const requiredLis = JSON.parse(list)
              setRequiredList(requiredLis)
              setIcon(null)
              setIsModalOpen(true)}}
          >
            <FaEdit /> تعديل
          </button>
        </div>
      ))}

      {/* Modal for updating service */}
      {isModalOpen && (
        <UpdateModal 
          data={selectedServiceEdite} 
          onClose={handleCloseModal} 
          id={serviceId}
          
          onUpdate={()=>{}} 
        />
      )}

    </div>
    </div>
  );
}





const UpdateModal = ({ onClose, onUpdate, id , data }) => {

  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  const list = JSON.parse(data.required_list)
              const requiredLis = JSON.parse(list)
  const [requiredList, setRequiredList] = useState(requiredLis);
  const [newRequiredItem, setNewRequiredItem] = useState('');
  const [isCarService, setIsCarService] = useState(data.is_car_service);
  const [icon, setIcon] = useState(null);
  const [wtsLink, setWtsLink] = useState(data.wtsLink);
  const [phone, setPhone] = useState(data.phone);
  const handleAddRequiredItem = () => {
    setRequiredList([...requiredList, newRequiredItem]);
    setNewRequiredItem('');
  };

  const handleIconUpload = (event) => {
    const file = event.target.files[0];
    console.log(file)
    if (file) {
      setIcon(file);  // This displays the icon preview
    }
  };



  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('required_list', JSON.stringify(requiredList)); // Send the required list as a JSON string
    formData.append('is_car_service', isCarService ? 1 : 0);
    formData.append('LinkWts', wtsLink);
    formData.append('phone', phone);
    
    if (icon) {
      formData.append('icon', icon); // Append the file for the icon
    }
    
    try {
      // Make an Axios POST request to the backend
      const response = await axios.put(`https://backend.sakanijo.com/api/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Send as multipart/form-data for file upload
        },
      });

      console.log('Service saved successfully:', response.data);
     

      // Reset the form fields after success
      setPhone("");
      setDescription("");
      setTitle("");
      setWtsLink("");
      setIsCarService(false);
      setRequiredList([]);
      setIcon(null);
      

      alert("تم تعديل الخدمة بنجاح");
      onClose(); // Close the modal after updating
      window.location.reload();

    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxHeight: '80vh', // Setting max height for the modal
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 4,
        overflowY: 'auto', // Enable scrolling inside the modal
      }}
    >
      <Typography id="add-service-modal-title" variant="h6" component="h2" mb={2}>
        تعديل خدمة
      </Typography>

      {/* Service Title */}
      <TextField
        label="عنوان الخدمة"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Upload Icon */}
      <Button
        variant="outlined"
        component="label"
        startIcon={<FaUpload />}
        fullWidth
        sx={{ margin: '10px 0' }}
      >
        ارفع ايقونة
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleIconUpload}
        />
      </Button>
      {icon && <img src={URL.createObjectURL(icon)} alt="Service Icon" style={{ width: '50px', height: '50px', marginTop: '10px' }} />}

      <p>ننصحك باخد الايقونة من موقع <a href="https://www.flaticon.com/" rel="noreferrer" target='_blank'>Flat icons</a></p>

      {/* Description */}
      <TextField
        label="الوصف"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        margin="normal"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* Required List */}
      <Typography variant="subtitle1" component="h3" mb={1}>
        مستلزمات الخدمة
      </Typography>
      <TextField
        label="اضافة عنصر مهم"
        variant="outlined"
        fullWidth
        margin="normal"
        value={newRequiredItem}
        onChange={(e) => setNewRequiredItem(e.target.value)}
      />
      <Button variant="contained" color="secondary" fullWidth onClick={handleAddRequiredItem} sx={{ mb: 2 }}>
        اضافة عنصر
      </Button>
      <List>
        {requiredList.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item} />
            <FaTrashAlt
              style={{ color: 'red', cursor: 'pointer' }}
              onClick={() => {
                setRequiredList(prevList => prevList.filter((currentItem) => currentItem !== item));
              }}
            />
          </ListItem>
        ))}
      </List>

      {/* WhatsApp Link */}
      <TextField
        label="رقم واتساب"
        variant="outlined"
        fullWidth
        margin="normal"
        value={wtsLink}
        onChange={(e) => setWtsLink(e.target.value)}
      />

      {/* Phone Number */}
      <TextField
        label="رقم هاتف"
        variant="outlined"
        fullWidth
        margin="normal"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Car Service Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={isCarService}
            onChange={(e) => setIsCarService(e.target.checked)}
          />
        }
        label="اضغط هنا ادا كانت هاده الخدمة حجز سيارة"
      />

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" onClick={onClose}>
          اغلاق
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          تعديل
        </Button>
      </Box>
    </Box>
  );
};


UpdateModal.propTypes = {
  id: PropTypes.any,
  onClose : PropTypes.func ,
  onUpdate : PropTypes.func , 
  data : PropTypes.any
  
};



export default Services;
