import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonIcon, IonButton, IonList, IonItem, IonLabel, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
import { Router, RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
//IonList, IonItem, IonLabel
interface Pokemon {
  name: string;
  url: string;
  favorito: boolean;
  types: string[];
  image: string;
  description: string;
}

@Component({
  selector: 'app-pokemons',
  standalone: true,
  templateUrl: './pokemons.page.html',
  styleUrls: ['./pokemons.page.scss'],
  imports: [
   IonIcon, IonButton, RouterLink, IonList, IonItem, IonLabel, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    CommonModule, FormsModule,
  ],
})
export class PokemonsPage {

  pokemons: Pokemon[] = [];
  pokemonsID: number[] = [];
  apiUrl: string = 'https://pokeapi.co/api/v2/';
  favoritos: Pokemon[] = [];

  constructor(
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService,
    private router: Router
  ) {
    // Atualiza favoritos quando houver mudanças
    this.favoritosService.favoritos.subscribe(favs => {
      this.favoritos = favs;
      // Atualiza o status de favorito nos pokemons já carregados
      this.pokemons.forEach(pokemon => {
        pokemon.favorito = this.favoritos.some(fav => fav.name === pokemon.name);
      });
    });

    this.pokemonService.getPokemons().subscribe({
      next: (data: any) => {
        this.pokemons = Array.isArray(data?.results)
          ? data.results.map((p: any) => ({
              name: p.name,
              url: p.url,
              favorito: false,
              types: [],
              image: '',
              description: ''
            }))
          : [];
          const favoritosSalvos = this.favoritosService.getFavoritosList();
    this.pokemons.forEach(pokemon => {
      pokemon.favorito = favoritosSalvos.some(fav => fav.name === pokemon.name);
    });
        this.pokemons.forEach((pokemon: Pokemon) => {
          this.pokemonService.getPokemonTypes(pokemon.name).subscribe({
            next: (pokeData: any) => {
              // Aqui você extrai os nomes dos tipos
              pokemon.types = Array.isArray(pokeData.types)
                ? pokeData.types.map((t: any) => t.type.name)
                : [];
              pokemon.image = pokeData?.sprites?.other?.['official-artwork']?.front_default || '';
            },
            error: () => {
              pokemon.types = [];
              pokemon.image = '';
            }
          });

          this.pokemonService.getPokemonSpecies(pokemon.name).subscribe({
            next: (speciesData: any) => {
              // Procura a descrição em português, se não achar pega em inglês
              const entry = Array.isArray(speciesData.flavor_text_entries)
                ? speciesData.flavor_text_entries.find(
                    (e: any) => e.language.name === 'pt'
                  ) || speciesData.flavor_text_entries.find(
                    (e: any) => e.language.name === 'en'
                  )
                : null;
              pokemon.description = entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Sem descrição';
            },
            error: () => {
              pokemon.description = 'Sem descrição';
            }
          });
        });
      },
      error: () => {
        this.pokemons = [];
      }
    });
  }

  types(pokemon: Pokemon): string {
    return pokemon.types ? pokemon.types.join(', ') : 'Carregando...';
  }

toggleFavorito(pokemon: Pokemon, event?: Event): void {
  if (event) {
    event.stopPropagation(); 
  }
  pokemon.favorito = !pokemon.favorito;
  
}

verDetalhes(pokemon: Pokemon): void {
  this.router.navigate(['/pagina/pokemon-detalhes', pokemon.name]);
}

}



