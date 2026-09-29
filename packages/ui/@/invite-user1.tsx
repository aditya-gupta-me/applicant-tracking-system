"use client";

import { CornerDownLeft, UserRoundPlus } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog";
import { Label } from "@/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table";
import { Textarea } from "@/components/textarea";
interface InviteUser1Props {
  heading?: string;
  className?: string;
}

const InviteUser1 = ({
  heading = "Invite Users",
  className,
}: InviteUser1Props) => {
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Administrator",
      status: "Active",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@company.com",
      role: "Collaborator",
      status: "Invited",
    },
  ];

  return (
    <section className="py-32">
      <div className="container flex flex-col gap-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Team Members
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and invite users to your team
          </p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog>
          <DialogTrigger render={<Button className="w-fit" />}>Invite Users</DialogTrigger>
          <DialogContent className={cn("gap-0 overflow-hidden p-0", className)}>
            <DialogTitle className="flex items-center gap-2 border-b p-4 text-sm font-medium">
              <UserRoundPlus className="size-4" />
              {heading}
            </DialogTitle>
            <form
              autoComplete="off"
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-4 bg-muted pt-4"
            >
              <div className="flex flex-col gap-4 px-4">
                <div className="space-y-1">
                  <Label className="text-xs">Email addresses</Label>
                  <Textarea
                    style={{
                      resize: "none",
                      minHeight: "100px",
                    }}
                    placeholder="Enter email addresses..."
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Assign role</Label>
                  <Select defaultValue="collaborator">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collaborator">Collaborator</SelectItem>
                      <SelectItem value="administrator">
                        Administrator
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter className="border-t bg-background px-4 py-3">
                <Button size="sm" type="submit">
                  Send Invitation <CornerDownLeft />
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export { InviteUser1 };
