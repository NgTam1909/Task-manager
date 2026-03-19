"use client"

import { useState } from "react"
import {AuthService} from "@/services/auth.service";
export type RegisterFormData = {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
}
export function useRegister() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu không trùng khớp")
            return
        }

        try {
            setLoading(true)
            setError(null)

            await AuthService.register({
                firstName: form.firstName,
                lastName: form.lastName,
                email: form.email,
                phone: form.phone,
                password: form.password,
            })

            window.location.href = "/login"
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Đăng ký thất bại"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return {
        form,
        setForm,
        handleSubmit,
        loading,
        error,
    }
}
