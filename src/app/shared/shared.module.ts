import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material';

@NgModule({
    imports: [MaterialModule, FormsModule],
    declarations: [],
    exports: [MaterialModule, FormsModule],
})
export class SharedModule {}
