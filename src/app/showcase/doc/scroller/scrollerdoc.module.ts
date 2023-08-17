import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollerModule } from 'avan-primeng/scroller';
import { SkeletonModule } from 'avan-primeng/skeleton';
import { SpinnerModule } from 'avan-primeng/spinner';
import { AppDocModule } from '../../layout/doc/app.doc.module';
import { AppCodeModule } from '../../layout/doc/code/app.code.component';
import { BasicDoc } from './basicdoc';
import { DelayDoc } from './delaydoc';
import { EventsDoc } from './eventsdoc';
import { HorizontalDoc } from './horizontaldoc';
import { GridDoc } from './griddoc';
import { ImportDoc } from './importdoc';
import { LazyLoadDoc } from './lazyloaddoc';
import { LoaderDoc } from './loaderdoc';
import { MethodsDoc } from './methodsdoc';
import { PropsDoc } from './propsdoc';
import { ScrollOptionsDoc } from './scrolloptionsdoc';
import { StyleDoc } from './styledoc';
import { TemplateDoc } from './templatedoc';
import { TemplatesDoc } from './templatesdoc';
import { ButtonModule } from 'avan-primeng/button';
import { ProgrammaticDoc } from './programmaticdoc';
import { AccessibilityDoc } from './accessibilitydoc';

@NgModule({
    imports: [CommonModule, RouterModule, AppCodeModule, AppDocModule, ScrollerModule, SkeletonModule, SpinnerModule, ButtonModule],
    declarations: [BasicDoc, DelayDoc, ImportDoc, EventsDoc, HorizontalDoc, GridDoc, LazyLoadDoc, LoaderDoc, MethodsDoc, PropsDoc, ScrollOptionsDoc, StyleDoc, TemplatesDoc, TemplateDoc, ProgrammaticDoc, AccessibilityDoc],
    exports: [AppDocModule]
})
export class ScrollerDocModule {}
