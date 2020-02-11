import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Config } from '@app/config';
import * as _ from 'lodash';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPoint } from '../../interfaces';
import { PointSequenceService } from '../../services';

interface IPointSequenceElement extends IPoint {
    isSelected: boolean;
}

@Component({
    selector: 'app-point-sequence',
    templateUrl: './point-sequence.component.html',
    styleUrls: ['./point-sequence.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

/** @class PointSequenceComponent. */
export class PointSequenceComponent implements OnInit, OnDestroy {
    private isDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    public elements: IPointSequenceElement[] = [];
    public globalSelectStatus: boolean = false;
    public inputValueX: number | undefined;
    public inputValueY: number | undefined;

    public pointForm: FormGroup | undefined;

    /**
     * @param  {PointSequenceService} privatepointSequenceService
     * @param  {ChangeDetectorRef} privatechangeDetection
     */
    constructor(private pointSequenceService: PointSequenceService, private changeDetection: ChangeDetectorRef) {}

    /**
     * Suscribes to the PointObservable
     */
    ngOnInit(): void {
        this.pointSequenceService.points$.pipe(takeUntil(this.isDestroyed$)).subscribe(points => {
            this.elements = this.convertPointsToPointSequenceElements(points, this.elements, this.globalSelectStatus);
            this.changeDetection.markForCheck();
        });
    }

    /**
     * Unsubscribe from the PointObservable
     */
    ngOnDestroy() {
        this.isDestroyed$.next(true);
        this.isDestroyed$.complete();
    }

    /**
     * Converts IPoint-Objects to PointSequence-Objects
     * @param  {IPoint[]} points
     * @param  {IPointSequenceElement[]} existingElements
     * @param  {boolean} globalSelectStatus
     * @returns {IPointSequenceElement[]}
     */
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

    /**
     * Checks if button to add point is enabled or disabled
     * @returns {boolean}
     */
    public isSubmitButtonDisabled(): boolean {
        if (_.isNil(this.inputValueX) || _.isNil(this.inputValueY)) {
            return true;
        }
        const numberOfDifferentPointValues = this.pointSequenceService.getNumberOfDifferentPointValues(this.elements);
        const pointValueAlreadyExists = _.find(
            this.elements,
            element => element.value.x === this.inputValueX && element.value.y === this.inputValueY,
        );
        if (numberOfDifferentPointValues < Config.MAX_NUMBER_OF_DIFFERENT_POINT_VALUES && this.elements.length < Config.MAX_SAMPLE_SIZE) {
            return false;
        } else if (!!pointValueAlreadyExists && this.elements.length < Config.MAX_SAMPLE_SIZE) {
            return false;
        }
        return true;
    }

    /**
     * Mastertoggle for the selection of all elements
     * @param  {boolean} status
     */
    public masterToggle(status: boolean): void {
        status === true ? this.selectAllElements() : this.unselectAllElements();
        this.globalSelectStatus = status;
    }

    /**
     * Select all elements in the list of points
     */
    private selectAllElements(): void {
        this.elements.forEach(element => (element.isSelected = true));
    }

    /**
     * unselect all element in the list of points
     */
    private unselectAllElements(): void {
        this.elements.forEach(element => (element.isSelected = false));
    }

    /**
     * Add a Point with value x and y, to the Obserable of points
     * @param  {number|undefined} x The x value of the point
     * @param  {number|undefined} y The y value of the point
     */
    public addPoint(x: number | undefined, y: number | undefined): void {
        if (x === undefined || y === undefined) {
            return;
        }
        this.pointSequenceService.addPoint({ x: x, y: y });
    }

    /**
     * Update the x Value of an specific element in list
     * @param  {IPointSequenceElement} element The Point that have to be updated
     * @param  {number} updatedValue The new x value
     */
    public updatePointValueX(element: IPointSequenceElement, updatedValue: number): void {
        element.value.x = updatedValue;
        this.pointSequenceService.updatePoint(element);
    }

    /**
     * Update the y Value of an specific element in list
     * @param  {IPointSequenceElement} element The Point that have to be updated
     * @param  {number} updatedValue The new y value
     */
    public updatePointValueY(element: IPointSequenceElement, updatedValue: number): void {
        element.value.y = updatedValue;
        this.pointSequenceService.updatePoint(element);
    }

    /**
     * Return all selected point-elements in the list
     * @param  {IPointSequenceElement[]} elements
     * @return {IPointSequenceElement[]} Selected elements
     */
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

    /**
     * Returns:
     * true: if all elements selected
     * false: if not all elements selected
     * @param  {IPointSequenceElement[]} elements All Elements in the list
     * @return {boolean}
     */
    private areAllElementsSelected(elements: IPointSequenceElement[]): boolean {
        const selectedElements = this.getSelectedElements(elements);
        return selectedElements.length === elements.length;
    }

    /**
     * Removes all points that are selected
     * @param  {IPointSequenceElement[]} elements All Elements in the list
     */
    public removeSelectedPoints(elements: IPointSequenceElement[]): void {
        const selectedElements = this.getSelectedElements(elements);
        this.pointSequenceService.removePoints(selectedElements);
    }

    /**
     * Toggles the selection of an element
     * @param  {IPointSequenceElement[]} elements All Elements in the list
     * @param  {boolean} status Has element changed
     */
    public toggleElementSelection(elements: IPointSequenceElement[], status: boolean): void {
        if (status === false) {
            this.globalSelectStatus = false;
        } else {
            const areAllElementsSelected = this.areAllElementsSelected(elements);
            this.globalSelectStatus = areAllElementsSelected;
        }
    }

    /**
     * Track by in ngFor for a better performance
     * @param  {number} index index of list element
     * @param  {IPoint} item
     */
    public trackByFn(index: number, item: IPoint) {
        return item.id;
    }
}
