import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { HomeComponent } from './components/home/home.component';
import { ProposedgradeComponent } from './components/proposedgrade/proposedgrade.component';
import { ProposedGradeAdminComponent } from './components/proposed-grade-admin/proposed-grade-admin.component';
import { ProposedGradeJuradoComponent } from './components/proposed-grade-jurado/proposed-grade-jurado.component';
import { ProposedGradeDirectorComponent } from './components/proposed-grade-director/proposed-grade-director.component';
import { PreliminaryProjectComponent } from './components/preliminary-project/preliminary-project.component';
import { PreliminayProjectAdminComponent } from './components/preliminay-project-admin/preliminay-project-admin.component';
import { PreliminayProjectDirectorComponent } from './components/preliminay-project-director/preliminay-project-director.component';
import { PreliminayProjectJuradoComponent } from './components/preliminay-project-jurado/preliminay-project-jurado.component';
import { FinalWorkComponent } from './components/final-work/final-work.component';
import { SustainabilityComponent } from './components/sustainability/sustainability.component';
import { SustainabilityJuradoComponent } from './components/sustainability-jurado/sustainabilityJurado.component';
import { UserComponent } from './components/user/user.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { ConfigComponent } from './components/config/config.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { SecurityComponent } from './components/security/security.component';
import { userGuardGuard } from './shared/guard/user-guard.guard';
import { FinalworkAdminComponent } from './components/finalwork-admin/finalwork-admin.component';
import { FinalworkJuradoComponent } from './components/finalwork-jurado/finalwork-jurado.component';
import { FinalworkDirectorComponent } from './components/finalwork-director/finalwork-director.component';
import { InfoProjectDirectorComponent } from './components/info-project-director/info-project-director.component';
import { ProjectComponent } from './components/project/project.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'Login' },
    { path: 'Login', component:LoginComponent},
    { path: 'Seira', component:SidenavComponent, canActivate: [userGuardGuard],
    children: [
        { path: '', pathMatch: 'full', redirectTo: 'Home' },
        { path: 'Home', component:HomeComponent},    
        { path: 'PropuestaGrado', component:ProposedgradeComponent},
        { path: 'PropuestaGradoAdmin', component:ProposedGradeAdminComponent}, 
        { path: 'PropuestaGradoJurado', component:ProposedGradeJuradoComponent}, 
        { path: 'PropuestaGradoDirector/Codirector', component:ProposedGradeDirectorComponent},  
        { path: 'Anteproyecto', component:PreliminaryProjectComponent},
        { path: 'AnteproyectoJurado', component:PreliminayProjectJuradoComponent},
        { path: 'AnteproyectoDirector/Codirector', component:PreliminayProjectDirectorComponent},
        { path: 'AnteproyectoAdmin', component:PreliminayProjectAdminComponent},
        { path: 'TrabajoFinal', component:FinalWorkComponent}, 
        { path: 'TrabajoFinalJurado', component:FinalworkJuradoComponent},
        { path: 'TrabajoFinalDirector/Codirector', component:FinalworkDirectorComponent}, 
        { path: 'TrabajoFinalAdmin', component:FinalworkAdminComponent}, 
        { path: 'Sustentacion', component:SustainabilityComponent}, 
        { path: 'SustentacionJurado', component:SustainabilityJuradoComponent}, 
        { path: 'Proyectos', component:ProjectComponent},    
        { path: 'Users', component:UserComponent},   
        { path: 'CreateUser', component:CreateUserComponent},     
        { path: 'Configuration', component:ConfigComponent,
          children: [
            { path: '', pathMatch: 'full', redirectTo: 'PersonalInformation'},
            { path: 'PersonalInformation', component:PersonalInformationComponent},
            { path: 'Security', component:SecurityComponent}
          ]
        },
        { path: 'InformacionProyecto', component:InfoProjectDirectorComponent}
      ]
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
