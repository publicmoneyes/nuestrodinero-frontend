import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Contract } from '../contracts/components/contract/contract.model';
import { AppStoreService } from './app-store.service';
import { AppState } from './app.state';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BoeService {
  private url = environment.serverUrl;

  private isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private isSearchDisabled: BehaviorSubject<boolean> = new BehaviorSubject(false);

  isLoading$ = this.isLoading.asObservable();
  isSearchDisabled$ = this.isSearchDisabled.asObservable();

  constructor(private http: HttpClient, private appStore: AppStoreService) {}

  getAds(start: Date, end: Date = new Date()): Observable<Contract[]> {
    this.isLoading.next(true);

    // Parse to UTC
    start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
    end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

    return this.http.get<Contract[]>(`${this.url}/contracts?dateStart=${start.getTime()}&dateEnd=${end.getTime()}`).pipe(
      tap((contractCollection) => {
        this.saveContractsToState(contractCollection, start, end);
      }),
      catchError(this.adErrHandler.bind(this))
    );
  }

  getAdByBoeId(boeId: string): Observable<Contract> {
    return this.http.get<Contract>(`${this.url}/contract?boeid=${boeId}`);
  }

  disableSearch(): void {
    this.isSearchDisabled.next(true);
  }

  enableSearch(): void {
    this.isSearchDisabled.next(false);
  }

  private saveContractsToState(contracts: Contract[], start: Date, end: Date): void {
    let state: AppState = {
      contractCollection: contracts,
      dateStart: start,
      dateEnd: end,
    };

    this.appStore.setState(state);
    this.isLoading.next(false);
  }

  adErrHandler(err): Observable<Contract[]> {
    console.warn('BoeService warning -> ', err);
    this.isLoading.next(false);

    return of([]);
  }
}
