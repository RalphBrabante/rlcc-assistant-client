import { Component, OnInit, signal, viewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { Tithe } from '../../models/tithe';
import { finalize, takeUntil } from 'rxjs';
import { PaginationComponent } from '../../../../../common/components/pagination/pagination.component';
import { AddNewTitheModalComponent } from '../add-new-tithe-modal/add-new-tithe-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tithes-table',
  templateUrl: './tithes-table.component.html',
  styleUrl: './tithes-table.component.scss',
})
export class TithesTableComponent extends BaseComponent implements OnInit {
  tithes = signal<Tithe[]>([]);
  isFetching = signal<boolean>(false);
  pagination = viewChild<PaginationComponent>('pagination');
  modal = viewChild<AddNewTitheModalComponent>('modal');
  dataCount = signal<number>(0);
  searchTerm: string = '';

  constructor(private titheSvc: TithesService, private modalService: NgbModal, private router:Router) {
    super();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  openPopup(id: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/tithes', id])
    );
    window.open(url, '_blank', 'width=800,height=600');
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

  onSearch() {}

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

  open() {
    this.modal()?.openAddTitheModal();
  }
}
