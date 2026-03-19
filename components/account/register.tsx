"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RegisterFormData } from "@/hooks/useRegister"
import { POST_METHOD } from "@/lib/req"

export default function RegisterForm() {
    const router = useRouter()

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [form, setForm] = useState<RegisterFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof RegisterFormData, string>>
    >({})

    const handleChange = (field: keyof RegisterFormData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)

        setFieldErrors({})
        if (form.password !== form.confirmPassword) {
            const message = "Máº­t kháº©u xÃ¡c nháº­n khÃ´ng khá»›p"
            setFieldErrors((prev) => ({ ...prev, confirmPassword: message }))
            setError(message)
            return
        }

        try {
            setLoading(true)
            await POST_METHOD("/api/auth/register", form)

            setSuccess("ÄÄƒng kÃ½ thÃ nh cÃ´ng! Äang chuyá»ƒn sang trang Ä‘Äƒng nháº­p...")

            setTimeout(() => {
                router.push("/login")
            }, 1500)

        } catch (err: unknown) {
            const payload = (err as { response?: { data?: unknown } })?.response?.data as
                | {
                      message?: string
                      errors?: Partial<Record<keyof RegisterFormData, string[]>>
                  }
                | undefined

            const serverErrors = payload?.errors

            if (serverErrors) {
                const nextFieldErrors: Partial<Record<keyof RegisterFormData, string>> = {}
                let firstMessage: string | undefined

                for (const [field, messages] of Object.entries(serverErrors)) {
                    if (messages && messages.length > 0) {
                        const message = messages[0]
                        nextFieldErrors[field as keyof RegisterFormData] = message
                        if (!firstMessage) {
                            firstMessage = message
                        }
                    }
                }

                setFieldErrors(nextFieldErrors)
                setError(firstMessage || payload?.message || "ÄÄƒng kÃ½ tháº¥t báº¡i")
            } else {
                setError(payload?.message || "ÄÄƒng kÃ½ tháº¥t báº¡i")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
            <Card className="w-full max-w-md shadow-xl border-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-center">
                        Táº¡o tÃ i khoáº£n
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label>Há»</Label>
                            <Input
                                value={form.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                placeholder="Nháº­p há»"
                            />
                            {fieldErrors.lastName && (
                                <p className="text-xs text-red-500">{fieldErrors.lastName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>TÃªn</Label>
                            <Input
                                value={form.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                placeholder="Nháº­p tÃªn"
                            />
                            {fieldErrors.firstName && (
                                <p className="text-xs text-red-500">{fieldErrors.firstName}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={form.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="example@email.com"
                            />
                            {fieldErrors.email && (
                                <p className="text-xs text-red-500">{fieldErrors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label>Sá»‘ Ä‘iá»‡n thoáº¡i</Label>
                            <Input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={form.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                placeholder="0123456789"
                            />
                            {fieldErrors.phone && (
                                <p className="text-xs text-red-500">{fieldErrors.phone}</p>
                            )}
                        </div>
                        <div className="space-y-2 relative">
                            <Label>Máº­t kháº©u</Label>
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="Nháº­p máº­t kháº©u"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-muted-foreground"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {fieldErrors.password && (
                                <p className="text-xs text-red-500">{fieldErrors.password}</p>
                            )}
                        </div>
                        <div className="space-y-2 relative">
                            <Label>XÃ¡c nháº­n máº­t kháº©u</Label>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    handleChange("confirmPassword", e.target.value)
                                }
                                placeholder="Nháº­p láº¡i máº­t kháº©u"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-9 text-muted-foreground"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                            {fieldErrors.confirmPassword && (
                                <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>
                            )}
                        </div>
                        {error && (
                            <p className="text-sm text-red-500 text-center">{error}</p>
                        )}

                        {success && (
                            <p className="text-sm text-green-600 text-center">
                                {success}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full rounded-xl"
                            disabled={loading}
                        >
                            {loading ? "Äang Ä‘Äƒng kÃ½..." : "ÄÄƒng kÃ½"}
                        </Button>

                        <p className="text-sm text-center text-muted-foreground">
                            ÄÃ£ cÃ³ tÃ i khoáº£n?{" "}
                            <a href="/login" className="underline cursor-pointer">
                                ÄÄƒng nháº­p
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
