import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizzComponent} from './quizz/quizz.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path:'Quizz', component: QuizzComponent},
  {path:'Profile', component: ProfileComponent},
  {path:'**', component: AccueilComponent},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
