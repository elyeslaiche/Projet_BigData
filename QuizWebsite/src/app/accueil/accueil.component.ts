import { Component , Input } from '@angular/core';
import {LoginService, UserLogged} from "../services/login.service";

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  constructor(private ls: LoginService){ }

  // Inherit attributes from the parent component
  @Input() dashboardIndex = 0;
  @Input() toolbar = 'hidden';
  @Input() vizUrl = 'https://public.tableau.com/views/GarbageFE/Evolutiondesdechets?:language=fr-FR&publish=yes&:display_count=n&:origin=viz_share_link';

  // Dashboard properties
  public VizIndex = 'Tableau-Viz-' + this.dashboardIndex;
}
