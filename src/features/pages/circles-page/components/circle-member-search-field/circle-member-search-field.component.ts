import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { GroupService } from '../../../../../common/services/group.service';

@Component({
  selector: 'app-circle-member-search-field',
  templateUrl: './circle-member-search-field.component.html',
  styleUrl: './circle-member-search-field.component.scss',
})
export class CircleMemberSearchFieldComponent
  extends BaseComponent
  implements OnInit
{
  constructor(private grpSvc:GroupService) {
    super();
  }

  ngOnInit(): void {


  }


}
