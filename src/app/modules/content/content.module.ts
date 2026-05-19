import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentRoutingModule } from './content-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NewsListComponent } from './components/news-list/news-list.component';

@NgModule({
  declarations: [
    NewsListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ContentRoutingModule
  ]
})
export class ContentModule {}
