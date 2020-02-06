import { Injectable } from '@angular/core';
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

    public async calculate(points: IPoint[]): Promise<ICalculationResult> {
        const pointsForCore = this.convertPoints(points);
        const oneDimensionalMean = await calcOneDimensionalMean(pointsForCore);
        const variance = await calcVariance(pointsForCore, oneDimensionalMean);
        const covariance = await calcCovariance(pointsForCore, oneDimensionalMean);
        const correlationCoefficient = await calcCorrelationCoefficient(pointsForCore, variance, covariance);
        const regressionGraph = await calcRegressionGraph(pointsForCore, variance, covariance, oneDimensionalMean);
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

    public get calculate$(): Observable<ICalculationResult> {
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
