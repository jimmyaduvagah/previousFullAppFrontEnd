import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Pipe({name: 'wordCount'})
export class WordCountPipe implements PipeTransform {


  transform(content: string = ''): number {
    return Observable.create((subscriber) => {

      content = content.replace(/<(?:.|\n)*?>/gm, '').replace(/\s/g, " ").replace(/\s/g, " ").replace(/![a-zA-Z0-9]/g, ' ');
      let words = content.split(' ');
      let wordCount = 0;
      for (let i in words) {
        let word = words[i];
        if (word.replace(/\s/g, "").length > 0) {
          wordCount++;
        }
      }

      subscriber.next(wordCount);
      subscriber.complete();

      return () => {
        content = null;
        words = null;
        //cleanup
      };
    });
  }
}