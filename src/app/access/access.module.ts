import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccessPageRoutingModule } from './access-routing.module';

import { AccessPage } from './access.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule.forRoot(),
    AccessPageRoutingModule,
  ],
  declarations: [AccessPage]
})
export class AccessPageModule {}
