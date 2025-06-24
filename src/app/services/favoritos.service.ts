import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Pokemon {
  name: string;
  url: string;
  favorito: boolean;
  types: string[];
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {
  private _favoritos = new BehaviorSubject<Pokemon[]>([]);
  
  get favoritos() {
    return this._favoritos.asObservable();
  }

  getFavoritosList() {
    return this._favoritos.value;
  }

  toggleFavorito(pokemon: Pokemon) {
    pokemon.favorito = !pokemon.favorito;
    
    const currentFavoritos = this._favoritos.value;
    
    if (pokemon.favorito) {
      // Adiciona aos favoritos se não existir
      if (!currentFavoritos.some(p => p.name === pokemon.name)) {
        this._favoritos.next([...currentFavoritos, pokemon]);
      }
    } else {
      // Remove dos favoritos
      this._favoritos.next(
        currentFavoritos.filter(p => p.name !== pokemon.name)
      );
    }
    
    // Salva no localStorage para persistência
    this.saveFavoritos();
  }
  
  // Salva no localStorage
  private saveFavoritos() {
    localStorage.setItem('pokemons_favoritos', JSON.stringify(this._favoritos.value));
  }
  
  // Carrega do localStorage
  loadFavoritos() {
    const saved = localStorage.getItem('pokemons_favoritos');
    if (saved) {
      this._favoritos.next(JSON.parse(saved));
    }
  }
  
  constructor() {
    this.loadFavoritos();
  }
  

adicionarFavorito(pokemon: any) {
  const currentFavoritos = this._favoritos.value;
  if (!currentFavoritos.some(p => p.name === pokemon.name)) {
    this._favoritos.next([...currentFavoritos, pokemon]);
    this.saveFavoritos();
  }
}

removerFavorito(pokemon: any) {
  const currentFavoritos = this._favoritos.value;
  this._favoritos.next(
    currentFavoritos.filter(p => p.name !== pokemon.name)
  );
  this.saveFavoritos();
}
}