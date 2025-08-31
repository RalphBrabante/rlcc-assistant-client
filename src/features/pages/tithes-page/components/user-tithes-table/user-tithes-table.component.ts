import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { Tithe } from '../../models/tithe';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-tithes-table',
  templateUrl: './user-tithes-table.component.html',
  styleUrl: './user-tithes-table.component.scss',
})
export class UserTithesTableComponent extends BaseComponent implements OnInit {
  tithes = signal<Tithe[]>([]);
  isFetching = signal<boolean>(false);

  constructor(private titheSvc: TithesService) {
    super();
  }

  ngOnInit(): void {
    this.isFetching.set(true);
    this.titheSvc
      .getUserTithes()
      .pipe(
        finalize(() => {
          this.isFetching.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.tithes.set(resp.tithes.rows);
        },
      });
  }
}
