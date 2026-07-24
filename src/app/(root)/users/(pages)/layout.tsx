"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";
import Link from "next/link";
import {
  IconDialpad,
  IconApps,
  IconSettingsCheck,
  IconShieldLock,
  IconUsersGroup,
} from "@tabler/icons-react";
const tabs = [
  { id: null, label: "Usuários", icon: IconUsersGroup, href: "/users" },
  {
    id: "permissions",
    label: "Permissões",
    icon: IconShieldLock,
    href: "/users/permissions",
  },
  {
    id: "modules",
    label: "Grupos",
    icon: IconDialpad,
    href: "/users/modules",
  },
  {
    id: "systems",
    label: "Sistemas",
    icon: IconApps,
    href: "/users/systems",
  },
  {
    id: "roles",
    label: "Roles",
    icon: IconSettingsCheck,
    href: "/users/roles",
  },
];

export default function UsersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const segment = useSelectedLayoutSegment();
  return (
    <div className="space-y-4 mx-auto px-4 container">
      <Tabs value={segment || "users"} className="w-full">
        <TabsList className="grid grid-cols-5 mx-auto w-fit">
          {tabs.map((tab) => (
            <TabsTrigger
              nativeButton={false}
              key={tab.id || "users"}
              value={tab.id || "users"}
              render={<Link href={tab.href} className="w-full sm:min-w-44" />}
            >
              {tab?.icon && <tab.icon />}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {children}
    </div>
  );
}
