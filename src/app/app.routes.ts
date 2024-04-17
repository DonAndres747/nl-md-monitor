import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WMSComponent } from './wms/wms.component';
import { TepComponent } from './tep/tep.component';
import { SapComponent } from './sap/sap.component';
import { ConfigComponent } from './config/config.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'wms', component: WMSComponent },
      { path: 'tep', component: TepComponent },
      { path: 'sap', component: SapComponent },
      { path: 'config/:sol', component: ConfigComponent },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
