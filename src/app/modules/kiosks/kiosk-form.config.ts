import { Validators } from '@angular/forms';

export const KioskForm = {
  id: [''],
  KioskName: ['', [Validators.required]],
  LocationId: ['', [Validators.required]],
};
