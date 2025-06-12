"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Edit, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";
import { deleteTodo, updateTodo } from "@/action/private";
import { Todos } from "@/type";

interface TaskListProps {
  Todos: Todos[]
}

const TaskList = ({ Todos }: TaskListProps) => {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // update to do
  const { mutateAsync: updateTodoMutation } = useMutation({
    mutationFn: ({ id, todo, completed }: { id: string; todo?: string; completed: boolean }) =>
      updateTodo(id, {completed, todo}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      console.error("Error updating todo:", error);
    }
  });

  // delete to do
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await deleteTodo(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ "todos" ]})
    },
    onError: (error) => {
      console.error("Error deleting todo:", error);
    }
  });

  const handleEditClick = (todo: Todos) => {
    setEditingId(todo.id)
    setEditText(todo.todo)
  }

  const handleSave = async (todo: Todos) => {
    try {
      await updateTodoMutation({
        id: todo.id,
        completed: todo.completed,
        todo: todo.todo === editText ? undefined : editText,
      });

      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error("Failed to update todo", err);
    }
  };

  const handleToggleCompleted = (todo: Todos)=> {
    updateTodoMutation({ id: todo.id, completed: !todo.completed })
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }


  return (
    <ul className="space-y-2">
      {Todos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              onCheckedChange={() => {
                handleToggleCompleted(todo)
              }}
              id={`task-${todo.id}`}
              checked={todo.completed}
              className="cursor-pointer"
            />
            {editingId === todo.id ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  onClick={() => handleSave(todo)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700 cursor-pointer"
                >
                  <Check className=" h-4 w-4" />
                  <span className="sr-only">Save edit</span>
                </Button>
                <Button
                  onClick={() => setEditingId(null)}
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel edit</span>
                </Button>
              </div>
            ) : (
              <label
                htmlFor={`task-${todo.id}`}
                className={`text-sm font-medium flex-1 ${todo.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {todo.todo}
              </label>
            )}
          </div>
          {editingId !== todo.id && (
            <div className="flex items-center space-x-1">
              <Button
                onClick={() => handleEditClick(todo)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
              <Button
                onClick={() => handleDelete(todo.id)}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete task</span>
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default TaskList;