import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService, UserLogged } from "../services/login.service";
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';
import * as echarts from 'echarts';

@Component({
    selector: 'app-gauge',
    templateUrl: './gauge.component.html',
    styleUrls: ['./gauge.component.css']
})
export class GaugeComponent implements OnInit {

    chart: any;
    SelectedDifficulty!: string;
    user!: UserLogged;
    /* Data come from our database */
    data!: { difficulty: string, score: number }[];
    mean_score! : number;

    onOptionChange(event: any) {
        this.SelectedDifficulty = event.target.value;
    }

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
        /* REQUETE : SELECT difficulty, score FROM quizz, user WHERE user.username = username AND user.user_id = quizz.user_id
            RETOUR : data = [{'easy', score}, {'hard', score}, {'hard', score} ... ]*/
    }
    
    draw_graph() {

        // Configuration du graphique
        this.chart = echarts.init(document.getElementById('gauge-container'));

        let mean_score = 0;

        for (let i = 0; i < this.data.length; i++) {
            if (this.SelectedDifficulty = 'default')
            {
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
            ]
        };

        this.chart.setOption(options);
    }
}