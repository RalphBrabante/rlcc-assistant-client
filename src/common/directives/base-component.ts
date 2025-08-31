import { fromEvent, map, merge, Observable, Observer, Subject } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

@Directive()
export abstract class BaseComponent implements OnDestroy {
  online$: Observable<boolean>;
  unsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    this.online$ = merge(
      fromEvent(window, 'offline').pipe(map(() => false)),
      fromEvent(window, 'online').pipe(map(() => true)),
      new Observable((sub: Observer<boolean>) => {
        sub.next(navigator.onLine);
        sub.complete();
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
