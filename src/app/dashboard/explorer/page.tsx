import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Compass } from "lucide-react";

export default function ExplorerPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Explorer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <Compass className="h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Explorer feature coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
