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

  categories !: any[];
  SelectedDifficulty!: string;
  chart: any; // Variable pour stocker l'instance d'ECharts
  user!: UserLogged;
  dataPie!: any[];
  dataBar!: any[];

  constructor(private ls: LoginService,
    private http: HttpClient,
    private router: Router,
    private apiService: ApiQuizzWebsiteService) { }

  async ngOnInit() {
    this.user = this.ls.getUserLogged();
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.Nom_utilisateur),
      pseudo: new FormControl(this.user.Nom_utilisateur),
      email: new FormControl(this.user.Email),
      age: new FormControl(this.user.age),
      country: new FormControl(this.user.pays),  
      newPassword: new FormControl('', [Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    });

    this.fetchDataBarPlot();
    this.fetchDataPiePlot();
  }

  onOptionChangeDiff(event: any) {
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

  fetchCategories() {
    this.apiService.getCategories().subscribe(
      (response: any[]) => {
        this.categories = response
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  fetchDataBarPlot() {
    this.apiService.getNumberOfGamePlayed(this.user.ID_utilisateur).subscribe(
      (response: { difficulty: string; nb_game: number; }[]) => {
        this.dataBar = response;
        this.draw_graphBar();
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  fetchDataPiePlot() {
    this.apiService.getNbGamePerCat(this.user.ID_utilisateur).subscribe(
      (response: any[]) => {
        this.dataPie = response;
        this.draw_graphPie();
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
  }

  async draw_graphPie() {

    let LineContainer = document.getElementById('pie-container');
    if (LineContainer)
      this.chart = echarts.init(LineContainer);

    const options = {
      title: {
        text: 'Number of games per theme',
        left: 'center'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.dataPie.map(item => item[1]) // Map the names to the legend data
      },
      series: [
        {
          name: 'Number of games per theme',
          type: 'pie',
          radius: '50%',
          data: this.dataPie,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: { // this object is responsible for displaying labels on the chart
            show: true,
            formatter: function(params: { name: any; value: any; percent: any; }) {
              return `${params.value[1]} (${params.percent}%)`;
            }
          },
        }
      ]
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
        text: 'Number of games per difficulty',
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.dataBar.map(item => Object.keys(item)[0])  // Extract difficulty from the object key
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        type: 'bar',
        data: this.dataBar.map(item => Object.values(item)[0]),  // Extract nb_game from the object value
        itemStyle: {
          color: '#1663f1'  // specify your color here
        }
      }],
      
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
