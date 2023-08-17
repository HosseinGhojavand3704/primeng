import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { ImportDoc } from './importdoc';
import { BasicDoc } from './basicdoc';
import { PropsDoc } from './propsdoc';
import { AutoFocusModule } from 'avan-primeng/autofocus';
import { InputTextModule } from 'avan-primeng/inputtext';

@NgModule({
    imports: [CommonModule, RouterModule, AppCodeModule, AppDocModule, AutoFocusModule, InputTextModule],
    declarations: [ImportDoc, BasicDoc, PropsDoc],
    exports: [AppDocModule]
})
export class AutoFocusDocModule {}
