'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage your account settings and personal information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-6">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" className="w-full" defaultValue="John Doe" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" className="w-full" defaultValue="john.doe@example.com" />
            </div>
             <div className="grid gap-3">
              <Label htmlFor="team">Team</Label>
              <Input id="team" type="text" className="w-full" defaultValue="Acme Inc." disabled />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save</Button>
        </CardFooter>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
          <CardDescription>
            You are currently on the Pro plan.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">Your trial ends in 14 days.</p>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Manage Subscription</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
