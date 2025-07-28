import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductlayerComponent } from './productlayer.component';

describe('ProductlayerComponent', () => {
  let component: ProductlayerComponent;
  let fixture: ComponentFixture<ProductlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductlayerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
