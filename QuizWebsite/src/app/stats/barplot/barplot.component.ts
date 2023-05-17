import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService, UserLogged } from "../services/login.service";
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';
import * as echarts from 'echarts';

@Component({
    selector: 'app-barplot',
    templateUrl: './barplot.component.html',
    styleUrls: ['./barplot.component.css']
})
export class BarplotComponent implements OnInit {
    chart: any; // Variable pour stocker l'instance d'ECharts
    user!: UserLogged;
     /* Data come from our database */
    data!: { difficulty: string, nb_game: number }[];
   

    constructor(private apiService: ApiQuizzWebsiteService, private http: HttpClient) { }

    ngOnInit() {
        this.user = this.LoginService.getUserLogged();

        this.fetchData();
        this.draw_graph();
    }
    
    fetchData() {
        this.apiService.getScores(this.user.Nom_utilisateur).subscribe(
            response => {
                this.data = response;
            },
            error => {
                console.error('Erreur lors de la récupération des données :', error);
            }
        );
        /* REQUETE : SELECT COUNT(*) FORM quizz, user WHERE user.user_id = quizz.user_id GROUP BY difficulty
            RETOUR : data = [{'easy', nb_game_easy}, {'medium', nb_game_medium}, {'hard', nb_game_hard}] */
    }

    draw_graph() {
        // Configuration du graphique
        this.chart = echarts.init(document.getElementById('barplot-container'));

        const options = {
            title: {
                text: 'Nombre de parties par difficulté',
                left: 'center'
              },
            xAxis: {
                type: 'difficulty',
                data: this.data.map(item => item.difficulty)
            },
            yAxis: {
                type: 'score'
            },
            series: [{
                type: 'bar',
                data: this.data.map(item => item.nb_game)
            }]
        };

        this.chart.setOption(options);
    }
}