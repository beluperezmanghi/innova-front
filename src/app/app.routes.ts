import { Routes } from '@angular/router';
import { Home } from './modules/home/home/home';
import { OurApproach } from './modules/home/our-approach/our-approach';
import { Connect } from './modules/home/connect/connect';
import { Purpose } from './modules/home/purpose/purpose';
import { JoinOurTeamComponent } from './modules/join-our-team/join-our-team';

export const routes: Routes = [
    { path: '', component: Home }, 
    { path: 'home', component: Home }, 
    { path: 'purpose', component: Purpose }, 
    { path: 'our-approach', component: OurApproach }, 
    { path: 'connect', component: Connect },
    { path: 'join-our-team', component: JoinOurTeamComponent }, 
    { path: '**', redirectTo: '/home' }
];