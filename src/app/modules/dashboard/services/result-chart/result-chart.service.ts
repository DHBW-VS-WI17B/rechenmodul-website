import { Injectable } from '@angular/core';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class ResultChartService {
    constructor(private resultService: ResultService) {}
}
