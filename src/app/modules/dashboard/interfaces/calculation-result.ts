import { IPoint, IRegressionGraph } from 'rechenmodul-core';

export interface ICalculationResult {
    oneDimensionalMean: IPoint;
    variance: IPoint;
    covariance: number;
    correlationCoefficient: number;
    regressionGraph: IRegressionGraph;
    points: IPoint[];
}
