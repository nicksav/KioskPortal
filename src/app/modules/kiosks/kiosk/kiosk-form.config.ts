import { Validators } from '@angular/forms';

export const KioskForm = {
  id: [''],
  name: ['', [Validators.required]],
  screenName: ['', [Validators.required]],
  kioskPhoneNumber: [''],
  mapURL: [''],
  logoURL: [''],
  helpPhone: [''],  
  helpInfo: [''],
};

export const PairKioskForm = {
  code: ['', Validators.compose([Validators.required, Validators.pattern('^(0|[0-9][0-9]*)$'), Validators.minLength(6), Validators.maxLength(6)])]
};


