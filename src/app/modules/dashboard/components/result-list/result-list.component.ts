import { Component, OnInit } from '@angular/core';
import { ResultListService } from '../../services';

@Component({
    selector: 'app-result-list',
    templateUrl: './result-list.component.html',
    styleUrls: ['./result-list.component.scss'],
})
export class ResultListComponent implements OnInit {
    constructor(private resultListService: ResultListService) {}

    ngOnInit() {}
}
