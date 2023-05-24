import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {QuizzComponent} from './quizz/quizz.component';
import { AccueilComponent } from './accueil/accueil.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './Connection/login/login.component';
import { RegisterComponent } from './Connection/register/register.component';
import { BaselineComponent } from './baseline/baseline.component';

const routes: Routes = [
  {path: '', component:BaselineComponent, children:[
    {path:'Quizz', component: QuizzComponent},
    {path:'Profile', component: ProfileComponent},
    {path:'Login', component: LoginComponent},
    {path:'Register', component: RegisterComponent},
    {path:'home', component: AccueilComponent},
    {path:'', component: AccueilComponent},
  ]}  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
