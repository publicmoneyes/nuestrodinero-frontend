import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CONTRACTS_SHARED_COMPONENTS } from './shared';
import { CONTRACT_COMPONENTS } from './components';
import { ContractsRoutingModule } from './contracts-routing.module';
import { TotalCostPipe } from './pipes/total-cost.pipe';
import { YesNoPipe } from './pipes/yes-no.pipe';

@NgModule({
  declarations: [
    ...CONTRACT_COMPONENTS,
    ...CONTRACTS_SHARED_COMPONENTS,
    TotalCostPipe,
    YesNoPipe,
  ],
  imports: [SharedModule, ContractsRoutingModule],
})
export class ContractsModule {}
