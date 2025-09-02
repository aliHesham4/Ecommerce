import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewpopupComponent } from './previewpopup.component';

describe('PreviewpopupComponent', () => {
  let component: PreviewpopupComponent;
  let fixture: ComponentFixture<PreviewpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewpopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
