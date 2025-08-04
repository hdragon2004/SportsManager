import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import models from '~/models';

/**
 * HÀM ĐĂNG KÝ NGƯỜI DÙNG MỚI
 */
export async function register(req, res) {
  const { full_name, email, phone, password, role } = req.body;

  // Validation
  if (!full_name || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Họ tên, email và mật khẩu là bắt buộc.'
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Email không hợp lệ.'
    });
  }

  // Password validation
  if (password.length < 6) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Mật khẩu phải có ít nhất 6 ký tự.'
    });
  }

  try {
    const existingUser = await models.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: 'Email này đã được sử dụng.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await models.User.create({
      name: full_name,
      email,
      phone,
      password: hashedPassword,
    });

    const roleNameToFind = role || 'user';
    console.log(`Đang tìm vai trò: '${roleNameToFind}'`);

    const userRole = await models.Role.findOne({ where: { name: roleNameToFind } });

    if (userRole) {
      await models.Role_User.create({
        User_ID: newUser.id,
        Role_ID: userRole.id,
      });
      console.log(`Đã gán vai trò '${roleNameToFind}' (ID: ${userRole.id}) cho người dùng mới (ID: ${newUser.id})`);
    } else {
      console.warn(`Không tìm thấy vai trò '${roleNameToFind}' trong database. Bỏ qua việc gán vai trò.`);
    }

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
      { expiresIn: '3d' }
    );

    const userWithoutPassword = newUser.toJSON();
    delete userWithoutPassword.password;

    res.status(StatusCodes.CREATED).json({
      success: true,
      user: userWithoutPassword,
      token: token
    });

  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Đã có lỗi xảy ra phía máy chủ, không thể hoàn tất đăng ký.'
    });
  }
}


/**
 * HÀM ĐĂNG NHẬP NGƯỜI DÙNG
 */
export async function login(req, res) {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Email và mật khẩu là bắt buộc.'
    });
  }

  try {
    const user = await models.User.findOne({ 
      where: { email },
      include: [{
        model: models.Role,
        through: { attributes: [] }, // Không lấy thông tin bảng trung gian
        attributes: ['id', 'name']
      }]
    });
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-here',
      { expiresIn: '3d' }
    );

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(StatusCodes.OK).json({
      success: true,
      user: userWithoutPassword,
      token: token
    });

  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Đã có lỗi xảy ra phía máy chủ.'
    });
  }
}

/**
 * HÀM ĐỔI MẬT KHẨU
 * THÊM MỚI HÀM NÀY
 */
export async function changePassword(req, res) {
  // Lấy userId từ token đã được giải mã bởi middleware (nếu có)
  // Hoặc từ req.body nếu gửi từ client
  const userId = req.user?.userId || req.body.userId;
  const { currentPassword, newPassword } = req.body;

  if (!userId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: 'Không tìm thấy thông tin người dùng.'
    });
  }

  try {
    // 1. Tìm người dùng trong database
    const user = await models.User.findByPk(userId);
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Người dùng không tồn tại.'
      });
    }

    // 2. So sánh mật khẩu hiện tại
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác.'
      });
    }

    // 3. Mã hóa mật khẩu mới và cập nhật
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    // 4. Trả về thành công
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Đổi mật khẩu thành công.'
    });

  } catch (error) {
    console.error('Lỗi khi đổi mật khẩu:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Đã có lỗi xảy ra phía máy chủ.'
    });
  }
}

/**
 * HÀM LẤY THÔNG TIN USER HIỆN TẠI
 */
export async function getCurrentUser(req, res) {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: 'Không tìm thấy thông tin người dùng.'
      });
    }

    const user = await models.User.findOne({
      where: { id: userId },
      include: [{
        model: models.Role,
        through: { attributes: [] },
        attributes: ['id', 'name']
      }]
    });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'Người dùng không tồn tại.'
      });
    }

    const userWithoutPassword = user.toJSON();
    delete userWithoutPassword.password;

    res.status(StatusCodes.OK).json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Đã có lỗi xảy ra phía máy chủ.'
    });
  }
}