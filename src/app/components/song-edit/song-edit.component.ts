import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { SongService } from '../../services/song.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

import { Song } from '../../models/song';

@Component({
    selector: 'song-edit',
    templateUrl: '../song-add/song-add.component.html',
    providers: [UserService, SongService, UploadService]
})
export class SongEditComponent implements OnInit{

    public titulo: string;
    public song: Song;
    public identity;
    public token;
    public url;
    public alertMessage;
    public is_edit = false;

    constructor(
        private _userService: UserService,
        private _songService: SongService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Editar Canción';
        this.url = GLOBAL.url;
        this.song =  new Song(1 , '', '', '', '');
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.is_edit = true;
    }

    ngOnInit(){
        console.log('SongEditomponent.ts cargado');

        //sacar la canciona  editar
        this.getSong();
    }

    getSong(){
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            this._songService.getSong(this.token, id).subscribe(
                response => {
                    if(!response.song){
                        this._router.navigate(['/']);
                    } else {
                        this.song = response.song;
                    }
                },
                error => {
                    var errorMessage = <any>error;
                    
                    if(errorMessage != null){
                      var body = JSON.parse(error._body);
                      //this.alertMessage = body.message;
                    }
                  }
            );
        });
    }

    onSubmit(){
        
        this._route.params.forEach((params: Params) => {
            let id = params['id'];

            console.log(this.song);

        this._songService.editSong(this.token, id ,this.song).subscribe(
            response => {
                if(!response.song){
                    this.alertMessage = 'Error En El Servidor';
                } else {
                    this.alertMessage = 'Cancion Creado Correctamente';

                    if(!this.filesToUpload){
                        this._router.navigate(['/album', response.song.album]);
                    } else {
                        //subir el fichero de audio
                        this._uploadService.makeFileRequest(this.url+'upload-file-song/'+id, [], this.filesToUpload, this.token, 'file')
                        .then(
                            (result) => {
                                this._router.navigate(['/album', response.song.album]);
                            },
                            (error) => {
                                console.log(error);
                            }
                        );
                    }

                    //this._router.navigate(['/album', response.album._id]);
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

    public filesToUpload;
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}