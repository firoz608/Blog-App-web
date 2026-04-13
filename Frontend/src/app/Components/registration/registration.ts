import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {

    registrationForm!: FormGroup;

  constructor(private _authService:AuthService,private fb: FormBuilder,private _route:Router) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registrationForm.valid) {

      const formData = this.registrationForm.value;
        this._authService.registerUser(formData).subscribe({
        next: (res : any)=> {
          alert("Registration Success");
          this._route.navigate(['/login']);
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    } else {
      alert('Please fill all fields correctly');
    }
  }

  cancelfun(){
    this._route.navigate(['/login']);
  }

}
