import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Task } from '../model/task';
import { TaskStatusEnum } from '../model/task-status.enum';
import { TaskService } from '../service/task.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnChanges {
  taskForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    tags: new FormControl(''),
    status: new FormControl(''),
    color: new FormControl(''),
    start: new FormControl(''),
    end: new FormControl(''),
  });
  fixLabelPosition = '';

  task?: Task;

  @Input()
  taskId?: number;

  @Output()
  closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output()
  updateTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.task.currentValue) {
      this.taskForm.patchValue(changes.task.currentValue);
      this.fixLabelPosition = 'p-inputwrapper-filled';
    }
  }

  ngOnInit(): void {
    if (this.taskId) {
      this.taskService.getTaskWithDuration(this.taskId).subscribe(data => this.task = data);
    }
  }

  onSubmit(): void {
    this.taskService.updateTask(this.taskForm.value)
      .subscribe((task) => this.closeDialogWithUpdatedTask(task));
  }

  showCompleteButton(status?: string): boolean {
    return (status === TaskStatusEnum.started) || (status === TaskStatusEnum.paused);
  }

  showPauseButton(status?: string): boolean {
    return status === TaskStatusEnum.started;
  }

  showStartButton(status?: string): boolean {
    return status === TaskStatusEnum.paused;
  }

  onSave(): void {
    this.onSubmit();
  }

  onClose(): void {
    this.closeDialog();
  }

  private closeDialog(): void {
    this.closeEvent.emit(true);
  }

  private closeDialogWithUpdatedTask(task: Task): void {
    this.updateTask.emit(task);
    this.closeDialog();
  }

  private updateCurrentTask(task: Task): void {
    this.task = task;
    this.updateTask.emit(task);
  }

  onStart(): void {
    if (this.task?.id) {
      this.taskService.startTask(this.task.id).subscribe(task => this.updateCurrentTask(task));
    }
  }

  onPause(): void {
    if (this.task?.id) {
      this.taskService.pauseTask(this.task.id).subscribe(task => this.updateCurrentTask(task));
    }
  }

  onComplete(): void {
    if (this.task?.id) {
      this.taskService.stopTask(this.task.id).subscribe(task => this.updateCurrentTask(task));
    }
  }
}
