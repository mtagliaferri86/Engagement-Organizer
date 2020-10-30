import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './calendar/calendar.component';
import { HomeComponent } from './home/home.component';
import { CustomerComponent } from './customer/customer.component';
import { UtilizationComponent } from './utilization/utilization.component';
import { EventViewerComponent } from './event-viewer/event-viewer.component';
import { ApiModule as EngagementOrganizerApiClient, Configuration, ConfigurationParameters } from './api/EngagementOrganizerApiClient';
import { HttpClientModule } from '@angular/common/http';
import { AppointmentEditorComponent } from './appointment-editor/appointment-editor.component';
import { AppConfig } from './app.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomDialogModule } from './custom-dialog/custom-dialog.module';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { StyleManager } from './themes/style-manager';
import { WarningResumeComponent } from './warning-resume/warning-resume.component'

//create our cost var with the information about the format that we want
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: AppConfig.settings.api.url,
    apiKeys: { "X-API-Key": AppConfig.settings.api.key }
  }
  return new Configuration(params);
}

export function initializeApp(appConfig: AppConfig) {
  return () => appConfig.load();
}

export function createApiConfigFactory() {
  return apiConfigFactory();
}

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    HomeComponent,
    CustomerComponent,
    UtilizationComponent,
    EventViewerComponent,
    AppointmentEditorComponent,
    CustomerViewComponent,
    WarningResumeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CustomDialogModule,
    EngagementOrganizerApiClient.forRoot(createApiConfigFactory)
  ],
  entryComponents: [
    AppointmentEditorComponent
  ],
  providers: [
    AppConfig,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppConfig], multi: true
    },
    MatDatepickerModule,
    { provide: DateAdapter, useClass: MomentDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    StyleManager
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
