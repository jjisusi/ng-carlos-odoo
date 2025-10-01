// src/utils/array.extensions.ts

declare global {
  interface Array<T> {
    fields(): (keyof T)[];
    groupBy<K>(keySelector: (item: T) => K): Array<{ key: K; items: T[] }>
    sum(mapper: (item: T) => number): number;
    toTable(keys?: (keyof T)[]): string;
    toCSV(keys?: (keyof T)[]): string;
  }
}

Array.prototype.fields = function<T>(this: T[]): (keyof T)[] {
  if (this.length > 0) {
    const item: any = this[0];
    return Object.keys(item) as (keyof T)[];
  }
  return [];
};


Array.prototype.groupBy = function <T, K>(this: T[], keySelector: (item: T) => K): Array<{ key: K; items: T[] }> {
  const groupedList: Array<{ key: K; items: T[] }> = [];

  for (let i = 0; i < this.length; i++) {
    const key = keySelector(this[i]);
    let group = groupedList.find(x => JSON.stringify(x.key) === JSON.stringify(key));

    if (!group) {
      group = {
        key,
        items: []
      };
      groupedList.push(group);
    }

    group.items.push(this[i]);
  }

  return groupedList;
};


Array.prototype.sum = function <T>(this: T[], selector: (item: T) => number): number {
  return this.map(selector).reduce((acc, val) => acc + val, 0);
};

Array.prototype.toTable = function <T>(this: T[], keys?: (keyof T)[]): string {
  if (!this.length) {
    return '<table class="table table-sm table-striped"></table>';
  } else {
    const headers: (keyof T)[] = keys || this.fields();
    const thead = `<thead><tr>${headers.map(h => `<th>${h.toString()}</th>`).join('')}</tr></thead>`;
    const tbody = `<tbody>${this.map(obj =>
      `<tr>${headers.map(h => `<td>${obj[h] ?? ''}</td>`).join('')}</tr>`
    ).join('')}</tbody>`;
    return `<table class="table table-sm table-striped">${thead}${tbody}</table>`;
  }
};

Array.prototype.toCSV = function <T>(this: T[], fields?: (keyof T)[]): string {
  const headers = fields || this.fields();
  const rows = this.map(obj =>
    headers.map(header => `"${(obj[header] ?? '').toString().replace(/"/g, '""')}"`).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

export {}; // 👈 Importante para que `declare global` funcione correctamente
