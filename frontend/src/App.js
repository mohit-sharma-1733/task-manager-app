import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import SimpleTabs from './components/tabs';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'To Do' });
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async (status = null) => {
    try {
      const response = await axios.get('/api/tasks', {
        params: { status: status }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'To Do' });
      setOpen(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await axios.put(`/api/tasks/${id}`, { status });
      const updatedTasks = tasks.map(task => {
        if (task._id === id) {
          return { ...task, status };
        }
        return task;
      });
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      const updatedTasks = tasks.filter(task => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const openStatusMenu = (event, taskId) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };

  const handleChangeStatus = async (status) => {
    if (selectedTaskId) {
      await handleStatusChange(selectedTaskId, status);
    }
    handleStatusMenuClose();
  };

  const openDeleteConfirmDialog = (taskId) => {
    setTaskToDelete(taskId);
    setDeleteConfirmDialogOpen(true);
  };

  const closeDeleteConfirmDialog = () => {
    setTaskToDelete(null);
    setDeleteConfirmDialogOpen(false);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await handleDelete(taskToDelete);
      closeDeleteConfirmDialog();
    }
  };

  const tabs = [
    { label: 'To Do', component: 
      <div>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpen(true)}
          style={{ marginBottom: '1rem' }}
        >
          Create Task
        </Button>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>
                    <Button
                      aria-controls="status-menu"
                      aria-haspopup="true"
                      onClick={(e) => openStatusMenu(e, task._id)}
                    >
                      {task.status} <MoreVertIcon />
                    </Button>
                    <Menu
                      id="status-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl && selectedTaskId === task._id)}
                      onClose={handleStatusMenuClose}
                    >
                      <MenuItem onClick={() => handleChangeStatus('To Do')}>To Do</MenuItem>
                      <MenuItem onClick={() => handleChangeStatus('In Progress')}>In Progress</MenuItem>
                      <MenuItem onClick={() => handleChangeStatus('Done')}>Done</MenuItem>
                    </Menu>
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteConfirmDialog(task._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    },
    { label: 'In Progress', component: 
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => task.status === 'In Progress' && (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteConfirmDialog(task._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    },
    { label: 'Completed', component: 
      <div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map(task => task.status === 'Done' && (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.description}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => openDeleteConfirmDialog(task._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    },
  ];

  return (
    <div className="App">
      <h1>Task Manager</h1>
      <SimpleTabs tabs={tabs} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please fill out the form below to create a new task.
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              multiline
              fullWidth
            />
            <TextField
              select
              label="Status"
              value={newTask.status}
              onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
              fullWidth
            >
              <MenuItem value="To Do">To Do</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Create Task</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={closeDeleteConfirmDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this task?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" autoFocus>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default App;
