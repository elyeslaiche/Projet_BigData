import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizzComponent} from './quizz/quizz.component';
import { AccueilComponent } from './accueil/accueil.component';

const routes: Routes = [
  {path:'Quizz', component: QuizzComponent},
  {path:'**', component: AccueilComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
