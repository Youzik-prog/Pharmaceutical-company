import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigracalmXComponent } from './migracalm-x.component';

describe('MigracalmXComponent', () => {
  let component: MigracalmXComponent;
  let fixture: ComponentFixture<MigracalmXComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MigracalmXComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MigracalmXComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
