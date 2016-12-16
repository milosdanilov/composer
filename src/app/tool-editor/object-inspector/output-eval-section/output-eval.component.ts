import {Component, forwardRef} from "@angular/core";
import {ControlValueAccessor, NG_VALUE_ACCESSOR, FormBuilder, FormGroup} from "@angular/forms";
import {ComponentBase} from "../../../components/common/component-base";
import {CommandOutputParameterModel as OutProperty} from "cwlts/models/d2sb";
import {CommandOutputBindingModel} from "cwlts/models/d2sb/CommandOutputBindingModel";

@Component({
    selector: 'output-eval',
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OutputEvalSectionComponent), multi: true }
    ],
    template: `
<ct-form-panel [borderless]="true" [collapsed]="true">
    <div class="tc-header">Output eval</div>
    <div class="tc-body" *ngIf="input && outputEvalFormGroup">
    
                <div class="form-group">
                    <label class="form-control-label">Output eval</label>
                    <ct-expression-input 
                    [context]="context"
                    [formControl]="outputEvalFormGroup.controls['outputEval']">                    
                    </ct-expression-input>
                </div>
    
                <div class="form-group flex-container">
                    <label class="form-control-label">Load Content</label>
                    <span class="align-right">
                        <toggle-slider [formControl]="outputEvalFormGroup.controls['loadContents']"
                                    [on]="'Yes'"
                                    [off]="'No'"></toggle-slider>
                    </span>
                </div>              
  
                <div class="secondary-text">
                    Read up to the first 64 KiB of text from the file and place it 
                    in the "contents" field of the file object for manipulation by 
                    expressions.
                </div>       
       
    </div> <!--tc-body-->
</ct-form-panel>
    `
})

/**
 * TODO: add the load content property on the model
 * */
export class OutputEvalSectionComponent extends ComponentBase implements ControlValueAccessor {

    private input: OutProperty;

    private onTouched = () => { };

    private propagateChange = (_) => {};

    private outputEvalFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder) {
        super();
    }

    writeValue(input: OutProperty): void {
        this.input = input;

        this.outputEvalFormGroup = this.formBuilder.group({
            loadContents: [this.input.outputBinding.loadContents],
            outputEval: [this.input.outputBinding.outputEval]
        });

        this.tracked = this.outputEvalFormGroup.valueChanges
            .distinctUntilChanged()
            .subscribe(value => {

                this.input.updateOutputBinding(new CommandOutputBindingModel({
                    loadContents: value.loadContents,
                    outputEval: value.outputEval.serialize()
                }));

                this.propagateChange(this.input);
            });
    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
}
