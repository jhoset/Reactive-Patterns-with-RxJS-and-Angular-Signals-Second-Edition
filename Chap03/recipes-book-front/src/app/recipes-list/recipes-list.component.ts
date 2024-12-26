import {ChangeDetectionStrategy, Component} from '@angular/core';
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
import {FormsModule} from '@angular/forms';
import {catchError, delay, delayWhen, from, map, of, retry, retryWhen, tap, throwError, timer} from "rxjs";
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
    RatingModule, FormsModule
  ],
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class RecipesListComponent {
  recipes$ = this.service.recipes$;

  stream$ = from(['5', '10', '6', 'Hello', '123']);
  streamOfNumbers$ = this.stream$.pipe(map((value: string) => {
    if (isNaN(value as never)) throw new Error('Not a number');

    return parseInt(value);
  }));

  constructor(private service: RecipesService,
              private http: HttpClient) {

    //this.replaceStrategy();
    //this.rethrowStrategy();
    //this.retryStrategy();
    //this.retryWhenStrategy();
    //this.retryWhenAndDelayWhenForRetryStrategy();
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
