import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { createClient, PhotosWithTotalResults, ErrorResponse } from 'pexels';

type PageState = 'error' | 'loading' | 'loaded';

@Component({
  selector: 'gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.sass'],
})
export class GalleryComponent implements OnInit {
  private readonly PEXEL_CLIENT = createClient(
    '563492ad6f91700001000001736ea7451505455ba692483c2d19d0d9'
  );
  private readonly IMAGES_PER_PAGE = 30;
  private currentPhotos: PhotosWithTotalResults;
  pageState: PageState = 'loaded';
  search = new FormControl('');

  constructor() {}

  ngOnInit() {
    this.searchImages();
  }

  get photos() {
    return this.currentPhotos ? this.currentPhotos.photos : [];
  }

  searchImages() {
    this.pageState = 'loading';

    this.PEXEL_CLIENT.photos
      .search({
        query: this.search.value,
        per_page: this.IMAGES_PER_PAGE,
        page: 1,
      })
      .then((photos) => {
        if (this.isError(photos)) {
          this.pageState = 'error';
        } else {
          this.currentPhotos = photos;
          this.pageState = 'loaded';
        }
      });
  }

  isError(photos: any): photos is ErrorResponse {
    return photos.error !== undefined;
  }
}
