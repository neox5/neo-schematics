import { environment as env } from "@env/environment";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";

const API_URL = env.api + "/<%= dasherize(name)%>";

@Injectable({
  providedIn: "root",
})
export class <%= classify(name) %>ApiService {
  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(private _httpClient: HttpClient) {}

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
