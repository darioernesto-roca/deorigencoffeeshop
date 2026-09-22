import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: '<app-header /><main><router-outlet /></main><app-footer />',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
