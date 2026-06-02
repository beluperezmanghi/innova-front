import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './modules/shell/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('innova');
}
