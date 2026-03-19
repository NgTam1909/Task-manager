'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Home,
    CheckSquare,
    Folder,
    Plus,
    ChevronDown,
    MoreHorizontal,
    SquareKanban,
    BookUser,
} from "lucide-react";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarContent,
} from "@/components/ui/sidebar";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import CreateProject from "@/components/projects/create-project";
import CreateTaskForm from "@/components/tasks/create-task";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DELETE_METHOD, GET_METHOD } from "@/lib/req";

type Project = {
    _id: string;
    title: string;
    projectId: string;
    isPublic: boolean;
};

type ProjectMember = {
    id: string;
    name: string;
    email: string;
    role: string;
    isOwner: boolean;
};

export default function NavProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [taskDialogProjectId, setTaskDialogProjectId] = useState<string | null>(null);
    const [taskDialogProjectTitle, setTaskDialogProjectTitle] = useState<string | null>(null);
    const [memberDialogProjectId, setMemberDialogProjectId] = useState<string | null>(null);
    const [memberDialogProjectTitle, setMemberDialogProjectTitle] = useState<string | null>(null);
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [membersLoading, setMembersLoading] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const data = (await GET_METHOD("/api/projects")) as Project[];
                if (active) setProjects(Array.isArray(data) ? data : []);
            } catch {
                if (active) setProjects([]);
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, []);

    const handleCreated = async () => {
        setOpen(false);
        setLoading(true);
        try {
            const data = (await GET_METHOD("/api/projects")) as Project[];
            setProjects(Array.isArray(data) ? data : []);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (projectId: string | undefined) => {
        if (!projectId) {
            window.alert("Project ID khÃ´ng há»£p lá»‡");
            return;
        }
        const ok = window.confirm("Delete this project? This cannot be undone.");
        if (!ok) return;

        setDeletingId(projectId);
        try {
            await DELETE_METHOD(`/api/projects/${projectId}`);
            setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
        } catch (err: unknown) {
            const payload = (err as { response?: { data?: { message?: string } } })?.response?.data;
            window.alert(payload?.message ?? "XÃ³a tháº¥t báº¡i!");
        } finally {
            setDeletingId(null);
        }
    };

    const openTaskDialog = (project: Project) => {
        setTaskDialogProjectId(project._id);
        setTaskDialogProjectTitle(project.title);
    };

    const openMembersDialog = async (project: Project) => {
        setMemberDialogProjectId(project.projectId);
        setMemberDialogProjectTitle(project.title);
        setMembers([]);
        setMembersLoading(true);
        try {
            const data = (await GET_METHOD(
                `/api/projects/${project.projectId}/members`
            )) as { members?: ProjectMember[] };
            setMembers(Array.isArray(data.members) ? data.members : []);
        } finally {
            setMembersLoading(false);
        }
    };

    const hasProjects = projects.length > 0;

    return (
        <SidebarContent className="w-fit flex-none">
            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/dashboard">
                                <Home size={16} />
                                <span>Home</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                            <Link href="/tasks">
                                <CheckSquare size={16} />
                                <span>CÃ´ng viá»‡c cá»§a tÃ´i</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Dá»± Ã¡n</SidebarGroupLabel>
                <SidebarMenu>
                    {loading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton disabled>
                                <Folder size={16} />
                                <span>Loading...</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {!loading && !hasProjects && (
                        <SidebarMenuItem>
                            <SidebarMenuButton disabled>
                                <Folder size={16} />
                                <span>ChÆ°a cÃ³ dá»± Ã¡n tá»“n táº¡i</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}

                    {hasProjects &&
                        projects.map((project) => (
                            <Collapsible key={project._id}>
                                <div className="flex items-center justify-between">
                                    <CollapsibleTrigger asChild>
                                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted transition w-full text-left">
                                            <Folder size={18} />
                                            <span>{project.title}</span>
                                            <ChevronDown size={16} className="ml-auto" />
                                        </button>
                                    </CollapsibleTrigger>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 hover:bg-muted rounded-lg" type="button">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onSelect={() => openMembersDialog(project)}>
                                                <BookUser size={14} className="mr-2" />
                                                ThÃ nh viÃªn
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Settings</DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-red-500"
                                                onSelect={() => handleDelete(project.projectId)}
                                                disabled={deletingId === project.projectId}
                                            >
                                                {deletingId === project.projectId ? "Deleting..." : "Delete"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <CollapsibleContent className="ml-6 mt-1 space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/project/${project.projectId}/tasks`}
                                            className="flex flex-1 items-center gap-2 p-2 rounded-lg hover:bg-muted transition text-sm"
                                        >
                                            <SquareKanban size={16} />
                                            Tasks
                                        </Link>
                                        <button
                                            type="button"
                                            className="p-2 rounded-lg hover:bg-muted transition"
                                            onClick={() => openTaskDialog(project)}
                                            aria-label="Táº¡o task"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => openMembersDialog(project)}
                                        className="flex w-full items-center gap-2 p-2 rounded-lg hover:bg-muted transition text-sm text-left"
                                    >
                                        <BookUser size={16} />
                                        ThÃ nh viÃªn dá»± Ã¡n
                                    </button>
                                </CollapsibleContent>
                            </Collapsible>
                        ))}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarMenu>
                    <SidebarMenuItem>
                        {mounted ? (
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <SidebarMenuButton>
                                        <Plus size={16} />
                                        <span>Táº¡o dá»± Ã¡n má»›i</span>
                                    </SidebarMenuButton>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Táº¡o dá»± Ã¡n má»›i</DialogTitle>
                                    </DialogHeader>
                                    <CreateProject onSuccessAction={handleCreated} />
                                </DialogContent>
                            </Dialog>
                        ) : (
                            <SidebarMenuButton>
                                <Plus size={16} />
                                <span>Táº¡o dá»± Ã¡n má»›i</span>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroup>

            <Dialog
                open={!!taskDialogProjectId}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setTaskDialogProjectId(null);
                        setTaskDialogProjectTitle(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>
                            {taskDialogProjectTitle
                                ? `Táº¡o task - ${taskDialogProjectTitle}`
                                : "Táº¡o task"}
                        </DialogTitle>
                    </DialogHeader>
                    {taskDialogProjectId && (
                        <CreateTaskForm
                            projectId={taskDialogProjectId}
                            onCreatedAction={() => {
                                setTaskDialogProjectId(null);
                                setTaskDialogProjectTitle(null);
                                window.dispatchEvent(new CustomEvent("task:created"));
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={!!memberDialogProjectId}
                onOpenChange={(nextOpen) => {
                    if (!nextOpen) {
                        setMemberDialogProjectId(null);
                        setMemberDialogProjectTitle(null);
                        setMembers([]);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {memberDialogProjectTitle
                                ? `ThÃ nh viÃªn - ${memberDialogProjectTitle}`
                                : "ThÃ nh viÃªn dá»± Ã¡n"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {membersLoading && (
                            <p className="text-sm text-muted-foreground">Äang táº£i...</p>
                        )}
                        {!membersLoading && members.length === 0 && (
                            <p className="text-sm text-muted-foreground">ChÆ°a cÃ³ thÃ nh viÃªn.</p>
                        )}
                        {!membersLoading &&
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
        </SidebarContent>
    );
}
