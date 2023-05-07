import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RegisterService, User} from "../../services/register.service";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {LoginComponent} from "../login/login.component";
import {Md5} from "ts-md5";
import { ApiQuizzWebsiteService } from 'src/app/services/api-quizz-website.service';

@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  user: User = new User("",  "", "", "");
  submitted = false;
  registerForm!: FormGroup;
  loginComp!: LoginComponent;
  is_valid_form = true;
  showPassword = false;

  constructor(private rs: RegisterService,
              private fb:FormBuilder,
              private router: Router,
              private ls: LoginService,
              private apiService: ApiQuizzWebsiteService,
  ) {
    this.loginComp = new LoginComponent(this.ls, this.fb, this.router,this.apiService)
  }

  ngOnInit(): void
  {
    this.registerForm = this.fb.group({
      userName:[''],
      passWord:['',[Validators.required,Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
      )]],
      email:['',[Validators.required,Validators.email]],

    })
    this.user.Email = "";
    this.user.Nom_utilisateur = "";
    this.user.Mot_de_passe = "";
  }

  OnSubmit() {
    if(this.registerForm.valid){
      this.is_valid_form = true;
      this.submitted = true;
      this.user.Email = this.registerForm.get('email')?.value;
      this.user.Nom_utilisateur = this.registerForm.get('userName')?.value;
      this.user.Mot_de_passe = Md5.hashStr(this.registerForm.get('passWord')?.value);
      this.user.Date_inscription = Date.now().toString();
      this.rs.register(this.user);

      setTimeout(() => {
        this.loginComp.login(this.user.Nom_utilisateur, this.user.Mot_de_passe);
      },2000)
    }
    else{
      this.is_valid_form = false
    }
  }
}








