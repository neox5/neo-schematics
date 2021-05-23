import { Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-app-layout-view',
  template: `
     <app-navigation></app-navigation>
		<router-outlet></router-outlet> 
  `,
  styleUrls: ['./app-layout-view.component.scss']
})
export class AppLayoutViewComponent implements OnInit{
  // ===========================================================================
  // CONSTRUCTOR
  // ===========================================================================
  constructor(){}

  // ===========================================================================
  // LIFECYCLE HOOKS
  // ===========================================================================
  ngOnInit(): void {}

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
