import { Component, OnInit, signal, viewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { Tithe } from '../../models/tithe';
import { finalize, takeUntil } from 'rxjs';
import { PaginationComponent } from '../../../../../common/components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-user-tithes-table',
  templateUrl: './user-tithes-table.component.html',
  styleUrl: './user-tithes-table.component.scss',
})
export class UserTithesTableComponent extends BaseComponent implements OnInit {
  tithes = signal<Tithe[]>([]);
  isFetching = signal<boolean>(false);
  pagination = viewChild<PaginationComponent>('pagination');
  dataCount = signal<number>(0);

  constructor(private titheSvc: TithesService, private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isFetching.set(true);
    this.titheSvc
      .getUserTithes(
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

  onDeleteTithes(titheId: number) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Delete Tithe';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this tithe?';

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Deleting tithe with id:', titheId);
          // 🔥 call your delete service here

          this.titheSvc
            .deleteTithe(titheId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe({
              next: (resp) => {
                if (resp.id) {
                  console.log(close);
                  modalRef.close();
                  this.fetchData();
                }
              },
            });
        }
      },
      () => {
        console.log('Delete canceled');
      }
    );
  }
}
