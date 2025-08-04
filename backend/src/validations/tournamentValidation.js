
import Joi from "joi";
import { StatusCodes } from 'http-status-codes';
import ApiError from "~/utils/ApiError";

const createTournament = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string()
      .required()
      .min(3)
      .max(100)
      .trim()
      .messages({
        'string.empty': 'Tên giải đấu không được để trống',
        'string.min': 'Tên giải đấu phải có ít nhất {#limit} ký tự',
        'string.max': 'Tên giải đấu không được vượt quá {#limit} ký tự',
        'any.required': 'Tên giải đấu là trường bắt buộc'
      }),

    description: Joi.string()
      .max(500)
      .allow('', null)
      .messages({
        'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
      }),

    start_date: Joi.date()
      .required()
      .greater('now')
      .messages({
        'date.base': 'Ngày bắt đầu không hợp lệ',
        'date.greater': 'Ngày bắt đầu phải sau ngày hiện tại',
        'any.required': 'Ngày bắt đầu là trường bắt buộc'
      }),

    end_date: Joi.date()
      .required()
      .greater(Joi.ref('start_date'))
      .messages({
        'date.base': 'Ngày kết thúc không hợp lệ',
        'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu',
        'any.required': 'Ngày kết thúc là trường bắt buộc'
      }),

    max_teams: Joi.number()
      .integer()
      .min(2)
      .max(64)
      .required()
      .messages({
        'number.base': 'Số đội tối đa phải là số',
        'number.integer': 'Số đội tối đa phải là số nguyên',
        'number.min': 'Số đội tối đa phải ít nhất {#limit}',
        'number.max': 'Số đội tối đa không được vượt quá {#limit}',
        'any.required': 'Số đội tối đa là trường bắt buộc'
      }),

    signup_deadline: Joi.date()
      .required()
      .less(Joi.ref('start_date'))
      .messages({
        'date.base': 'Hạn đăng ký không hợp lệ',
        'date.less': 'Hạn đăng ký phải trước ngày bắt đầu',
        'any.required': 'Hạn đăng ký là trường bắt buộc'
      }),

    Type_ID: Joi.number()
      .integer()
      .required()
      .messages({
        'number.base': 'Loại giải đấu phải là số',
        'number.integer': 'Loại giải đấu phải là số nguyên',
        'any.required': 'Loại giải đấu là trường bắt buộc'
      }),

    location: Joi.string().required().messages({
      'string.empty': 'Địa điểm không được để trống',
      'any.required': 'Địa điểm là trường bắt buộc'
    }),
    rules: Joi.string().allow('', null),
    prize: Joi.string().allow('', null),
    status: Joi.string().valid('upcoming', 'active', 'completed', 'cancelled').default('upcoming'),
    banner_url: Joi.string().uri().allow('', null)
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errorMessage = error.message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};

const updateTournament = async (req, res, next) => {
  const correctCondition = Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .trim()
      .messages({
        'string.min': 'Tên giải đấu phải có ít nhất {#limit} ký tự',
        'string.max': 'Tên giải đấu không được vượt quá {#limit} ký tự'
      }),

    description: Joi.string()
      .max(500)
      .allow('', null)
      .messages({
        'string.max': 'Mô tả không được vượt quá {#limit} ký tự'
      }),

    start_date: Joi.date()
      .messages({
        'date.base': 'Ngày bắt đầu không hợp lệ',
      }),

    end_date: Joi.date()
      .greater(Joi.ref('start_date'))
      .messages({
        'date.base': 'Ngày kết thúc không hợp lệ',
        'date.greater': 'Ngày kết thúc phải sau ngày bắt đầu'
      }),

    max_teams: Joi.number()
      .integer()
      .min(2)
      .max(64)
      .messages({
        'number.base': 'Số đội tối đa phải là số',
        'number.integer': 'Số đội tối đa phải là số nguyên',
        'number.min': 'Số đội tối đa phải ít nhất {#limit}',
        'number.max': 'Số đội tối đa không được vượt quá {#limit}'
      }),

    signup_deadline: Joi.date()
      .less(Joi.ref('start_date'))
      .messages({
        'date.base': 'Hạn đăng ký không hợp lệ',
        'date.less': 'Hạn đăng ký phải trước ngày bắt đầu'
      }),

    Type_ID: Joi.number()
      .integer()
      .messages({
        'number.base': 'Loại giải đấu phải là số',
        'number.integer': 'Loại giải đấu phải là số nguyên'
      }),
    
    location: Joi.string(),
    rules: Joi.string().allow('', null),
    prize: Joi.string().allow('', null),
    status: Joi.string().valid('upcoming', 'active', 'completed', 'cancelled'),
    banner_url: Joi.string().uri().allow('', null)
  }).min(1); // Yêu cầu có ít nhất một trường để cập nhật

  try {
    // Chỉ validate những trường được gửi lên, bỏ qua những trường không có
    await correctCondition.validateAsync(req.body, { 
      abortEarly: false, 
      allowUnknown: true // Bỏ qua các trường không được định nghĩa trong schema
    });
    next();
  } catch (error) {
    const errorMessage = error.message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};

export const tournamentValidation = {
  createTournament,
  updateTournament
};