"use client";

import { CornerDownLeft, UserRoundPlus } from "lucide-react";
import { cn } from "cn";

import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/table";
import { Textarea } from "@repo/ui/components/textarea";
import { Controller, useForm } from "react-hook-form";
import { inviteUserInOrganizationSchema, type InviteUserInput } from "@repo/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/api/api";
import { useState } from "react";
import axios from "axios";
interface InviteUserProps {
  heading?: string;
  className?: string;
}

const InviteUser = ({
  heading = "Invite Users",
  className,
}: InviteUserProps) => {
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

  const {
    control,
    register,
    handleSubmit,
  } = useForm<InviteUserInput>({
    resolver: zodResolver(inviteUserInOrganizationSchema),
    mode: "onChange",
    defaultValues: {
      role: "RECRUITER" as InviteUserInput["role"],
    },
  });

  const [error, setError] = useState("");

  async function onSubmit(data: InviteUserInput) {
    // LOG
    console.log(data);

    try {
      const res = await api.post('api/organization/create-invite', {
        email: data.email,
        role: data.role
      })

      alert(res.data.message);
    } catch(error: unknown) {
      if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
        setError(error.response?.data.error?.message ?? "Unable to create an invite.");
      } else {
        setError("Unable to create the invite. Please try again.");
      }
    }
  }

  return (
    <section className="bg-muted/30 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="container mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Team Members
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage and invite users to your team
            </p>
          </div>
          <Dialog>
            <DialogTrigger
              render={<Button className="w-full cursor-pointer sm:w-fit" />}
            >
              Invite Users
            </DialogTrigger>
            <DialogContent
              className={cn(
                "max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-lg gap-0 overflow-y-auto overflow-x-hidden p-0",
                className,
              )}
            >
              <DialogTitle className="flex items-center gap-2 border-b p-4 text-sm font-medium">
                <UserRoundPlus className="size-4" />
                {heading}
              </DialogTitle>
              <form
                onSubmit={handleSubmit(onSubmit, (validationErrors) => console.log(validationErrors))}
                className="flex flex-col gap-4 bg-muted pt-4"
              >
                <div className="flex flex-col gap-4 px-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Email addresses</Label>
                    <Textarea
                      style={{
                        resize: "none",
                        minHeight: "10px",
                      }}
                      placeholder="sarah@google.com"
                      {...register("email", {
                        required: "Email is required"
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Assign role</Label>
                    <Controller
                    name="role"
                    control={control}
                    render={({field}) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a role" />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="RECRUITER">
                          Recruiter
                          </SelectItem>
                        <SelectItem value="HIRING_MANAGER">
                          Hiring Manager
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    )}
                    />
                  </div>
                </div>
                <DialogFooter className="border-t bg-background px-4 py-3">
                  {error && <p style={{color: "red"}}>{error}</p>}
                  <Button className="w-full sm:w-fit" size="sm" type="submit">
                    Send Invitation <CornerDownLeft />
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="overflow-x-auto rounded-lg border bg-background shadow-sm">
          <Table className="min-w-160">
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
        </div>
      </div>
    </section>
  );
};

export { InviteUser };