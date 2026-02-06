import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";
import { DrugsService } from "../../services/drugs.service";

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  providers: []
})
export class HeaderComponent {
  
}
