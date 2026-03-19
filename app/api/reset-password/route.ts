import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { connectDB } from "@/lib/db"
import User from "@/models/user.model"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const token = (body?.token as string | undefined)?.trim()
        const password = body?.password as string | undefined
        const confirmPassword = body?.confirmPassword as string | undefined

        if (!token) {
            return NextResponse.json(
                { message: "Token khÃ´ng há»£p lá»‡" },
                { status: 400 }
            )
        }

        if (!password || password.length < 6) {
            return NextResponse.json(
                { message: "Máº­t kháº©u pháº£i cÃ³ Ã­t nháº¥t 6 kÃ½ tá»±" },
                { status: 400 }
            )
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "Máº­t kháº©u xÃ¡c nháº­n khÃ´ng khá»›p" },
                { status: 400 }
            )
        }

        await connectDB()

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex")

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        }).select("+resetPasswordToken +resetPasswordExpires")

        if (!user) {
            return NextResponse.json(
                { message: "Token háº¿t háº¡n hoáº·c khÃ´ng há»£p lá»‡" },
                { status: 400 }
            )
        }

        user.password = password
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { message: "KhÃ´ng thá»ƒ Ä‘áº·t láº¡i máº­t kháº©u" },
            { status: 500 }
        )
    }
}
