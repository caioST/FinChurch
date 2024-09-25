import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityKeyPage } from './security-key.page';

describe('SecurityKeyPage', () => {
  let component: SecurityKeyPage;
  let fixture: ComponentFixture<SecurityKeyPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityKeyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
