'use client';

import { Search, Bell, HelpCircle, User, Menu } from 'lucide-react';
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { POST_METHOD } from "@/lib/req";

/* thÃªm type props */
type NavMenuProps = {
    onToggleSidebarAction?: () => void
    className?: string
}

export default function NavMenu({
    onToggleSidebarAction,
    className,
}: NavMenuProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleLogout = async () => {
        await POST_METHOD("/api/auth/logout", {})

        localStorage.removeItem("accessToken")

        window.location.href = "/login"
    }

    return (
        <nav className={cn("w-full border-b bg-background", className)}>
            <div
                className={cn(
                    "flex w-full items-center justify-between px-4 py-2"
                )}
            >

                {/* LEFT */}
                <div className="flex items-center gap-3">

                    {/* nÃºt toggle sidebar */}
                    {onToggleSidebarAction && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggleSidebarAction}
                        >
                            <Menu size={20} />
                        </Button>
                    )}

                    <div className="relative w-80">
                        <Search className="absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search"
                            className="w-full pl-8 pr-4"
                        />
                    </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">

                    <Button variant="ghost" size="icon">
                        <HelpCircle size={20} />
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    <Button variant="ghost" size="icon">
                        <Bell size={20} />
                    </Button>

                    <Separator orientation="vertical" className="h-6" />

                    {mounted ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User size={20} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem>
                                    Quáº£n lÃ½ tÃ i khoáº£n
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="text-red-500"
                                    onClick={handleLogout}
                                >
                                    ÄÄƒng xuáº¥t
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="ghost" size="icon" aria-label="User menu">
                            <User size={20} />
                        </Button>
                    )}

                </div>

            </div>
        </nav>
    );
}
