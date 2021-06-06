import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaskStatusEnum } from '../model/task-status.enum';
import { Task } from '../model/task';
import { TaskService } from '../service/task.service';
import { ConfirmationService, FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { TableState } from '../model/table-state';
import { SortOrder } from '../model/sort-order.enum';
import { TaskColorEnum } from '../model/task-color.enum';
import { SelectOptions } from '../model/select-options';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  private static NO_COLOR_CODE = 'no-color';
  private static COLOR_FIELD = 'color';
  private static IS_NULL_MATCH_MODE = 'isNull';
  tasks: Task[] = [];
  productDialog = false;
  selectedTasks?: Task[];
  currentTask: Task = {id: 0, name: ''};
  subscription: Subscription = new Subscription();

  @Input()
  newTask$?: Observable<Task>;
  pageSize = 10;
  totalRecords = 0;
  loading = true;
  page = 0;
  tableState: TableState;
  colorOption: SelectOptions[] = [];
  statusOption: SelectOptions[] = [];
  translationMap = new Map<string, string>();
  translationKey: string[];

  constructor(private taskService: TaskService,
              private confirmationService: ConfirmationService,
              private translateService: TranslateService) {

    this.tableState = {
      currentPage: 0,
      sortField: undefined,
      sortOrder: SortOrder.asc
    };
    this.translationKey = ['title.confirmDeleteMessage', 'title.confirmTitle', 'taskColor.noColor',
      ...TaskListComponent.getEnumKeysWithPrefix(TaskColorEnum, 'taskColor.'),     // [taskColor.green, taskColor.yellow ...]
      ...TaskListComponent.getEnumKeysWithPrefix(TaskStatusEnum, 'taskStatus.')];  // [taskStatus.started, taskStatus.paused ...]
  }

  private static getEnumKeysWithPrefix(enumOrigin: object, prefix: string): string[] {
    const result: string[] = [];
    for (const enumKey in enumOrigin) {
      if (enumOrigin.hasOwnProperty(enumKey)) {
        result.push(prefix + enumKey);
      }
    }
    return result;
  }

  private static isArray(value: any): boolean {
    return Array.isArray(value);
  }

  private static createFilter(filters: { [p: string]: FilterMetadata } | undefined): string[] {
    const result: string[] = [];
    for (const [fieldName, constraint] of Object.entries(filters || {})) {
      result.push(fieldName);
      result.push(constraint.matchMode || '');
      if (this.isArray(constraint.value)) {
        result.push(constraint.value
          .filter((item: {name: string, code: string}) => item.code !== this.NO_COLOR_CODE && item.name !== this.COLOR_FIELD)
          .map((item: {name: string, code: string}) => item.code).join(', '));
        if (fieldName === this.COLOR_FIELD && constraint.value
          .map((item: {name: string, code: string}) => item.code).includes(this.NO_COLOR_CODE)) {
          result.push(fieldName);
          result.push(this.IS_NULL_MATCH_MODE);
          result.push('');
        }
      } else {
        result.push(constraint.value);
      }
    }
    return result;
  }

  ngOnInit(): void {

    this.loadTasks(this.page, this.pageSize, this.tableState.sortField || '', this.tableState.sortOrder);

    this.subscription.add(this.translateService.stream(this.translationKey)
      .subscribe((data) => this.setTranslation(data)));

    this.subscription.add(this.newTask$?.subscribe(() =>
      this.loadTasks(this.page, this.pageSize, this.tableState.sortField || '', this.tableState.sortOrder)));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private loadTasks(page: number, pageSize: number, sortField: string, sortOrder: number, filter?: string[]): void {
    this.loading = true;
    this.taskService.getAllPageTasks(page, pageSize, sortField, sortOrder, filter).subscribe(data => {
      this.tasks = data.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
    });
  }

  private fillSelectOption(enumOrigin: object, mapKeyPrefix: string): SelectOptions[] {
    const result: SelectOptions[] = [];
    for (const enumKey in enumOrigin) {
      if (enumOrigin.hasOwnProperty(enumKey)) {
        result.push({name: this.translationMap.get(mapKeyPrefix + enumKey) || '',
          code: enumKey});
      }
    }
    return result;
  }

  showCompleteButton(status: string): boolean {
    return (status === TaskStatusEnum.started) || (status === TaskStatusEnum.paused);
  }

  showPauseButton(status: string): boolean {
    return status === TaskStatusEnum.started;
  }

  showStartButton(status: string): boolean {
    return status === TaskStatusEnum.paused;
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
    this.confirmationService.confirm({
      message: this.translationMap.get('title.confirmDeleteMessage'),
      header: this.translationMap.get('title.confirmTitle'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteSelectedTasks();
      }
    });
  }

  private deleteSelectedTasks(): void {
    const ids = this.selectedTasks?.map(task => task.id.toString());
    if (ids) {
      this.taskService.deleteAllTask(ids).subscribe(() =>
        this.loadTasks(this.page, this.pageSize, this.tableState.sortField || '', this.tableState.sortOrder));
      this.selectedTasks = [];
    }
  }

  sortAndFilterEvent($event: LazyLoadEvent): void {
    if ($event.first !== undefined && $event.rows !== undefined) {
      this.loading = true;
      const selectedPage = $event.first / $event.rows;
      this.tableState.sortField = $event.sortField;
      this.tableState.sortOrder = $event.sortOrder || 1;
      const filter: string[] = TaskListComponent.createFilter($event.filters);
      this.loadTasks(selectedPage, this.pageSize, this.tableState.sortField || '', this.tableState.sortOrder, filter);
    }
  }

  private setTranslation(data: any): void {
    for (const [key, value] of Object.entries(data)) {
      if (data.hasOwnProperty(key)) {
          this.translationMap.set(key, value as string);
      }
    }
    this.colorOption = this.fillSelectOption(TaskColorEnum, 'taskColor.');
    this.colorOption.unshift({ name: this.translationMap.get('taskColor.noColor') || '', code: TaskListComponent.NO_COLOR_CODE });
    this.statusOption = this.fillSelectOption(TaskStatusEnum, 'taskStatus.');
  }

  clear(table: Table): void {
    table.clear();
  }
}
