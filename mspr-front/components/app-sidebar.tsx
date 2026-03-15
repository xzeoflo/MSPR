"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconUsers,
  IconBarbell,
  IconStretching,
  IconDownload,
  IconMeat,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Rat } from "lucide-react";
import Link from "next/link";
import { getAuthToken } from "@/lib/auth";

const menuData = {
  navMain: [
    { title: "Dashboard", url: "/", icon: IconLayoutDashboard },
    { title: "Users", url: "/users", icon: IconUsers },
    { title: "Workouts", url: "/workouts", icon: IconBarbell },
    { title: "Exercises", url: "/exercises", icon: IconStretching },
    { title: "Meals", url: "/meals", icon: IconMeat },
    { title: "Import", url: "/import", icon: IconDownload }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [mounted, setMounted] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: "Loading...",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    setMounted(true);

    async function fetchConnectedUser() {
      const token = getAuthToken();

      if (!token) return;

      try {
        const response = await fetch(`http://localhost:8080/api/users/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const user = await response.json();

          const fname = user.firstname;
          const lname = user.lastname;

          const fullName = (fname || lname)
            ? `${fname} ${lname}`.trim()
            : user.email.split('@')[0];

          setUserData({
            name: fullName,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          });
        } else {
          console.error("Erreur profil (Status):", response.status);
        }
      } catch (error) {
        console.error("Erreur API Sidebar:", error);
      }
    }

    fetchConnectedUser();
  }, []);
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5">
              <Link href="/">
                <Rat className="text-primary" />
                <span className="text-base font-semibold">HealthAI Coach</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={menuData.navMain} />
      </SidebarContent>

      <SidebarFooter>
        {mounted ? (
          <NavUser user={userData} />
        ) : (
          <div className="h-12 w-full animate-pulse bg-muted rounded-md" />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
