import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-tithes-page',
  templateUrl: './tithes-page.component.html',
  styleUrl: './tithes-page.component.scss'
})
export class TithesPageComponent extends BaseComponent implements OnInit {

  roles = signal<string[]>([])

  constructor( private authSvc:AuthService){
    super()
  }

  ngOnInit(): void {
    this.roles.set(this.authSvc.getRoles())
  }
}
