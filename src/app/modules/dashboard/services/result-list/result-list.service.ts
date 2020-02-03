import { Injectable } from '@angular/core';
import { ResultService } from '../result/result.service';

@Injectable({
    providedIn: 'root',
})
export class ResultListService {
    constructor(private resultService: ResultService) {}
}
