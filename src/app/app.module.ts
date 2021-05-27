import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { ConfirmationService, SharedModule } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ColorSelectorComponent } from './shared/color-selector/color-selector.component';
import { TaskShortComponent } from './shared/task-short/task-short.component';
import { ChipsModule } from 'primeng/chips';
import { InplaceModule } from 'primeng/inplace';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { TaskListComponent } from './shared/task-list/task-list.component';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { TaskDetailComponent } from './shared/task-detail/task-detail.component';
import { DialogModule } from 'primeng/dialog';
import { AppConfigService } from './app-config.sevice';
import { TaskService } from './shared/service/task.service';
import { ServicesApiClient } from './shared/service/services-api-client';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MainPageBlockComponent } from './shared/main-page-block/main-page-block.component';

// данная функция необходима при AOT компиляции
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ColorSelectorComponent,
    TaskShortComponent,
    TaskListComponent,
    TaskDetailComponent,
    MainPageBlockComponent
  ],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        ButtonModule,
        SelectButtonModule,
        FormsModule,
        MenubarModule,
        SharedModule,
        InputTextModule,
        ToggleButtonModule,
        ChipsModule,
        InplaceModule,
        OverlayPanelModule,
        BrowserAnimationsModule,
        InputTextareaModule,
        ReactiveFormsModule,
        TableModule,
        ToolbarModule,
        TooltipModule,
        DialogModule,
        ConfirmDialogModule
    ],
  providers: [
        AppConfigService,
        ServicesApiClient,
        TaskService,
        ConfirmationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
