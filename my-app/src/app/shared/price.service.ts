import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  private priceRangeSubject = new BehaviorSubject<{ min: number; max: number }>({ min: 0, max: 1000 });
  priceRange$ = this.priceRangeSubject.asObservable();

  setPriceRange(range: { min: number; max: number }) {
    this.priceRangeSubject.next(range);
  }
}
