import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

   user!: UserLogged;
   isConnected = false;

  constructor(private http: HttpClient,
              private router: Router)
 { }

  public setUserLogged(value: UserLogged){
    localStorage.setItem('user', JSON.stringify(value));
  }

  public resetUserLogged(){
    localStorage.removeItem("user");
  }

  public getUserLogged(): UserLogged{
    return JSON.parse(localStorage.getItem("user")?? '');
  }

  LogOut() {
    this.isConnected = false;
    this.resetUserLogged();
    this.router.navigate([""]).then(() => {
      window.location.reload();
    });
  }
}


export class UserLogged {
  constructor(
    public ID_utilisateur: number,
    public Nom_utilisateur: string,
    public Email: string,
    public Mot_de_passe: string,
    public Date_inscription: string,
    public age: number,
    public pays:string,
  ) { }
}
