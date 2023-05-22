import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService, UserLogged } from "../../services/login.service";
import { ApiQuizzWebsiteService } from '../../services/api-quizz-website.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.css']
})
export class PieComponent implements OnInit {
  chart: any; // Variable pour stocker l'instance d'ECharts
  user!: UserLogged;
  /* Data come from our database */
  data!: { category: string, nb_game: number }[];

  constructor(private LoginService: LoginService, private apiService: ApiQuizzWebsiteService, private http: HttpClient) { }

  ngOnInit() {
    this.user = this.LoginService.getUserLogged();

    this.fetchData();
    this.draw_graph();
  }

  fetchData() {
    this.apiService.getScores(this.user.ID_utilisateur).subscribe(
      (response: { category: string; nb_game: number; }[]) => {
        this.data = response;
      },
      (error: any) => {
        console.error('Erreur lors de la récupération des données :', error);
      }
    );
    /* REQUETE : SELECT COUNT(*) FROM quizz, user WHERE user.user_id = quizz.user_id GROUP BY category 
        RETOUR : data = [{'cat1', nb_game}, {'cat2', nb_game}, {'cat3', nb_game} ...]*/
  }

  draw_graph() {
    // Configuration du graphique
    let pieContainer = document.getElementById('pie-container');
    if(pieContainer)
      this.chart = echarts.init(pieContainer);

    const options = {
      title: {
        text: 'Nombre de parties par catégories',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'nb_game per category',
          type: 'pie',
          radius: '50%',
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };



    this.chart.setOption(options);
  }
}