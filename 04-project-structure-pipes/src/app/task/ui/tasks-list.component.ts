import { Component, inject, Input } from "@angular/core";
import { Task } from "../model/Task";
import { NgFor, NgIf } from "@angular/common";
import { NgIconComponent, provideIcons } from "@ng-icons/core";
import { featherCalendar } from "@ng-icons/feather-icons";
import { TasksService } from "../data-access/tasks.service";
import { RemoveItemButtonComponent } from "@ui/remove-item-button.component";
import { AutosizeTextareaComponent } from "@ui/autosize-textarea.component";

@Component({
  selector: "app-tasks-list",
  standalone: true,
  viewProviders: [provideIcons({ featherCalendar })],
  imports: [
    NgFor,
    NgIconComponent,
    NgIf,
    RemoveItemButtonComponent,
    AutosizeTextareaComponent,
  ],
  template: `
    <ul>
      <li *ngFor="let task of tasks" class="mb-2">
        <div class="rounded-md shadow-md p-4 block" [class.bg-green-300]="task.done">
          <button
            class="w-full"
            (click)="handleSingleClick(task)"
            (dblclick)="switchToEditMode(task)"
          >
            <header class="flex justify-end">
              <app-remove-item-button (confirm)="delete(task.id)" />
            </header>
            <section class="text-left">
              <app-autosize-textarea
                *ngIf="editMode && taskOnEditId == task.id; else previewModeTemplate"
                (keyup.escape)="editMode = false; taskOnEditId = null"
                (submitText)="updateTask(task.id, $event)"
                [value]="task.name"
              />

              <ng-template #previewModeTemplate>
                <span [class.line-through]="task.done">
                  {{ task.name }}
                </span>
              </ng-template>
            </section>
            <footer class=" pt-2 flex items-center justify-end">
              <ng-icon name="featherCalendar" class="text-sm" />
            </footer>
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [],
})
export class TasksListComponent {
  @Input({ required: true }) tasks: Task[] = [];

  removeMode = false;
  editMode = false;

  taskOnEditId: number | null = null;

  isSingleClick = true;

  private tasksService = inject(TasksService);

  delete(taskId: number) {
    this.tasksService.delete(taskId);
    this.tasks = this.tasks.filter((task) => task.id !== taskId);
  }

  updateTask(taskId: number, updatedName: string) {
    this.tasksService.update(taskId, updatedName);
    this.tasks.find((task) => task.id === taskId)!.name = updatedName;
    this.editMode = false;
    this.taskOnEditId = null;
  }

  handleSingleClick(task: Task) {
    this.isSingleClick = true;

    setTimeout(() => {
      if (this.isSingleClick) {
        this.toggleDoneStatus(task);
      }
    }, 150);
  }

  switchToEditMode(task: Task) {
    this.isSingleClick = false;
    this.editMode = true;
    this.taskOnEditId = task.id;
  }

  toggleDoneStatus(task: Task) {
    task.done = !task.done;
  }
}
