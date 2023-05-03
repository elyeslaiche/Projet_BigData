import  { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {UserLogged} from "./login.service";
import { ApiQuizzWebsiteService } from './api-quizz-website.service';

@Injectable({
providedIn: 'root'
})
export class RegisterService {
  user!: UserLogged;
  
  constructor(private http: HttpClient,
    private apiService:ApiQuizzWebsiteService) {}

  register(user: User){
    this.apiService.postRegister(user).subscribe({
        next: (data: any) => {
            this.user = data;
        },
        error: (error: any) => {
            console.error('There was an error!', error);
        }
    });
}
}


export class User {
constructor(
  public pseudo: string,
  public email: string,
  public password: string,
  public last_updated: string,
) {}
}
