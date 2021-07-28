import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { AlbumService } from '../../services/album.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';
import { Album } from '../../models/album';

@Component({
    selector: 'album-edit',
    templateUrl: '../album-add/album-add.component.html',
    providers: [UserService, ArtistService, AlbumService, UploadService]
})
export class AlbumEditComponent implements OnInit{

    public titulo: string;
    public album: Album;
    public identity;
    public token;
    public url;
    public alertMessage;
    public is_edit;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _albumService: AlbumService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Editar Album';
        this.url = GLOBAL.url;
        this.album =  new Album('', '', 2021, '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('AlbumAddComponent.ts cargado');
        this.getAlbum();
    }

    getAlbum(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._albumService.getAlbum(this.token, id).subscribe(
                response => {
                    if(!response.album){
                        this._router.navigate(['/']);
                    } else {
                        this.album = response.album;
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

    onSubmit(){
        this._route.params.forEach((params: Params) => {
        let id = params['id'];
        
        console.log(this.album);

            this._albumService.editAlbumt(this.token, id, this.album).subscribe(
                response => {
                    if(!response.album){
                        this.alertMessage = 'Error En El Servidor';
                    } else {
                        this.alertMessage = 'Album Modificado Correctamente';
                        //this._router.navigate(['/artista', response.artist._id]);

                        if(!this.filesToUpload){
                            //redirigir a algun sitio
                            console.log(response.album.artist);
                            this._router.navigate(['/artista', response.artist._id]);
                        } else {
                            //subir imagen del album
                            this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id, [], this.filesToUpload, this.token, 'image')
                            .then(
                                (result) => {
                                    this._router.navigate(['/artista', response.artist._id]);
                                },
                                (error) => {
                                    console.log(error);
                                }
                            );
                        }
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

    public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}