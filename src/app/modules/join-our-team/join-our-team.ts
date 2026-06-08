import { Component } from '@angular/core';
import { Footer } from '../shell/footer/footer';

@Component({
  selector: 'app-join-our-team',
  standalone: true,
  imports: [Footer],   // ← ACÁ
  templateUrl: './join-our-team.html',
  styleUrl: './join-our-team.scss'
})
export class JoinOurTeamComponent {}