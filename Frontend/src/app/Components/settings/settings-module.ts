import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Settings } from './settings/settings';
import { RouterModule } from '@angular/router';
import { Manageblog } from './manageblog/manageblog';
import { Likedblog } from './likedblog/likedblog';
import { SavedBlog } from './saved-blog/saved-blog';
import { Profile } from './profile/profile';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,

    RouterModule.forChild([
      { path: '', component: Settings },
      {path: 'manageblog', component: Manageblog },
      {path:'likedblog',component:Likedblog},
      {path:'savedBlog',component:SavedBlog},
      {path:'profile',component:Profile},
    ])
  ]
})
export class SettingsModule {
  constructor() {
    
  }
}