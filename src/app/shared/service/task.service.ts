import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../model/task';
import { HttpOptions, ServicesApiClient } from './services-api-client';
import { PageModel } from '../model/page-model';
import { SortOrder } from '../model/sort-order.enum';
import { Filter } from '../model/filter';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly localUrl = '/tasks';

  constructor(private servicesApiClient: ServicesApiClient) { }

  public updateTask(data: Task): Observable<Task> {
    const url = `${this.localUrl}`;
    return this.servicesApiClient.put(url, data);
  }

  public getAllPageTasks(page: number, pageSize: number, sortField?: string, sortOrder?: number,
                         filter?: string[]): Observable<PageModel<Task>> {
    const url = `${this.localUrl}`;
    const options: HttpOptions = {
      params: {
        page: page.toString(),
        size: pageSize.toString(),
        sort: sortField || '',
        order: SortOrder[sortOrder || 1],
        fl: filter || []
      }
    };
    return this.servicesApiClient.get(this.localUrl, options);
  }

  public createTask(data: Task): Observable<Task> {
    const url = `${this.localUrl}`;
    return this.servicesApiClient.post(url, data);
  }

  public startTask(id: number): Observable<Task> {
    const url = `${this.localUrl}/start/${id}`;
    return this.servicesApiClient.put(url);
  }

  public pauseTask(id: number): Observable<Task> {
    const url = `${this.localUrl}/pause/${id}`;
    return this.servicesApiClient.put(url);
  }

  public stopTask(id: number): Observable<Task> {
    const url = `${this.localUrl}/stop/${id}`;
    return this.servicesApiClient.put(url);
  }

  public deleteTask(id: number): Observable<Task> {
    const url = `${this.localUrl}/${id}`;
    return this.servicesApiClient.delete(url);
  }

  public deleteAllTask(ids: string[]): Observable<Task> {
    const url = `${this.localUrl}/delete`;
    const options: HttpOptions = {
      params: {
        ids
      }
    };
    return this.servicesApiClient.delete(url, options);
  }
}
