import { Card, CardContent } from "../card"
import { HugeiconsIcon } from "@hugeicons/react"
import { JoinStraightIcon } from "@hugeicons/core-free-icons"

interface Item {
  title: string;
  description: string;
  href: string;
  icon: typeof JoinStraightIcon;
}

export function Pattern({ 
  title, 
  description, 
  href,
  icon,
}: Item) {
  return (
    <a
      href={href}
      className="block w-full max-w-xs rounded-4xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Card className="h-full w-full transition-colors hover:bg-accent">
        <CardContent className="flex flex-col gap-3">
          <div className="bg-primary rounded-md [&_svg]:text-primary-foreground flex size-11 items-center justify-center [&_svg]:size-5">
            <HugeiconsIcon icon={icon} strokeWidth={2} aria-hidden="true" />
          </div>
          <h2 className="text-foreground text-sm leading-tight font-medium">
            {title}
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </a>
  )
}