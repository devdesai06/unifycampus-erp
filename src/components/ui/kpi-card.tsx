import { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: {
    value: number
    isPositive: boolean
    label: string
  }
  className?: string
  variant?: "default" | "primary" | "accent" | "success" | "warning"
}

export function KpiCard({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  variant = "default" 
}: KpiCardProps) {
  const variantStyles = {
    default: "border-border",
    primary: "border-primary/20 bg-primary-light/30",
    accent: "border-accent/20 bg-accent-light/30",
    success: "border-success/20 bg-success/5",
    warning: "border-warning/20 bg-warning/5"
  }

  const iconStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning"
  }

  return (
    <Card className={cn(
      "card-hover transition-all duration-200",
      variantStyles[variant],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("h-4 w-4", iconStyles[variant])}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && (
          <div className="flex items-center pt-1">
            {trend.isPositive ? (
              <TrendingUp className="h-4 w-4 text-success mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <p className={cn(
              "text-xs",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% {trend.label}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}