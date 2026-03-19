import { useState } from "react"
import { CreateTaskInput } from "@/lib/validations/task.validation"
import { POST_METHOD } from "@/lib/req"

export function useCreateTask() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const createTask = async (data: CreateTaskInput) => {
        try {
            setLoading(true)
            setError(null)

            return await POST_METHOD("/api/task", data)
        } catch (err: unknown) {
            const payload = (err as { response?: { data?: { message?: string } } })?.response?.data
            const message = payload?.message ?? "Táº¡o tháº¥t báº¡i!"
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return { createTask, loading, error }
}
