import { StatusCodes } from 'http-status-codes';
import {
  getAllTournamentTypes as getAllTournamentTypesService,
  getTournamentTypeById,
  createTournamentType as createTournamentTypeService,
  updateTournamentType as updateTournamentTypeService,
  deleteTournamentType as deleteTournamentTypeService
} from '../services/tournamentTypeService';

export async function getAllTournamentTypes(req, res) {
  try {
    // Chỉ admin mới có thể xem tất cả tournament types
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem danh sách tournament types'
      });
    }
    
    const tournamentTypes = await getAllTournamentTypesService();
    res.status(StatusCodes.OK).json({ success: true, data: tournamentTypes });
  } catch (error) {
    console.error('Error fetching tournament types:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournament types',
      error: error.message
    });
  }
}

export async function getTournamentType(req, res) {
  try {
    // Chỉ admin mới có thể xem tournament type
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xem tournament type'
      });
    }
    
    const tournamentType = await getTournamentTypeById(req.params.id);
    
    if (!tournamentType) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament type not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: tournamentType });
  } catch (error) {
    console.error('Error fetching tournament type:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error fetching tournament type',
      error: error.message
    });
  }
}

export async function createTournamentType(req, res) {
  try {
    // Chỉ admin mới có thể tạo tournament type
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền tạo tournament type'
      });
    }
    
    const tournamentType = await createTournamentTypeService(req.body);
    res.status(StatusCodes.CREATED).json({ success: true, data: tournamentType });
  } catch (error) {
    console.error('Error creating tournament type:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error creating tournament type',
      error: error.message
    });
  }
}

export async function updateTournamentType(req, res) {
  try {
    // Chỉ admin mới có thể cập nhật tournament type
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền cập nhật tournament type'
      });
    }
    
    const updatedTournamentType = await updateTournamentTypeService(req.params.id, req.body);
    
    if (!updatedTournamentType) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament type not found' 
      });
    }
    
    res.status(StatusCodes.OK).json({ success: true, data: updatedTournamentType });
  } catch (error) {
    console.error('Error updating tournament type:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error updating tournament type',
      error: error.message
    });
  }
}

export async function deleteTournamentType(req, res) {
  try {
    // Chỉ admin mới có thể xóa tournament type
    const isAdmin = req.userRoles?.some(role => role.name === 'admin');
    if (!isAdmin) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: 'Chỉ admin mới có quyền xóa tournament type'
      });
    }
    
    const deleted = await deleteTournamentTypeService(req.params.id);
    
    if (!deleted) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        success: false, 
        message: 'Tournament type not found' 
      });
    }
    
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    console.error('Error deleting tournament type:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
      success: false, 
      message: 'Error deleting tournament type',
      error: error.message
    });
  }
} 