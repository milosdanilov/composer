import {Component, Input, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {CommandLineToolModel, ExpressionModel, ResourceRequirementModel} from "cwlts/models/d2sb";
import {ComponentBase} from "../common/component-base";
import {FileDef} from "cwlts/mappings/d2sb/FileDef";
import {EditorInspectorService} from "../../editor-common/inspector/editor-inspector.service";
import {ProcessRequirement} from "cwlts/mappings/d2sb/ProcessRequirement";

require("./clt-editor.component.scss");

@Component({
    selector: "ct-clt-editor",
    providers: [EditorInspectorService],
    template: `
        
        <div class="row ">       
            <form [class.col-xs-6]="showInspector" 
                  [class.col-xs-12]="!showInspector" 
                  [formGroup]="formGroup">
                  
                <docker-image-form [dockerRequirement]="model.hints.DockerRequirement"
                                   [form]="formGroup.controls['dockerGroup']"
                                   (update)="setRequirement($event, true)">
                </docker-image-form>
                                
                <base-command-form [baseCommand]="model.baseCommand"
                                   [context]="{$job: model.job}"
                                   [form]="formGroup.controls['baseCommandGroup']"
                                   (update)="setBaseCommand($event)">
                </base-command-form>
                
                <inputs-ports-form [cltModel]="model"></inputs-ports-form>
                
                <ct-output-ports [entries]="model.outputs || []" [readonly]="readonly"></ct-output-ports>
                
                <ct-resources [entries]="resources" [readonly]="readonly" (update)="setResource($event)"></ct-resources>
                
                <ct-hint-list [entries]="model.hints || {}" [readonly]="readonly"></ct-hint-list>
                
                <ct-argument-list [entries]="model.arguments || []" [readonly]="readonly"></ct-argument-list>
                
                <ct-file-def-list [entries]="model.requirements.CreateFileRequirement?.fileDef || []"></ct-file-def-list>
            </form>
            
            <ct-editor-inspector class="col-xs-6" [hidden]="!showInspector">
                <template #inspector></template>
            </ct-editor-inspector>
        </div>

    `
})
export class CltEditorComponent extends ComponentBase implements OnInit {

    @Input()
    public model: CommandLineToolModel;

    @Input()
    public readonly: boolean;

    /** ControlGroup that encapsulates the validation for all the nested forms */
    @Input()
    public formGroup: FormGroup;

    private resources: {
        "sbg:CPURequirement"?: ResourceRequirementModel,
        "sbg:MemRequirement"?: ResourceRequirementModel
    } = {};

    @ViewChild("inspector", {read: ViewContainerRef})
    private inspectorContent: ViewContainerRef;

    @Input()
    public showInspector = false;

    constructor(private formBuilder: FormBuilder,
                private inspector: EditorInspectorService) {
        super();

        this.tracked = this.inspector
            .inspectedObject.map(obj => obj !== undefined)
            .subscribe(show => this.showInspector = show);
    }

    ngOnInit() {
        this.formGroup.addControl("dockerGroup", this.formBuilder.group({}));
        this.formGroup.addControl("baseCommandGroup", this.formBuilder.group({}));
        this.formGroup.addControl("inputPortsGroup", this.formBuilder.group({}));

        console.log("Model", this.model);

        if (this.model.hints) {
            this.resources["sbg:CPURequirement"] = this.model.hints["sbg:CPURequirement"] || {};
            this.resources["sbg:MemRequirement"] = this.model.hints["sbg:MemRequirement"] || {};
        }
    }

    private setRequirement(req: ProcessRequirement, hint: boolean) {
        this.model.setRequirement(req, hint);
    }

    private setResource(resource: ProcessRequirement) {
        this.model.setRequirement(resource, true);
        this.formGroup.markAsDirty();
    }

    ngAfterViewInit() {
        this.inspector.setHostView(this.inspectorContent);
    }

    private setBaseCommand(list: ExpressionModel[]) {
        this.model.baseCommand = [];
        list.forEach(cmd => this.model.addBaseCommand(cmd));
    }
}
