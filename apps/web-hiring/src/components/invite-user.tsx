"use client";

import { CheckCircle2, Clock3, CornerDownLeft, Users, UserRoundPlus } from "lucide-react";
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
import { useEffect, useState } from "react";
import axios from "axios";
import { useTeamMembersStore, type TeamMember } from "@/store/useTeamMembersStore";
interface InviteUserProps {
  heading?: string;
  className?: string;
}

type MemberFilter = "All" | TeamMember["status"];

const InviteUser = ({
  heading = "Invite Users",
  className,
}: InviteUserProps) => {

  const [memberFilter, setMemberFilter] = useState<MemberFilter>("All");
  const { teamMembers, isLoading, getTeamMembers } = useTeamMembersStore();

  useEffect(() => {
    void getTeamMembers();
  }, [getTeamMembers]);

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

      setError("");
      await getTeamMembers();
      alert(res.data.message);
    } catch(error: unknown) {
      if (axios.isAxiosError<{ error?: { message?: string } }>(error)) {
        setError(error.response?.data.error?.message ?? "Unable to create an invite.");
      } else {
        setError("Unable to create the invite. Please try again.");
      }
    }
  }

  const activeUsers = teamMembers?.filter((user) => user.status === "Active");
  const invitedUsers = teamMembers?.filter((user) => user.status === "Invited");
  const visibleUsers = memberFilter === "All"
    ? teamMembers
    : teamMembers?.filter((user) => user.status === memberFilter);

  function formatRole(role: string) {
    return role
      .toLowerCase()
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  return (
    <section className="px-0 py-0">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
              Team directory
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              See who is already part of your organization and who is still being onboarded.
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

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Everyone</span>
              <Users className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-3 font-heading text-3xl font-semibold">{teamMembers?.length}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-sm dark:border-emerald-900 dark:bg-emerald-950/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-emerald-800 dark:text-emerald-300">Joined</span>
              <CheckCircle2 className="size-4 text-emerald-600" />
            </div>
            <p className="mt-3 font-heading text-3xl font-semibold text-emerald-900 dark:text-emerald-200">{activeUsers?.length}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 shadow-sm dark:border-amber-900 dark:bg-amber-950/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-amber-800 dark:text-amber-300">Pending invites</span>
              <Clock3 className="size-4 text-amber-600" />
            </div>
            <p className="mt-3 font-heading text-3xl font-semibold text-amber-900 dark:text-amber-200">{invitedUsers?.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {(["All", "Active", "Invited"] as const).map((filter) => (
            <Button
              key={filter}
              type="button"
              size="sm"
              variant={memberFilter === filter ? "secondary" : "ghost"}
              className="cursor-pointer"
              onClick={() => setMemberFilter(filter)}
            >
              {filter === "Active" ? "Joined" : filter === "Invited" ? "Pending invites" : filter}
              <span className="ml-1 text-xs text-muted-foreground">
                {filter === "All" ? teamMembers?.length : filter === "Active" ? activeUsers?.length : invitedUsers?.length}
              </span>
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-sm text-muted-foreground">
                    Loading team members...
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && visibleUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatRole(user.role)}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                      user.status === "Active"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
                    )}>
                      {user.status === "Active" ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}
                      {user.status === "Active" ? "Joined" : "Pending invite"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && visibleUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-28 text-center text-sm text-muted-foreground">
                    {memberFilter === "Invited" ? "No pending invitations." : "No joined members yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export { InviteUser };