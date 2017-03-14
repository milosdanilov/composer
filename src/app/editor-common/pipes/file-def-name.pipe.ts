import {Pipe, PipeTransform} from "@angular/core";
import {Expression} from "cwlts/mappings/d2sb/Expression";
import {SBDraft2ExpressionModel} from "cwlts/models/d2sb";

@Pipe({
    name: "fileDefName"
})

export class FileDefNamePipe implements PipeTransform {
    transform(value: string | Expression, args: any[]): any {

        if (value instanceof SBDraft2ExpressionModel) {
            return value.toString();
        }

        return value || "";
    }
}
