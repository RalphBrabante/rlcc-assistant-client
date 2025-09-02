import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseComponent } from '../../../../../common/directives/base-component';
import { TithesService } from '../../../../../common/services/tithes.service';
import { finalize, takeUntil } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: '[userTitheChart]',
  templateUrl: './user-tithe-chart.component.html',
  styleUrl: './user-tithe-chart.component.scss',
  standalone: false,
})
export class UserTitheChartComponent extends BaseComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective; // ✅ chart ref

  isFetching = signal<boolean>(false);
  year = signal<string>('2025');
  chartDataSet = signal<number[]>([]);

  constructor(private titheSvc: TithesService) {
    super();
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.isFetching.set(true);
    this.titheSvc
      .getAllTitheReportByUserYear(this.year())
      .pipe(
        finalize(() => {
          this.isFetching.set(false);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe({
        next: (resp) => {
          this.chartDataSet.set(resp.data);
          this.chartData.datasets[0].data = this.chartDataSet();
          this.chartData.datasets[0].label = `${this.year()} Graph`;
          this.chart?.update();
        },
      });
  }
  // Chart type
  public chartType: ChartType = 'bar';

  // Chart data
  public chartData: ChartConfiguration['data'] = {
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sept',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        data: this.chartDataSet(),
        label: '2024 Graph',
      },
    ],
  };

  // Chart options
  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          // Tooltip value formatting
          label: (context) => {
            const value = context.raw as number;
            return `₱${value.toLocaleString()}`;
          },
        },
      },
    },
  };
}
