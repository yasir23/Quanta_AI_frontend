import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Reports feature coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
