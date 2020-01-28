import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContingencyTableComponent, DashboardComponent, PointSequenceComponent } from './components';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [CommonModule, FormsModule, DashboardRoutingModule],
    declarations: [ContingencyTableComponent, DashboardComponent, PointSequenceComponent],
})
export class DashboardModule {}
