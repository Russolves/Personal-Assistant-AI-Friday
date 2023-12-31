import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { SignupComponent } from './signup/signup.component';
import { EditpasswordComponent } from './editpassword/editpassword.component';
import { authGuardFunction } from './auth.guard'; // utilize exported function written by you
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'main/:user', component: MainComponent, canActivate: [authGuardFunction]}, // 'main/:user'
  { path: 'signup', component: SignupComponent},
  { path: 'editpassword/:user', component: EditpasswordComponent}, //, canActivate: [authGuardFunction] include once previous URL solved
  { path: 'about', component: AboutComponent, canActivate: [authGuardFunction]}, // 
  { path: 'profile', component: ProfileComponent, canActivate: [authGuardFunction]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
  
})
export class AppRoutingModule { }
