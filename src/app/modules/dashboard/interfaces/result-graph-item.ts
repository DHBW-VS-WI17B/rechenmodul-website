import { IPoint, IRegressionGraph } from '@dhbw-vs-wi17b/rechenmodul-core';

export interface IResultGraphItem {
    regressionGraph: IRegressionGraph | undefined;
    points: IPoint[];
}
