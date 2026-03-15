import * as React from "react"
import { cn } from "../../../src/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "link";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", ...props }, ref) => {

        // Simplistic variant management for this demo
        const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] h-11 px-8 py-2";

        const variants = {
            default: "bg-primary-600 text-white hover:bg-primary-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]",
            outline: "border border-white/10 bg-white/5 hover:bg-white/10 text-foreground backdrop-blur-sm",
            ghost: "hover:bg-white/10 hover:text-foreground",
            link: "text-primary underline-offset-4 hover:underline",
        }

        return (
            <button
                className={cn(baseClasses, variants[variant], className)}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
