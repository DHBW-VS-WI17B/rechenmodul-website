import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPointDialogComponent } from './edit-point-dialog.component';

describe('EditPointDialogComponent', () => {
  let component: EditPointDialogComponent;
  let fixture: ComponentFixture<EditPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPointDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
