import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'rxjs/operators';
import { MenuItem, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Task timer';
  stateOptions: any[];
  currentLanguage = 'ru';
  items: MenuItem[];
  val = true;

  constructor(
    private config: PrimeNGConfig,
    private translateService: TranslateService
  ) {
    // устанавливаем язык по умолчанию
    this.translateService.setDefaultLang(this.currentLanguage);
    this.stateOptions = [
      { label: 'English', value: 'en' },
      { label: 'Русский', value: 'ru' }
    ];
    this.items = [
      {
        label: 'File',
        icon: 'pi pi-fw pi-file',
        items: [
          {
            label: 'New',
            icon: 'pi pi-fw pi-plus',
            items: [
              {
                label: 'Bookmark',
                icon: 'pi pi-fw pi-bookmark'
              },
              {
                label: 'Video',
                icon: 'pi pi-fw pi-video'
              },

            ]
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-trash'
          },
          {
            separator: true
          },
          {
            label: 'Export',
            icon: 'pi pi-fw pi-external-link'
          }
        ]
      },
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          {
            label: 'Left',
            icon: 'pi pi-fw pi-align-left'
          },
          {
            label: 'Right',
            icon: 'pi pi-fw pi-align-right'
          },
          {
            label: 'Center',
            icon: 'pi pi-fw pi-align-center'
          },
          {
            label: 'Justify',
            icon: 'pi pi-fw pi-align-justify'
          },
        ]
      },
    ];
  }

  ngOnInit(): void {
    this.config.ripple = true;
    }

  setLanguage(): void {
    // устанавливаем выбранный язык
    this.translateService.use(this.currentLanguage);
    // для примера переводим строку вне шаблона, используя
    // для этого TranslateService
    this.translateService.get('info.about').
    pipe(first()).subscribe((value) => console.log(value));
  }

  translate(lang: string): void {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res));
  }
}
