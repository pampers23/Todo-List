import { supabase } from "@/lib/client";
import { toast } from "sonner";

export async function addTodos({ todo }: { todo: string }) {
  console.log(todo)
  try {
    const { data, error } = await supabase
      .from("todos")
      .insert([{ todo, completed: false }])
      .select("*");

    if (error) {
      throw error;
    }

    return data?.[0];
  } catch (error) {
    console.error("Error adding todo:", error);
    toast.error("Failed to add todo. Please try again.");
  }
}

export async function getTodos() {
  try {
    const { data, error } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error getting todo:", error);
    toast.error("Failed to get todo. Please try again.");
  }
}

export async function updateTodo(id: string, completed: boolean) {
  try {
    const { data, error } = await supabase
      .from("todos")
      .update(completed)
      .eq("id", id)
      .select("*");

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating todo:", error);
    toast.error("Failed to update todo. Please try again.");
  }
}


export async function deleteTodo(id: string) {
  try {
    const { error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    toast.success("Todo deleted successfully.");
  } catch (error) {
    console.error("Error deleting todo:", error);
    toast.error("Failed to delete todo. Please try again.");
  }
}