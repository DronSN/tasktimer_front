import { Component, OnInit } from '@angular/core';
import { Task } from '../model/task';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-main-page-block',
  templateUrl: './main-page-block.component.html',
  styleUrls: ['./main-page-block.component.scss']
})
export class MainPageBlockComponent implements OnInit {

  task$: BehaviorSubject<Task> = new BehaviorSubject<Task>({id: 0, name: ''});

  constructor() { }

  ngOnInit(): void {
  }

  createdNewTask($event: Task): void {
    this.task$.next($event);
  }
}
