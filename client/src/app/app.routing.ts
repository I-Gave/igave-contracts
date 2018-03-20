import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { AdminComponent } from './campaigns-admin/admin.component';
import { CreateCampaignsComponent } from './campaigns-create/create.component';
import { CertificateComponent } from './certificate/certificate.component';
import { ViewCampaignsComponent } from './campaigns-view/view.component';
import { ManageCampaignsComponent } from './campaigns-manage/manage.component';
import { MyCampaignsComponent } from './mycampaigns/mycampaigns.component';
import { MyTokensComponent } from './mytokens/mytokens.component';
import { EtherFaucetComponent } from './faucet/faucet.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes =[
    { path: 'dashboard',      component: DashboardComponent },
    {
      path: 'campaigns',
      children: [
        {
          path: '',
          children: [
            {
              path: '',
              component: CampaignsComponent,
            },
          ]
        },
        {
          path: 'create',
          children: [
            {
              path: '',
              component: CreateCampaignsComponent,
            },
          ]
        },
        {
          path: 'view',
          children: [
            {
              path: ':id',
              component: ViewCampaignsComponent,
            },
          ]
        },
        {
          path: 'manage',
          children: [
            {
              path: ':id',
              component: ManageCampaignsComponent,
            },
          ]
        },
        {
          path: ':id',
          children: [
            {
              path: '',
              component: ViewCampaignsComponent,
            },
          ]
        }
      ]
    },
    { path: 'create',         component: CreateCampaignsComponent },
    { path: 'mycampaigns',    component: MyCampaignsComponent },
    { path: 'admin',          component: AdminComponent },
    { path: 'mytokens',
      children: [
        {
          path: 'certificate',
          children: [
            {
              path: ':id',
              component: CertificateComponent,
            }
          ]
        },
        {
          path: '',
          component: MyTokensComponent,
        }
      ]
    },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'ether-faucet',   component: EtherFaucetComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: '',               redirectTo: 'ether-faucet', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
