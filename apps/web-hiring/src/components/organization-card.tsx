import { Card, CardContent } from "@repo/ui/components/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { JoinStraightIcon } from "@hugeicons/core-free-icons"
import { Link } from "react-router-dom";

interface Item {
  title: string;
  description: string;
  route: string;
  icon: typeof JoinStraightIcon;
}

export function OrgOnboardingCard({ 
  title, 
  description, 
  route,
  icon,
}: Item) {
  return (
    <Link
      to={route}
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
    </Link>
  )
}