import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
<% if (!skiputil) { %>
import { <%= classify(name) %>UtilService } from "./util";<% } %>

@Injectable({
  providedIn: "root",
})
export class <%= classify(name) %>SandboxService {
  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(<% if (!skiputil) { %>private _<%= camelize(name) %>Util: <%= classify(name) %>UtilService<% } %>) {}

  // ===========================================================================
  // GET FUNCTIONS
  // ===========================================================================

  // ===========================================================================
  // PUBLIC FUNCTIONS
  // ===========================================================================

  // ===========================================================================
  // PRIVATE FUNCTIONS
  // ===========================================================================
}
