import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { ImageDialogComponent } from './image-dialog.component';

@NgModule({
  declarations: [ImageDialogComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [ImageDialogComponent],
})
export class ImageDialogModule {}
