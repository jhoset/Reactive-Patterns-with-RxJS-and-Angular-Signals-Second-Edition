import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecipesService} from '../core/services/recipes.service';
import {DataViewModule} from 'primeng/dataview';
import {PanelModule} from 'primeng/panel';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {RatingModule} from 'primeng/rating';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  catchError, combineLatest,
  delay,
  delayWhen,
  from, interval,
  map,
  of,
  retry,
  retryWhen,
  Subject,
  takeUntil,
  tap,
  throwError,
  timer, withLatestFrom
} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Recipe} from "../core/model/recipe.model";

@Component({
  selector: 'app-recipes-list',
  standalone: true,
  imports: [CommonModule,
    DataViewModule,
    PanelModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    RippleModule,
    RatingModule, FormsModule, ReactiveFormsModule
  ],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecipesListComponent {


  recipes$ = this.service.recipes$;

  filterRecipesAction$ = this.service.filterRecipesAction$;
  filteredRecipes$ = combineLatest([this.recipes$, this.filterRecipesAction$])
    .pipe(map(([recipes, filter]: [Recipe[], Recipe]) => {
      const filterTitle = filter?.title?.toLowerCase() ?? '';
      return recipes.filter((recipe) => recipe.title?.toLowerCase().includes(filterTitle))
    }));

  stream$ = from(['5', '10', '6', 'Hello', '123']);
  streamOfNumbers$ = this.stream$.pipe(map((value: string) => {
    if (isNaN(value as never)) throw new Error('Not a number');

    return parseInt(value);
  }));

  constructor(private service: RecipesService,
              private http: HttpClient,
              private fb: FormBuilder) {


    //this.replaceStrategy();
    //this.rethrowStrategy();
    //this.retryStrategy();
    //this.retryWhenStrategy();
    //this.retryWhenAndDelayWhenForRetryStrategy();

    //this.sensorsSimulation();
    //this.priceComparator();
    //this.gameSimulation();
  }

  // ngOnInit() {
  //   this.service.recipes$.pipe(takeUntil(this.destroy$)).subscribe((recipes) => {
  //     this.recipes = recipes;
  //     this.filteredRecipes = recipes;
  //   })
  // }


  // filterResults(r: Recipe) {
  //   if (!r.title) return;
  //   this.filteredRecipes = this.recipes.filter(recipe => recipe.title?.indexOf(r.title!) !== 1)
  // }

  public gameSimulation() {
    const gameTimer$ = interval(1000);
    const playerEnergy$ = interval(3000).pipe(map((value) => {
      console.log('>>> energy checking:', value);
      if (value === 2) throw new Error('Player energy is low');
      return Math.floor(Math.random() * 100);
    }));

    gameTimer$.pipe(
      withLatestFrom(playerEnergy$),
      map(([time, playerEnergy]) => {
        return `Time: ${time}, Player Energy: ${playerEnergy}`;
      })
    ).subscribe(console.log)
  }

  public priceComparator() {
    const store1$ = interval(1500).pipe(map(() => Math.floor(Math.random() * 100) + 1));
    const store2$ = interval(1500).pipe(map(() => Math.floor(Math.random() * 100) + 1));

    combineLatest([store1$, store2$]).pipe(
      map(([store1, store2]) => store1 > store2 ? `Store 1 is cheaper ${store1}` : `Store 2 is cheaper ${store2}`)
    ).subscribe(data => {
      console.log('Result:', data);
    })
  }

  public sensorsSimulation() {

    const temperature$ = interval(2000).pipe(map(() => Math.floor(Math.random() * 35) + 15));
    const humidity$ = interval(3000).pipe(map(() => Math.floor(Math.random() * 100)));

    combineLatest([temperature$, humidity$]).pipe(
      map(([temperature, humidity]) => {
        return {temperature, humidity};
      })
    ).subscribe(data => {
      console.log('Temperature and humidity', data);
    })
  }


  public replaceStrategy() {
    console.log('\x1b[36m%s\x1b[0m', '>>> The replace Strategy');
    this.streamOfNumbers$.pipe(
      catchError((error) => {
        console.error(`catchError inside the stream. ${error}`);
        return of();
      })
    ).subscribe({
      next: (res) => console.log(`value emitted: ${res}`),
      complete: () => console.warn('Stream completed')
    })
  }

  public rethrowStrategy() {
    console.log('\x1b[36m%s\x1b[0m', '>>> The rethrow Strategy');
    this.streamOfNumbers$.pipe(
      catchError((error) => {
        console.error(`catchError inside the stream, rethrowing it. ${error}`);
        //throw error; //? Also valid
        return throwError(() => error);
      })
    ).subscribe({
      next: (res) => console.log(`value emitted: ${res}`),
      error: (error) => console.error(`Subscriber Error catch:`, error),
      complete: () => console.warn('Stream completed')
    })
  }

  public retryStrategy() {
    console.log('\x1b[36m%s\x1b[0m', '>>> The retry Strategy');
    this.streamOfNumbers$.pipe(
      retry(2),
      catchError((error) => {
        console.error(`Caught error, rethrowing it.`, error);
        //throw error; //? Also valid
        return throwError(() => error);
      })
    ).subscribe({
      next: (res) => console.log(`value emitted: ${res}`),
      error: (error) => console.error(`Subscriber Error catch:`, error),
      complete: () => console.warn('Stream completed')
    })
  }

  public retryWhenStrategy() {
    console.log('\x1b[36m%s\x1b[0m', '>>> The retryWhen Strategy');
    this.streamOfNumbers$.pipe(
      retryWhen((errors) => {
        return errors.pipe(
          tap(() => console.warn('Retrying...')),
          delay(5000) // Espera 1 segundo antes de reintentar
        );
      }),
      catchError((error) => {
        console.error(`Caught error, rethrowing it.`, error);
        //throw error; //? Also valid
        return throwError(() => error);
      })
    ).subscribe({
      next: (res) => console.log(`value emitted: ${res}`),
      error: (error) => console.error(`Subscriber Error catch:`, error),
      complete: () => console.warn('Stream completed')
    })
  }

  public retryWhenAndDelayWhenForRetryStrategy() {
    console.log('\x1b[36m%s\x1b[0m', '>>> The retryWhen and delayWhen for retry Strategy');

    this.http.get<Recipe[]>('http://localhost:3001/recipes').pipe(
      retryWhen(errors => {
          return errors.pipe(
            delayWhen(() => timer(5000)),
            tap(() => console.log('Retrying HTTP request...'))
          )
        }
      )
    ).subscribe(value => {
      console.log('HTTP request completed', value);
    });
  }

}
