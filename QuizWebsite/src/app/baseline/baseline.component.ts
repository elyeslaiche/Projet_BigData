import { Component } from '@angular/core';
import {LoginService, UserLogged} from "../services/login.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-baseline',
  templateUrl: './baseline.component.html',
  styleUrls: ['./baseline.component.css']
})
export class BaselineComponent {

  isConnected = false;
  user!: UserLogged;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {
    console.log('constructor')
  }

  ngOnInit(){
    this.user = this.loginService.getUserLogged();
    if (this.user != null){
      this.isConnected = true;
    }
  }

  LogOut() {
    this.loginService.LogOut();
    this.isConnected =this.loginService.isConnected;
  }
}
