import { HttpClientModule, HttpClientXsrfModule, HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { NoCsrfTokenInterceptor } from './services/NoCsrfTokenInterceptor.service';


@NgModule({
  declarations: [
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientXsrfModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NoCsrfTokenInterceptor, multi: true }
  ],
  bootstrap: []
})
export class AppModule { }
