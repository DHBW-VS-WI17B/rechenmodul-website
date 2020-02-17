import { IPoint, IRegressionGraph } from '@dhbw-vs-wi17b/rechenmodul-core';

export interface ICalculationResult {
    oneDimensionalMean: IPoint;
    variance: IPoint | undefined;
    covariance: number | undefined;
    correlationCoefficient: number | undefined;
    regressionGraph: IRegressionGraph | undefined;
    points: IPoint[];
}
