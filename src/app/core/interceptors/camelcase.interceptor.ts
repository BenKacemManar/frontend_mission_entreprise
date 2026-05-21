import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler,
  HttpEvent, HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

function snakeToCamel(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function camelToSnake(s: string): string {
  return s.replace(/[A-Z]/g, c => `_${c.toLowerCase()}`);
}

function deepConvert(obj: any, keyFn: (k: string) => string): any {
  if (Array.isArray(obj)) return obj.map(v => deepConvert(v, keyFn));
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [keyFn(k), deepConvert(v, keyFn)])
    );
  }
  return obj;
}

@Injectable()
export class CamelCaseInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let modified = req;
    if (req.body && typeof req.body === 'object') {
      modified = req.clone({ body: deepConvert(req.body, camelToSnake) });
    }
    return next.handle(modified).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.body) {
          return event.clone({ body: deepConvert(event.body, snakeToCamel) });
        }
        return event;
      })
    );
  }
}
