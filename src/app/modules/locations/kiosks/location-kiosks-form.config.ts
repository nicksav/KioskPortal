import { Validators } from '@angular/forms';

export const LocationKiosksForm = {
  id: ['', [Validators.required]],
  locationId: ['', [Validators.required]]
};
