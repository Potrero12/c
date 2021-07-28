import { Component, OnInit } from '@angular/core';
import { Song } from '../../models/song';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'player',
    template: `
        <div class="album-image">
            <span *ngIf="song.album">
                <img id="play-image-album" src="{{ url + 'get-image-album/' + song.album.image }}" />
            </span>
            <span *ngIf="!song.album">
                <img id="play-image-album" src="assets/images/default.jpg"/>
            </span>
        </div>
        
        <div class="audio-file">
            <p>Reproduciendo</p>
            <span id="play-song-title">
                {{ song.name }}
            </span>
            
            <span id="play-song-artist">
                <span *ngIf="song.artist">
                    {{ song.album.artist.name }}
                </span>
            </span>
            <audio controls id="player">
                <source id="mp3-source" src="{{ url + 'get-song-file/' + song.file }}" type="audio/mpeg" />
                Tu  Navegador No es Compatible
            </audio>
        </div>

    `
})
export class PlayerComponent implements OnInit{

    public url: string;
    public song;

    constructor(){
        this.url = GLOBAL.url;
    }

    ngOnInit(){
        console.log('PlayerComponent cargado');

        var song = JSON.parse(localStorage.getItem('sound_song'));

        if(song){
            this.song = song;
        } else {
            this.song = new Song(1, '', '', '', '');
        }
    }

}