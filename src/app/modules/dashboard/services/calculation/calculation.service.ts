import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
    calcCorrelationCoefficient,
    calcCovariance,
    calcOneDimensionalMean,
    calcRegressionGraph,
    calcVariance,
    IPoint as IPoint_Core,
} from 'rechenmodul-core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICalculationResult, IPoint } from '../../interfaces';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
export class CalculationService {
    constructor(private pointsService: PointsService) {}

    public async calculate(points: IPoint[]): Promise<ICalculationResult | undefined> {
        if (points.length < 2) {
            return undefined;
        }
        const pointsForCore = this.convertPoints(points);
        const oneDimensionalMean = this.roundPoint(await calcOneDimensionalMean(pointsForCore));
        const variance = this.roundPoint(await calcVariance(pointsForCore, oneDimensionalMean));
        const covariance = this.roundNumber(await calcCovariance(pointsForCore, oneDimensionalMean));
        const correlationCoefficient = this.roundNumber(await calcCorrelationCoefficient(pointsForCore, variance, covariance));
        const regressionGraph = await calcRegressionGraph(pointsForCore, variance, covariance, oneDimensionalMean);
        regressionGraph.quality = this.roundNumber(regressionGraph.quality);
        if (regressionGraph.incline !== undefined) regressionGraph.incline = this.roundNumber(regressionGraph.incline);
        if (regressionGraph.xAxisSection !== undefined) regressionGraph.xAxisSection = this.roundNumber(regressionGraph.xAxisSection);
        if (regressionGraph.yAxisSection !== undefined) regressionGraph.yAxisSection = this.roundNumber(regressionGraph.yAxisSection);
        const calculationResult = <ICalculationResult>{
            correlationCoefficient: correlationCoefficient,
            covariance: covariance,
            variance: variance,
            oneDimensionalMean: oneDimensionalMean,
            points: pointsForCore,
            regressionGraph: regressionGraph,
        };
        return calculationResult;
    }

    private roundNumber(num: number): number {
        return _.round(num, 2);
    }

    private roundPoint(point: IPoint_Core): IPoint_Core {
        return <IPoint_Core>{ x: this.roundNumber(point.x), y: this.roundNumber(point.y) };
    }

    public get calculate$(): Observable<ICalculationResult | undefined> {
        return this.pointsService.points$.pipe(
            switchMap(points => {
                return this.calculate(points);
            }),
        );
    }

    private convertPoints(points: IPoint[]): IPoint_Core[] {
        const corePoints: IPoint_Core[] = [];
        for (const point of points) {
            corePoints.push({ x: point.value.x, y: point.value.y });
        }
        return corePoints;
    }
}
