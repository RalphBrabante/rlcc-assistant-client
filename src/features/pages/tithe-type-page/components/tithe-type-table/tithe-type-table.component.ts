import { Component, OnInit, signal } from '@angular/core';
import { TitheTypeService } from '../../../../../common/services/tithe-type.service';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { takeUntil } from 'rxjs';
import { TitheType } from '../../models/tithe-type';
import { AuthService } from '../../../../../common/services/auth.service';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tithe-type-table',
  templateUrl: './tithe-type-table.component.html',
  styleUrl: './tithe-type-table.component.scss',
})
export class TitheTypeTableComponent extends BaseComponent implements OnInit {
  titheTypes = signal<TitheType[]>([]);
  errorMessage = signal<string>('');

  constructor(
    private titheTypeSvc: TitheTypeService,
    private authSvc: AuthService,
    private modalService: NgbModal
  ) {
    super();
  }

  isAdmin(): boolean {
    return this.authSvc.isAdmin();
  }
  isSuperUser(): boolean {
    return this.authSvc.isSuperUser();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.titheTypeSvc
      .getAllTitheType()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.titheTypes.set(resp.data.titheTypes.rows);
        },
      });
  }

  /*
   *
   * @param message  -- error message
   * @param ms - delelay until it will be removedF
   */
  setErrorMessage(message: string, ms: number) {
    this.errorMessage.set(message);

    // setTimeout(() => {
    //   this.errorMessage.set('');
    // }, ms);
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

          this.titheTypeSvc
            .deleteTitheType(titheId)
            .pipe(takeUntil(this.unsubscribe))
            .subscribe({
              next: (resp) => {
                if (resp.data.id) {
                  console.log(close);
                  modalRef.close();
                  this.fetchData();
                }
              },
              error: (err) => {
                this.setErrorMessage(err.error.message, 2500)
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
