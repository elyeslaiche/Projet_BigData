import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoginService, UserLogged} from "../services/login.service";
import {Md5} from "ts-md5";
import {Router} from "@angular/router";
import { ApiQuizzWebsiteService } from '../services/api-quizz-website.service';

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
  user!: UserLogged;

  constructor(private ls: LoginService,
              private http: HttpClient,
              private router: Router,
              private apiService: ApiQuizzWebsiteService){ }

  ngOnInit(){
    this.user = this.ls.getUserLogged();
    console.log(this.user);
    this.profileForm = new FormGroup({
      name: new FormControl(this.user.Nom_utilisateur),
      pseudo: new FormControl(this.user.Nom_utilisateur),
      email: new FormControl(this.user.Email),
      newPassword: new FormControl('', [Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )])
    })
  }

  onSubmit() {
    this.apiService.putResetPwd(this.user.Nom_utilisateur,this.user.Mot_de_passe,this.profileForm.value.newPassword).subscribe(
        (response: any) => {
          console.log(response);
          this.user.Mot_de_passe = Md5.hashStr(this.profileForm.value.newPassword);
        },
        (error: any) => console.log(error)
        ),  {headers: this.apiService.headers}
    console.log(`after submit ${this.user.Mot_de_passe}`)
    }

  Ondelete() {
    const Confirmation = confirm("Are you sure you want to do that?");
    if(Confirmation){
      this.apiService.deleteUser(this.user.Nom_utilisateur,this.user.Mot_de_passe).subscribe(
        (response: any) => {
          this.LogOut();
        },
        (error: any) => console.log(error)
        ),  {headers: this.apiService.headers}
      }
    }

  LogOut() {
    this.ls.LogOut();
  }
}
