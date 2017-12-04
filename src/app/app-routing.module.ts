import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'

const routes: Routes = [
  { 
    path: '',
    loadChildren: 'app/modules/loader/loader.module#LoaderModule'
  },
  {
    path: 'kiosks',
    loadChildren: 'app/modules/kiosks/kiosks.module#KiosksModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
