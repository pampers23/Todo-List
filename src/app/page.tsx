import TodoList from "@/components/todo-list"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient();

export default function Page() {
  return (
  <QueryClientProvider client={queryClient}>
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <TodoList />
      </div>
    </main>
  </QueryClientProvider>
  )
}
