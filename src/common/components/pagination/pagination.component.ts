import {
  Component,
  computed,
  input,
  OnChanges,
  output,
  signal,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent implements OnChanges {
  currentPage = signal(1);
  pageSize = 10; // default
  pageSizes = [5, 10, 25, 50];
  data = input.required<any[]>();
  dataCount = input.required<number>();
  changeEmitter = output<boolean>();

  totalPages = computed(() => Math.ceil(this.dataCount() / this.pageSize));

  ngOnChanges(changes: SimpleChanges): void {
    
  this.totalPages = computed(() => Math.ceil(this.dataCount() / this.pageSize));
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((v) => v + 1);
          this.changeEmitter.emit(true);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((v) => v - 1);
          this.changeEmitter.emit(true);
    }
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.changeEmitter.emit(true);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  }

  changePageSize() {
    this.currentPage.set(1); // reset to first page
    this.changeEmitter.emit(true);
  }
}
