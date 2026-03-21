"use client"

import { useSyncExternalStore } from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(): boolean {
    return useSyncExternalStore(
        (onStoreChange) => {
            if (typeof window === "undefined") {
                return () => {}
            }

            const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
            const handler = () => onStoreChange()

            mediaQuery.addEventListener("change", handler)

            return () => mediaQuery.removeEventListener("change", handler)
        },
        () => {
            if (typeof window === "undefined") {
                return false
            }
            return window.innerWidth < MOBILE_BREAKPOINT
        },
        () => false
    )
}
