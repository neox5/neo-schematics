<% if(quotes === "double") { %>import { Component, OnInit<% if(destroyable) { %>, OnDestroy <% } %>} from "@angular/core";
<% if(destroyable) { %>import { Subject } from "rxjs";
<% } %>
<% if(sandboxName) { %>import { <%= classify(sandboxName)%>SandboxService } from "@routes/<%= sandboxName %>/services";<% } %>
@Component({
  selector: "<%= prefix %>-<%= dasherize(name) %>",
  template: `
    <% if (template) { %> <%= template %> <% } else { %> <%= dasherize(name) %> WORKS!<% } %>
  `,
  styleUrls: ["./<%= dasherize(name) %>.component.scss"]
})
export class <%= classify(name) %>Component implements OnInit<% if(destroyable) { %>, OnDestroy <% } %>{
<% if(destroyable) { %>  /** Emits when Component is destroyed to cancel Subscriptions */
  private readonly _destroyed: Subject<any> = new Subject();
<% } %>  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(<% if(sandboxName) { %>private _sb: <%= classify(sandboxName)%>SandboxService<% } %>){}

  // ===========================================================================
  // LIFECYCLE HOOKS
  // ===========================================================================
  ngOnInit(): void {}
<% if(destroyable) { %>
  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
<% } %>
  // ===========================================================================
  // TEMPLATE EVENTS
  // ===========================================================================

  // ===========================================================================
  // TEMPLATE HELPERS
  // ===========================================================================

  // ===========================================================================
  // PRIVATE FUNCTIONS
  // ===========================================================================
}
<% } else {  %>import { Component, OnInit<% if(destroyable) { %>, OnDestroy <% } %>} from '@angular/core';
<% if(destroyable) { %>import { Subject } from 'rxjs';
<% } %>
<% if(sandboxName) { %>import { <%= classify(sandboxName)%>SandboxService } from '@routes/<%= sandboxName %>/services';<% } %>
@Component({
  selector: '<%= prefix %>-<%= dasherize(name) %>',
  template: `
    <% if (template) { %> <%= template %> <% } else { %> <%= dasherize(name) %> WORKS!<% } %>
  `,
  styleUrls: ['./<%= dasherize(name) %>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit<% if(destroyable) { %>, OnDestroy <% } %>{
<% if(destroyable) { %>  /** Emits when Component is destroyed to cancel Subscriptions */
  private readonly _destroyed: Subject<any> = new Subject();
<% } %>  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(<% if(sandboxName) { %>private _sb: <%= classify(sandboxName)%>SandboxService<% } %>){}

  // ===========================================================================
  // LIFECYCLE HOOKS
  // ===========================================================================
  ngOnInit(): void {}
<% if(destroyable) { %>
  ngOnDestroy(): void {
    this._destroyed.next();
    this._destroyed.complete();
  }
<% } %>
  // ===========================================================================
  // TEMPLATE EVENTS
  // ===========================================================================

  // ===========================================================================
  // TEMPLATE HELPERS
  // ===========================================================================

  // ===========================================================================
  // PRIVATE FUNCTIONS
  // ===========================================================================
}
<% } %>