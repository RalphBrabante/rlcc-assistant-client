import { Component, OnInit, signal, viewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { Tithe } from '../../models/tithe';
import { finalize, takeUntil } from 'rxjs';
import { PaginationComponent } from '../../../../../common/components/pagination/pagination.component';

@Component({
  selector: 'app-tithes-table',
  templateUrl: './tithes-table.component.html',
  styleUrl: './tithes-table.component.scss',
})
export class TithesTableComponent extends BaseComponent implements OnInit {
  tithes = signal<Tithe[]>([]);
  isFetching = signal<boolean>(false);
  pagination = viewChild<PaginationComponent>('pagination');
  dataCount = signal<number>(0);
  searchTerm: string = '';

  constructor(private titheSvc: TithesService) {
    super();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  onSearch() {
  
 
  }

  fetchData() {
    this.isFetching.set(true);
    this.titheSvc
      .getAllTithes(
        this.pagination()!.pageSize.toString(),
        this.pagination()!.currentPage().toString()
      )
      .pipe(
        finalize(() => {
          this.isFetching.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.tithes.set(resp.tithes.rows);
          this.dataCount.set(resp.tithes.count);
        },
      });
  }
}
