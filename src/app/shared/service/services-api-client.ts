import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { AppConfigService } from '../../app-config.sevice';

export interface HttpOptions {
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export interface ObserveResponse {
  observe: 'response';
}

export interface ObserveBody {
  observe: 'body';
}

export interface ResponseTypeBlob {
  responseType: 'blob';
}

export interface ResponseTypeJson {
  responseType: 'json';
}

@Injectable()
export class ServicesApiClient {

  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Origin, Accept, X-Requested-With, Content-Type,' +
        ' Access-Control-Request-Method, Authorization, Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH',
      'Content-Type':  'application/json',
    })
  };

  constructor(private httpClient: HttpClient, private appConfigService: AppConfigService) {
  }

  public get<T>(url: string, options?: HttpOptions | HttpOptions & ResponseTypeJson): Observable<T>;
  public get<T>(url: string, options?: HttpOptions & ResponseTypeBlob): Observable<Blob>;
  public get<T>(url: string, options?: any): any {
    return this.httpClient.get<T>(this.getUrl(url), options);
  }

  public post<T>(url: string, data?: any, options?: HttpOptions | HttpOptions & ObserveBody): Observable<T>;
  public post<T>(url: string, data?: any, options?: HttpOptions & ObserveResponse): Observable<HttpResponse<T>>;
  public post<T>(url: string, data?: any, options?: any): any {
    return this.httpClient.post<T>(this.getUrl(url), data, options);
  }

  public put<T>(url: string, data: any = {}, options?: HttpOptions): Observable<T> {
    return this.httpClient.put<T>(this.getUrl(url), data, options);
  }

  public patch<T>(url: string, data: any = {}, options?: HttpOptions): Observable<T> {
    return this.httpClient.patch<T>(this.getUrl(url), data, options);
  }

  public delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.httpClient.delete<T>(this.getUrl(url), options);
  }

  protected getUrl(url: string): string {
    return this.appConfigService.getConfig.apiUrl + '/api' + url;
  }
}
