import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx'; 

// Firebase modules
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore'; // Importando o Firestore
import { environment } from '../environments/environment';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { CategoriasComponent } from './categorias/categorias.component';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FinanceService } from './services/finance.service';
import { ErrorHandler } from './services/error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    TermsModalComponent,
    CategoriasComponent,
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FingerprintAIO, FinanceService, ErrorHandler],

  bootstrap: [AppComponent],
})
export class AppModule {}