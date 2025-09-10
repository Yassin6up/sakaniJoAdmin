import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, TextField } from '@mui/material';

function ReportView() {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState(reports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://backend.sakanijo.com/api/reports');
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const handleStatusChange = async (reportId, newStatus) => {
    try {
      // Send a PUT request to update the report status
      const response = await axios.put(`https://backend.sakanijo.com/reports/${reportId}/status`, {
        status: newStatus
      });
  
      if (response.status === 200) {
        console.log(response)
        // Update the local state if the request is successful
        const updatedReports = reports.map(report =>
          report.reportId === reportId ? { ...report, status: newStatus } : report
        );
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      }
    } catch (error) {
      console.error('Error updating report status:', error);
    }
  };

  const handleDeleteReport = (reportId) => {
    const updatedReports = reports.filter(report => report.reportId !== reportId);
    setReports(updatedReports);
    setFilteredReports(updatedReports);
  };



// Function to ban a user
const banUser = async (reportId , placeId) => {
  try {
    const response = await axios.put(`https://backend.sakanijo.com/users/action/${placeId}/block` , {
        reportId
    });
    if (response.status === 200) {
      alert('تم حظر المستخدم بنجاح');
      return true; // Indicate success
    }
  } catch (error) {
    console.error('Error banning user:', error);
    alert('فشل حظر المستخدم');
  }
  return false; // Indicate failure
};

// Function to delete a comment
const deleteComment = async (reportId , placeId) => {
  try {
    const response = await axios.delete(`https://backend.sakanijo.com/comments/${placeId}` , {
        reportId
    });
    if (response.status === 200) {
      alert('تم حذف التعليق بنجاح');
      return true; // Indicate success
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    alert('فشل حذف التعليق');
  }
  return false; // Indicate failure
};

// Function to stop an ad
const stopAd = async (reportId , placeId) => {
  try {
    const response = await axios.put(`https://backend.sakanijo.com/places/${placeId}/stop`, {
        reportId
    });
    if (response.status === 200) {
      setReports((prevReports) => prevReports.filter((report) => report.reportId !== reportId));

      alert('تم إيقاف الإعلان بنجاح');

      return true; // Indicate success
    }
  } catch (error) {
    console.error('Error stopping ad:', error);
    alert('فشل إيقاف الإعلان');
  }
  return false; // Indicate failure
};



  useEffect(() => {
    const filtered = reports.filter(report =>
      (statusFilter === 'all' || report.status === statusFilter) &&
      (typeFilter === 'all' || report.reportType === typeFilter)
    );
    setFilteredReports(filtered);
  }, [statusFilter, typeFilter, reports]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'status') {
      setStatusFilter(value); // Update statusFilter state
    } else if (filterType === 'type') {
      setTypeFilter(value); // Update typeFilter state
    }
    // No need to calculate filteredReports here; useEffect will handle it
  };
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        تقارير البلاغات
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>حالة البلاغ</InputLabel>
        <Select
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="قيد الانتظار">قيد الانتظار</MenuItem>
          <MenuItem value="قيد التحقيق">قيد التحقيق</MenuItem>
          <MenuItem value="مغلق">مغلق</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>نوع البلاغ</InputLabel>
        <Select
          value={typeFilter}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        >
          <MenuItem value="all">الكل</MenuItem>
          <MenuItem value="profile">بروفايل</MenuItem>
          <MenuItem value="comment">تعليق</MenuItem>
          <MenuItem value="place">اعلان</MenuItem>
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>رقم البلاغ</TableCell>
              <TableCell>اسم البلاغ</TableCell>
              <TableCell>وصف البلاغ</TableCell>
              <TableCell>نوع الجريمة</TableCell>
              <TableCell>نوع البلاغ</TableCell>
              <TableCell>رقم الضحية</TableCell>
              <TableCell>تاريخ البلاغ</TableCell>
              <TableCell>حالة البلاغ</TableCell>
              <TableCell> محتوى المشكل </TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.map((report) => (
              <TableRow key={report.reportId}>
                <TableCell>{report.reportId}</TableCell>
                <TableCell>{report.reporterName}</TableCell>
                <TableCell>{report.description}</TableCell>
                <TableCell>
                    {JSON.parse(report.crimeType)?.map((crime, index) => (
                        <div key={index}>{crime}</div>
                    ))}
                    </TableCell>
                <TableCell>{report.reportType}</TableCell>
                <TableCell>{report.victimNumber}</TableCell>
                <TableCell>{report.reportDate}</TableCell>
                <TableCell>
                  <Select
                    value={report.status}
                    onChange={(e) => handleStatusChange(report.reportId, e.target.value)}
                  >
                        <MenuItem value="قيد الانتظار">قيد الانتظار</MenuItem>
                        <MenuItem value="قيد التحقيق">قيد التحقيق</MenuItem>
                        <MenuItem value="مغلق">مغلق</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                    {
                        report.reportType === "place"&& (
                            <div>رقم الاعلان : {report.placeId}</div>
                        )
                        
                    }
                    {
                        report.reportType === "comment"&& (
                            <div> {report.comment}</div>
                        )
                    }
                    {
                        report.reportType === "profile"&& (
                            <div>رقم الملف : {report.placeId}</div>
                        )
                    }
                </TableCell>
                <TableCell>
                  {/* <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeleteReport(report.reportId)}
                  >
                    حذف البلاغ
                  </Button> */}
                  {report.reportType === 'profile' && (
  report.actionFinished ? (
    <Typography variant="body2" color="error">
      تم حظر المستخدم
    </Typography>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        const success = await banUser(report.reportId , report.placeId);
        if (success) {
          // Update the report to reflect the action
          const updatedReports = reports.map(r =>
            r.reportId === report.reportId ? { ...r, actionFinished: true } : r
          );
          setReports(updatedReports);
          setFilteredReports(updatedReports);
        }
      }}
    >
      حظر المستخدم
    </Button>
  )
)}

{report.reportType === 'comment' && (
  report.actionFinished ? (
    <Typography variant="body2" color="error">
      تم حذف التعليق
    </Typography>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        const success = await deleteComment(report.reportId , report.placeId);
        if (success) {
          // Update the report to reflect the action
          const updatedReports = reports.map(r =>
            r.reportId === report.reportId ? { ...r, actionFinished: true } : r
          );
          setReports(updatedReports);
          setFilteredReports(updatedReports);
        }
      }}
    >
      حذف التعليق
    </Button>
  )
)}

{report.reportType === 'place' && (
  report.actionFinished ? (
    <Typography variant="body2" color="error">
      تم إيقاف الإعلان
    </Typography>
  ) : (
    <Button
      variant="contained"
      color="primary"
      onClick={async () => {
        const success = await stopAd(report.reportId , report.placeId);
        if (success) {
          // Update the report to reflect the action
          const updatedReports = reports.map(r =>
            r.reportId === report.reportId ? { ...r, actionFinished: true } : r
          );
          setReports(updatedReports);
          setFilteredReports(updatedReports);
        }
      }}
    >
      إيقاف الإعلان
    </Button>
  )
)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ReportView;