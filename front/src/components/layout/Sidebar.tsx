import { Wrench } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-gray-100 dark:bg-gray-900 p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-8">
          <Wrench className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">ManuTech</h1>
        </div>
        <nav>
          {/* Futuros links de navegação podem ser adicionados aqui */}
          <a href="/" className="flex items-center p-2 bg-primary/20 text-primary rounded-lg">
            Dashboard
          </a>
        </nav>
      </div>
      <div className="flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}