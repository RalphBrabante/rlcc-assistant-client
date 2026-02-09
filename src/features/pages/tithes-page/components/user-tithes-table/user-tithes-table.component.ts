import { Component, OnInit, signal, viewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { Tithe } from '../../models/tithe';
import { finalize, takeUntil } from 'rxjs';
import { PaginationComponent } from '../../../../../common/components/pagination/pagination.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  filterError = signal<string>('');
  filtersForm: FormGroup;

  constructor(
    private titheSvc: TithesService,
    private modalService: NgbModal,
    private router: Router,
    private fb: FormBuilder
  ) {
    super();
    this.filtersForm = this.fb.group({
      name: [''],
      status: ['active'],
      encodedBy: [''],
      createdFrom: [''],
      createdTo: [''],
      dateReceivedFrom: [''],
      dateReceivedTo: [''],
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    const createdFrom = String(this.filtersForm.value.createdFrom || '').trim();
    const createdTo = String(this.filtersForm.value.createdTo || '').trim();
    const dateReceivedFrom = String(this.filtersForm.value.dateReceivedFrom || '').trim();
    const dateReceivedTo = String(this.filtersForm.value.dateReceivedTo || '').trim();
    if (createdFrom && createdTo && new Date(createdFrom) > new Date(createdTo)) {
      this.filterError.set('Created From must be on or before Created To.');
      return;
    }
    if (
      dateReceivedFrom &&
      dateReceivedTo &&
      new Date(dateReceivedFrom) > new Date(dateReceivedTo)
    ) {
      this.filterError.set('Date Received From must be on or before Date Received To.');
      return;
    }

    this.filterError.set('');
    this.isFetching.set(true);
    this.titheSvc
      .getUserTithes({
        limit: this.pagination()?.pageSize || 10,
        page: this.pagination()?.currentPage() || 1,
        name: String(this.filtersForm.value.name || '').trim() || undefined,
        status: this.filtersForm.value.status || 'active',
        encodedBy: String(this.filtersForm.value.encodedBy || '').trim() || undefined,
        createdFrom: createdFrom || undefined,
        createdTo: createdTo || undefined,
        dateReceivedFrom: dateReceivedFrom || undefined,
        dateReceivedTo: dateReceivedTo || undefined,
      })
      .pipe(
        finalize(() => {
          this.isFetching.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.tithes.set(resp.data.tithes.rows);
          this.dataCount.set(resp.data.tithes.count);
        },
      });
  }

  applyFilters() {
    this.pagination()?.currentPage.set(1);
    this.fetchData();
  }

  resetFilters() {
    this.filtersForm.reset({
      name: '',
      status: 'active',
      encodedBy: '',
      createdFrom: '',
      createdTo: '',
      dateReceivedFrom: '',
      dateReceivedTo: '',
    });
    this.pagination()?.currentPage.set(1);
    this.filterError.set('');
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
                if (resp.data.id) {
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
