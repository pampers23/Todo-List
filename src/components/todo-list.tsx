"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus} from "lucide-react"
import TaskList from "./task-list"
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodos, getTodos } from "@/action/private"


const TodoList = () => {
  const queryClient = useQueryClient();
  const [todo, setTodo] = useState("");

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addTodos,
    onSuccess: () => {
      console.log("Todo updated — invalidating query");
      queryClient.invalidateQueries({ queryKey: ["todos"] })
    },
    onError: (error) => {
      console.error("Error adding todo:", error);
      toast.error("Failed to add todo. Please try again.");
    }
  })

  const { data: todos, isLoading } = useQuery({
    queryFn: () => getTodos(),
    queryKey: ["todos"]
  })


  if (isLoading) {
    return <div className="text-center">Loading...</div>
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input 
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              className="flex-1"
              type="text" 
              placeholder="Add task here..."
            />
            <Button
              onClick={async () => {
                try {
                  await addTodoMutation({ todo });
                  setTodo("")
                  toast.success("Added")
                } catch (error) {
                  console.log(error);
                  toast.error("Failed to Add")
                }
              }}
              size="icon"
              className="bg-black text-white cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <TaskList Todos={todos ?? []} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TodoList