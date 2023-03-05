import { AbstractControl, ValidatorFn } from '@angular/forms';

export const sloveneNumberValidator: ValidatorFn = (control: AbstractControl): {[key: string]: any} | null => {
    const number = control.value;
    if (!number) {
        return null;
    }

    const pattern = /^386[1-9][0-9]{6,7}$/;
    const valid = pattern.test(number);
    return valid ? null : { invalidSloveneNumber: true };
};