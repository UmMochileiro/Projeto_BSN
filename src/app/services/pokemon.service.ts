import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getPokemons(): Observable<any> {
    return this.http.get<any>(this.apiUrl + 'pokemon?limit=20');
  }
  getPokemonTypes(nameOrId: string | number) {
  return this.http.get<any>(`${this.apiUrl}pokemon/${nameOrId}/`);
}
getPokemonSpecies(nameOrId: string | number) {
  return this.http.get<any>(`${this.apiUrl}pokemon-species/${nameOrId}/`);
}
  
}