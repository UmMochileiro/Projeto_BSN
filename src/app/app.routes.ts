import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inicio',
    pathMatch: 'full',
  },
  {
    path: 'folder/:id',
    loadComponent: () =>
      import('./folder/folder.page').then((m) => m.FolderPage),
  },

  {
  path: 'pagina/pokemons',
  loadComponent: () => 
    import('./pagina/pokemons/pokemons.page').then(m => m.PokemonsPage)
  },
  {
    path: 'pagina/favoritos',
    loadComponent: () => import('./pagina/favoritos/favoritos.page').then( m => m.FavoritosPage)
  },
  {
    path: 'pagina/pokemon-detalhes/:name',
    loadComponent: () => import('./pagina/pokemon-detalhes/pokemon-detalhes.page').then( m => m.PokemonDetalhesPage)
  }
];
