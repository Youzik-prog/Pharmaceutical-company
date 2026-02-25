import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingProcessComponent } from './testing-process.component';

describe('TestingProcessComponent', () => {
  let component: TestingProcessComponent;
  let fixture: ComponentFixture<TestingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestingProcessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestingProcessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
