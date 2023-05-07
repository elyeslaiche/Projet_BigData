import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //  apiUrl="http://localhost:8000/users";
   user!: UserLogged;
   isConnected = false;

  // headers = new HttpHeaders()
  //   .set('Content-Type', 'application/json')
  //   .set('Access-Control-Allow-Origin', '*');

  constructor(private http: HttpClient,
              private router: Router)
 { }


  // getLoginResponse(identifiant: string): Observable<UserLogged> {
  //   return this.http.get<UserLogged>(`${this.apiUrl}/${identifiant}`,
  //     {headers: this.headers});
  // }

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
  ) { }
}
