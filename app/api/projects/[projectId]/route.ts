import mongoose from "mongoose"
import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import { connectDB } from "@/lib/db"
import Project from "@/models/project.model"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

async function getUserIdFromRequest(req: NextRequest) {
    const token = req.cookies.get("accessToken")?.value
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, SECRET)
        const id = (payload.id || payload.userId) as string | undefined
        return id ?? null
    } catch {
        return null
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ projectId: string }> }
) {
    try {
        const userId = await getUserIdFromRequest(req)
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const { projectId } = await params
        if (!projectId) {
            return NextResponse.json({ message: "Không thấy projectId" }, { status: 400 })
        }

        await connectDB()

        let project = await Project.findOne({ projectId })
        if (!project && mongoose.isValidObjectId(projectId)) {
            project = await Project.findById(projectId)
        }

        if (!project) {
            return NextResponse.json({ message: "Không tìm thấy dự án" }, { status: 404 })
        }

        if (!project.owner?.userId?.equals(userId)) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        await Project.deleteOne({ _id: project._id })

        return NextResponse.json({ success: true })
    } catch {
        return NextResponse.json(
            { message: "Không thể xóa dự án" },
            { status: 500 }
        )
    }
}
