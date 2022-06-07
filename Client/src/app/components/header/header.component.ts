import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { NotificationService } from 'src/app/services/admin/notification.service'
import { InvitationService } from 'src/app/services/admin/invitation.service'
import { ToastrService } from 'ngx-toastr';
import { MatMenu } from '@angular/material/menu';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  user: any;

  //Valentina
  adminNotificationN : number = 0;
  notificationsAdmin: any[] = [];
  newNotificationsAdmin: any[] = [];
  oldNotificationsAdmin: any[] = [];
  showOldNotifications:boolean = false;

  constructor(
            public router: Router, 
            private auth: AuthService, 
            private notificationService: NotificationService,
            private invitationService: InvitationService,
            private toastr: ToastrService) {
    this.auth.userEmitter.subscribe(user => {
      this.user = user;
    });
  }

  ngOnInit(): void {
    this.user = this.auth.getUser();
    if(this.user && (this.user.role === 'admin' || this.user.role === 'creator')){
      this.getAdminNotification();
    }
  }

  goToEditor() {
    this.router.navigate(['editor']);
  }

  goToGame() {
    this.router.navigate(['game']);
  }

  async logout() {
    await this.auth.signOut();
    this.reloadPage();
  }

  goHome() {
    if(!this.user){
      this.router.navigate(['/']);
    }
    else if(this.user && !this.user.trainer_id){
      this.router.navigate(['/']);
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  public get role() {
    return this.user.role;
  }

  reloadPage(): void {
    window.location.reload();
  }
  //Valentina
  getAdminNotification(){
    this.notificationService.getNotificationByUser(this.user._id).subscribe(
      response => {
        this.notificationsAdmin = response.notifications;
        var activeNotification = 0;
        this.oldNotificationsAdmin = [];
        this.newNotificationsAdmin = [];

        this.notificationsAdmin.forEach( not => {
          let d = new Date(not.createdAt);
          let date = (d.getDate() < 10? '0':'') + d.getDate() + (d.getMonth() < 10 ? '/0' : '/') + (d.getMonth() + 1) + '/' + d.getFullYear();          
          let hour = (d.getHours() < 10 ? '0' : '') +d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') +d.getMinutes();
          not.createdAt = date + ' ' + hour;
          if(not.seen === false){
            activeNotification++;
            this.newNotificationsAdmin.push(not);
          }
          else{
            if ((not.type === 'invitation' || not.type === 'collabRequest') && not.invitation.status === 'Pendiente'){
              this.newNotificationsAdmin.push(not);
            }
            else{
              this.oldNotificationsAdmin.push(not);
            }
          }
          
        })
        this.adminNotificationN = activeNotification;
      },
      err => {
        console.log(err)
      }
    )
  }
  updateAdminNotifications(){
    const seen = this.notificationsAdmin.some(not => not.seen == false);
    this.showOldNotifications = false;
    if(seen){
      this.notificationService.seeNotification(this.notificationsAdmin[0]).subscribe(
        response => {
          this.getAdminNotification();
        },
        err => {
          console.log(err)
        }
      );
    }
    else{
      this.getAdminNotification();
    }
  }
  acceptInvitation(item: any){
    this.invitationService.acceptInvitation(item.invitation, item.type).subscribe(
      response => {
        if(item.type ==='invitation'){
          this.toastr.success("Ahora es colaborador de la aventura: "+ response.invitation.adventure.name+'. Puede revisarlo en la pestaña Colaboraciones','Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        else{
          this.toastr.success(response.invitation.user.username + " ahora es colaborador de su aventura: "+ response.invitation.adventure.name,'Éxito', {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        }
        
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al aceptar, intente más tarde", "Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  rejectInvitation(item: any){
    this.invitationService.rejectInvitation(item.invitation, item.type).subscribe(
      response => {
        console.log(response)
        if(item.type === 'invitation')
          this.toastr.success("Ha rechazado la invitación a colaborar en la aventura: "+ response.invitation.adventure.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        else
          this.toastr.success("Ha rechazado la colaboración de: " + response.invitation.user.username + " en su aventura: "+ response.invitation.adventure.name,"Éxito", {
            timeOut: 5000,
            positionClass: 'toast-top-center'
          });
        console.log("Invitación Rechazada");
        this.getAdminNotification();
      },
      err => {
        console.log(err)
        this.toastr.error("Ha ocurrido un error al rechazar, intente más tarde","Error", {
          timeOut: 5000,
          positionClass: 'toast-top-center'
        });
      }
    );
  }
  redirectAdventure(adventure_id: string){
    this.router.navigate(['/adventures-search/adventure/'+adventure_id])

  }

}
