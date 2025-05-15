import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AttributeValue, Attribute } from '../data/attribute-model';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AttributeService } from '../services/attribute.service';
import { AttributeDialogComponent } from '../attribute-dialog/attribute-dialog.component';
import { AssignAttributeDialogComponent } from '../assign-attribute-dialog/assign-attribute-dialog.component';

@Component({
  selector: 'app-attributes',
  imports: [MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './attributes.component.html',
  styleUrl: './attributes.component.css'
})
export class AttributesComponent {
  displayedColumns: string[] = ['id', 'name', 'description'];
  displayedColumnsAssignedValues: string[] = ['attributeId', 'value'];

  attributeDataSource = new MatTableDataSource<Attribute>([]);
  attributeValueDataSource = new MatTableDataSource<AttributeValue>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;


  constructor(public dialog: MatDialog, private attributeService: AttributeService) {}
  ngOnInit() {
    this.attributeService.getAttributes().subscribe(attributes => {
      this.attributeDataSource.data = attributes;
      this.attributeDataSource.paginator = this.paginator;
    });
  }

  createAttribute(): void {
    const dialogRef = this.dialog.open(AttributeDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.attributeService.addAttribute(result).subscribe(newAttribute => {
          // this.dataSource.data = [...this.dataSource.data, newAttribute];
          this.attributeDataSource.paginator = this.paginator; // Reassign paginator to trigger change detection
        });
      }
    });
  }
// Method for "Assign Attribute Value" Button
assignAttributeValue(): void {
  const dialogRef = this.dialog.open(AssignAttributeDialogComponent, {
    width: '300px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Save the new assigned attribute value to the model
      const { attributeId, value } = result;
      const newAssignedValue = {
        id: this.attributeValueDataSource.data.length + 1, // Assuming ID is auto-incremented
        attributeId: attributeId,
        value: value
      };

      // Add the assigned value to the respective attribute (you can update your model here)
      this.attributeValueDataSource.paginator = this.paginator;
    }
  });
}
}
