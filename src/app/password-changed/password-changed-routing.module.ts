import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasswordChangedPage } from './password-changed.page';

const routes: Routes = [
  {
    path: '',
    component: PasswordChangedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordChangedPageRoutingModule {}
