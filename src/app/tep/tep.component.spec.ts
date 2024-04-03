import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TepComponent } from './tep.component';

describe('TepComponent', () => {
  let component: TepComponent;
  let fixture: ComponentFixture<TepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TepComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
