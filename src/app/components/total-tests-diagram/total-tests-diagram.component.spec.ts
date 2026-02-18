import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTestsDiagramComponent } from './total-tests-diagram.component';

describe('TotalTestsDiagramComponent', () => {
  let component: TotalTestsDiagramComponent;
  let fixture: ComponentFixture<TotalTestsDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTestsDiagramComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalTestsDiagramComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
