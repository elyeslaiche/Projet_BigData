import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserLogged } from './login.service';
import {Observable} from "rxjs";
import { User } from './register.service';
// import { Stat } from './user-statistique.service';
import { Md5 } from 'ts-md5';
// import { model_result, resutTosave } from '../components/scan-photo/scan-photo.component';

@Injectable({
  providedIn: 'root'
})
export class ApiQuizzWebsiteService {

  apiUrl="http://localhost:8000";
  headers= new HttpHeaders()
  .set('Content-Type', 'application/json')
  .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  .set('Access-Control-Allow-Origin', "*");

    constructor(private http: HttpClient,
      private router: Router)
{ }

getLoginResponse(identifiant: string, password: string): Observable<UserLogged> {
  return this.http.post<UserLogged>(`${this.apiUrl}/login`, {
    "Nom_utilisateur": identifiant,
    "Mot_de_passe": password
  },{headers: this.headers});
}

// getUserStats(user_id: number): Observable<Stat[]>{
//   return this.http.get<Stat[]>(`${this.apiUrl}/scans?user_id=${user_id}`,
//     {headers: this.headers});
// }

// getModelResult(photo_name:string){

//   return this.http.get<model_result>(`${this.apiUrl}/model/?imageUrl=./img/${photo_name}`)
// }

// postSaveImg(img: FormData){
//   return this.http.post(`${this.apiUrl}/scans/images`, img)
// }

postUserCreated(user: User){
  return this.http.post<UserLogged>(`${this.apiUrl}/utilisateurs/`, user, {headers: this.headers})
}

postUploadFile(blob: Blob, username:string){
  const formData = new FormData();
  formData.append('audio', blob, 'recorded_audio_of_'+username +'_'+Math.floor(Math.random() * (1e9 - 0 + 1)) + 0+'.wav');

  fetch(`${this.apiUrl}/upload`, {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      console.log('Audio file uploaded successfully');
    } else {
      console.error('Error uploading audio file');
    }
  })
  .catch(error => {
    console.error('Error uploading audio file:', error);
  });
}

postRegister(user: User){
  return  this.http.post<UserLogged>(`${this.apiUrl}/utilisateurs/`, user, {headers: this.headers})
}

putResetPwd(pseudo: string, oldPwd: string, newPwd: string){
  return this.http.put(`${this.apiUrl}/utilisateurs/${pseudo}/reset_pwd?pwd=${oldPwd}&new_pwd=${Md5.hashStr(newPwd)}`, 0)
}

// putResultPredictedOnBdd(data : resutTosave){
//   return  this.http.put<resutTosave>(`${this.apiUrl}/stats`, data).subscribe(
//     (response) => {
//       console.log(response);
//     },
//     (error) => console.log(error)
//     ),  {headers: this.headers}
// }
deleteUser(pseudo: string, pwd: string){
  return this.http.delete(`${this.apiUrl}/utilisateurs/${pseudo}?pwd=${pwd}`)
}

}

