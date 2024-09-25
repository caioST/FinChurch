import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SecurityKeyPageRoutingModule } from './security-key-routing.module';

import { SecurityKeyPage } from './security-key.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SecurityKeyPageRoutingModule
  ],
  declarations: [SecurityKeyPage]
})
export class SecurityKeyPageModule {}
