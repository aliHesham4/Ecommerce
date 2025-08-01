import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpopupComponent } from './searchpopup.component';

describe('SearchpopupComponent', () => {
  let component: SearchpopupComponent;
  let fixture: ComponentFixture<SearchpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
