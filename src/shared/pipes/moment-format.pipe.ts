import { Pipe, PipeTransform } from '@angular/core';
import * as moment from "moment";


@Pipe({name: 'momentFormat'})
export class MomentFormatPipe implements PipeTransform {
  transform(date, format='YYYY-MM'): string {
    let to_return = moment(date).format(format);
    if (to_return === 'Invalid date') {
      return '';
    } else {
      return to_return;
    }

  }
}