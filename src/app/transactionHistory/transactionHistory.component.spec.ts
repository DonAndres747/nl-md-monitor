import { ComponentFixture, TestBed } from '@angular/core/testing';

import { transactionComponent } from './transactionHistory.component';

describe('WMSComponent', () => {
  let component: transactionComponent;
  let fixture: ComponentFixture<transactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [transactionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(transactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
