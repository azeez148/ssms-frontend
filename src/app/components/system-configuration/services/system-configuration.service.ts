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

  backupData(passkey: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/backup`, { passkey }).pipe(
      tap(() => {
        console.log('Backup data service method called');
      })
    );
  }

  restoreData(backupFile: File, passkey: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', backupFile, backupFile.name);
    formData.append('passkey', passkey);


    return this.http.post<any>(`${this.apiUrl}/restore`, formData).pipe(
      tap(() => {
        console.log('Restore data service method called');
      })
    );
  }

  resetData(pass_key: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-db`, { pass_key }).pipe(
      tap(() => {
        console.log('Data reset successfully');
      })
    );
  }

  runSqlFix(pass_key: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/run-sql-fix`, { pass_key }).pipe(
      tap(() => {
        console.log('SQL fix run successfully');
      })
    );
  }
}
