import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogged } from './login.service';
import { Observable } from "rxjs";
import { User } from './register.service';
// import { Stat } from './user-statistique.service';
import { Md5 } from 'ts-md5';
import { Game } from '../quizz/quizz.component';
// import { model_result, resutTosave } from '../components/scan-photo/scan-photo.component';

@Injectable({
  providedIn: 'root'
})
export class ApiQuizzWebsiteService {

  apiUrl = "http://apideploymenteuyaro.azurewebsites.net";
  headers = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
    .set('Access-Control-Allow-Origin', "*");

  constructor(private http: HttpClient,
    private router: Router) { }

  getLoginResponse(identifiant: string, password: string): Observable<UserLogged> {
    return this.http.post<UserLogged>(`${this.apiUrl}/login`, {
      "Nom_utilisateur": identifiant,
      "Mot_de_passe": password
    }, { headers: this.headers });
  }

  getScores(user_id: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stat?user_id=${user_id}`,
      { headers: this.headers });
  }

  postUserCreated(user: User) {
    return this.http.post<UserLogged>(`${this.apiUrl}/utilisateurs/`, user, { headers: this.headers })
  }

  getCategories(): Observable<string[]> {
    return this.http.post<string[]>(`${this.apiUrl}/categories/`, { headers: this.headers });
  }

  getNumberOfGamePlayed(user_id: number): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/nbgamesperdiff?user_id=${user_id}`, { headers: this.headers });
  }

  getNbGamePerCat(user_id:number): Observable<any[]> {
    return this.http.post<any[]>(`${this.apiUrl}/nbgamepercat?user_id=${user_id}`, { headers: this.headers });
  }


  sendScoreToDatabase(game: Game, score: number) {
    let body = {
      "ID_utilisateur": game.ID_Utilisateur,
      "ID_Categorie": game.ID_Category != null ? game.ID_Category : 1,
      "Difficulte": game.Difficulte != null ? game.Difficulte : "No difficulty selected",
      "Nombre_questions": game.Nombre_questions,
      "Type_questions": game.Type_questions,
      "Date_partie": "2023-05-22",
      "Pourcentage_reussite": score
    };

    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };

    return this.http.post(`${this.apiUrl}/game`, body, { headers });
  }

  postUploadFile(blob: Blob, username: string) {
    const formData = new FormData();
    formData.append('audio', blob, 'recorded_audio_of_' + username + '_' + Math.floor(Math.random() * (1e9 - 0 + 1)) + 0 + '.wav');

    fetch(`${this.apiUrl}/upload`, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        if (response.ok) {
        } else {
          console.error('Error uploading audio file');
        }
      })
      .catch(error => {
        console.error('Error uploading audio file:', error);
      });
  }

  predictAudio(file: Blob): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');

    return this.http.post('http://apideploymenteuyaro.azurewebsites.net/predict/', formData, { headers: headers });
  }

  postRegister(user: User) {
    return this.http.post<UserLogged>(`${this.apiUrl}/utilisateurs/`, user, { headers: this.headers })
  }

  putResetPwd(pseudo: string, oldPwd: string, newPwd: string) {
    return this.http.put(`${this.apiUrl}/utilisateurs/${pseudo}/reset_pwd?pwd=${oldPwd}&new_pwd=${Md5.hashStr(newPwd)}`, 0)
  }

  deleteUser(pseudo: string, pwd: string) {
    return this.http.delete(`${this.apiUrl}/utilisateurs/${pseudo}?pwd=${pwd}`)
  }

}

