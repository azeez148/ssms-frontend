import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { EventsOffersService } from '../services/events-offers.service';
import { Participant } from '../data/events-offers-model';

@Component({
  selector: 'app-event-participants',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  templateUrl: './event-participants.component.html',
  styleUrls: ['./event-participants.component.css']
})
export class EventParticipantsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'mobile', 'isWinner'];
  dataSource = new MatTableDataSource<Participant>([]);
  eventOfferId!: number;
  numberOfWinners: number = 1;

  constructor(
    private route: ActivatedRoute,
    private eventsOffersService: EventsOffersService
  ) {}

  ngOnInit(): void {
    // Reading the id from the route parameters
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.eventOfferId = +id;
        this.loadParticipants();
      }
    });
  }

  loadParticipants(): void {
    this.eventsOffersService.getParticipants(this.eventOfferId).subscribe(data => {
      this.dataSource.data = data;
    });
  }

  selectWinners(): void {
    if (this.numberOfWinners > 0) {
      this.eventsOffersService.selectRandomParticipants(this.eventOfferId, this.numberOfWinners)
        .subscribe(() => {
          // Reload the participants to see the updated winner status
          this.loadParticipants();
        });
    }
  }
}
