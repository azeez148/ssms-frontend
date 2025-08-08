import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { EventOffer, Participant } from '../data/events-offers-model';
import { environment } from '../../../../environment';
import { start } from 'repl';

@Injectable({
  providedIn: 'root'
})
export class EventsOffersService {
  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}

  getEventOffers(): Observable<EventOffer[]> {
  return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
    map((offers) =>
      offers.map((offer) => ({
        id: offer.id,
        name: offer.name,
        description: offer.description,
        type: offer.type,
        isActive: offer.is_active,
        rateType: offer.rate_type,
        rate: offer.rate,
        startDate: offer.start_date,
        endDate: offer.end_date,
        products: offer.products || [],
        categories: offer.categories || []
      }))
    )
  );
}


  addEventOffer(eventOffer: any): Observable<EventOffer> {
    return this.http.post<EventOffer>(`${this.apiUrl}/create`, eventOffer);
  }

  updateEventOffer(eventOffer: any): Observable<EventOffer> {
    const payload = {
      offer_update: eventOffer
    };
    return this.http.post<EventOffer>(`${this.apiUrl}/update/${eventOffer.id}`, payload);
  }

    deActivateEventOffer(eventOffer: EventOffer): Observable<any> {
    const payload = {
       offer_id: eventOffer.id,
    };
    return this.http.post<EventOffer>(`${this.apiUrl}/deactivate/${eventOffer.id}`, payload);
  }

  deleteEventOffer(id: number): Observable<any> {
    const payload = {
      offer_id: id
    };
    return this.http.post<EventOffer>(`${this.apiUrl}/deactivate`, payload);
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
