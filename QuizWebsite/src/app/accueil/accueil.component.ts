import { Component, OnInit, Input } from '@angular/core';
import { LoginService } from "../services/login.service";


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  constructor(private ls: LoginService) { }

  // Inherit attributes from the parent component
  @Input() dashboardIndex = 0;
  @Input() toolbar = 'hidden';
  @Input() vizUrl = 'https://public.tableau.com/views/Dataviz_V1/Tableaudebord1?:language=fr-FR&publish=yes&:display_count=n&:origin=viz_share_link';

  public VizIndex = 'Tableau-Viz-' + this.dashboardIndex;

  ngOnInit(): void {
  }
}
