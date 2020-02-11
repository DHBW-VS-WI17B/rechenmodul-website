import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from './components';
import { MaterialModule } from './modules';

@NgModule({
    imports: [MaterialModule, FormsModule],
    declarations: [NotificationComponent],
    exports: [MaterialModule, FormsModule],
    entryComponents: [NotificationComponent],
})
export class SharedModule {}
