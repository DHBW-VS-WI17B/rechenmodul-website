import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarDismiss } from '@angular/material';
import { LogLevel } from '@app/core/enums';
import { INotification } from '@app/core/interface';
import { LogService } from '@app/core/services';
import { NotificationComponent } from '@app/shared/components';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    private readonly TAG = '[NotificationService]';
    private readonly DURATION_IN_SECONDS = 5;

    constructor(private snackBar: MatSnackBar, private logService: LogService) {}

    public showNotification(data: INotification): Promise<MatSnackBarDismiss> {
        const snackBarRef = this.snackBar.openFromComponent(NotificationComponent, {
            duration: this.DURATION_IN_SECONDS * 1000,
            verticalPosition: 'bottom',
            horizontalPosition: 'left',
            data: data,
        });
        this.logService.log(LogLevel.debug, this.TAG, 'Show notification.', [data]);
        return snackBarRef.afterDismissed().toPromise();
    }
}
