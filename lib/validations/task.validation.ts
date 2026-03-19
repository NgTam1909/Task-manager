import { z } from "zod"
import { TaskStatus, ImportanceLevel } from "@/types/task"

const dateFromInput = (value: string) => new Date(`${value}T00:00:00`)

export const createTaskSchema = z.object({
    title: z.string().min(1, "TiÃªu Ä‘á» khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng"),

    description: z.string().optional(),

    status: z.nativeEnum(TaskStatus).optional(),

    importance: z.nativeEnum(ImportanceLevel).optional(),

    projectId: z.string().min(1, "Thiáº¿u project"),

    assignees: z.array(z.string()).optional(),

    labels: z.array(z.string()).optional(),

    startDate: z.string().optional(),

    dueDate: z.string().optional(),

    estimate: z.number().optional(),
}).superRefine((data, ctx) => {
    if (data.estimate !== undefined && data.estimate < 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Estimate khÃ´ng Ä‘Æ°á»£c Ã¢m",
            path: ["estimate"],
        })
    }

    if (data.startDate && data.dueDate) {
        const start = dateFromInput(data.startDate)
        const due = dateFromInput(data.dueDate)
        if (start > due) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "NgÃ y báº¯t Ä‘áº§u khÃ´ng Ä‘Æ°á»£c sau ngÃ y káº¿t thÃºc",
                path: ["startDate"],
            })
        }
    }

    if (data.dueDate) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const due = dateFromInput(data.dueDate)
        if (due < today) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "NgÃ y káº¿t thÃºc khÃ´ng Ä‘Æ°á»£c trÆ°á»›c ngÃ y hiá»‡n táº¡i",
                path: ["dueDate"],
            })
        }
    }
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
