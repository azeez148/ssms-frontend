import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
        categories: offer.categories || [],
        imageUrl: offer.image_url || ''
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

  toggleActivateEventOffer(eventOffer: EventOffer): Observable<EventOffer> {
    const params = new HttpParams()
      .set('offer_id', eventOffer.id)
      .set('is_active', eventOffer.isActive);
    return this.http.post<EventOffer>(`${this.apiUrl}/set_active_status`, null, { params });
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

  uploadEventOfferImage(eventOfferId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image, image.name);
    return this.http.post<any>(`${this.apiUrl}/upload-image?event_offer_id=${eventOfferId}`, formData);
  }
}
