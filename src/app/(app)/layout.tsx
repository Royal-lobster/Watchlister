import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Navbar } from "@/components/navbar/navbar";
import { logoutAction } from "@/actions/auth";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        workspaceName={session.workspace_name}
        workspaceIcon={session.workspace_icon}
        onLogout={logoutAction}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
}
