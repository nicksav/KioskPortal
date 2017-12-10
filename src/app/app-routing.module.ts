import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component'
import { LoaderComponent } from '../app/modules/loader/loader.component'


const routes: Routes = [
  { 
    path: '',
    loadChildren: 'app/modules/loader/loader.module#LoaderModule',
    pathMatch: 'full'
  },
  {
    path: 'locations',
    loadChildren: 'app/modules/locations/locations.module#LocationsModule',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadChildren: 'app/modules/loader/loader.module#LoaderModule',
    pathMatch: 'full'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
