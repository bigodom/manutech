import { Outlet } from "react-router-dom"
import { Sidebar } from "../../App"

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  )
}