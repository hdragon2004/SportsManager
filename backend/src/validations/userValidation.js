import Joi from "joi"
import { StatusCodes } from 'http-status-codes'
import ApiError from "~/utils/ApiError";

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string()
            .required()
            .min(3)
            .max(100)
            .trim()
            .strict()
            .messages({
                'string.empty': 'Tên không được để trống',
                'string.min': 'Tên phải có ít nhất {#limit} ký tự',
                'string.max': 'Tên không được vượt quá {#limit} ký tự',
                'any.required': 'Tên là trường bắt buộc'
            }),
        
        email: Joi.string()
            .required()
            .email()
            .trim()
            .messages({
                'string.empty': 'Email không được để trống',
                'string.email': 'Email không hợp lệ',
                'any.required': 'Email là trường bắt buộc'
            }),

        password: Joi.string()
            .required()
            .min(6)
            .max(30)
            .messages({
                'string.empty': 'Mật khẩu không được để trống',
                'string.min': 'Mật khẩu phải có ít nhất {#limit} ký tự',
                'string.max': 'Mật khẩu không được vượt quá {#limit} ký tự',
                'any.required': 'Mật khẩu là trường bắt buộc'
            }),

        confirm_password: Joi.string()
            .valid(Joi.ref('password'))
            .required()
            .messages({
                'any.only': 'Mật khẩu xác nhận không khớp',
                'any.required': 'Mật khẩu xác nhận là trường bắt buộc'
            }),

        phone: Joi.string()
            .pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)
            .allow('', null)
            .messages({
                'string.pattern.base': 'Số điện thoại không hợp lệ'
            })
    });

    try {
        // Chỉ định abortEarly: false để trả về tất cả lỗi validation nếu có
        await correctCondition.validateAsync(req.body, { abortEarly: false });
        // Validate dữ liệu hợp lệ thì cho request đi tiếp sang controller
        next();
    } catch (error) {
        const errorMessage = error.message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};

const update = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string()
            .min(3)
            .max(100)
            .trim()
            .strict()
            .messages({
                'string.min': 'Tên phải có ít nhất {#limit} ký tự',
                'string.max': 'Tên không được vượt quá {#limit} ký tự'
            }),
        
        email: Joi.string()
            .email()
            .trim()
            .messages({
                'string.email': 'Email không hợp lệ'
            }),

        phone: Joi.string()
            .pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)
            .allow('', null)
            .messages({
                'string.pattern.base': 'Số điện thoại không hợp lệ'
            })
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

export const userValidation = {
    createNew,
    update
};
