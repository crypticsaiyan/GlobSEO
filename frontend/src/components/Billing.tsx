import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Progress } from "./ui/progress";

function Billing() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
        <CardDescription>
          You are currently on the Free plan. You can upgrade to the Pro plan
          to get more features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">20</span> of{" "}
              <span className="font-medium text-foreground">100</span>{" "}
              generations
            </p>
            <p className="text-sm text-muted-foreground">4 days left</p>
          </div>
          <Progress value={20} />
        </div>
      </CardContent>
      <CardFooter>
        <Button>Upgrade to Pro</Button>
      </CardFooter>
    </Card>
  );
}

export { Billing };
