"use client"

import { Calendar, Clock, MessageSquare, Tag, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Task } from "@/types/task"

type TaskDetailProps = {
    task: Task
}

export function TaskDetail({ task }: TaskDetailProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-muted-foreground">
                        {task.code}
                    </Badge>
                    <Badge variant="secondary">{task.status}</Badge>
                    {task.priority && (
                        <Badge
                            variant={
                                task.priority === "high"
                                    ? "destructive"
                                    : task.priority === "medium"
                                        ? "default"
                                        : "secondary"
                            }
                        >
                            {task.priority}
                        </Badge>
                    )}
                </div>
                <h2 className="text-xl font-semibold">{task.title}</h2>
                {task.description && (
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">Properties</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Assignees</span>
                        <div className="flex items-center gap-2 text-sm">
                            <User size={14} className="text-muted-foreground" />
                            <span>
                                {task.assignees && task.assignees.length > 0
                                    ? task.assignees.join(", ")
                                    : "ChÆ°a gáº¯n"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Start date</span>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-muted-foreground" />
                            <span>{task.startDate ?? "ChÆ°a Ä‘áº·t"}</span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Due date</span>
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar size={14} className="text-muted-foreground" />
                            <span>{task.dueDate ?? "ChÆ°a Ä‘áº·t"}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Estimate</span>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-muted-foreground" />
                            <span>{task.estimate != null ? `${task.estimate}h` : "ChÆ°a nháº­p"}</span>
                        </div>
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Labels</span>
                        <div className="flex items-center gap-2 text-sm">
                            <Tag size={14} className="text-muted-foreground" />
                            <span>
                                {task.labels && task.labels.length > 0
                                    ? task.labels.join(", ")
                                    : "ChÆ°a gáº¯n"}
                            </span>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Created</span>
                        <span className="text-sm">{task.createdAt ?? "N/A"}</span>
                    </div>

                    <div className="flex items-start justify-between">
                        <span className="text-sm text-muted-foreground">Updated</span>
                        <span className="text-sm">{task.updatedAt ?? "N/A"}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <MessageSquare size={14} />
                        Comments
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        ChÆ°c nÄƒng bÃ¬nh luáº­n sáº½ Ä‘Æ°á»£c phÃ¡t triá»ƒn sau.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
