import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { UserService } from '../../services/user.service';
import { ArtistService } from '../../services/artist.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

import { Artist } from '../../models/artist';

@Component({
    selector: 'artist-edit',
    templateUrl: '../artist-add/artist-add.component.html',
    providers: [UserService, ArtistService, UploadService]
})
export class ArtistEditComponent implements OnInit{

    public titulo: string;
    public artist: Artist;
    public identity;
    public token;
    public url;
    public alertMessage: string;
    public is_edit;

    constructor(
        private _userService: UserService,
        private _artistService: ArtistService,
        private _uploadService: UploadService,
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Editar Artistas';
        this.url = GLOBAL.url;
        this.artist = new Artist('', '', '');
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
		console.log(this.artist);
		this._route.params.forEach((params: Params) => {
			let id = params['id'];

			this._artistService.editArtist(this.token, id, this.artist).subscribe(
				response => {
                    console.log(response);
					if(response.artist){
						this.alertMessage = 'Error en el servidor';
					}else{
						this.alertMessage = '¡El artista se ha actualizado correctamente!';
						if(!this.filesToUpload){
							this._router.navigate(['/artistas', 1 ]);
						}else{
                            this.alertMessage = 'El Arista se ha actualizado correctamente';

                            if(!this.filesToUpload){
                                this._router.navigate(['/artistas',  response.artist._id]);
                            } else {
							//Subir la imagen del artista
							this._uploadService.makeFileRequest(this.url+'upload-image-artist/'+id, [], this.filesToUpload, this.token, 'image')
								.then(
									(result) => {
										this._router.navigate(['/artistas', response.artist._id]);
									},
									(error) => {
										console.log(error);
									}
								);
                            }
						}
					}
				},
				error => {
					var errorMessage = <any>error;

			        if(errorMessage != null){
			          var body = JSON.parse(error._body);
			          this.alertMessage = body.message;

			          console.log(error);
			        }
				}	
			);
		});
	}

	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any){
		this.filesToUpload = <Array<File>>fileInput.target.files;
	}
}