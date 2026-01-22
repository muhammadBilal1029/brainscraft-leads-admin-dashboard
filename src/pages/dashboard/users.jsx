import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user',
    status: 'active'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await fetch('http://192.168.18.146:5000/auth/users/user-data',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(Array.isArray(data?.users) ? data.users : []);
      console.log(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      status: user.status || 'active'
    });
    setEditModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value, name) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`http://192.168.18.146:5000/auth/users/user-data/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Update the users list with the updated user
      setUsers(users.map(user => 
        user._id === editingUser._id ? { ...user, ...formData } : user
      ));

      setEditModalOpen(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };
// Add this function inside your Users component
const handleDeleteUser = async (userId) => {
  if (!window.confirm('Are you sure you want to delete this user?')) {
    return;
  }
  try {
    const response = await fetch(`http://192.168.18.146:5000/auth/users/delete-user/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    // Remove the user from the local state
    setUsers(users.filter(user => user._id !== userId));
  } catch (err) {
    console.error('Error deleting user:', err);
    setError('Failed to delete user. Please try again.');
  }
};
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Typography variant="h6">Loading users...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-500">
        <Typography variant="h6">Error loading users</Typography>
        <Typography className="text-sm">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Users Table
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["User", "Email", "Role", "Status", "Actions"].map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Typography variant="h6" color="blue-gray" className="text-lg">
                        No users found
                      </Typography>
                      <Typography variant="small" color="gray" className="mt-1">
                        There are no users to display at the moment.
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user, key) => {
                  const className = `py-3 px-5 ${
                    key === users.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={user._id || key}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <Avatar 
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                            alt={user.name} 
                            size="sm" 
                            variant="rounded" 
                          />
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              {user.username}
                            </Typography>
                            <Typography className="text-xs font-normal text-blue-gray-500">
                              {user.email}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-normal text-blue-gray-600">
                          {user.email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={user.role === 'admin' ? 'green' : 'blue'}
                          value={user.role || 'user'}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={user.status === 'active' ? 'green' : 'gray'}
                          value={user.status || 'inactive'}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className} style={{display:'flex'}}>
                        <button
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 mr-3"
                          onClick={() => handleEditClick(user)}
                        >
                          Edit
                        </button>
                       
 <button
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 mr-3"
                           onClick={() => handleDeleteUser(user._id)}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        </button>

                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* Edit User Modal */}
      <Dialog open={editModalOpen} handler={() => setEditModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>Edit User</DialogHeader>
          <DialogBody divider className="flex flex-col gap-4">
            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}
            
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Name
              </Typography>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                label="Name"
                required
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Email
              </Typography>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                label="Email"
                required
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Role
              </Typography>
              <Select
                name="role"
                value={formData.role}
                onChange={(value) => handleSelectChange(value, 'role')}
                label="Role"
              >
                <Option value="user">User</Option>
                <Option value="admin">Admin</Option>
                <Option value="editor">Editor</Option>
              </Select>
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="mb-2">
                Status
              </Typography>
              <Select
                name="status"
                value={formData.status}
                onChange={(value) => handleSelectChange(value, 'status')}
                label="Status"
              >
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="suspended">Suspended</Option>
              </Select>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={() => setEditModalOpen(false)}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="green" type="submit">
              <span>Save Changes</span>
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}

export default Users;