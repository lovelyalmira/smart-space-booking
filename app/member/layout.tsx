import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell expectedRole="member">{children}</DashboardShell>;
}
