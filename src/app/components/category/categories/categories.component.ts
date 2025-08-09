import { Component, OnInit } from '@angular/core';
import { Category } from '../data/category-model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  allCategories: Category[] = [];
  p: number = 1;

  constructor(public dialog: MatDialog, private categoryService: CategoryService) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.allCategories = categories;
      this.categories = categories;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.categories = this.allCategories.filter(category =>
      category.name.toLowerCase().includes(filterValue) ||
      category.description.toLowerCase().includes(filterValue)
    );
  }

  createCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.addCategory(result).subscribe(newCategory => {
          this.ngOnInit(); // Refresh the list
        });
      }
    });
  }
}
