import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Artist } from '../../models/artist';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit{

    public titulo: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ){
        this.titulo = 'Musify';
    }

    ngOnInit(){
        console.log('HomeComponent.ts Cargado');
    }

}