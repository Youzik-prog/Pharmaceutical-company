import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugApprovalRatesComponent } from './drug-approval-rates.component';

describe('DrugApprovalRatesComponent', () => {
  let component: DrugApprovalRatesComponent;
  let fixture: ComponentFixture<DrugApprovalRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrugApprovalRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrugApprovalRatesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
