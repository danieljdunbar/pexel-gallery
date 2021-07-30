import { CurrentViewService } from 'app/common/current-view/current-view.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GalleryModule } from 'app/gallery/gallery.module';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GalleryModule,
    MatToolbarModule,
    MatDialogModule,
  ],
  providers: [CurrentViewService],
  bootstrap: [AppComponent],
})
export class AppModule {}
