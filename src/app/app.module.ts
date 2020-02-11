import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Config } from './config';
import { CoreModule } from './core';
import { SharedModule } from './shared';

registerLocaleData(localeDe, 'de');

@NgModule({
    declarations: [AppComponent],
    imports: [CoreModule, SharedModule, BrowserModule, AppRoutingModule, BrowserAnimationsModule],
    providers: [{ provide: LOCALE_ID, useValue: Config.APP_LOCALE }],
    bootstrap: [AppComponent],
})
export class AppModule {}
