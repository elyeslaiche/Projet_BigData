import { Component } from '@angular/core';
import { LoginService } from "../../services/login.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Md5 } from "ts-md5";
import { ApiQuizzWebsiteService } from '../../services/api-quizz-website.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  submitted = false;
  loginForm!: FormGroup;
  identifiant!: string;
  pwd!: string;
  isValidUser = true;
  is_valid_form = true;
  showPassword = false;

  constructor(private loginService: LoginService,
    private fb: FormBuilder,
    private router: Router,
    private apiService: ApiQuizzWebsiteService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: '',
      passWord: '',
    })
  }


  OnSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.identifiant = this.loginForm.get('userName')?.value;
      this.pwd = Md5.hashStr(this.loginForm.get('passWord')?.value);
      this.login(this.identifiant, this.pwd);
    }
    else {
      this.is_valid_form = false;
    }
  }


  login(identifiant: string, pwd: string) {
    function clear(lf: FormGroup) {
      lf.patchValue({
        userName: '',
        passWord: '',
      });
    }

    function redirect(ls: LoginService, router: Router, loginForm: FormGroup): boolean {
      console.log(ls.user); 
      if ((ls.user.Nom_utilisateur == identifiant) && (ls.user.Mot_de_passe == pwd)) {
        ls.isConnected = true;
        ls.setUserLogged(ls.user);
        router.navigate(['/home']).then(() => {
          window.location.reload();
        });
        clear(loginForm);
        loginForm.disable();
        return true;
      }
      clear(loginForm);
      return false;
    }

    this.apiService.getLoginResponse(identifiant, pwd).subscribe(result => {
      this.loginService.user = result;
      this.isValidUser = redirect(this.loginService, this.router, this.loginForm)
    }, err => {
      console.log("Something went wrong");
    }), { headers: this.apiService.headers }
  }
}

