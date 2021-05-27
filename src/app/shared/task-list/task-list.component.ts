import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskStatus } from '../model/TaskStatus';
import { Task } from '../model/task';
import { TaskService } from '../service/task.service';
import { ConfirmationService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  productDialog = false;
  selectedTasks?: Task[];
  currentTask: Task = {id: 0, name: ''};
  taskSubscription?: Subscription;

  @Input()
  newTask$?: Observable<Task>;

  constructor(private taskService: TaskService,
              private confirmationService: ConfirmationService,
              private translateService: TranslateService) { }

  ngOnDestroy(): void {
        this.taskSubscription?.unsubscribe();
    }

  ngOnInit(): void {
    this.loadTasks();
    this.taskSubscription = this.newTask$?.subscribe(() => this.loadTasks());
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe(data => this.tasks = data);
  }

  showCompleteButton(status: string): boolean {
    return (status === TaskStatus.started) || (status === TaskStatus.paused);
  }

  showPauseButton(status: string): boolean {
    return status === TaskStatus.started;
  }

  showStartButton(status: string): boolean {
    return status === TaskStatus.paused;
  }

  editTask(task: any): void {
    console.log('edit task');
    this.currentTask = task;
    this.productDialog = true;
  }

  closeDialog($event: boolean): void {
    if ($event) {
      this.productDialog = false;
    }
  }

  updateTask($event: Task): void {
    if ($event) {
      this.currentTask = $event;
      this.tasks.forEach( (item, i, self) => {
        if (item.id === this.currentTask?.id) {
          self[i] = this.currentTask;
        }
      });
    }
  }

  onStart(task: Task): void {
    if (task.id) {
      this.taskService.startTask(task.id).subscribe(taskData => this.updateTask(taskData));
    }
  }

  onPause(task: Task): void {
    if (task.id) {
      this.taskService.pauseTask(task.id).subscribe(taskData => this.updateTask(taskData));
    }
  }

  onStop(task: Task): void {
    if (task.id) {
      this.taskService.stopTask(task.id).subscribe(taskData => this.updateTask(taskData));
    }
  }

  deleteTasks(): void {
    const translate = forkJoin({
      confirmMessage: this.translateService.get('title.confirmDeleteMessage'),
      confirmTitle: this.translateService.get('title.confirmTitle'),
    });
    translate.subscribe(data => {
      this.confirmationService.confirm({
        message: data.confirmMessage,
        header: data.confirmTitle,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteSelectedTasks();
        }
      });
    });
  }

  private deleteSelectedTasks(): void {
    const ids = this.selectedTasks?.map(task => task.id.toString());
    if (ids) {
      this.taskService.deleteAllTask(ids).subscribe(() => this.loadTasks());
      this.selectedTasks = [];
    }
  }
}
