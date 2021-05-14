import { UpdateRecorder } from "@angular-devkit/schematics";
import { Change, InsertChange, NoopChange, RemoveChange, ReplaceChange } from "@schematics/angular/utility/change";

export function applyToUpdateRecorder(
  recorder: UpdateRecorder,
  changes: Change[]
): void {
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    } else if (change instanceof RemoveChange) {
      recorder.remove(change.order, change.toRemove.length);
    } else if (change instanceof ReplaceChange) {
      recorder.remove(change.order, change.oldText.length);
      recorder.insertLeft(change.order, change.newText);
    } else if (!(change instanceof NoopChange)) {
      throw new Error(
        "Unknown Change type encountered when updating a recorder."
      );
    }
  }
}