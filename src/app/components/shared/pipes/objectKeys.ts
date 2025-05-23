import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): string[] {
    return Object.keys(value);
  }
}
