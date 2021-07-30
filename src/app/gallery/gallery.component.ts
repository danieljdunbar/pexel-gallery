import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  createClient,
  PhotosWithTotalResults,
  ErrorResponse,
  Photo,
} from 'pexels';
import { CurrentViewService } from 'app/common/current-view/current-view.service';
import { SupportedViews } from 'app/common/current-view/supported-views-enum';
import { ImageDialogComponent } from 'app/gallery/image-dialog/image-dialog.component';

type PageState = 'error' | 'loading' | 'loaded';
type GridColumns = 5 | 3 | 1;

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass'],
  providers: [],
})
export class GalleryComponent implements OnInit {
  private readonly PEXEL_CLIENT = createClient(
    '563492ad6f91700001000001736ea7451505455ba692483c2d19d0d9'
  );
  private readonly IMAGES_PER_PAGE = 30;
  private greatestPage = 0;
  private currentPhotos: PhotosWithTotalResults;
  photos: Photo[] = [];
  pageState: PageState = 'loaded';
  search = new FormControl('');
  gridColumns: GridColumns = 5;
  loadingMoreImages = false;
  imagesSearched = false;

  constructor(
    readonly currentViewService: CurrentViewService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    this.currentViewService.currentView.subscribe((view) => {
      switch (view) {
        case SupportedViews.DESKTOP:
          this.gridColumns = 5;
          break;
        case SupportedViews.TABLET:
          this.gridColumns = 3;
          break;
        default:
          this.gridColumns = 1;
      }
    });
  }

  searchImages() {
    this.imagesSearched = true;
    this.pageState = 'loading';

    this.PEXEL_CLIENT.photos
      .search({
        query: this.search.value,
        per_page: this.IMAGES_PER_PAGE,
        page: 1,
      })
      .then((newPhotosResults) => {
        if (this.isError(newPhotosResults)) {
          this.pageState = 'error';
        } else {
          this.currentPhotos = newPhotosResults;
          this.photos = newPhotosResults.photos;
          this.greatestPage = 1;
          this.pageState = 'loaded';
        }
      });
  }

  isError(photos: any): photos is ErrorResponse {
    return photos.error !== undefined;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let position =
      (document.documentElement.scrollTop || document.body.scrollTop) +
      document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;

    if (position === max && !this.loadingMoreImages) {
      this.loadMoreImages();
    }
  }

  private loadMoreImages() {
    if (this.currentPhotos) {
      if (this.currentPhotos.next_page) {
        this.loadingMoreImages = true;

        this.PEXEL_CLIENT.photos
          .search({
            query: this.search.value,
            per_page: this.IMAGES_PER_PAGE,
            page: this.greatestPage + 1,
          })
          .then((newPhotosResults) => {
            if (this.isError(newPhotosResults)) {
              this.pageState = 'error';
            } else {
              this.currentPhotos = newPhotosResults;

              this.photos = this.photos.concat(newPhotosResults.photos);
              this.greatestPage++;
              this.loadingMoreImages = false;
            }
          });
      }
    }
  }

  openImageDialog(photo: Photo) {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      data: { photo },
    });
  }
}
