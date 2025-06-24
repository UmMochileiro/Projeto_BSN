import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonDetalhesPage } from './pokemon-detalhes.page';

describe('PokemonDetalhesPage', () => {
  let component: PokemonDetalhesPage;
  let fixture: ComponentFixture<PokemonDetalhesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonDetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
