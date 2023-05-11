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
  recording = false;
  //URL of Blob
  url: any;
  error: any;

  Wizard: boolean = true;
  quizzes: any[] = [];
  amount!: string;
  category!: string;
  difficulty!: string;
  Type !: string;
  user !: UserLogged;

  constructor(private domSanitizer: DomSanitizer, private quizzesService: QuizService,
    private apiService: ApiQuizzWebsiteService, private loginService: LoginService,) { }
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  /**
  * Start recording.
  */
  initiateRecording() {
    this.recording = true;
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
  stopRecording() {
    this.recording = false;
    this.record.stop(this.processRecording.bind(this));
  }

  processRecording(blob: Blob) {
    this.url = URL.createObjectURL(blob);
    // Upload the recorded audio as a .wav file to azure storage
    this.apiService.postUploadFile(blob, this.user.Nom_utilisateur);
  }
  /**
  * Process Error.
  */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }

  OnSubmit(): void {
    this.Wizard = false;
    this.quizzesService.getQuizzes(this.wizardForm.value.amount, this.wizardForm.value.difficulty, this.wizardForm.value.category, this.wizardForm.value.Type).subscribe(
      response => {
        this.quizzes = response.results;
      },
      error => {
        console.log('Error fetching quizzes:', error);
      }
    );
  }
}