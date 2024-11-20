import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { RouteReuseStrategy } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { ResumoSubcategoriaComponent } from './resumo-subcategoria/resumo-subcategoria.component';
import { AdicionarValorComponent } from './adicionar-valor/adicionar-valor.component';


@NgModule({
  declarations: [
    AppComponent,
    TermsModalComponent,
    CategoriasComponent,
    SubcategoriasComponent,
    AdicionarValorComponent,
    ResumoSubcategoriaComponent,
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
    HttpClientModule,
    RouterModule,
    
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, FingerprintAIO, FinanceService, ErrorHandler],

  bootstrap: [AppComponent],
})
export class AppModule {}