import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

@Component({
    selector: 'album-add',
    templateUrl: './album-add.component.html',
    providers: [UserService, ArtistService, AlbumService]
})
export class AlbumAddComponent implements OnInit{

    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url;
    public alertMessage;
    public is_edit = false;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Crear Album';
        this.url = GLOBAL.url;
        this.album =  new Album('', '', 2021, '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
    }

    ngOnInit(){
        console.log('AlbumAddComponent.ts cargado')
    }

    onSubmit(){
        this._route.params.forEach((params: Params) => {
            let artistId = params['artist'];
            this.album.artist = artistId;
        });
        console.log(this.album);

        this._albumService.saveAlbum(this.token, this.album).subscribe(
            response => {
                if(!response.album){
                    this.alertMessage = 'Error En El Servidor';
                } else {
                    this.alertMessage = 'Album Creado Correctamente';
                    this.album = response.album;
                    this._router.navigate(['/editar-album', response.album._id]);

                    this.album =  new Album('', '', 2021, '', '');
                }
            },
            error => {
                var errorMessage = <any>error;
                
                if(errorMessage != null){
                  var body = JSON.parse(error._body);
                  this.alertMessage = body.message;
                }
              }
        )
    }
}