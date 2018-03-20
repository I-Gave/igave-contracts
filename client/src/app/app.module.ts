import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './campaigns-admin/admin.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { CreateCampaignsComponent } from './campaigns-create/create.component';
import { CertificateComponent } from './certificate/certificate.component';
import { ViewCampaignsComponent } from './campaigns-view/view.component';
import { ManageCampaignsComponent } from './campaigns-manage/manage.component';
import { EtherFaucetComponent } from './faucet/faucet.component';

import { MyCampaignsComponent } from './mycampaigns/mycampaigns.component';
import { MyTokensComponent } from './mytokens/mytokens.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { TypographyComponent } from './typography/typography.component';
import { IconsComponent } from './icons/icons.component';
import { MapsComponent } from './maps/maps.component';
import { NotificationsComponent } from './notifications/notifications.component';

import { WindowRef } from './window';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    CampaignsComponent,
    AdminComponent,
    CreateCampaignsComponent,
    CertificateComponent,
    ViewCampaignsComponent,
    ManageCampaignsComponent,
    EtherFaucetComponent,
    MyCampaignsComponent,
    MyTokensComponent,
    UserProfileComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ComponentsModule,
RouterModule,
    AppRoutingModule
  ],
  providers: [
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
