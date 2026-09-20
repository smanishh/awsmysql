import { Routes } from '@angular/router';
import { UserListComponent } from './users/user-list.component';
import { TaskComponent } from './task/task.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserListComponent
  },
  {
    path: 'tasks/:userId',
    component: TaskComponent
  }
];
