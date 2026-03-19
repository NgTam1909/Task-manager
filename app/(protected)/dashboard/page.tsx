import { cookies } from "next/headers"
import { jwtVerify } from "jose"

import { connectDB } from "@/lib/db"
import User from "@/models/user.model"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

async function getCurrentUsername() {
    const token = (await cookies()).get("accessToken")?.value

    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, SECRET)
        const userId =
            (payload as { id?: string; userId?: string }).id ??
            (payload as { id?: string; userId?: string }).userId

        if (!userId) return null

        await connectDB()

        const user = await User.findById(userId).select(
            "firstName lastName email"
        )

        if (!user) return null

        const fullName = [user.lastName, user.firstName]
            .filter(Boolean)
            .join(" ")
            .trim()

        return fullName || user.email
    } catch {
        return null
    }
}

export default async function DashboardPage() {
    const now = new Date()
    const hour = now.getHours()
    const username = (await getCurrentUsername()) ?? "bạn"
    const greeting =
        hour < 4
            ? 'Giờ này sao bạn lại ở đây? '
            : hour < 12
                ? 'Chào buổi sáng'
                : hour < 18
                    ? 'Chào buổi chiều'
                    : hour < 23
                        ? 'Chào buổi tối'
                        : 'Muộn rồi đó!'

    const today = now.toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
    })
    const time = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit'
    })

    const tasks = [
        {
            id: 'TSK-001',
            name: 'Thiết kế giao diện',
            updatedAt: '10:45',
            status: 'Doing',
            assignee: 'Tâm',
        },
        {
            id: 'TSK-002',
            name: 'Xây dựng API',
            updatedAt: '09:20',
            status: 'Todo',
            assignee: 'An',
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Doing':
                return 'bg-blue-100 text-blue-600'
            case 'Todo':
                return 'bg-yellow-100 text-yellow-600'
            case 'Done':
                return 'bg-green-100 text-green-600'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    return (

        <div className="p-4 sm:p-6 lg:p-10 space-y-10">

            {/* Header */}
            <div className="space-y-1 text-center">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    {greeting}, {username}
                </h1>

                <p className="text-sm text-muted-foreground">
                    {time}, {today}
                </p>
            </div>

            {/* Task Section */}
            <div>

                <h2 className="text-lg sm:text-xl font-semibold mb-6">
                    Tổng quan dự án
                </h2>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

                    {tasks.map((task) => (

                        <div
                            key={task.id}
                            className="bg-background border rounded-xl p-5 space-y-4 hover:shadow-md transition"
                        >

                            {/* Top */}
                            <div className="flex justify-between items-start">

                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        {task.id}
                                    </p>

                                    <h3 className="font-semibold text-base">
                                        {task.name}
                                    </h3>
                                </div>

                                <span
                                    className={`px-2.5 py-1 text-xs rounded-full font-medium ${getStatusColor(
                                        task.status
                                    )}`}
                                >
                                    {task.status}
                                </span>

                            </div>

                            {/* Info */}
                            <div className="text-xs text-muted-foreground">
                                Cập nhật: {task.updatedAt}
                            </div>

                            <div className="text-sm">
                                Phụ trách: {task.assignee}
                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </div>

    )
}



