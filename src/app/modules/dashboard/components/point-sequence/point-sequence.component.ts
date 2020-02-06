import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { MatTableDataSource } from '@angular/material/table';
import { IPoint } from '../../interfaces';
import { PointSequenceService } from '../../services';
import { EditPointDialogComponent } from '../edit-point-dialog/edit-point-dialog.component';

@Component({
    selector: 'app-point-sequence',
    templateUrl: './point-sequence.component.html',
    styleUrls: ['./point-sequence.component.scss'],
})
export class PointSequenceComponent implements OnInit {
    constructor(private pointSequenceService: PointSequenceService, public dialog: MatDialog) {}

    private points: IPoint[] = [];
    private xValueControl: FormControl | undefined;
    private yValueControl: FormControl | undefined;

    public pointForm: FormGroup | undefined;
    public displayedColumns: string[] = ['select', 'xValue', 'yValue', 'actions'];
    public dataSource = new MatTableDataSource<IPoint>(this.points);
    public selection = new SelectionModel<IPoint>(true, []);

    ngOnInit(): void {
        this.pointSequenceService.points$.subscribe((data: IPoint[]) => {
            this.dataSource.data = data;
        });
        this.xValueControl = new FormControl('', [
            Validators.required,
            Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
            Validators.minLength(1),
        ]);
        this.yValueControl = new FormControl('', [
            Validators.required,
            Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
            Validators.minLength(1),
        ]);
        this.pointForm = new FormGroup({
            xValueControl: this.xValueControl,
            yValueControl: this.yValueControl,
        });
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows && this.dataSource.data.length !== 0;
    }

    masterToggle(): void {
        this.isAllSelected() ? this.selection.clear() : this.selectAllRows();
    }

    selectAllRows(): void {
        this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: IPoint): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
    }

    addPoint(): void {
        if (!this.pointForm || !this.xValueControl || !this.yValueControl || !this.pointForm.valid) {
            return;
        }
        let selectAll = false;
        if (this.isAllSelected()) {
            selectAll = true;
        }
        this.pointSequenceService.addPoint({ x: this.xValueControl.value, y: this.yValueControl.value });
        if (selectAll) {
            this.selectAllRows();
        }
    }

    removeSelectedPoints(): void {
        this.selection.selected.forEach(point => {
            this.pointSequenceService.removePointById(point.id);
            this.selection.deselect(point);
        });
    }

    editPoint(event: any, point: IPoint): void {
        event.stopPropagation();
        const dialogRef = this.dialog.open(EditPointDialogComponent, {
            width: '450px',
            data: point.value,
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.pointSequenceService.updatePointById(point.id, result);
            }
        });
    }
}
