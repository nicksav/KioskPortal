import { Validators } from '@angular/forms';

export const LocationForm = {
  id: [''],
  name: ['', [Validators.required]],
  locationKey: ['', [Validators.required]]
};
