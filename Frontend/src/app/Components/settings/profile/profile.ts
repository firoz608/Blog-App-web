import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  constructor(private authService: AuthService) { }
  profileImage: string = 'assets/default-avatar.jpg'; // default image

  selectedFile!: File;
  name: string = '';
  email: string = '';
  password: string = "";
 
  ngOnInit() {

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  if(user.id){

    this.authService.getprofilepic(user.id)
    .subscribe((imageBlob: Blob)=>{

      const imageUrl = URL.createObjectURL(imageBlob);

      this.profileImage = imageUrl;
      localStorage.setItem("profilePicture", this.profileImage);

    });

  }

  }

  uploadImage() {

    const formData = new FormData();

    const storedUser = JSON.parse(localStorage.getItem("user")!);
    const userId = Number(storedUser.id);

    formData.append('file', this.selectedFile);
    
    


    this.authService.updateProfilepicture(userId, formData)
      .subscribe({
        next: (res: any) => {

          
          console.log("Profile updated", res);
          
          localStorage.setItem("CommentPic",res.profilePicture)as any;

        },
        error: (err) => {
          console.log(err);
        }
      });

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
