import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterpopupComponent } from './filterpopup.component';

describe('FilterpopupComponent', () => {
  let component: FilterpopupComponent;
  let fixture: ComponentFixture<FilterpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
