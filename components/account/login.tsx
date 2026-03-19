"use client"

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"

interface LoginFormProps {
    identifier: string
    password: string
    setIdentifier: (value: string) => void
    setPassword: (value: string) => void
    handleSubmit: () => void
    loading: boolean
    error: string | null
}

export default function LoginForm({
    identifier,
    password,
    setIdentifier,
    setPassword,
    handleSubmit,
    loading,
    error,
}: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">

            <Card className="w-full max-w-sm sm:max-w-md rounded-2xl shadow-lg border">

                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-semibold">
                        ÄÄƒng nháº­p
                    </CardTitle>

                    <p className="text-sm text-muted-foreground">
                        Nháº­p thÃ´ng tin tÃ i khoáº£n Ä‘á»ƒ tiáº¿p tá»¥c
                    </p>
                </CardHeader>

                <CardContent className="space-y-5">

                    {/* Email / Username */}
                    <div className="space-y-2">
                        <Label>Email hoáº·c Username</Label>

                        <Input
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            placeholder="example@email.com"
                            className="h-11"
                        />
                    </div>

                    {/* Password */}
                    <div className="space-y-2 relative">

                        <Label>Password</Label>

                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Nháº­p máº­t kháº©u"
                            className="h-11 pr-10"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[34px] text-muted-foreground hover:text-foreground transition"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>

                    </div>
                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm text-muted-foreground hover:underline"
                        >
                            QuÃªn máº­t kháº©u?
                        </Link>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-500 text-center">
                            {error}
                        </p>
                    )}

                    {/* Login Button */}
                    <Button
                        onClick={handleSubmit}
                        className="w-full h-11 rounded-xl"
                        disabled={loading}
                    >
                        {loading ? "Äang Ä‘Äƒng nháº­p..." : "ÄÄƒng nháº­p"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        ChÆ°a cÃ³ tÃ i khoáº£n?
                        <Link href="/register" className="underline ml-1">
                            ÄÄƒng kÃ½
                        </Link>
                    </p>
                </CardContent>

            </Card>

        </div>
    )
}
