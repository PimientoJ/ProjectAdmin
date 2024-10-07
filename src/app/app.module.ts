import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_ICONS } from 'ng-zorro-antd/icon';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
//import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
//componentes
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HeaderComponent } from './components/header/header.component';
import { UserComponent } from './components/user/user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ProposedgradeComponent } from './components/proposedgrade/proposedgrade.component';
import { ConfigComponent } from './components/config/config.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { SecurityComponent } from './components/security/security.component';
import { SustainabilityComponent } from './components/sustainability/sustainability.component';
import { PreliminaryProjectComponent } from './components/preliminary-project/preliminary-project.component';
import { PreliminayProjectAdminComponent } from './components/preliminay-project-admin/preliminay-project-admin.component';
import { PreliminayProjectDirectorComponent } from './components/preliminay-project-director/preliminay-project-director.component';
import { PreliminayProjectJuradoComponent } from './components/preliminay-project-jurado/preliminay-project-jurado.component';
import { FinalWorkComponent } from './components/final-work/final-work.component';
import { FinalworkAdminComponent } from './components/finalwork-admin/finalwork-admin.component';
import { FinalworkJuradoComponent } from './components/finalwork-jurado/finalwork-jurado.component';
import { FinalworkDirectorComponent } from './components/finalwork-director/finalwork-director.component';
import { InfoProjectDirectorComponent } from './components/info-project-director/info-project-director.component';
import { ProposedGradeAdminComponent } from './components/proposed-grade-admin/proposed-grade-admin.component';
import { ProposedGradeDirectorComponent } from './components/proposed-grade-director/proposed-grade-director.component';
import { ProposedGradeJuradoComponent } from './components/proposed-grade-jurado/proposed-grade-jurado.component';
import { ProjectComponent } from './components/project/project.component';
import LocaleEsMx from '@angular/common/locales/es-CO';
// Servicios
import { UsersService } from './services/users.service';
import { JwtInterceptor } from './shared/helpers/jwt.interceptor'
import { SustainabilityJuradoComponent } from './components/sustainability-jurado/sustainabilityJurado.component';
registerLocaleData(LocaleEsMx);

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidenavComponent,
    HeaderComponent,
    UserComponent,
    CreateUserComponent,
    ProposedgradeComponent,
    ProposedGradeAdminComponent,
    ProposedGradeDirectorComponent,
    ProposedGradeJuradoComponent,
    ConfigComponent,
    PersonalInformationComponent,
    SecurityComponent, 
    SustainabilityComponent,
    PreliminaryProjectComponent,
    FinalWorkComponent,
    FinalworkJuradoComponent,
    FinalworkAdminComponent,
    FinalworkDirectorComponent,
    PreliminayProjectAdminComponent,
    PreliminayProjectDirectorComponent,
    PreliminayProjectJuradoComponent,
    InfoProjectDirectorComponent,
    ProjectComponent,
    SustainabilityJuradoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DemoNgZorroAntdModule,
    ReactiveFormsModule,
    NzInputModule,
    CommonModule
  ],
  providers: [ UsersService, CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},    
    { provide: NZ_I18N, useValue: en_US },
    { provide: NZ_ICONS, useValue: icons },
    { provide: LOCALE_ID, useValue: 'es-CO'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
