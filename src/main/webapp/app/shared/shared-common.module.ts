import { NgModule } from '@angular/core';

import { WebStoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [WebStoreSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [WebStoreSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class WebStoreSharedCommonModule {}
