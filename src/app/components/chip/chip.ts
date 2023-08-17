import { NgModule, Component, ChangeDetectionStrategy, ViewEncapsulation, Input, Output, EventEmitter, TemplateRef, AfterContentInit, ContentChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimesCircleIcon } from 'avan-primeng/icons/timescircle';
import { PrimeTemplate, SharedModule } from 'avan-primeng/api';

@Component({
    selector: 'p-chip',
    template: `
        <div [ngClass]="containerClass()" [class]="styleClass" [ngStyle]="style" *ngIf="visible">
            <ng-content></ng-content>
            <img [src]="image" *ngIf="image; else iconTemplate" (error)="imageError($event)" />
            <ng-template #iconTemplate><span *ngIf="icon" [class]="icon" [ngClass]="'p-chip-icon'"></span></ng-template>
            <div class="p-chip-text" *ngIf="label">{{ label }}</div>
            <ng-container *ngIf="removable">
                <ng-container *ngIf="!removeIconTemplate">
                    <span tabindex="0" *ngIf="removeIcon" [class]="removeIcon" [ngClass]="'pi-chip-remove-icon'" (click)="close($event)" (keydown.enter)="close($event)"></span>
                    <TimesCircleIcon [attr.tabindex]="0" *ngIf="!removeIcon" [styleClass]="'pi-chip-remove-icon'" (click)="close($event)" (keydown.enter)="close($event)" />
                </ng-container>
                <span *ngIf="removeIconTemplate" class="pi-chip-remove-icon" (click)="close($event)" (keydown.enter)="close($event)">
                    <ng-template *ngTemplateOutlet="removeIconTemplate"></ng-template>
                </span>
            </ng-container>
        </div>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./chip.css'],
    host: {
        class: 'p-element'
    }
})
export class Chip implements AfterContentInit {
    /**
     * Defines the text to display.
     */
    @Input() label: string | undefined;
    /**
     * Defines the icon to display.
     */
    @Input() icon: string | undefined;
    /**
     * Defines the image to display.
     */
    @Input() image: string | undefined;
    /**
     * Inline style of the element.
     */
    @Input() style: CSSStyleDeclaration | undefined;
    /**
     * Class of the element.
     */
    @Input() styleClass: string | undefined;
    /**
     * Whether to display a remove icon.
     */
    @Input() removable: boolean | undefined = false;
    /**
     * Icon of the remove element.
     */
    @Input() removeIcon: string | undefined;
    /**
     * Callback to invoke when a chip is removed.
     */
    @Output() onRemove: EventEmitter<MouseEvent> = new EventEmitter();
    /**
     * This event is triggered if an error occurs while loading an image file.
     */
    @Output() onImageError: EventEmitter<ErrorEvent> = new EventEmitter();

    visible: boolean = true;

    removeIconTemplate: TemplateRef<any>;

    @ContentChildren(PrimeTemplate) templates: QueryList<any>;

    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'removeicon':
                    this.removeIconTemplate = item.template;
                    break;

                default:
                    this.removeIconTemplate = item.template;
                    break;
            }
        });
    }

    containerClass() {
        return {
            'p-chip p-component': true,
            'p-chip-image': this.image != null
        };
    }

    close(event) {
        this.visible = false;
        this.onRemove.emit(event);
    }

    imageError(event) {
        this.onImageError.emit(event);
    }
}

@NgModule({
    imports: [CommonModule, TimesCircleIcon, SharedModule],
    exports: [Chip, SharedModule],
    declarations: [Chip]
})
export class ChipModule {}
