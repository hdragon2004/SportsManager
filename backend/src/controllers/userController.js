import { StatusCodes } from 'http-status-codes';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsers
} from '../services/userService';

export async function getAllUsers(req, res) {
  try {
    // Kiểm tra nếu user có role admin thì lấy tất cả users
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    
    if (isAdmin) {
      const users = await getUsers();
      res.status(StatusCodes.OK).json({ success: true, data: users });
    } else {
      // User thường chỉ có thể xem thông tin của chính mình
      const user = await getUserById(req.user.userId);
      res.status(StatusCodes.OK).json({ success: true, data: [user] });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching users',
      error: error.message
    });
  }
}

export async function getUser(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching user',
      error: error.message
    });
  }
}

export async function postUser(req, res) {
  try {
    const user = await createUser(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: user });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating user',
      error: error.message
    });
  }
}

export async function putUser(req, res) {
  try {
    const updated = await updateUser(req.params.id, req.body);
    if (!updated) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating user',
      error: error.message
    });
  }
}

export async function removeUser(req, res) {
  try {
    const deleted = await deleteUser(req.params.id);
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting user',
      error: error.message
    });
  }
}

export async function searchUsersController(req, res) {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: 'Query parameter "q" is required' 
      });
    }

    const users = await searchUsers(q.trim());
    res.status(StatusCodes.OK).json({ success: true, data: users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error searching users',
      error: error.message
    });
  }
}
