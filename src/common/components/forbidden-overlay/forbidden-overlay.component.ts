import { Component } from '@angular/core';
import { ForbiddenOverlayService } from '../../services/forbidden-overlay.service';

@Component({
  selector: 'app-forbidden-overlay',
  templateUrl: './forbidden-overlay.component.html',
  styleUrl: './forbidden-overlay.component.scss',
})
export class ForbiddenOverlayComponent {
  constructor(public forbiddenOverlaySvc: ForbiddenOverlayService) {}

  dismiss() {
    this.forbiddenOverlaySvc.hide();
  }
}

