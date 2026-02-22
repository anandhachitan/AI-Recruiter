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
// import your array

export function AppSidebar() {
  const path = usePathname();
  console.log(path);

  return (
    <Sidebar className="bg-gray-100 border-r">
      <SidebarHeader className="flex flex-col gap-2 mt-2">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={200}
          height={100}
          className="w-[150px]"
          loading="eager"
        />
        <Button className="w-full flex items-center gap-2">
          <Plus />
          Create New Interview
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {SideBarOptions.map((option, index) => (
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
                      className={`text-[16px] ${
                        path == option.path && "text-primary"
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
