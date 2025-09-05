import { Component, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../../common/directives/base-component';
import { ServerConfiguration } from '../../../common/services/server-configuration';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { takeUntil } from 'rxjs';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrl: './settings-page.component.scss',
})
export class SettingsPageComponent extends BaseComponent implements OnInit {
  serverConfigurations = signal<ServerConfiguration[]>([]);

  form!: FormGroup;
  constructor(
    private serverConfSvc: ConfigurationService,
    private fb: FormBuilder
  ) {
    super();

    this.form = this.fb.group({
      maintenanceMode: [false],
    });
  }

  ngOnInit(): void {
    this.fetchData();
  }

  get maintenanceMode() {
    return this.form.get('maintenanceMode') as FormControl;
  }

  fetchData() {
    this.serverConfSvc
      .getServerConfigurations()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (resp) => {
          this.serverConfigurations.set(resp.serverConfigurations);

          this.maintenanceMode.setValue(
            Boolean(
              resp.serverConfigurations.filter(
                (c) => c.name === 'maintenance_mode'
              )[0].value === 'true'
            )
          );
        },
      });
  }
}
