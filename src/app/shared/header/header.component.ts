import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // Importe RouterLink

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink], // Adicione RouterLink aos imports
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {}