import { Component, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';
import { finalize, takeUntil } from 'rxjs';
import { Group } from '../../models/groups';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateCircleModalComponent } from '../create-circle-modal/create-circle-modal.component';
import { DeleteConfirmationModalComponent } from '../../../../../common/components/delete-confirmation-modal/delete-confirmation-modal.component';

@Component({
  selector: 'app-circles-table',
  templateUrl: './circles-table.component.html',
  styleUrl: './circles-table.component.scss',
})
export class CirclesTableComponent extends BaseComponent implements OnInit {
  modal = viewChild<CreateCircleModalComponent>('modal');
  groupsData = signal<Group[]>([]);
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(private grpSvc: GroupService, private modalService: NgbModal) {
    super();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isLoading.set(true);
    this.grpSvc
      .getAllGroupsAndCount(1, 10)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.groupsData.set(resp.data.groups.rows);
        },
      });
  }

  open() {
    this.modal()?.openCreateCircleModal();
  }

  setErrorMessage(message: string, ms: number) {
    this.errorMessage.set(message);

    // setTimeout(() => {
    //   this.errorMessage.set();
    // }, ms);
  }
  onDeleteGroup(groupId: number) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Delete Group';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this group? Please take note that all members will get detached.';

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Deleting group with id:', groupId);
          // 🔥 call your delete service here

          this.grpSvc
            .deleteGroup(groupId)
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
                this.setErrorMessage(err.error.message, 2500);
              },
            });
        }
      },
      () => {
        console.log('Delete canceled');
      }
    );
  }

  onEditGroup(groupId: number) {
    const modalRef = this.modalService.open(DeleteConfirmationModalComponent, {
      centered: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.title = 'Delete Group';
    modalRef.componentInstance.message =
      'Are you sure you want to delete this group? Please take note that all members will get detached.';

    modalRef.result.then(
      (result) => {
        if (result) {
          console.log('Deleting group with id:', groupId);
          // 🔥 call your delete service here

          this.grpSvc
            .deleteGroup(groupId)
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
                this.setErrorMessage(err.error.message, 2500);
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
