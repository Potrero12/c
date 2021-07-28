import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';

@Component({
    selector: 'artist-add',
    templateUrl: './artist-add.component.html',
    providers: [UserService, ArtistService]
})
export class ArtistAddComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url;
    public alertMessage: string;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Añadir Artistas';
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(){
        console.log('ArtistAddComponent.ts Cargado');
    }

    onSubmit(){
        console.log(this.artist);

        this._artistService.register(this.token, this.artist).subscribe(
            response => {
                if(!response.artist){
                    this.alertMessage = 'Error Al Crear El artista'
                } else {
                    this.artist = response.artist;
                    this._router.navigate(['/editar-artista', response.artist._id]);


                    this.alertMessage = 'Artista Creado Correctamente';

                    this.artist = new Artist('', '', '');
                }
            },
            error => {
                var errorMessage = <any>error;
                
                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                }
              }
        );
    }

}