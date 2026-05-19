import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForumRoutingModule } from './forum-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ForumHomeComponent } from './components/forum-home/forum-home.component';

@NgModule({
  declarations: [
    ForumHomeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ForumRoutingModule
  ]
})
export class ForumModule {}
