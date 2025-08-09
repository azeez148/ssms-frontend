import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShopDialogComponent } from '../shop-dialog/shop-dialog.component';
import { Shop } from '../data/shop-model';
import { ShopService } from '../services/shop.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.css']
})
export class ShopsComponent implements OnInit {
  shops: Shop[] = [];
  p: number = 1;

  constructor(public dialog: MatDialog, private shopService: ShopService) {}

  ngOnInit() {
    this.shopService.getShops().subscribe(shops => {
      this.shops = shops;
    });
  }

  createShop(): void {
    const dialogRef = this.dialog.open(ShopDialogComponent, {
      width: '650px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shopService.addShop(result).subscribe(newShop => {
          this.ngOnInit();
        });
      }
    });
  }
}
