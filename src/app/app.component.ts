import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from './models/user';
import { UserService } from './services/user.service';
import { GLOBAL } from './services/global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit{

  public titulo: string;
  public user: User;
  public user_Register: User;
  public identity;
  public token;
  public errorMessage;
  public alertRegister;
  public url: string;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  )
  {
    this.titulo = 'MUSIFY';
    this.user = new User('','','','','','ROLE_USER','');
    this.user_Register = new User('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  onSubmit(){

    //conseguir los datos del usuario
    this._userService.login(this.user).subscribe(
      response => {
        let identity = response.user;
        this.identity = identity;

        if(!this.identity._id){
          alert("El usuario no esta correctamente identificado");
        } else {
          //crear la sesion en el localstorage
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // conseguir el token para enviarlo a cada peticion
          this._userService.login(this.user, 'true').subscribe(
            response => {
              let token = response.token;
              this.token = token;
      
              if(this.token.length <= 0){
                alert('El token no se ha generado');
              } else {
                //crear el elemento para tener el token disponible
                localStorage.setItem('token', this.token);                
              }
            }, 
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null){
                var body = JSON.parse(error._body);
                this.errorMessage = body.message;
              }
            }
          )
        }
      }, 
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.errorMessage = body.message;
        }
      }
    )
  }

  onSubmitRegister(){
    this._userService.register(this.user_Register).subscribe(
      response =>{
        let user = response.user;
        this.user_Register = user;

        if(!user._id){
          this.alertRegister = 'Error al registrarse';
        } else {
          this.alertRegister = 'El registro se ha realizado correctamente';
          this.user_Register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null){
          var body = JSON.parse(error._body);
          this.alertRegister = body.message;
        }
      }
    )
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    this.identity = null;
    this.token = null;
    this.user = new User('','','','','','ROLE_USER','');
    this._router.navigate(['/']);
  }

}
