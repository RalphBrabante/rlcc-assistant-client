import { Component, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from '../../models/groups';
import { GroupService } from '../../../../../common/services/group.service';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { finalize, takeUntil, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignCirlceMembersModalComponent } from '../assign-cirlce-members-modal/assign-cirlce-members-modal.component';

@Component({
  selector: 'app-circle-details-page',
  templateUrl: './circle-details-page.component.html',
  styleUrl: './circle-details-page.component.scss',
})
export class CircleDetailsPageComponent
  extends BaseComponent
  implements OnInit
{
  modal = viewChild<AssignCirlceMembersModalComponent>('modal');
  group = signal<Group | null>(null);
  id = signal<string | null>(null);
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private grpSvc: GroupService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    // Simulate API call

    this.route.paramMap.subscribe((params) => {
      this.id.set(params.get('id')); // e.g. /receipt/123 → "123"
      console.log('Record ID:', this.id());
    });
this.isLoading = true;
    this.fetchData();
  }

  fetchData() {
    this.grpSvc
      .getGroupById(this.id()!)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.group.set(resp.data.group!);
        },
        error: (err) => {
          if (err.error.code === 403) {
            this.router.navigate(['/forbidden']);
          }
        },
      });
  }

  open() {
    this.modal()?.openCreateCircleModal(this.group()!);
  }
}
