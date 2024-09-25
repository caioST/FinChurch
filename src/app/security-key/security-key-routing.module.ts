import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SecurityKeyPage } from './security-key.page';

const routes: Routes = [
  {
    path: '',
    component: SecurityKeyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SecurityKeyPageRoutingModule {}
