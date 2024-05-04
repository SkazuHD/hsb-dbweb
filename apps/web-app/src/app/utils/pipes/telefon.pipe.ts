import {Pipe, PipeTransform} from '@angular/core';
import {parsePhoneNumber} from 'libphonenumber-js';

type telefonType = 'tel' | 'fax' | 'mobil';

@Pipe({
  name: 'telefon',
  standalone: true,
})
export class TelefonPipe implements PipeTransform {
  transform(value: string, type: telefonType): string {
    if (value.startsWith(('0'))) {
      value = value.replace('0', '+49');
    }
    const formattedNumber = parsePhoneNumber(value).formatInternational();
    switch (type) {
      case 'tel':
        return `Tel.: ${formattedNumber}`;
      case 'fax':
        return `Fax: ${formattedNumber}`;
      case 'mobil':
        return `Mobil: ${formattedNumber}`;
    }
  }
}
