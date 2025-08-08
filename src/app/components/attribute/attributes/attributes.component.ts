import { Component, OnInit } from '@angular/core';
import { AttributeValue, Attribute } from '../data/attribute-model';
import { MatDialog } from '@angular/material/dialog';
import { AttributeService } from '../services/attribute.service';
import { AttributeDialogComponent } from '../attribute-dialog/attribute-dialog.component';
import { AssignAttributeDialogComponent } from '../assign-attribute-dialog/assign-attribute-dialog.component';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-attributes',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  attributes: Attribute[] = [];
  attributeValues: AttributeValue[] = [];
  p1: number = 1;
  p2: number = 1;

  constructor(public dialog: MatDialog, private attributeService: AttributeService) {}

  ngOnInit() {
    this.attributeService.getAttributes().subscribe(attributes => {
      this.attributes = attributes;
    });
    // This needs to be implemented in the service
    // this.attributeService.getAttributeValues().subscribe(values => {
    //   this.attributeValues = values;
    // });
  }

  createAttribute(): void {
    const dialogRef = this.dialog.open(AttributeDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attributeService.addAttribute(result).subscribe(newAttribute => {
          this.ngOnInit();
        });
      }
    });
  }

  assignAttributeValue(): void {
    const dialogRef = this.dialog.open(AssignAttributeDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // This needs to be implemented in the service
        // this.attributeService.assignAttributeValue(result).subscribe(() => {
        //   this.ngOnInit();
        // });
      }
    });
  }
}
