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
    const passkey = prompt('Enter passkey to backup data:');
    if (passkey) {
      this.systemConfigurationService.backupData(passkey).subscribe({
        next: (response) => alert(response.message),
        error: (error) => alert(`Error: ${error.message}`),
      });
    }
  }

  restoreData(): void {
    const passkey = prompt('Enter passkey to restore data:');
    if (passkey) {
      // TODO: Implement file selection
      alert('File selection is not yet implemented.');
      // const fileInput = document.createElement('input');
      // fileInput.type = 'file';
      // fileInput.onchange = (e: any) => {
      //   const file = e.target.files[0];
      //   this.systemConfigurationService.restoreData(file, passkey).subscribe({
      //     next: (response) => alert(response.message),
      //     error: (error) => alert(`Error: ${error.message}`),
      //   });
      // };
      // fileInput.click();
    }
  }

  resetData(): void {
    const passkey = prompt('Enter passkey to reset data:');
    if (passkey) {
      if (confirm('Are you sure you want to reset the data? This action cannot be undone.')) {
        this.systemConfigurationService.resetData(passkey).subscribe({
          next: (response) => {
            console.log(response);
            alert(response.message);
          },
          error: (error) => {
            console.error(error);
            alert(`Error: ${error.message}`);
          },
        });
      }
    }
  }
}
