import { Component, ElementRef, ViewChild } from '@angular/core';
import { QuizService } from '../services/quizz.service';
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService, UserLogged } from '../services/login.service';

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css']
})
export class QuizzComponent /*implements OnInit*/ {

  wizardForm!: FormGroup;

  title = 'micRecorder';
  //Lets declare Record OBJ
  record: any;
  //Will use this flag for toggeling recording
  recordingStates: boolean[] = [];
  //URL of Blob
  error: any;

  Wizard: boolean = true;
  predictionValue!: string;
  donePrediction: boolean = false;
  amount!: string;
  category!: string;
  difficulty!: string;
  Type !: string;
  user !: UserLogged;
  game !: Game;
  currentQuestionIndex!: number;
  isAnswerSelectionEnabled: boolean = false;

  constructor(private domSanitizer: DomSanitizer, private quizzesService: QuizService,
    private apiService: ApiQuizzWebsiteService, private loginService: LoginService,) { }
  /**
  * Start recording.
  */
  initiateRecording(index: number) {
    this.recordingStates[index] = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  ngOnInit() {
    this.user = this.loginService.getUserLogged();
    this.wizardForm = new FormGroup({
      amount: new FormControl(this.amount),
      difficulty: new FormControl(this.difficulty),
      category: new FormControl(this.category),
      Type: new FormControl(this.Type)
    })
  }
  /**
  * Will be called automatically.
  */
  successCallback(stream: MediaStream) {
    var options: RecordRTC.Options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      sampleRate: 48000,
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  /**
  * Stop recording.
  */
  stopRecording(index: number) {
    this.recordingStates[index] = false;
    this.currentQuestionIndex = index;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob: Blob) {
    // Upload the recorded audio as a .wav file to azure storage    
    this.apiService.postUploadFile(blob, this.user.Nom_utilisateur);
    this.apiService.predictAudio(blob).subscribe(response => {
      this.predictionValue = response.prediction;
      this.donePrediction = true;
    });
  }
  /**
  * Process Error.
  */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  shuffleArray(array: any) {
    var m = array.length, t, i;

    while (m) {
      i = Math.floor(Math.random() * m--);
      t = array[m];
      array[m] = array[i];
      array[i] = t;
    }

    return array;
  }

  OnSubmit(): void {
    this.quizzesService.getQuizzes(this.wizardForm.value.amount, this.wizardForm.value.difficulty, this.wizardForm.value.category, this.wizardForm.value.Type).subscribe(
      response => {
        this.game = new Game(this.user.ID_utilisateur, 
          (this.wizardForm.value.category === '') ? 1 : this.wizardForm.value.category,
          this.wizardForm.value.difficulty,
          this.wizardForm.value.amount);
        this.game.questions = new Array<Question>;
        if (this.wizardForm.value.Type === 'multiple' || this.wizardForm.value.Type === '') {
          this.game.typeOfQuestions = 1
        } else {
          this.game.typeOfQuestions = 0
        }
        for (let question of response.results) {
          let Qst = new Question(question.question);
          Qst.answers = new Array<Answer>();
          for (let answer of question.incorrect_answers) {
            Qst.answers.push(new Answer(answer, false, false))
          }
          Qst.answers.push(new Answer(question.correct_answer, true, false));
          Qst.answers = this.shuffleArray(Qst.answers);
          this.game.questions.push(Qst);
        }
      },
      error => {
        console.log('Error fetching quizzes:', error);
      }
    );
    this.Wizard = false;
  }

  selectAnswer(answer: any) {
    // Logic to select the answer based on user input
    const userInput = (document.getElementById('questionAnswer' + (this.currentQuestionIndex + 1)) as HTMLInputElement).value.toLowerCase();
    switch (userInput) {
      case 'oui':
        // Select true answer
        // Assuming you have an array of quiz questions called 'game.questions'
        for (let answer of this.game.questions[this.currentQuestionIndex].answers) {
          if (answer.answer == 'True') {
            answer.isSelected = true;
          }else{
            answer.isSelected = false;
          }
        }
        break;
      case 'non':
        // Select false answer
        for (let answer of this.game.questions[this.currentQuestionIndex].answers) {
          if (answer.answer == 'False') {
            answer.isSelected = true;
          }else{
            answer.isSelected = false;
          }
        }
        break;
      
      case '1':
      case 'un':
        // Select first answer
        this.game.questions[this.currentQuestionIndex].answers[0].isSelected = true;
        this.game.questions[this.currentQuestionIndex].answers[1].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[2].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[3].isSelected = false;
        break;
      case '2':
      case 'deux':
        // Select second answer
        this.game.questions[this.currentQuestionIndex].answers[1].isSelected = true;
        this.game.questions[this.currentQuestionIndex].answers[0].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[2].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[3].isSelected = false;
        break;
      case '3':
      case 'trois':
        // Select third answer
        this.game.questions[this.currentQuestionIndex].answers[2].isSelected = true;
        this.game.questions[this.currentQuestionIndex].answers[1].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[0].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[3].isSelected = false;
        break;
      case '4':
      case 'quatre':
        // Select fourth answer
        this.game.questions[this.currentQuestionIndex].answers[3].isSelected = true;
        this.game.questions[this.currentQuestionIndex].answers[1].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[2].isSelected = false;
        this.game.questions[this.currentQuestionIndex].answers[0].isSelected = false;
        break;
      default:
        // Invalid input, do nothing or handle accordingly
        break;
    }
    // Disable answer selection after selection
    this.isAnswerSelectionEnabled = false;
    this.donePrediction = false;
  }

  undisableTextBox() {
    // Undisable the text box to allow user input again
    this.isAnswerSelectionEnabled = true;
  }

}


export class Game {
  constructor(
    public idUtilisateur: number,
    public idCategory: number,
    public difficulty: string,
    public numberOfQuestions: number,
  ) { }

  public questions!: Array<Question>;
  public typeOfQuestions!: TypeOfQuestion
}

export class Question {
  constructor(
    public question: string,
  ) { }
  public answers!: Array<Answer>;
}

export class Answer {
  constructor(
    public answer: string,
    public isCorrect: boolean,
    public isSelected: boolean) { }
}

enum TypeOfQuestion {
  'true/false',
  'multipleChoice'
}