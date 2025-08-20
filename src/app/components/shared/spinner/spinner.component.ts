import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../services/spinner.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SpinnerComponent {
  isLoading: Observable<boolean>;

  constructor(private spinnerService: SpinnerService) {
    this.isLoading = this.spinnerService.isLoading$;
  }
}
