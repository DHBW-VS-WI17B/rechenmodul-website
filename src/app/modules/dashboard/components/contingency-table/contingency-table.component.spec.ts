import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContingencyTableComponent } from './contingency-table.component';

describe('ContingencyTableComponent', () => {
    let component: ContingencyTableComponent;
    let fixture: ComponentFixture<ContingencyTableComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContingencyTableComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContingencyTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
