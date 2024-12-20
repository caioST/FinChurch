import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoriasComponent } from './categorias/categorias.component';
import { SubcategoriasComponent } from './subcategorias/subcategorias.component';
import { ResumoSubcategoriaComponent } from './resumo-subcategoria/resumo-subcategoria.component';
import { AdicionarValorComponent } from './adicionar-valor/adicionar-valor.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },

  {
    path: 'splash',
    loadChildren: () => import('./splash/splash.module').then(m => m.SplashPageModule)
  },

  {
    path: 'access',
    loadChildren: () => import('./access/access.module').then(m => m.AccessPageModule)
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },

  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'security-key',
    loadChildren: () => import('./security-key/security-key.module').then( m => m.SecurityKeyPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./new-password/new-password.module').then( m => m.NewPasswordPageModule)
  },
  {
    path: 'password-changed',
    loadChildren: () => import('./password-changed/password-changed.module').then( m => m.PasswordChangedPageModule)
  },
  {
    path: 'fingerprint-authentication',
    loadChildren: () => import('./fingerprint-authentication/fingerprint-authentication.module').then( m => m.FingerprintAuthenticationPageModule)
  },

  {
    path: 'categorias',  // Defina o nome da rota
    component:  CategoriasComponent

  },

  {
    path: 'subcategorias/:categoriaId/:colecao',
    component: SubcategoriasComponent
  },

  { path: 'subcategorias/:colecao/:categoriaId', component: SubcategoriasComponent },
  { path: 'subcategoria/:colecao/:categoriaId/:subcategoriaId', component: ResumoSubcategoriaComponent },
  { path: 'subcategoria/:colecao/:categoriaId/:subcategoriaId/adicionar', component: AdicionarValorComponent },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
