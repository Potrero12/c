import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

@Component({
    selector: 'artist-detail',
    templateUrl: './artist-detailt.component.html',
    providers: [UserService, ArtistService, AlbumService]
})
export class ArtistDetailComponent implements OnInit{

    public artist: Artist;
    public albums: Album[];
    public identity;
    public token;
    public url;
    public alertMessage: string;
    public is_edit;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('ArtistEditComponent.ts cargado');
        //llamar el metodo de sacar al artista
        this.getArtist();
    }

    getArtist(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._artistService.getArtist(this.token, id).subscribe(
                response => {

                    if(!response.artist){
                        this._router.navigate(['/'])
                    } else {
                        this.artist = response.artist;

                        //sacar los albums del artista
                        this._albumService.getAlbums(this.token, response.artist._id).subscribe(
                            response => {
                                if(!response.albums){
                                    this.alertMessage = 'Este Artista no Tiene Albums';
                                } else {
                                    this.albums = response.albums;
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
                },
                error => {
                    var errorMessage = <any>error;
                    
                    if(errorMessage != null){
                      var body = JSON.parse(error._body);
                      this.alertMessage = body.message;
                    }
                  }
            )
        });
    }

    public confirmado;
    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onDeleteAlbum(id){
        this._albumService.deleteAlbum(this.token, id).subscribe(
            response => {
                if(!response.album){
                    this.alertMessage = 'Error En El Servidor';
                    return;
                }

                this.getArtist();
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

    onCancelAlbum(){
        this.confirmado = null;
    }
}