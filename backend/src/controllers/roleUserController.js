import { StatusCodes } from 'http-status-codes';
import {
  getAllRoleUsers as getAllRoleUsersService,
  getRoleUserById,
  createRoleUser as createRoleUserService,
  updateRoleUser as updateRoleUserService,
  deleteRoleUser as deleteRoleUserService
} from '../services/roleUserService';

export async function getAllRoleUsers(req, res) {
  try {
    // Chỉ admin mới có thể xem tất cả role users
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem danh sách role users'
      });
    }
    
    const roleUsers = await getAllRoleUsersService();
    res.status(StatusCodes.OK).json({ success: true, data: roleUsers });
  } catch (error) {
    console.error('Error fetching role users:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching role users',
      error: error.message
    });
  }
}

export async function getRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể xem role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem role user'
      });
    }
    
    const roleUser = await getRoleUserById(req.params.id);
    
    if (!roleUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: roleUser });
  } catch (error) {
    console.error('Error fetching role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching role user',
      error: error.message
    });
  }
}

export async function createRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể tạo role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền tạo role user'
      });
    }
    
    const roleUser = await createRoleUserService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: roleUser });
  } catch (error) {
    console.error('Error creating role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating role user',
      error: error.message
    });
  }
}

export async function updateRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể cập nhật role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật role user'
      });
    }
    
    const updatedRoleUser = await updateRoleUserService(req.params.id, req.body);
    
    if (!updatedRoleUser) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedRoleUser });
  } catch (error) {
    console.error('Error updating role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating role user',
      error: error.message
    });
  }
}

export async function deleteRoleUser(req, res) {
  try {
    // Chỉ admin mới có thể xóa role user
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa role user'
      });
    }
    
    const deleted = await deleteRoleUserService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role user association not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting role user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting role user',
      error: error.message
    });
  }
} 