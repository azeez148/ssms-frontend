import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Category } from '../data/category-model';
import { MatButtonModule } from '@angular/material/button';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-categories',
  imports: [MatTableModule, MatPaginator, MatButtonModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  displayedColumns: string[] = ['id', 'name', 'description'];
  dataSource = new MatTableDataSource<Category>([]);

  @ViewChild(MatPaginator)
  paginator: MatPaginator = new MatPaginator;

  constructor(public dialog: MatDialog, private categoryService: CategoryService) {}


  ngOnInit() {
    this.categoryService.getCategories().subscribe(categories => {
      this.dataSource.data = categories;
      this.dataSource.paginator = this.paginator;
    });
  }

  createCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '250px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.categoryService.addCategory(result).subscribe(newCategory => {
          this.dataSource.paginator = this.paginator; // Reassign paginator to trigger change detection          console.log(this.dataSource);
        });
      }
    });
  }
}
