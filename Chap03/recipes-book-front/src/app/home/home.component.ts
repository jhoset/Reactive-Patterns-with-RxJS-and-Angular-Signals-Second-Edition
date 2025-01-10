import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecipesListComponent } from '../recipes-list/recipes-list.component';
import {RecipesFilterComponent} from "../recipes-filter/recipes-filter.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RecipesListComponent, RecipesFilterComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {

}
