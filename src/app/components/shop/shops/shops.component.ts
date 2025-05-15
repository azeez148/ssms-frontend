import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ShopDialogComponent } from '../shop-dialog/shop-dialog.component';
import { Shop, SHOP_DATA } from '../data/shop-model';
import { ShopService } from '../services/shop.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shops',
  imports: [MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './shops.component.html',
  styleUrl: './shops.component.css'
})
export class ShopsComponent {
  displayedColumns: string[] = ['id', 'name', 'address', 'mobileNumber', 'email'];
  dataSource = new MatTableDataSource<Shop>();

  ngOnInit() {
    this.shopService.getShops().subscribe(shops => {
      this.dataSource.data = shops;
      this.dataSource.paginator = this.paginator;
    });
  }

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(public dialog: MatDialog, private shopService: ShopService) {}


  createShop(): void {
    const dialogRef = this.dialog.open(ShopDialogComponent, {
      width: '650px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shopService.addShop(result).subscribe(newShop => {
          this.dataSource.data = [...this.dataSource.data, newShop];
          this.dataSource.paginator = this.paginator; // Reassign paginator to trigger change detection
        });
      }
    });
  }
}
