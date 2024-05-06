import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { transactionComponent } from './transactionHistory/transactionHistory.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { ConfigComponent } from './config/config.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
      {
        path: 'config/:sol',
        component: ConfigComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'transactions/:sol',
        component: transactionComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: ':id',
            component: TransactionDetailsComponent,
          },
        ],
      },
    ],
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '' },
];
