import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { IPoint } from '../../interfaces';
import { PointSequenceService } from '../../services';

interface IPointSequenceElement extends IPoint {
    isSelected: boolean;
}

@Component({
    selector: 'app-point-sequence',
    templateUrl: './point-sequence.component.html',
    styleUrls: ['./point-sequence.component.scss'],
})
export class PointSequenceComponent implements OnInit {
    constructor(private pointSequenceService: PointSequenceService) {}

    public elements: IPointSequenceElement[] = [];
    public globalSelectStatus: boolean = false;
    public inputValueX: number | undefined;
    public inputValueY: number | undefined;

    public pointForm: FormGroup | undefined;

    public test: any;

    ngOnInit(): void {
        this.pointSequenceService.points$.subscribe(points => {
            this.elements = this.convertPointsToPointSequenceElements(points, this.elements, this.globalSelectStatus);
        });
    }

    public convertPointsToPointSequenceElements(
        points: IPoint[],
        existingElements: IPointSequenceElement[],
        globalSelectStatus: boolean,
    ): IPointSequenceElement[] {
        const elements: IPointSequenceElement[] = [];
        for (const point of points) {
            const element: IPointSequenceElement = {
                id: point.id,
                value: {
                    x: point.value.x,
                    y: point.value.y,
                },
                isSelected: false,
            };
            const existingElement = _.find(existingElements, _existingElement => {
                return _existingElement.id === element.id;
            });
            if (existingElement) {
                element.isSelected = existingElement.isSelected;
            } else {
                element.isSelected = globalSelectStatus === true;
            }
            elements.push(element);
        }
        return elements;
    }

    public masterToggle(status: boolean): void {
        status === true ? this.selectAllElements() : this.unselectAllElements();
        this.globalSelectStatus = status;
    }

    private selectAllElements(): void {
        this.elements.forEach(element => (element.isSelected = true));
    }

    private unselectAllElements(): void {
        this.elements.forEach(element => (element.isSelected = false));
    }

    public addPoint(x: number | undefined, y: number | undefined): void {
        if (x === undefined || y === undefined) {
            return;
        }
        this.pointSequenceService.addPoint({ x: x, y: y });
    }

    public updatePointValueX(element: IPointSequenceElement, updatedValue: number): void {
        element.value.x = updatedValue;
        this.pointSequenceService.updatePointById(element.id, element.value);
    }

    public updatePointValueY(element: IPointSequenceElement, updatedValue: number): void {
        element.value.y = updatedValue;
        this.pointSequenceService.updatePointById(element.id, element.value);
    }

    public getSelectedElements(elements: IPointSequenceElement[]): IPointSequenceElement[] {
        const selectedElements: IPointSequenceElement[] = [];
        for (const element of elements) {
            if (!element.isSelected) {
                continue;
            }
            selectedElements.push(element);
        }
        return selectedElements;
    }

    private areAllElementsSelected(elements: IPointSequenceElement[]): boolean {
        const selectedElements = this.getSelectedElements(elements);
        return selectedElements.length === elements.length;
    }

    public removeSelectedPoints(elements: IPointSequenceElement[]): void {
        const selectedElements = this.getSelectedElements(elements);
        for (const element of selectedElements) {
            this.pointSequenceService.removePointById(element.id);
        }
    }

    public toggleElementSelection(elements: IPointSequenceElement[], status: boolean): void {
        if (status === false) {
            this.globalSelectStatus = false;
        } else {
            const areAllElementsSelected = this.areAllElementsSelected(elements);
            this.globalSelectStatus = areAllElementsSelected;
        }
    }

    public trackByFn(index: number, item: IPoint) {
        return item.id;
    }
}
