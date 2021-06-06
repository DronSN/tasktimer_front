import {
  Component,
  forwardRef,
  Input,
  OnInit,
} from '@angular/core';
import { TaskColorEnum } from '../model/task-color.enum';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface SelectedCheckBox {
  colorName: string;
  isChecked: boolean;
}

const CUSTOM_VALUE_ACCESSOR: any = {
  provide : NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ColorSelectorComponent),
  multi : true,
};

@Component({
  selector: 'app-color-selector',
  templateUrl: './color-selector.component.html',
  styleUrls: ['./color-selector.component.scss'],
  providers : [CUSTOM_VALUE_ACCESSOR],
})
export class ColorSelectorComponent implements OnInit, ControlValueAccessor {
  checkBoxes: SelectedCheckBox[] = [];
  private selectedColor?: string;

  // tslint:disable-next-line:no-input-rename
  @Input('disabled')
  isDisabled = false;

  onChange(_: any): void {}

  ngOnInit(): void {
    this.fillColorsArray();
  }

  private fillColorsArray(): void {
    for (const currentColor in TaskColorEnum) {
      if ({}.hasOwnProperty.call(TaskColorEnum, currentColor)) {
        this.checkBoxes.push({
          colorName: currentColor,
          isChecked: false
        });
      }
    }
  }

  private changeColor(color: string): void {
    this.checkBoxes.forEach((value => {
      value.isChecked = value.colorName === color;
    }));
  }

  handleChange($event: any, colorName: string): void {
    const isChecked = $event.checked;
    if (isChecked) {
      this.checkBoxes.forEach((value) => {
        if (value.colorName !== colorName) {
          value.isChecked = false;
          this.selectedColor = colorName;
        }
      });
      this.onChange(this.selectedColor);
    } else {
      this.onChange(undefined);
    }
  }

  registerOnChange(fn: (color: string) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
  }

  writeValue(obj: any): void {
    this.changeColor(obj?.toLowerCase() || '');
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
