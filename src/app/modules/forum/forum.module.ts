import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ForumRoutingModule } from './forum-routing.module';
import { ForumHomeComponent } from './components/forum-home/forum-home.component';
import { ForumThreadListComponent } from './components/forum-thread-list/forum-thread-list.component';
import { ForumThreadDetailComponent } from './components/forum-thread-detail/forum-thread-detail.component';

@NgModule({
  declarations: [ForumHomeComponent, ForumThreadListComponent, ForumThreadDetailComponent],
  imports: [SharedModule, ForumRoutingModule],
})
export class ForumModule {}
