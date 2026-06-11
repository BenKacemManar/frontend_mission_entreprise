import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContentRoutingModule } from './content-routing.module';
import { NewsListComponent } from './components/news-list/news-list.component';
import { NewsDetailComponent } from './components/news-detail/news-detail.component';

@NgModule({
  declarations: [NewsListComponent, NewsDetailComponent],
  imports: [SharedModule, ContentRoutingModule],
})
export class ContentModule {}
