"use client";

import * as React from "react";
import {
  IconLayoutDashboard,
  IconUsers,
  IconBarbell,
  IconStretching,
  IconSettings,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
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
import { getAuthToken, getCurrentUser } from "@/lib/auth";

const menuData = {
  navMain: [
    { title: "Dashboard", url: "/", icon: IconLayoutDashboard },
    { title: "Users", url: "/users", icon: IconUsers },
    { title: "Workouts", url: "/workouts", icon: IconBarbell },
    { title: "Exercices", url: "/exercices", icon: IconStretching },
  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
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
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        const userEmail = payload.sub;

        const response = await fetch(`http://localhost:8080/api/users/email/${userEmail}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const user = await response.json();
          const fullName = (user.firstname && user.lastname)
            ? `${user.firstname} ${user.lastname}`
            : userEmail.split('@')[0];

          setUserData({
            name: fullName,
            email: user.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          });
        } else {
          setUserData(prev => ({ ...prev, name: userEmail.split('@')[0], email: userEmail }));
        }
      } catch (error) {
        console.error("Erreur Sidebar:", error);
      }
    }

    fetchConnectedUser();
  }, []);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="p-1.5">
              <Link href="/">
                <Rat className="text-primary" />
                <span className="text-base font-semibold">HealthAi</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={menuData.navMain} />
        <NavSecondary items={menuData.navSecondary} className="mt-auto" />
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
