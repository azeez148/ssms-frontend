import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./components/shared/footer/footer.component";
import { SpinnerComponent } from './components/shared/spinner/spinner.component';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, SpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ssms-front-end';
}
