import { Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component'
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerificationComponent } from './verification/verification.component';

export const routes: Routes = [
    { path: 'welcome', component: WelcomeComponent },
    { path: '', redirectTo: 'welcome' , pathMatch: 'full'},
    { path: 'home',  component : HomeComponent},
    { path: 'login',  component : LoginComponent},
    { path: 'sign-up',  component : SignUpComponent},
    { path: 'verification',  component : VerificationComponent},
    
];
