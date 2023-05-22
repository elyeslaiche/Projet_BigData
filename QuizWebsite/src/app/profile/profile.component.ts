import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService, UserLogged } from "../services/login.service";
import { Md5 } from "ts-md5";
import { Router } from "@angular/router";
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  // Apiurl = 'http://localhost:8000/'

  // headers= new HttpHeaders()
  // .set('Content-Type', 'application/json')
  // .set("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS")
  // .set('Access-Control-Allow-Origin', '*');

  /* Data come from our database */
  name!: string;
  pseudo!: string;
  email!: string;
  newPassword!: string;
  profileForm!: FormGroup;
  SelectedDifficulty!: string;
  chart: any; // Variable pour stocker l'instance d'ECharts
  user!: UserLogged;
  data!: any[];

  constructor(private ls: LoginService,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiQuizzWebsiteService) { }

  ngOnInit() {
    this.user = this.ls.getUserLogged();
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.Nom_utilisateur),
      pseudo: new FormControl(this.user.Nom_utilisateur),
      email: new FormControl(this.user.Email),
      newPassword: new FormControl('')
    });

    this.fetchDataBarPlot();
    this.fetchDataGaugePlot();
  }

  onOptionChange(event: any) {
    this.SelectedDifficulty = event.target.value;
  }

  onSubmit() {
    this.apiService.putResetPwd(this.user.Nom_utilisateur, this.user.Mot_de_passe, this.profileForm.value.newPassword).subscribe(
      (response: any) => {
        console.log(response);
        this.user.Mot_de_passe = Md5.hashStr(this.profileForm.value.newPassword);
      },
      (error: any) => console.log(error)
    ), { headers: this.apiService.headers }
    console.log(`after submit ${this.user.Mot_de_passe}`)
  }

  fetchDataBarPlot() {
    this.apiService.getNumberOfGamePlayed(this.user.ID_utilisateur).subscribe(
      (response: { difficulty: string; nb_game: number; }[]) => {
        this.data = response;
        this.draw_graphBar();
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  fetchDataGaugePlot() {
    this.apiService.getScorePerDiff(this.user.ID_utilisateur).subscribe(
      (response: { difficulty: string, score: number }[]) => {
        this.data = response;
        this.draw_graphGauge();
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  draw_graphGauge() {
    let gaugeContainer = document.getElementById('gauge-container');
    if (gaugeContainer)
      this.chart = echarts.init(gaugeContainer);
    // Configuration du graphique

    let mean_score = 0;

    for (let i = 0; i < this.data.length; i++) {
      if (this.SelectedDifficulty = 'default') {
        mean_score += this.data[i].score;
      }
      if (this.data[i].difficulty = this.SelectedDifficulty) {
        mean_score += this.data[i].score;
      }
    }

    const options = {
      title: {
        text: 'Score moyen selon la difficulté choisie',
        subtext: 'Valeur par défaut : toutes les difficultés',
        left: 'center'
      },
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: 'Mean Score',
          type: 'gauge',
          detail: {
            formatter: '{value}'
          },
          data: [
            {
              value: mean_score,
              name: 'SCORE MOYEN DE LA DIFFICULTE'
            }
          ]
        }
      ],
      itemStyle: {
        color: '#ce8460'  // specify your color here
      }
    };

    this.chart.setOption(options);
  }
  
  draw_graphBar() {
    // Configuration du graphique
    let barplotContainer = document.getElementById('barplot-container');
    if (barplotContainer)
      this.chart = echarts.init(barplotContainer);

    const options = {
      title: {
        text: 'Nombre de parties par difficulté',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.data.map(item => Object.keys(item)[0])  // Extract difficulty from the object key
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        data: this.data.map(item => Object.values(item)[0])  // Extract nb_game from the object value
      }],
      itemStyle: {
        color: '#ce8460'  // specify your color here
      }
    };

    if (this.chart) {
      this.chart.setOption(options);
    }
  }


  Ondelete() {
    const Confirmation = confirm("Are you sure you want to do that?");
    if (Confirmation) {
      this.apiService.deleteUser(this.user.Nom_utilisateur, this.user.Mot_de_passe).subscribe(
        (response: any) => {
          this.LogOut();
        },
        (error: any) => console.log(error)
      ), { headers: this.apiService.headers }
    }
  }

  LogOut() {
    this.ls.LogOut();
  }
}
