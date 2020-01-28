import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PointSequenceComponent } from './point-sequence.component';

describe('PointSequenceComponent', () => {
    let component: PointSequenceComponent;
    let fixture: ComponentFixture<PointSequenceComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PointSequenceComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PointSequenceComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
