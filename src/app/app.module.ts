import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { SharedModule } from './components/shared/shared.module';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es'},
              {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi:true},
              {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:true},],
  bootstrap: [AppComponent]
})
export class AppModule { }
