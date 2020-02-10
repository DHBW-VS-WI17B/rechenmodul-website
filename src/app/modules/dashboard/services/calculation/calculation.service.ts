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
        if (points.length < 1) {
            return undefined;
        }
        const pointsForCore = this.convertPoints(points);
        const oneDimensionalMean = await calcOneDimensionalMean(pointsForCore);
        const calculationResult: ICalculationResult = {
            correlationCoefficient: undefined,
            covariance: undefined,
            variance: undefined,
            oneDimensionalMean: this.roundPoint(oneDimensionalMean),
            points: pointsForCore,
            regressionGraph: undefined,
        };
        if (points.length > 1) {
            const variance = await calcVariance(pointsForCore, oneDimensionalMean);
            const covariance = await calcCovariance(pointsForCore, oneDimensionalMean);
            const correlationCoefficient = await calcCorrelationCoefficient(pointsForCore, variance, covariance);
            const regressionGraph = await calcRegressionGraph(pointsForCore, variance, covariance, oneDimensionalMean);
            calculationResult.variance = this.roundPoint(variance);
            calculationResult.covariance = this.roundNumber(covariance);
            calculationResult.correlationCoefficient = this.roundNumber(correlationCoefficient);
            calculationResult.regressionGraph = {
                quality: this.roundNumber(regressionGraph.quality),
                incline: regressionGraph.incline === undefined ? undefined : this.roundNumber(regressionGraph.incline),
                xAxisSection: regressionGraph.xAxisSection === undefined ? undefined : this.roundNumber(regressionGraph.xAxisSection),
                yAxisSection: regressionGraph.yAxisSection === undefined ? undefined : this.roundNumber(regressionGraph.yAxisSection),
            };
        }
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
