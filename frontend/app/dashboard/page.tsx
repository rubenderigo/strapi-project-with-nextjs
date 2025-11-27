import { Button } from "@/components/ui/button";
import { actions } from "@/actions";

export default function DashboardRoute() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <form action={actions.auth.signOutAction}>
          <Button type="submit" variant="destructive">
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  )
}