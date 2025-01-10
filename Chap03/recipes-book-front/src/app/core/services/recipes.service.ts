import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Recipe} from '../model/recipe.model';
import {environment} from 'src/environments/environment';
import {BehaviorSubject, catchError, of} from "rxjs";

const BASE_PATH = environment.basePath


@Injectable({
  providedIn: 'root'
})

export class RecipesService {

  //? Create the action stream - filterRecipeSubject
  private filterRecipeSubject = new BehaviorSubject<Recipe>({title: ''});
  //* Extract the readonly stream
  //* Consumers can only read the stream but not write to it using the next() method
  filterRecipesAction$ = this.filterRecipeSubject.asObservable();

  //! Data Stream - recipes$
  recipes$ = this.http.get<Recipe[]>(`${BASE_PATH}/recipes`).pipe(
    catchError(() => of([]))
  );

  updateFilter(criteria: Recipe) {
    this.filterRecipeSubject.next(criteria);
  }

  constructor(private http: HttpClient) {

  }
}
