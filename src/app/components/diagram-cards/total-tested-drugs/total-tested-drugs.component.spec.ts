import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTestedDrugsComponent } from './total-tested-drugs.component';

describe('TotalTestedDrugsComponent', () => {
  let component: TotalTestedDrugsComponent;
  let fixture: ComponentFixture<TotalTestedDrugsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTestedDrugsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalTestedDrugsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
