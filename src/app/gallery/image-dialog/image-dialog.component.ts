import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Photo } from 'pexels';

export interface ImageDialogData {
  photo: Photo;
}

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.sass'],
})
export class ImageDialogComponent implements OnInit {
  constructor(
    readonly dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ImageDialogData
  ) {}

  ngOnInit() {}

  closeDialog() {
    this.dialogRef.close();
  }

  downloadImage() {
    saveAs(this.data.photo.src.large, this.data.photo.photographer + '.png');
    this.dialogRef.close();
  }
}
