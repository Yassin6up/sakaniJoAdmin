import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

export default function SendNotificationModal({ open, onClose, selectedUsers, onSubmit }) {
  const [tabValue, setTabValue] = useState('none');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setTabValue('none');
      setTitle('');
      setBody('');
      setSearchQuery('');
      setPosts([]);
      setUsersList([]);
      setSelectedPost(null);
      setSelectedUser(null);
    }
  }, [open]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedPost(null);
    setSelectedUser(null);
    setSearchQuery('');
    setPosts([]);
    setUsersList([]);
  };

  const handleSearchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.sakanijo.com/search/places?search=${encodeURIComponent(searchQuery)}`
      );
      setPosts(response.data);
    } catch (error) {
      console.error('Error searching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://backend.sakanijo.com/search/users?search=${encodeURIComponent(searchQuery)}`
      );
      setUsersList(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    let redirectId = null;
    if (tabValue === 'post') {
      redirectId = selectedPost?.id;
    } else if (tabValue === 'user') {
      redirectId = selectedUser?.id;
    }
    
    const notificationData = {
      title,
      body,
      redirectType: tabValue,
      redirectId,
      userIds: selectedUsers
    };
    
    onSubmit(notificationData);
    onClose();
  };

  const isSubmitDisabled = 
    !title || 
    !body || 
    (tabValue === 'post' && !selectedPost) || 
    (tabValue === 'user' && !selectedUser);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>إرسال إشعار</DialogTitle>
      <DialogContent dividers>
        <TextField
          fullWidth
          label="عنوان الإشعار"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          multiline
          rows={3}
          label="محتوى الإشعار"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="بدون تحويل" value="none" />
          <Tab label="تحويل إلى منشور" value="post" />
          <Tab label="تحويل إلى مستخدم" value="user" />
        </Tabs>

        {tabValue === 'post' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <TextField
                fullWidth
                label="ابحث عن المنشورات بالرقم"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="contained" 
                onClick={handleSearchPosts}
                disabled={!searchQuery}
              >
                بحث
              </Button>
            </div>
            {loading ? (
              <CircularProgress />
            ) : (
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {posts.map(post => (
                  <ListItem
                    key={post.id}
                    button
                    selected={selectedPost?.id === post.id}
                    onClick={() => setSelectedPost(post)}
                  >
                    <ListItemText
                      primary={`منشور #${post.id}`}
                      secondary={post.title}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}

        {tabValue === 'user' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <TextField
                fullWidth
                label="ابحث عن مستخدمين بالاسم/الهاتف"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                variant="contained" 
                onClick={handleSearchUsers}
                disabled={!searchQuery}
              >
                بحث
              </Button>
            </div>
            {loading ? (
              <CircularProgress />
            ) : (
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {usersList.map(user => (
                  <ListItem
                    key={user.id}
                    button
                    selected={selectedUser?.id === user.id}
                    onClick={() => setSelectedUser(user)}
                  >
                    <ListItemText
                      primary={user.name}
                      secondary={user.phone}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </>
        )}

        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="textSecondary">
          المستلمون المحددون: {selectedUsers?.length}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>إلغاء</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          إرسال الإشعار
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SendNotificationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedUsers: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ).isRequired,
  onSubmit: PropTypes.func.isRequired,
};