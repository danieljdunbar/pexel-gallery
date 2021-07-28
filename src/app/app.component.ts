import { APP_NAME } from 'app/common/strings/strings';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  readonly APP_NAME = APP_NAME;
}
