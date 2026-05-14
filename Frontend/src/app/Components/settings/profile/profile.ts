import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { SupabaseStorageService } from '../../../services/supabase-storage.service';
import { SupabaseService } from '../../../services/supabase.service';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(private authService: AuthService,private storageService: SupabaseStorageService, private supabaseService: SupabaseService) { }
  profileImage: string = 'assets/default-avatar.jpg'; // default image

  selectedFile!: File;
  name: string = '';
  email: string = '';
  password: string = "";
 
  ngOnInit() {

  const user = JSON.parse(localStorage.getItem("user") || '{}');

if (user.picture) {
  this.profileImage = user.picture;
}

  }

  async uploadImage() {

  try {

    if (!this.selectedFile) {
      alert("Please select image");
      return;
    }

    const imageUrl = await this.supabaseService
      .uploadProfileImage(this.selectedFile);

    const storedUser = JSON.parse(localStorage.getItem("user")!);

    const userId = Number(storedUser.id);

    this.authService
      .updateProfileImage(userId, imageUrl)
      .subscribe({

        next: (res: any) => {

          this.profileImage = imageUrl;

          storedUser.picture = imageUrl;

          localStorage.setItem(
            "user",
            JSON.stringify(storedUser)
          );

          alert("Profile updated successfully");

        },

        error: (err) => {
          console.log(err);
        }

      });

  }
  catch (error) {

    console.log(error);

    alert("Upload failed");

  }

}

  updateName() {

    // get input value
    const inputElement = document.getElementById("profileNameInput") as HTMLInputElement;
    const newName = inputElement.value;

    if (!newName) {
      alert("Please enter a name");
      return;
    }

    // get user from localStorage
    const user = JSON.parse(localStorage.getItem("user")!);
    const userId = user.id;
    const emailId = user.email;

    const data = {
      name: newName,
      email: emailId,
      password: "",
    };

    this.authService.updateName(userId, data).subscribe({
      next: (res: any) => {

        console.log("Name updated", res);

        // update localStorage
        user.name = newName;
        localStorage.setItem("user", JSON.stringify(user));

        alert("Name updated successfully");

      },
      error: (err) => {
        console.log(err);
      }
    });

  }

  onImageSelected(event: any) {

    this.selectedFile = event.target.files[0];

    if (!this.selectedFile) return;

    // preview image immediately
    const reader = new FileReader();

    reader.onload = () => {
      this.profileImage = reader.result as string;
    };

    reader.readAsDataURL(this.selectedFile);

  }



}
