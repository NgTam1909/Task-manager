import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"

export const registerSchema = z.object({
    firstName: z
        .string()
        .min(1, "Hãy nhập đầy đủ thông tin")
        .max(50),

    lastName: z
        .string()
        .min(1, "Hãy nhập đầy đủ thông tin")
        .max(50),

    email: z
        .string()
        .email("Địa chỉ email không hợp lệ")
        .toLowerCase(),
    phone: z
        .string()
        .trim()
        .refine((value) => {
            const phone = parsePhoneNumberFromString(value, "VN")
            const type = phone?.getType()
            return !!phone?.isValid() && (type === "MOBILE")
        }, "Số điện thoại không hợp lệ"),

    password: z
        .string()
        .min(6, "Mật khẩu phải ít nhất 6 ký tự"),

    confirmPassword: z
        .string()
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu không trùng khớp",
        path: ["confirmPassword"],
    })



