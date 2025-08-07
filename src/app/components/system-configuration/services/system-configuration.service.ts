import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class SystemConfigurationService {
  private apiUrl = environment.apiUrl + '/system';  // Ensure this is set correctly

  constructor(private http: HttpClient) { }

  backupData(): Observable<any> {
    // Placeholder for backup data logic
    console.log('Backup data service method called');
    // In a real application, you would make an HTTP request to the backend
    // return this.http.post(`${this.baseUrl}/backup`, {});
    return of({ message: 'Backup created successfully' });
  }

  restoreData(backupFile: File): Observable<any> {
    // Placeholder for restore data logic
    console.log('Restore data service method called');
    // In a real application, you would make an HTTP request to the backend
    // const formData = new FormData();
    // formData.append('file', backupFile);
    // return this.http.post(`${this.baseUrl}/restore`, formData);
    return of({ message: 'Data restored successfully' });
  }

  resetData(): Observable<any> {
  console.log('Reset data service method called');

  return this.http.post<any>(`${this.apiUrl}/reset-db`, {}).pipe(
    tap(() => {
      console.log('Data reset successfully');
    })
  );
}
}
