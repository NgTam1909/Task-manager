'use client';

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GET_METHOD } from "@/lib/req";

type ProjectMember = {
    id: string;
    name: string;
    email: string;
    role: string;
    isOwner: boolean;
};

interface MemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string | null;
    projectTitle: string | null;
}

export function MemberDialog({ open, onOpenChange, projectId, projectTitle }: MemberDialogProps) {
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && projectId) {
            const loadMembers = async () => {
                setLoading(true);
                try {
                    const data = (await GET_METHOD(
                        `/api/projects/${projectId}/members`
                    )) as { members?: ProjectMember[] };
                    setMembers(Array.isArray(data.members) ? data.members : []);
                } catch (error) {
                    console.error("Failed to load members:", error);
                    setMembers([]);
                } finally {
                    setLoading(false);
                }
            };

            loadMembers();
        } else {
            setMembers([]);
            setLoading(false);
        }
    }, [open, projectId]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {projectTitle
                            ? `Members - ${projectTitle}`
                            : "Project Members"}
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    {loading && (
                        <p className="text-sm text-muted-foreground">Loading...</p>
                    )}
                    {!loading && members.length === 0 && (
                        <p className="text-sm text-muted-foreground">No members found.</p>
                    )}
                    {!loading &&
                        members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                            >
                                <div>
                                    <div className="text-sm font-medium">{member.name || member.email}</div>
                                    <div className="text-xs text-muted-foreground">{member.email}</div>
                                </div>
                                <span className="text-xs rounded-full border px-2 py-1 text-muted-foreground">
                                    {member.isOwner ? "Owner" : member.role}
                                </span>
                            </div>
                        ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}