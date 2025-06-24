import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonIcon, IonSpinner, IonButton, IonList, IonItem, IonLabel, IonNote, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritosService } from '../../services/favoritos.service';

interface PokemonDetalhado {
  name: string;
  id: number;
  height: number;
  weight: number;
  types: string[];
  stats: {name: string, value: number}[];
  abilities: string[];
  image: string;
  description: string;
  favorito: boolean;
}

@Component({
  selector: 'app-pokemon-detalhes',
  templateUrl: './pokemon-detalhes.page.html',
  styleUrls: ['./pokemon-detalhes.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonIcon, 
    IonSpinner,
    IonButton, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonNote,
    IonHeader, 
    IonToolbar, 
    IonButtons, 
    IonBackButton, 
    IonTitle, 
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ]
})
export class PokemonDetalhesPage implements OnInit {
  pokemon: PokemonDetalhado = {
    name: '',
    id: 0,
    height: 0,
    weight: 0,
    types: [],
    stats: [],
    abilities: [],
    image: '',
    description: '',
    favorito: false
  };
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoritosService: FavoritosService
  ) { }

  ngOnInit() {
    // Pega o parâmetro 'name' da URL
    const pokemonName = this.route.snapshot.paramMap.get('name');
    if (pokemonName) {
      this.loadPokemonDetails(pokemonName);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  loadPokemonDetails(name: string) {
    this.loading = true;
    this.error = false;

    // Carregar dados básicos do Pokémon
    this.pokemonService.getPokemonTypes(name).subscribe({
      next: (data: any) => {
        this.pokemon.name = data.name;
        this.pokemon.id = data.id;
        this.pokemon.height = data.height / 10; // Converter para metros
        this.pokemon.weight = data.weight / 10; // Converter para kg
        this.pokemon.types = data.types.map((t: any) => t.type.name);
        this.pokemon.image = data?.sprites?.other?.['official-artwork']?.front_default || '';
        this.pokemon.abilities = data.abilities.map((a: any) => a.ability.name);
        
        // Processar estatísticas
        this.pokemon.stats = data.stats.map((s: any) => ({
          name: s.stat.name,
          value: s.base_stat
        }));

        // Verificar se é favorito
        this.favoritosService.favoritos.subscribe(favoritos => {
          const favs = favoritos || [];
          this.pokemon.favorito = favs.some(f => f.name === name);
        });
        
        // Carregar descrição do Pokémon
        this.pokemonService.getPokemonSpecies(name).subscribe({
          next: (speciesData: any) => {
            const entry = speciesData.flavor_text_entries.find(
              (e: any) => e.language.name === 'pt'
            ) || speciesData.flavor_text_entries.find(
              (e: any) => e.language.name === 'en'
            );
            
            this.pokemon.description = entry ? entry.flavor_text.replace(/\f/g, ' ') : 'Sem descrição';
            this.loading = false;
          },
          error: () => {
            this.pokemon.description = 'Sem descrição disponível';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  toggleFavorito() {
    this.pokemon.favorito = !this.pokemon.favorito;
    
    // Objeto Pokemon simplificado para salvar nos favoritos
    const pokemonParaSalvar = {
      name: this.pokemon.name,
      url: '',
      favorito: this.pokemon.favorito,
      types: this.pokemon.types,
      image: this.pokemon.image,
      description: this.pokemon.description
    };
    
    if (this.pokemon.favorito) {
      this.favoritosService.adicionarFavorito(pokemonParaSalvar);
    } else {
      this.favoritosService.removerFavorito(pokemonParaSalvar);
    }
  }
  
  // Método para calcular a porcentagem da barra de estatística
  getStatPercentage(value: number): number {
    return Math.min(value / 255 * 100, 100); // 255 é o valor máximo possível
  }
  
  // Método para determinar a cor baseada no tipo
  getTypeColor(type: string): string {
    const typeColors: {[key: string]: string} = {
      normal: 'medium',
      fire: 'danger',
      water: 'primary',
      grass: 'success',
      electric: 'warning',
      ice: 'tertiary',
      fighting: 'danger',
      poison: 'secondary',
      ground: 'warning',
      flying: 'tertiary',
      psychic: 'tertiary',
      bug: 'success',
      rock: 'medium',
      ghost: 'dark',
      dragon: 'tertiary',
      dark: 'dark',
      steel: 'medium',
      fairy: 'tertiary'
    };
    return typeColors[type] || 'medium';
  }
  getNiceStatName(statName: string): string {
  const statNames: {[key: string]: string} = {
    'hp': 'HP',
    'attack': 'Ataque',
    'defense': 'Defesa',
    'special-attack': 'Ataque Especial',
    'special-defense': 'Defesa Especial',
    'speed': 'Velocidade'
  };
  return statNames[statName] || statName;
}
}