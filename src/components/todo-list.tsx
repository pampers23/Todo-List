"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit, Check, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Task = {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
console.log("Resolved button class:", buttonVariants({ variant: "default", size: "icon" }))
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([
        ...tasks,
        {
          id: crypto.randomUUID(),
          text: newTask.trim(),
          completed: false,
        },
      ])
      setNewTask("")
    }
  }

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const startEditing = (id: string, currentText: string) => {
    setEditingId(id)
    setEditText(currentText)
  }

  const saveEdit = () => {
    if (editText.trim() !== "" && editingId) {
      setTasks(tasks.map((task) => (task.id === editingId ? { ...task, text: editText.trim() } : task)))
    }
    setEditingId(null)
    setEditText("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === "active") return !task.completed
    if (activeFilter === "completed") return task.completed
    return true
  })

  const activeTasks = tasks.filter((task) => !task.completed).length
  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTask()
              }
            }}
            className="flex-1"
          />
          <Button onClick={addTask} size="icon" className="bg-black text-white cursor-pointer">
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add task</span>
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger className="cursor-pointer" value="all">All ({tasks.length})</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="active">Active ({activeTasks})</TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="completed">Completed ({completedTasks})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              editingId={editingId}
              editText={editText}
              onStartEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onEditTextChange={setEditText}
            />
          </TabsContent>
          <TabsContent value="active" className="mt-4">
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              editingId={editingId}
              editText={editText}
              onStartEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onEditTextChange={setEditText}
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <TaskList
              tasks={filteredTasks}
              onToggle={toggleTaskCompletion}
              onDelete={deleteTask}
              editingId={editingId}
              editText={editText}
              onStartEdit={startEditing}
              onSaveEdit={saveEdit}
              onCancelEdit={cancelEdit}
              onEditTextChange={setEditText}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        {tasks.length > 0 ? (
          <p>
            {activeTasks} task{activeTasks !== 1 ? "s" : ""} left to complete
          </p>
        ) : (
          <p>No tasks yet. Add one above!</p>
        )}
      </CardFooter>
    </Card>
  )
}

function TaskList({
  tasks,
  onToggle,
  onDelete,
  editingId,
  editText,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditTextChange,
}: {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  editingId: string | null
  editText: string
  onStartEdit: (id: string, text: string) => void
  onSaveEdit: () => void
  onCancelEdit: () => void
  onEditTextChange: (text: string) => void
}) {
  if (tasks.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No tasks to display</p>
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="flex items-center justify-between p-3 bg-background rounded-md border">
          <div className="flex items-center space-x-3 flex-1">
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggle(task.id)}
              disabled={editingId === task.id}
              className="cursor-pointer"
            />
            {editingId === task.id ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editText}
                  onChange={(e) => onEditTextChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onSaveEdit()
                    } else if (e.key === "Escape") {
                      onCancelEdit()
                    }
                  }}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onSaveEdit}
                  className="h-8 w-8 text-green-600 hover:text-green-700"
                >
                  <Check className="h-4 w-4" />
                  <span className="sr-only">Save edit</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelEdit}
                  className="h-8 w-8 text-red-600 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cancel edit</span>
                </Button>
              </div>
            ) : (
              <label
                htmlFor={`task-${task.id}`}
                className={`text-sm font-medium flex-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}
              >
                {task.text}
              </label>
            )}
          </div>
          {editingId !== task.id && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onStartEdit(task.id, task.text)}
                className="h-8 w-8 text-muted-foreground hover:text-blue-600 cursor-pointer"
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit task</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task.id)}
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
    