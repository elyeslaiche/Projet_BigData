import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginService, UserLogged } from "../services/login.service";
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';
import * as echarts from 'echarts';

@Component({
    selector: 'app-line',
    templateUrl: './line.component.html',
    styleUrls: ['./line.component.css']
})
export class LineComponent implements OnInit {

    chart : any;
    categories: any[] = [];
    data! : { date : Date, difficulty: string, category : string, score: number }[];
    SelectedDifficulty! : string;
    SelectedCategory! : string;

    constructor(private apiService: ApiQuizzWebsiteService, private http: HttpClient) { }

    ngOnInit() {
        this.user = this.LoginService.getUserLogged();

        this.fetchData();
        this.draw_graph();

        this.getCategories();
    }

    onOptionChange(event: any) {
        this.SelectedDifficulty = event.target.value;
        this.SelectedCategory = event.target.value;
    }

    getCategories() {
        this.apiService.getCategories().subscribe(
            (data: any[]) => {
                this.categories = data;
            },
            (error) => {
                console.log(error);
            }
        );
        /* REQUETE : SELECT category_name FROM category 
         RETOUR : categories : {'cat1', 'cat2', 'cat3' ...} */
    }
    
    fetchData (){
        this.apiService.getScores(this.user.Nom_utilisateur).subscribe(
            response => {
                this.data = response;
            },
            error => {
                console.error('Erreur lors de la récupération des données :', error);
            }
        );
        /* REQUETE : SELECT date, difficulty, category, score FROM quizz, user WHERE user.username = username AND user.user_id = quizz.user_id
            RETOUR : data = [{'01-01-2023', 'easy', 'cat1', score}, {'04-18-2023', 'hard', 'cat5', score}, {'02-17-2023, 'hard', 'cat23', score} ... ]*/
    }

    draw_graph() {

        // Configuration du graphique
        this.chart = echarts.init(document.getElementById('line-container'));

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