import { Pipe, PipeTransform } from '@angular/core';


@Pipe({name: 'starsView'})
export class StarsViewPipe implements PipeTransform {

  transform(stars: number = 0) : number {
    return stars - 1;
  }
}