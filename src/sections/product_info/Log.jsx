import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress } from '@mui/material';
import moment from 'moment';
import axios from "axios"
import PropTypes from "prop-types"

const AdminActionLogs = ({ placeId }) => {
    const [actions, setActions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadActions = async () => {
            try {
                const response = await axios.get(`https://backend.sakanijo.com/api/admin-actions/${placeId}`);
                setActions(response.data.actions);              
            } catch (err) {
                setError('فشل في تحميل سجل الإجراءات.');
            } finally {
                setLoading(false);
            }
        };

        loadActions();
    }, [placeId]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return (
            <Typography variant="h6" color="error" align="center" style={{ marginTop: '20px' }}>
                {error}
            </Typography>
        );
    }

    if (actions.length === 0) {
        return (
            <Typography variant="h6" align="center" style={{ marginTop: '20px' }}>
                لا توجد إجراءات مسجلة لهذا المكان.
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} style={{ marginTop: '20px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell style={{ fontWeight: 'bold' }}>معرف المشرف</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>اسم المشرف</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>نوع الإجراء</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>رسالة الإجراء</TableCell>
                        <TableCell style={{ fontWeight: 'bold' }}>وقت الإجراء</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {actions.map((action) => (
                        <TableRow key={action.id} style={{ '&:hover': { backgroundColor: '#fafafa' } }}>
                            <TableCell>{action.admin_id}</TableCell>
                            <TableCell>{action.admin_name}</TableCell>
                            <TableCell>{action.action_type}</TableCell>
                            <TableCell>{action.action_message}</TableCell>
                            <TableCell>{moment(action.action_time).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};


AdminActionLogs.propTypes = {
    placeId: PropTypes.number
    
}

export default AdminActionLogs;