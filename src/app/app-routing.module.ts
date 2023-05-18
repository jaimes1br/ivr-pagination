import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreListComponent } from './perPage/store-list/store-list.component';

const routes: Routes = [
  { path: 'home', component: StoreListComponent },
  { path: '', redirectTo: '/home?page=1', pathMatch: 'full' },
]


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
