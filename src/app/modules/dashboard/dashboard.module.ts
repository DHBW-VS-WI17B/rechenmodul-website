import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import {
    ContingencyTableComponent,
    DashboardComponent,
    PointSequenceComponent,
    ResultChartComponent,
    ResultListComponent,
} from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, DashboardRoutingModule, SharedModule, ReactiveFormsModule],
    declarations: [ContingencyTableComponent, DashboardComponent, PointSequenceComponent, ResultListComponent, ResultChartComponent],
})
export class DashboardModule {}
