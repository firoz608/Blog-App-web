import { Routes } from '@angular/router';
import { Login } from './Components/login/login';
import { Dashboard } from './Components/dashboard/dashboard';
import { Registration } from './Components/registration/registration';
import { Search } from './Components/search/search';
import { Comments } from './Components/comments/comments';
import { AllPosts } from './Components/all-posts/all-posts';

export const routes: Routes = [
    {path:'',component:Dashboard},
    {path:'login',component:Login},
    {path:'dashboard',component:Dashboard},
    {path:'registration',component:Registration},
    {path:'searchblog',component:Search},
    {path:'commentblog',component:Comments},
    {path:'Allposts',component:AllPosts},
    {
      path: 'settings',
      loadChildren: () => import('./Components/settings/settings-module').then(m => m.SettingsModule)
    }

]
