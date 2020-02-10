import { IPoint, IRegressionGraph } from 'rechenmodul-core/dist';

export interface IResultGraphItem {
    regressionGraph: IRegressionGraph | undefined;
    points: IPoint[];
}
