import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SharedServiceService } from './shared-service.service';
import { NavigationEnd, ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'friday';
  isMenuOpen: boolean = false;
  isLoggedIn: boolean = false;
  userLanguage: string = 'en-gb';
  chinese: boolean = false; // true if user language is chinese

  constructor(private httpClient: HttpClient, private sharedService: SharedServiceService, private route: Router, private activatedRoute: ActivatedRoute, private cdr: ChangeDetectorRef) {
    sharedService.data$.subscribe(data => {
      // console.log('Chinese?', data);
      this.chinese = data;
      this.cdr.markForCheck();
    })
   }
  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.isLoggedIn = true;
      this.retrieveUserDetails(token);
    } else {
      this.isLoggedIn = false;
      this.cdr.detectChanges();
      let encoded_url: any;
      let firstName: any;
      // Subscribe to changes in active URL
      this.route.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          //Get the current router URL
          let currentUrl = this.route.url;
          // console.log('Current URL', currentUrl);
          encoded_url = this.urlParser(currentUrl); // parse the current URL
          // Subscribe to changes in the shared data for logging out
          this.sharedService.someData$.subscribe((data) => {
            // console.log('Logged in?', data);
            if (data.isLoggedIn === true) {
              this.isLoggedIn = true;
              this.cdr.detectChanges();
              const token = localStorage.getItem('auth_token'); // retrieve token upon logging in
              if (token) {
                this.retrieveUserDetails(token);
              }
            }
            // for (let i = 0; i < environment.users.length; i++) {
            //   const encoded_name = btoa(environment.users[i].email);
            //   // console.log('This is the encoded_name', encodeURIComponent(encoded_name));
            //   // console.log('This is the current url', encoded_url);
            //   // console.log('Equal?', encodeURIComponent(encoded_name) === encoded_url);
            //   if ((data && data.isLoggedIn) || encodeURIComponent(encoded_name) === encoded_url) {
            //     // console.log('Entered!');
            //     this.isLoggedIn = true;
            //     break
            //   }
            // }
          });
        }
      })
      this.sharedService.userLoggedOut$.subscribe(() => {
        this.isLoggedIn = false;
        // this.cdr.detectChanges();
      });
    }
  }
  // function that changes UI into Chinese (but does not change model language)
  changeLanguage () {
    this.chinese = !this.chinese;
    this.sharedService.setData(this.chinese);
  };

  // async function to retrieve user details (for language)
  async retrieveUserDetails(token: string): Promise <any> {
    try {
      const data = await this.sharedService.initializeUserDetails(token);
      // console.log("Received data:", data);
      this.userLanguage = data.language;
      // console.log('This is the language', this.userLanguage);
      if (this.userLanguage === 'zh-TW') {
        this.chinese = true;
      }
      // this.sharedService.setData(this.chinese);
    } catch (error) {
      console.error("Error occurred at retrieving user details through shared service:", error);
    }
  };
  // // method to log out user
  // logout() {
  //     this.sharedService.logOutUser();
  //     this.route.navigate(['/']);
  //     // this.isMenuOpen = false;
  //     this.isLoggedIn = false;
  //     this.cdr.detectChanges();
  // }

  // url parser method (can return string or null)
  urlParser(url: string): any {
    const firstSlash = url.indexOf('/');
    if (firstSlash !== -1) {
      const secondSlash = url.indexOf('/', firstSlash + 1) // start the search from the next character from where the first slash was found
      if (secondSlash !== -1) {
        return url.slice(secondSlash + 1);
      } else {
        console.log('Second slash not found, something went wrong in urlParser!');
      }
    } else {
      console.log('First slash not found, something went wrong in urlParser!');
    }
    return null;
  }


  onSidenavClick(): void {
    this.isMenuOpen = false;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

  }
  // closeMenu(clickedOutside: boolean) {
  //   // console.log('This is the value', clickedOutside)
  //   this.isMenuOpen = false;
  // }
}
