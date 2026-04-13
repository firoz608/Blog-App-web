import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings {
  constructor(private _router:Router) {}
manageblog() {
  this._router.navigate(['/settings/manageblog']);
}
likedblog() {
  this._router.navigate(['/settings/likedblog']);
}
savedBlog(){
  this._router.navigate(['/settings/savedBlog']);
}
profile(){
  this._router.navigate(['/settings/profile']);
}
}
