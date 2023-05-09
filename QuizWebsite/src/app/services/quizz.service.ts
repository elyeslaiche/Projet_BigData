import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getQuizzes(amount: string, difficulty:string, category:string, Type:string): Observable<any> {
    
    if (amount) {
      var apiUrl = 'https://opentdb.com/api.php?amount=' + amount;
    }else{
      var apiUrl = 'https://opentdb.com/api.php?amount=10';
    }

    if (category) {
      apiUrl += '&category=' + category;
    }

    if (difficulty) {
      apiUrl += '&difficulty=' + difficulty;
    }

    if (Type) {
      apiUrl += '&type=' + Type;
    }
    
    return this.http.get<any>(apiUrl);
  }
}
