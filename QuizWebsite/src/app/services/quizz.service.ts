import { Injectable } from '@angular/core';
import { QuizQuestion } from '../models/quiz.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://opentdb.com/api.php';

  constructor(private http: HttpClient) { }

  getQuizzes(): Observable<any> {
    const options = {
      params: {
        amount: '10', // Number of quizzes to fetch
        category: '25', // Category of quizzes (Computers)
        type: 'multiple' // Type of quizzes (multiple choice)
      }
    };
    return this.http.get<any>(this.apiUrl, options);
  }
}
