import { Component, OnInit, signal } from '@angular/core';
import { Tithe } from '../../models/tithe';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tithe-single-page',
  templateUrl: './tithe-single-page.component.html',
  styleUrl: './tithe-single-page.component.scss',
})
export class TitheSinglePageComponent extends BaseComponent implements OnInit {
  isLoading = true;
  tithe = signal<Tithe | undefined>(undefined);
  recordId!: string;

  constructor(
    private titheSvc: TithesService,
    private route: ActivatedRoute,
    private router: Router) {
    super();
  }

  ngOnInit() {
    // Simulate API call

    this.route.paramMap.subscribe((params) => {
      this.recordId = params.get('id')!; // e.g. /receipt/123 → "123"
      console.log('Record ID:', this.recordId);
    });

    this.isLoading = true;
    this.titheSvc
      .getTitheById(this.recordId)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.tithe.set(resp.tithe);
        },
        error: (err) => {
          if (err.error.status === 403) {
            this.router.navigate(['/forbidden'])
          }
        },
      });
  }

  printPage() {
    window.print();
  }
}
