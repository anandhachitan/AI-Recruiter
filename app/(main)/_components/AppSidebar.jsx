"use client";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SideBarOptions } from "@/services/Constants";
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/app/provider";
import { useViewMode } from "@/app/(main)/provider";

export function AppSidebar() {
  const { user } = useUser();
  const { viewMode } = useViewMode();
  const path = usePathname();

  const filteredOptions = SideBarOptions.filter((option) => {
    // Candidate: only Dashboard + Settings
    if (!user?.isRecruiter && !user?.isAdmin) {
      return option.name === "Dashboard" || option.name === "Settings";
    }

    // Admin view: only Dashboard + Settings (no recruiter features)
    if (viewMode === "admin" && user?.isAdmin) {
      return option.name === "Dashboard" || option.name === "Settings";
    }

    // Recruiter view: show all items
    return true;
  });

  // Hide "Create New Interview" in admin view or for candidates
  const showCreateButton =
    (user?.isRecruiter || user?.isAdmin) && viewMode !== "admin";

  return (
    <Sidebar className="bg-gray-100 border-r">
      <SidebarHeader className="flex flex-col gap-2 mt-2">
        <Link href="/dashboard" className="cursor-pointer">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={200}
            height={100}
            className="w-[150px]"
            loading="eager"
            unoptimized
          />
        </Link>
        {showCreateButton && (
          <Link href="/dashboard/create-interview">
            <Button className="w-full flex items-center gap-2">
              <Plus />
              Create New Interview
            </Button>
          </Link>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {filteredOptions.map((option, index) => (
              <SidebarMenuItem key={index} className="p-1">
                <SidebarMenuButton
                  asChild
                  className={`p-5 ${path == option.path && "bg-blue-100"}`}
                >
                  <Link href={option.path} className="flex items-center gap-2">
                    <option.icon
                      className={` ${path == option.path && "text-primary"}`}
                    />
                    <span
                      className={`text-[16px] ${path == option.path && "text-primary"
                        }`}
                    >
                      {option.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
