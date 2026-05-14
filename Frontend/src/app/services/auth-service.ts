import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private apiUrl = "https://localhost:7059";
  // private apiUrl = "https://blog-app-web-f3av.onrender.com";
// private saveApi = "https://blog-app-web-f3av.onrender.com/api/BlogSave";
  constructor(private http: HttpClient) { }
  //register user
  registerUser(userData: any): Observable<any> {
    return this.http.post(this.apiUrl+"/api/auth/register", userData);
  }
  //login user
  loginUser(credentials: any): Observable<any> {
    return this.http.post(this.apiUrl+"/api/auth/login", credentials);
    
  }

updateProfileImage(id: number, imageUrl: string) {
  return this.http.put(
    `${this.apiUrl}/api/auth/update/profile-image/${id}`,
    JSON.stringify(imageUrl),
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
}

  updateName(id: number, data: any) {
  return this.http.put<any[]>(`${this.apiUrl}/api/auth/update/name/${id}`, data);
}

//get profilepic
 getprofilepic(id:number){
  return this.http.get<any>(
    `${this.apiUrl}/api/auth/profile-picture/${id}`
  );
}

  // SAVE TOKEN
  saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  // CHECK LOGIN
  isLoggedIn(): boolean {
    return !!localStorage.getItem("token");
  }

  // LOGOUT
  logout() {
    localStorage.removeItem("token");
  }


}
