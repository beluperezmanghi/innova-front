import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from './modules/shell/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('innova');

  constructor(private router: Router) {
    (window as any).innovaNavigate = (route: string) => {
      this.router.navigateByUrl(route);
    };
  }
}
