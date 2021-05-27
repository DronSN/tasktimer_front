import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../service/task.service';
import { Task } from '../model/task';

@Component({
  selector: 'app-task-short',
  templateUrl: './task-short.component.html',
  styleUrls: ['./task-short.component.scss']
})
export class TaskShortComponent {
  taskForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    tags: new FormControl(''),
    color: new FormControl('')
  });

  @Output()
  newTask: EventEmitter<Task> = new EventEmitter<Task>();

  constructor(private taskService: TaskService) {
  }

  onSubmit(): void {
    this.taskService.createTask(this.taskForm.value).subscribe((data) => this.newTask.emit(data));
    this.taskForm.reset();
  }
}
