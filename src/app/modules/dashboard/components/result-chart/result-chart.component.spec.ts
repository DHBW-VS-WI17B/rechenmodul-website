import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultChartComponent } from './result-chart.component';

describe('ResultChartComponent', () => {
    let component: ResultChartComponent;
    let fixture: ComponentFixture<ResultChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ResultChartComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ResultChartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
