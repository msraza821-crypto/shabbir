import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';

const pageRoutes: Routes = [
  { path: '', canActivate: [],data: { title: 'Profile' }, children: [
    {
      path: '',  
  data: { title: '' }, component: ProfileComponent },
]}];

@NgModule({
  imports: [
    CommonModule, SharedModule,
    RouterModule.forChild(pageRoutes),    
  ],
  declarations: [ProfileComponent,ChangePasswordComponent],
  entryComponents: []
})
export class SettingsModule { }


