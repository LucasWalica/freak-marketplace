import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {
  transform(items: any[], searchText: string, field: string = ''): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      if (field) {
        // Search in specific field
        return item[field] && item[field].toString().toLowerCase().includes(searchText);
      } else {
        // Search in all string fields
        return Object.keys(item).some(key => {
          const value = item[key];
          return value && typeof value === 'string' && 
                 value.toLowerCase().includes(searchText);
        });
      }
    });
  }
}
