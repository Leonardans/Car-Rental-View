import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagerLoginComponent } from './manager-login/manager-login.component';
import { ManagerPanelComponent } from './manager-panel/manager-panel.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { CarLoanComponent } from './car-management/car-loan/car-loan.component';
import { CarReturnComponent } from './car-management/car-return/car-return.component';
import { CarAdditionComponent } from './car-management/car-addition/car-addition.component';


@NgModule({
  declarations: [
    ManagerLoginComponent, 
    ManagerPanelComponent,
    StatisticsComponent,

    CarLoanComponent,
    CarReturnComponent,
    CarAdditionComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ManagerLoginComponent, 
    ManagerPanelComponent,
    StatisticsComponent,   

    CarLoanComponent,
    CarReturnComponent,
    CarAdditionComponent
  ]
})

export class ManagerModule {}
