import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { ContingencyTableComponent, DashboardComponent, PointSequenceComponent } from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, DashboardRoutingModule, SharedModule],
    declarations: [ContingencyTableComponent, DashboardComponent, PointSequenceComponent],
})
export class DashboardModule {}
