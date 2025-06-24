import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PokemonsPage } from './pokemons.page';

describe('PokemonsPage', () => {
  let component: PokemonsPage;
  let fixture: ComponentFixture<PokemonsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PokemonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
