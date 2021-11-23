import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolareasComponent } from './solareas.component';

describe('SolareasComponent', () => {
  let component: SolareasComponent;
  let fixture: ComponentFixture<SolareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolareasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
