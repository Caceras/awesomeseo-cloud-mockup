import { cn } from "@/lib/utils"

type Props = {
  title: string
  description?: string
  actions?: React.ReactNode
  eyebrow?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, actions, eyebrow, className }: Props) {
  return (
    <header
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6",
        className,
      )}
    >
      <div className="space-y-1.5 min-w-0">
        {eyebrow ? (
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h1>
        {description ? (
          <p className="text-sm text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>
      ) : null}
    </header>
  )
}
