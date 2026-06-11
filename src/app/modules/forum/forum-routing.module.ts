import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForumHomeComponent } from './components/forum-home/forum-home.component';
import { ForumThreadListComponent } from './components/forum-thread-list/forum-thread-list.component';
import { ForumThreadDetailComponent } from './components/forum-thread-detail/forum-thread-detail.component';

const routes: Routes = [
  { path: '', component: ForumHomeComponent },
  { path: ':categoryId', component: ForumThreadListComponent },
  { path: ':categoryId/:threadId', component: ForumThreadDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumRoutingModule {}
