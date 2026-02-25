import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberOfPeopleTestedComponent } from './number-of-people-tested.component';

describe('NumberOfPeopleTestedComponent', () => {
  let component: NumberOfPeopleTestedComponent;
  let fixture: ComponentFixture<NumberOfPeopleTestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberOfPeopleTestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumberOfPeopleTestedComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
