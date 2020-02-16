import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { calcCorrelationCoefficient, calcCovariance, calcOneDimensionalMean, calcRegressionGraph, calcVariance } from 'rechenmodul-core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ICalculationResult, IPoint } from '../../interfaces';
import { PointsService } from '../points/points.service';

@Injectable({
    providedIn: 'root',
})
/** @class CalculationService. */
export class CalculationService {
    /**
     * creates a instance of the service
     * @param  {PointsService} PointsService
     */
    constructor(private pointsService: PointsService) {}

    /**
     * calculates all results with the given points
     * @param  {IPoint[]} points
     * @returns {Promise<ICalculationResult | undefined>}
     */
    public async calculate(points: IPoint[]): Promise<ICalculationResult | undefined> {
        if (points.length < 1) {
            return undefined;
        }
        const oneDimensionalMean = await calcOneDimensionalMean(points);
        const calculationResult: ICalculationResult = {
            correlationCoefficient: undefined,
            covariance: undefined,
            variance: undefined,
            oneDimensionalMean: this.roundPoint(oneDimensionalMean),
            points: points,
            regressionGraph: undefined,
        };
        if (points.length > 1) {
            const variance = await calcVariance(points, oneDimensionalMean);
            const covariance = await calcCovariance(points, oneDimensionalMean);
            const correlationCoefficient = await calcCorrelationCoefficient(points, variance, covariance);
            const regressionGraph = await calcRegressionGraph(points, variance, covariance, oneDimensionalMean);
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

    /**
     * rounds number on two decimal places
     * @param  {number} num
     * @returns {number}
     */
    private roundNumber(num: number): number {
        return _.round(num, 2);
    }

    /**
     * rounds point values on two decimal places
     * @param  {IPoint} point
     * @returns {IPoint}
     */
    private roundPoint(point: IPoint): IPoint {
        return <IPoint>{ x: this.roundNumber(point.x), y: this.roundNumber(point.y) };
    }

    /**
     * Returns CalculationResult as an observable
     * @returns {Observable<ICalculationResult | undefined>}
     */
    public get calculate$(): Observable<ICalculationResult | undefined> {
        return this.pointsService.points$.pipe(
            switchMap(points => {
                return this.calculate(points);
            }),
        );
    }
}
