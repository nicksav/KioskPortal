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
