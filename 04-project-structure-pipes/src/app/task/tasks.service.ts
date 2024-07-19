import { Injectable } from "@angular/core";
import { Task } from "./Task";
import { ListFetchingError } from "../utils/list-state.type";
import { wait } from "../utils/wait";

@Injectable({
  providedIn: "root",
})
export class TasksService {
  private URL = "http://localhost:3000";

  async getAll() {
    await wait();

    return fetch(`${this.URL}/tasks`).then<Task[] | ListFetchingError>((response) => {
      if (response.ok) {
        return response.json();
      }

      return { status: response.status, message: response.statusText };
    });
  }

  async delete(taskId: number) {
    fetch(`${this.URL}/tasks/${taskId}`, {
      method: "DELETE",
    }).then<Error | undefined>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error("Cant delete task");
    });
  }

  async update(taskId: number, name: string) {
    return fetch(`${this.URL}/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    }).then<Task | Error>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error("Cant update task");
    });
  }

  async add(name: string) {
    await wait();

    return fetch(`${this.URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        createdAt: new Date().getTime(),
        name,
        done: false,
      } as Task),
    }).then<Task | Error>((response) => {
      if (response.ok) {
        return response.json();
      }

      return new Error("Cant add task");
    });
  }
}
