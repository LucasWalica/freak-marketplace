import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, completeWords: boolean = false, suffix: string = '...'): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;

    if (completeWords) {
      limit = value.substring(0, limit).lastIndexOf(' ');
      if (limit === -1) limit = value.length;
    }

    return value.substring(0, limit) + suffix;
  }
}
