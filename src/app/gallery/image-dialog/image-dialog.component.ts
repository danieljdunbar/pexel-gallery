import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { saveAs } from 'file-saver';
import { Photo } from 'pexels';
import { CurrentViewService } from 'app/common/current-view/current-view.service';
import { SupportedViews } from 'app/common/current-view/supported-views-enum';

export interface ImageDialogData {
  photo: Photo;
}

@Component({
  selector: 'image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.sass'],
})
export class ImageDialogComponent implements OnInit {
  photoUrl = '';

  constructor(
    readonly currentViewService: CurrentViewService,
    readonly dialogRef: MatDialogRef<ImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) readonly data: ImageDialogData
  ) {}

  ngOnInit() {
    this.currentViewService.currentView.subscribe((view) => {
      switch (view) {
        case SupportedViews.DESKTOP:
          this.photoUrl = this.data.photo.src.large;
          break;
        case SupportedViews.TABLET:
        case SupportedViews.MOBILE:
        default:
          this.photoUrl = this.data.photo.src.medium;
      }
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  downloadImage() {
    saveAs(this.photoUrl, this.data.photo.photographer + '.png');
    this.dialogRef.close();
  }
}
