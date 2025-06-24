import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonIcon, IonButton, IonList, IonItem, IonLabel, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';
import { PokemonService } from '../../services/pokemon.service';

// Importe a interface Pokemon
interface Pokemon {
  name: string;
  url: string;
  favorito: boolean;
  types: string[];
  image: string;
  description: string;
}

@Component({
  selector: 'app-favoritos',
  standalone: true,
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  imports: [IonIcon, IonButton, RouterLink, IonList, IonItem, IonLabel, IonSearchbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    CommonModule, FormsModule
  ]
})
export class FavoritosPage implements OnInit {
  favoritos: Pokemon[] = [];

  constructor( 
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService 
  ) { }

  ngOnInit() {
    // Inscrever-se para receber atualizações da lista de favoritos
    this.favoritosService.favoritos.subscribe(favoritos => {
      this.favoritos = favoritos;
      
      // Se precisar buscar detalhes adicionais de cada Pokémon favorito
      this.carregarDetalhesFavoritos();
    });
  }

  // Método para carregar detalhes (tipos, imagens, descrições) de cada pokémon favorito
  carregarDetalhesFavoritos() {
    this.favoritos.forEach(pokemon => {
      // Busca tipos e imagem
      if (!pokemon.types || pokemon.types.length === 0 || !pokemon.image) {
        this.pokemonService.getPokemonTypes(pokemon.name).subscribe({
          next: (pokeData: any) => {
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
      }
      
      // Busca descrição
      if (!pokemon.description) {
        this.pokemonService.getPokemonSpecies(pokemon.name).subscribe({
          next: (speciesData: any) => {
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
      }
    });
  }

  // Método para remover um Pokémon dos favoritos
  removerFavorito(pokemon: Pokemon) {
    this.favoritosService.toggleFavorito(pokemon);
  }
  
  // Método para listar os tipos (igual ao da página pokemons)
  types(pokemon: Pokemon): string {
    return pokemon.types ? pokemon.types.join(', ') : 'Carregando...';
  }
}