import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemConfigurationService } from './services/system-configuration.service';

@Component({
  selector: 'app-system-configuration',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './system-configuration.component.html',
  styleUrl: './system-configuration.component.css'
})
export class SystemConfigurationComponent {

  constructor(private systemConfigurationService: SystemConfigurationService) { }

  backupData(): void {
    console.log('Backup data method called');
    alert('Backup data functionality is not yet implemented.');
  }

  restoreData(): void {
    console.log('Restore data method called');
    alert('Restore data functionality is not yet implemented.');
  }

  resetData(): void {
    console.log('Reset data method called');
    // alert('Reset data functionality is not yet implemented.');
    if (confirm('Are you sure you want to reset the data? This action cannot be undone.')) {
      // Call the reset data service method here
      console.log('Data reset confirmed');
      this.systemConfigurationService.resetData()
    }
  }
}
