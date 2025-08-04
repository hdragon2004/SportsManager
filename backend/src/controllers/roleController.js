import { StatusCodes } from 'http-status-codes';
import {
  getAllRoles as getAllRolesService,
  getRoleById,
  createRole as createRoleService,
  updateRole as updateRoleService,
  deleteRole as deleteRoleService
} from '../services/roleService';

export async function getAllRoles(req, res) {
  try {
    // Chỉ admin mới có thể xem tất cả roles
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem danh sách roles'
      });
    }
    
    const roles = await getAllRolesService();
    res.status(StatusCodes.OK).json({ success: true, data: roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching roles',
      error: error.message
    });
  }
}

export async function getRole(req, res) {
  try {
    // Chỉ admin mới có thể xem role
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem role'
      });
    }
    
    const role = await getRoleById(req.params.id);
    if (!role) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role not found' 
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data: role });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching role',
      error: error.message
    });
  }
}

export async function createRole(req, res) {
  try {
    // Chỉ admin mới có thể tạo role
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền tạo role'
      });
    }
    
    const role = await createRoleService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: role });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating role',
      error: error.message
    });
  }
}

export async function updateRole(req, res) {
  try {
    // Chỉ admin mới có thể cập nhật role
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật role'
      });
    }
    
    const updatedRole = await updateRoleService(req.params.id, req.body);
    if (!updatedRole) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role not found' 
      });
    }
    res.status(StatusCodes.OK).json({ success: true, data: updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating role',
      error: error.message
    });
  }
}

export async function deleteRole(req, res) {
  try {
    // Chỉ admin mới có thể xóa role
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa role'
      });
    }
    
    const deleted = await deleteRoleService(req.params.id);
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Role not found' 
      });
    }
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting role',
      error: error.message
    });
  }
} 