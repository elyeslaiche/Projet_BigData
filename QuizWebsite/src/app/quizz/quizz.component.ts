import { Component, /*OnInit*/ } from '@angular/core';
import { QuizService } from '../services/quizz.service';

interface Question {
  text: string;
  answer: boolean | null;
  correctAnswer: boolean;
  commentary: string;
}

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent /*implements OnInit*/ {
  generatedQuestion!: string;
  test!: string;

  constructor(private quizService: QuizService) {}

  questions: Question[] = [
    {
      text: '1+1 = 2',
      answer: null,
      correctAnswer: true,
      commentary: 'c est juste evident'
    },
    {
      text: '2+2 = 2',
      answer: null,
      correctAnswer: false,
      commentary: 'explication plus poussée'
    },
    {
      text: '1+1 = 4',
      answer: null,
      correctAnswer: false,
      commentary: 'c est juste evident'
    },
    {
      text: '2+2 = 4',
      answer: null,
      correctAnswer: true,
      commentary: 'c est juste evident'
    },
    {
      text: '4+1 = 5',
      answer: null,
      correctAnswer: true,
      commentary: 'c est juste evident'
    },
    {
      text: '6+6 = 12',
      answer: null,
      correctAnswer: true,
      commentary: 'c est juste evident'
    },
    {
      text: '1+25 = 2',
      answer: null,
      correctAnswer: false,
      commentary: 'c est juste evident'
    },
    {
      text: '1+15 = 16',
      answer: null,
      correctAnswer: true,
      commentary: 'c est juste evident'
    },
    {
      text: '1+0 = 2',
      answer: null,
      correctAnswer: false,
      commentary: 'c est juste evident'
    },
    {
      text: '1 = 2',
      answer: null,
      correctAnswer: false,
      commentary: 'c est juste evident'
    }
  ];

  /*async ngOnInit(): Promise<void> {
    const prompt = '1+1=?';
    this.generatedQuestion = await this.quizService.generateQuestion(prompt);
    this.test = this.generatedQuestion;
  
    // Extrait les données de la question générée
    const regex = /\("(.+?)", (True|False), "(.+?)"\)/;
    const match = regex.exec(this.generatedQuestion);
  
    if (match !== null) {
      const text = match[1];
      const correctAnswer = match[2] === 'True';
      const commentary = match[3];
  
      // Ajoute la question générée au tableau de questions
      this.questions.push({ text, answer: null, correctAnswer, commentary });
    }
  }*/ 

  currentQuestion: number = 0;
  showAnswers: boolean = false;
  score: number = 0;
  endofquiz: boolean = false;

  checkAnswer(Answer: boolean) {
    if (this.questions[this.currentQuestion].correctAnswer == Answer)
    {
      this.questions[this.currentQuestion].answer = true;
      this.score = this.score + 1;
    }
    else
    {
      this.questions[this.currentQuestion].answer = false;
    }
    this.showAnswers = true;
  }

  nextQuestion() {
    this.showAnswers = false;
    this.questions[this.currentQuestion].answer = null;
    if (this.currentQuestion < this.questions.length - 1) {
      this.currentQuestion++;
    } 
    else {
      this.endofquiz = true;
    }
  }

  restartquiz(){
    this.score = 0;
    this.currentQuestion = 0;
    this.endofquiz = false;
  }
}