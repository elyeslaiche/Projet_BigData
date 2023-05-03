import { Injectable } from '@angular/core';
import { QuizQuestion } from '../models/quiz.model';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  ListQuizz!: QuizQuestion[];
  openaiApiKey: string = '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';

  async generateQuestion(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci/completions',
      {
        prompt: prompt,
        max_tokens: 1024,
        n: 1,
        stop: null,
        temperature: 0.5,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
      }
    );

    return response.data.choices[0].text.trim();
  }
}
