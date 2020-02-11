import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Config } from '@app/config';
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
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/** @class ResultChartComponent */
export class ResultChartComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public chart: Chart | undefined;

    /**
     * @param  {ResultChartService} privateresultChartService
     * @param  {ChangeDetectorRef} privatechangeDetection
     */
    constructor(private resultChartService: ResultChartService, private changeDetection: ChangeDetectorRef) {}

    ngOnInit() {
        this.init();
    }

    /**
     * Unsuscribe from Pointobservable
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * Suscribes to the PointObservable and map to pointvalues to scatterpoints
     */
    private init(): void {
        this.chart = this.createChart([], []);
        this.resultChartService.items$.pipe(takeUntil(this.isDestroyed$)).subscribe(item => {
            const scatterPoints = _.map(item.points, point => {
                return { x: point.x, y: point.y };
            });
            const linePoints = item.regressionGraph === undefined ? [] : this.getTwoPoints(item.regressionGraph, item.points);
            this.updateChart(scatterPoints, linePoints);
            this.changeDetection.markForCheck();
        });
    }

    /**
     * Creates a ChartJS Chart with scatterpoints and regressionline
     * @param  {ChartPoint[]} scatterPoints Points for the scatterchart
     * @param  {ChartPoint[]} linePoints Points for the regressionline
     * @returns {Chart}
     */
    private createChart(scatterPoints: ChartPoint[], linePoints: ChartPoint[]): Chart {
        const chart = new Chart('canvas', {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'Punkte',
                        data: scatterPoints,
                        backgroundColor: Config.THEME_SECONDARY_HEX_COLOR,
                        borderColor: Config.THEME_SECONDARY_HEX_COLOR,
                    },
                    {
                        label: 'Regressionsgerade',
                        type: 'line',
                        data: linePoints,
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
                            scaleLabel: {
                                display: true,
                                labelString: 'y',
                            },
                        },
                    ],
                    xAxes: [
                        {
                            scaleLabel: {
                                display: true,
                                labelString: 'x',
                            },
                        },
                    ],
                },
            },
        });
        return chart;
    }

    /**
     * Update values of the chart
     * @param  {ChartPoint[]} scatterPoints Points for the scatterchart
     * @param  {ChartPoint[]} linePoints Points for the regressionline
     */
    private updateChart(scatterPoints: ChartPoint[], linePoints: ChartPoint[]): void {
        if (!this.chart || !this.chart.data.datasets || this.chart.data.datasets.length < 2) {
            return;
        }

        if (linePoints.every((val, _i, arr) => val.x === arr[0].x)) {
            this.chart.data.datasets[1].hidden = true;
        } else {
            this.chart.data.datasets[1].hidden = false;
        }

        this.chart.data.datasets[0].data = scatterPoints;
        this.chart.data.datasets[1].data = linePoints;
        this.chart.update();
    }

    /**
     * Gets two points to draw the regressionline
     * @param  {IRegressionGraph} regressionGraph RegressiongraphResult from the resultservice
     * @param  {IPoint[]} points points for the scatterchart
     * @returns {ChartPoint[]}
     */
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

    /**
     * Calculates the y-Value with the line function
     * @param  {number} m
     * @param  {number} c
     * @param  {number} x
     * @returns {number} Y-Value
     */
    private getYForX(m: number, c: number, x: number): number {
        return m * x + c;
    }

    /**
     * Fixes chart on resize of the window
     * @param  {any} event
     */
    @HostListener('window:resize', ['$event'])
    public onResize(event: any) {
        if (!this.chart) {
            return;
        }
        this.chart.resize();
        this.chart.update();
    }
}
