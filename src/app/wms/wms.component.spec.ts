import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WMSComponent } from './wms.component';

describe('WMSComponent', () => {
  let component: WMSComponent;
  let fixture: ComponentFixture<WMSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WMSComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WMSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
