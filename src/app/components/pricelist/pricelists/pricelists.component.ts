import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Pricelist } from '../data/pricelist-model';
import { PricelistDialogComponent } from '../pricelist-dialog/pricelist-dialog.component';
import { PricelistService } from '../service/pricelist.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pricelists',
   imports: [MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './pricelists.component.html',
  styleUrl: './pricelists.component.css'
})
export class PricelistsComponent {
  displayedColumns: string[] = ['id', 'name', 'description'];
  dataSource = new MatTableDataSource<Pricelist>([]);

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private pricelistService: PricelistService) {}

  ngOnInit() {
    this.pricelistService.getPricelists().subscribe(pricelists => {
      this.dataSource.data = pricelists;
      this.dataSource.paginator = this.paginator;
    });
  }

  createPricelist(): void {
    const dialogRef = this.dialog.open(PricelistDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pricelistService.addPricelist(result).subscribe(newPricelist => {
          // this.dataSource.data = [...this.dataSource.data, newPricelist];
          this.dataSource.paginator = this.paginator; // Reassign paginator to trigger change detection
        });
      }
    });
  }
}