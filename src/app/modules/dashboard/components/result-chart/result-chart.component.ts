import { Component, OnDestroy, OnInit } from '@angular/core';
import { Chart, ChartPoint } from 'chart.js';
import * as _ from 'lodash';
import { IPoint, IRegressionGraph } from 'rechenmodul-core/dist';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResultChartService } from '../../services';

@Component({
    selector: 'app-result-chart',
    templateUrl: './result-chart.component.html',
    styleUrls: ['./result-chart.component.scss'],
})
export class ResultChartComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    scatterPoints: ChartPoint[] = [];
    linePoints: ChartPoint[] = [];
    regressionGraph: IRegressionGraph | undefined;
    chart: Chart | undefined;
    quality: number | undefined;
    equation: string | undefined = '-';

    constructor(private resultChartService: ResultChartService) {}

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
            this.quality = _.round(item.regressionGraph.quality, 2);
            if (item.regressionGraph.xAxisSection != undefined || item.regressionGraph.yAxisSection != undefined) {
                this.equation =
                    item.regressionGraph.xAxisSection === undefined
                        ? `y = ${item.regressionGraph.incline === undefined ? 'm' : _.round(item.regressionGraph.incline, 2)} * x + ${
                              item.regressionGraph.yAxisSection === undefined ? 'c' : _.round(item.regressionGraph.yAxisSection, 2)
                          }`
                        : `x = ${_.round(item.points[0].x, 2)}`;
            }

            this.linePoints = this.getTwoPoints(item.regressionGraph, item.points);
            this.chart = new Chart('canvas', {
                type: 'scatter',
                data: {
                    datasets: [
                        {
                            label: 'Punkte',
                            data: this.scatterPoints,
                            pointBackgroundColor: '#ff6384',
                            backgroundColor: '#ff6384',
                        },
                        {
                            label: 'Regressionsgerade',
                            type: 'line',
                            data: this.linePoints,
                            fill: false,
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
