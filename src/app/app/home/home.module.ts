import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomePageComponent  } from './home-page/home-page.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserOpenOfficeInteractComponent } from './user-open-office-interact/user-open-office-interact.component';
import { SharedModule } from '../shared/shared.module';
import { AuthModule } from '../auth/auth.module';
import { PartnersComponent } from './partners/partners.component';


@NgModule({

    declarations: [
        HomePageComponent,
        AboutUsComponent,
        UserOpenOfficeInteractComponent,
        PartnersComponent,
    ],
    imports: [
        CommonModule,
        SharedModule, 
        FormsModule,
        AuthModule,
    ],
    exports: [
        SharedModule,
        HomePageComponent,
        AboutUsComponent,
        UserOpenOfficeInteractComponent,
        PartnersComponent,
    ],
    
})

export class HomeModule {
  
}
