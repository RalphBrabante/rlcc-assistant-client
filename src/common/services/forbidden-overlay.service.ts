import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ForbiddenOverlayState {
  visible: boolean;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForbiddenOverlayService {
  private readonly stateSubject = new BehaviorSubject<ForbiddenOverlayState>({
    visible: false,
    title: 'Access Restricted',
    message: 'You do not have permission to perform this action.',
  });

  readonly state$ = this.stateSubject.asObservable();

  show(message?: string) {
    this.stateSubject.next({
      visible: true,
      title: 'Access Restricted',
      message: message || 'You do not have permission to perform this action.',
    });
  }

  hide() {
    const current = this.stateSubject.getValue();
    if (!current.visible) return;
    this.stateSubject.next({ ...current, visible: false });
  }
}

