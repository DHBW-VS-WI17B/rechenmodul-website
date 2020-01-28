import { Component, OnInit } from '@angular/core';
import { PointSequenceService } from '../../services';

@Component({
    selector: 'app-point-sequence',
    templateUrl: './point-sequence.component.html',
    styleUrls: ['./point-sequence.component.scss'],
})
export class PointSequenceComponent implements OnInit {
    constructor(private pointSequenceService: PointSequenceService) {}

    ngOnInit() {}
}
