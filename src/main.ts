import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

declare global {
  interface Array<T> {
    fields(): (keyof T)[];
    sum(mapper: (item: T) => number): number;
    toTable(keys?: (keyof T)[]): string;
  }
}

Array.prototype.sum = function <T>(this: T[], mapper: (item: T) => number): number {
  return this.map(mapper).reduce((acc, val) => acc + val, 0);
};

Array.prototype.fields = function<T>(this: T[]): (keyof T)[] {
  if (this.length > 0) {
      const item:any=this[0];
     return Object.keys(item) as (keyof T)[];
  }
  return [];
};

Array.prototype.toTable = function <T>(this: T[], keys?: (keyof T)[]): string {
  if (!this.length) {
    return '<table class="table table-sm table-striped"></table>';
  } else {
    const headers: (keyof T)[] = keys || this.fields();
    const thead = `<thead><tr>${headers.map(h => `<th>${h.toString()}</th>`).join('')}</tr></thead>`;

    const tbody = `<tbody>${this.map(obj =>
      `<tr>${this.fields().map(h => `<td>${obj[h] ?? ''}</td>`).join('')}</tr>`
    ).join('')}</tbody>`;

    return `<table class="table table-sm table-striped">${thead}${tbody}</table>`;
  }
};

