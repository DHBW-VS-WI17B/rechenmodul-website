import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Config } from '@app/config';
import { Chart, ChartPoint } from 'chart.js';
import { IPoint, IRegressionGraph } from 'rechenmodul-core/dist';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResultChartService } from '../../services';

@Component({
    selector: 'app-result-chart',
    templateUrl: './result-chart.component.html',
    styleUrls: ['./result-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultChartComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    scatterPoints: ChartPoint[] = [];
    linePoints: ChartPoint[] = [];
    regressionGraph: IRegressionGraph | undefined;
    chart: Chart | undefined;

    constructor(private resultChartService: ResultChartService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    private init(): void {
        this.resultChartService.items$.pipe(takeUntil(this.isDestroyed$)).subscribe(item => {
            this.scatterPoints = [];
            item.points.forEach(point => {
                this.scatterPoints.push({ x: point.x, y: point.y });
            });
            this.linePoints = this.getTwoPoints(item.regressionGraph, item.points);
            this.chart = new Chart('canvas', {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Punkte',
                            data: this.scatterPoints,
                            backgroundColor: Config.THEME_SECONDARY_HEX_COLOR,
                            borderColor: Config.THEME_SECONDARY_HEX_COLOR,
                        },
                        {
                            label: 'Regressionsgerade',
                            type: 'line',
                            data: this.linePoints,
                            fill: false,
                            backgroundColor: Config.THEME_PRIMARY_HEX_COLOR,
                            borderColor: Config.THEME_PRIMARY_HEX_COLOR,
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                stacked: true,
                            },
                        ],
                    },
                },
            });
            this.changeDetection.markForCheck();
        });
    }

    private getTwoPoints(regressionGraph: IRegressionGraph, points: IPoint[]): ChartPoint[] {
        const max = Math.max.apply(
            Math,
            points.map(point => {
                return point.x;
            }),
        );
        const min = Math.min.apply(
            Math,
            points.map(point => {
                return point.x;
            }),
        );
        if (regressionGraph.xAxisSection !== undefined) {
            return [
                { x: min, y: regressionGraph.xAxisSection },
                { x: max, y: regressionGraph.xAxisSection },
            ];
        } else if (regressionGraph.yAxisSection !== undefined && regressionGraph.incline !== undefined) {
            return [
                { x: min, y: this.getYForX(regressionGraph.incline, regressionGraph.yAxisSection, min) },
                { x: max, y: this.getYForX(regressionGraph.incline, regressionGraph.yAxisSection, max) },
            ];
        }
        return [];
    }

    private getYForX(m: number, c: number, x: number): number {
        return m * x + c;
    }
}
