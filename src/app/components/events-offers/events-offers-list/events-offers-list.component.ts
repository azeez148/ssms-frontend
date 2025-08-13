import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { EventsOffersService } from '../services/events-offers.service';
import { EventOffer } from '../data/events-offers-model';
import { EventsOffersDialogComponent } from '../events-offers-dialog/events-offers-dialog.component';

@Component({
  selector: 'app-events-offers-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    FormsModule,
    MatIconModule
  ],
  templateUrl: './events-offers-list.component.html',
  styleUrls: ['./events-offers-list.component.css']
})
export class EventsOffersListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'imageUrl', 'description', 'type', 'startDate', 'endDate', 'rateType', 'rate', 'isActive', 'actions'];
  dataSource = new MatTableDataSource<EventOffer>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private eventsOffersService: EventsOffersService
  ) {}

  ngOnInit(): void {
    this.loadEventOffers();
  }

  loadEventOffers(): void {
    this.eventsOffersService.getEventOffers().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openEventOfferDialog(eventOffer?: EventOffer): void {
    const dialogRef = this.dialog.open(EventsOffersDialogComponent, {
      width: '800px',
      data: { eventOffer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadEventOffers();
      }
    });
  }


  toggleActivation(eventOffer: EventOffer): void {
    const updatedEventOffer = { ...eventOffer, isActive: !eventOffer.isActive };
    this.eventsOffersService.toggleActivateEventOffer(updatedEventOffer).subscribe(() => {
      this.loadEventOffers();
    });
  }

  viewParticipants(id: number): void {
    // This will navigate to the participants page.
    // I'll implement routing for this later.
    console.log('Navigating to participants for event:', id);
  }

  updateWhatsappGroup(eventOffer: EventOffer): void {
    const message = encodeURIComponent(`Check out our new ${eventOffer.type}: *${eventOffer.name}*! ${eventOffer.description}`);
    const url = `https://api.whatsapp.com/send?text=${message}`;
    window.open(url, '_blank');
  }
}
