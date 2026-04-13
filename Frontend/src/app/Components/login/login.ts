import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faSignIn } from '@fortawesome/free-solid-svg-icons'
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-login',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private fb: FormBuilder, private _router: Router, private _authService: AuthService) { }
  loginForm!: FormGroup;
  sign_up = faUser;
  sign_in = faSignIn;


  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {


    if (this.loginForm.valid) {

      this._authService.loginUser(this.loginForm.value).subscribe({
        next: (res: any) => {

          console.log(res);

          localStorage.setItem("user", JSON.stringify(res.user));
          this._authService.saveToken(res.id);

          alert("Login Successful");
          this._router.navigate(['/dashboard']);

        },
        error: (err: any) => {
          alert("Invalid Email or Password");
        }
      });


    } else {
      alert('Please fill all fields correctly');
    }
  }




}





