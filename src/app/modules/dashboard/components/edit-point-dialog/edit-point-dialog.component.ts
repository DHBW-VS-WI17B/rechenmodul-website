import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// tslint:disable-next-line: ordered-imports
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IPointValue } from '../../interfaces';

@Component({
    selector: 'app-edit-point-dialog',
    templateUrl: './edit-point-dialog.component.html',
    styleUrls: ['./edit-point-dialog.component.scss'],
})
export class EditPointDialogComponent implements OnInit {
    private xValueControl: FormControl;
    private yValueControl: FormControl;

    public pointForm: FormGroup;

    constructor(public dialogRef: MatDialogRef<EditPointDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: IPointValue) {}

    ngOnInit(): void {
        this.xValueControl = new FormControl(this.data.x, [
            Validators.required,
            Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
            Validators.minLength(1),
        ]);
        this.yValueControl = new FormControl(this.data.y, [
            Validators.required,
            Validators.pattern('^-?[0-9]\\d*(\\.\\d+)?$'),
            Validators.minLength(1),
        ]);
        this.pointForm = new FormGroup({
            xValueControl: this.xValueControl,
            yValueControl: this.yValueControl,
        });
    }

    cancel(): void {
        this.dialogRef.close();
    }

    edit(): void {
        const pointValue: IPointValue = { x: this.xValueControl.value, y: this.yValueControl.value };
        this.dialogRef.close(pointValue);
    }
}
