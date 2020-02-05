import { Injectable } from '@angular/core';
import {
    calcCorrelationCoefficient,
    calcCovariance,
    calcOneDimensionalMean,
    calcRegressionGraph,
    calcVariance,
    IPoint,
} from 'rechenmodul-core';
import { ICalculationResult } from '../../interfaces';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class CalculationService {
    constructor(private resultService: ResultService) {}

    public async calculate(points: IPoint[]): Promise<void> {
        const oneDimensionalMean = await calcOneDimensionalMean(points);
        const variance = await calcVariance(points, oneDimensionalMean);
        const covariance = await calcCovariance(points, oneDimensionalMean);
        const correlationCoefficient = await calcCorrelationCoefficient(points, variance, covariance);
        const regressionGraph = await calcRegressionGraph(points, variance, covariance, oneDimensionalMean);
        const calculationResult = <ICalculationResult>{
            correlationCoefficient: correlationCoefficient,
            covariance: covariance,
            variance: variance,
            oneDimensionalMean: oneDimensionalMean,
            points: points,
            regressionGraph: regressionGraph,
        };
        this.resultService.setResult(calculationResult);
    }
}
