import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleAuthComponent } from './sample-auth.component';

describe('SampleAuthComponent', () => {
  let component: SampleAuthComponent;
  let fixture: ComponentFixture<SampleAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SampleAuthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SampleAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
