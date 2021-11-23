import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolusersComponent } from './solusers.component';

describe('SolusersComponent', () => {
  let component: SolusersComponent;
  let fixture: ComponentFixture<SolusersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolusersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
