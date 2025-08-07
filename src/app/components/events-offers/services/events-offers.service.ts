import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { EventOffer, Participant } from '../data/events-offers-model';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root'
})
export class EventsOffersService {
  private apiUrl = environment.apiUrl + '/events-offers';

  constructor(private http: HttpClient) {}

  getEventOffers(): Observable<EventOffer[]> {
    return this.http.get<EventOffer[]>(`${this.apiUrl}/all`);
  }

  addEventOffer(eventOffer: EventOffer): Observable<EventOffer> {
    return this.http.post<EventOffer>(`${this.apiUrl}/add`, eventOffer);
  }

  updateEventOffer(eventOffer: EventOffer): Observable<EventOffer> {
    return this.http.post<EventOffer>(`${this.apiUrl}/update`, eventOffer);
  }

  deleteEventOffer(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }

  getParticipants(eventOfferId: number): Observable<Participant[]> {
    return this.http.get<Participant[]>(`${this.apiUrl}/${eventOfferId}/participants`);
  }

  selectRandomParticipants(eventOfferId: number, count: number): Observable<Participant[]> {
    return this.http.post<Participant[]>(`${this.apiUrl}/${eventOfferId}/select-random-participants`, { count });
  }

  updateWhatsappGroup(eventOfferId: number, message: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${eventOfferId}/update-whatsapp-group`, { message });
  }
}
