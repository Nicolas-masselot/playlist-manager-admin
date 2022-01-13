import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {MatPaginator, MatPaginatorIntl} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MessageService } from '../services/message.service';
import {ToastrService} from "ngx-toastr";
import { CustomPaginator } from '../customPaginator';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import {MatDialog} from '@angular/material/dialog';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { environment } from 'src/environments/environment';

export interface Utilisateur{
  email:string,
  id_creator:string,
  nbPlaylists:number | undefined,
  _id:string
  //nbads:number |undefined
}

export interface NouvUser{
  email:string,
  mdp:string,
  mdpConfirm:string
  role:string
}

export interface UserEdited{
  user:string,
  email:string,
  changed:boolean
}

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator() } 
  ]
})
export class ManageUsersComponent implements AfterViewInit {
  
  @BlockUI() blockUI!: NgBlockUI;
  faSearch = faSearch ;
  colonnes: string[] = ["infosUser","ItemsUser","options"];
  users : Utilisateur[] = [];
  datasource = new MatTableDataSource<Utilisateur>(this.users) ;
  env = environment ;

  constructor(private service:MessageService,private toastr: ToastrService,private dialog: MatDialog) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = "Users per page :"
    this.datasource.paginator = this.paginator ;
    this.service.sendMessage('user/getSet',{}).subscribe(
      (response)=>{
        
        console.log(response.data);

        for (let index = 0; index < response.data.length; index++) {
          if (response.data[index].id_creator === undefined) {
            response.data.splice(index,1);
          }
        }
       
        console.log(response.data);

        this.users = response.data ;
        this.datasource.data = response.data ;
      },
      (error) => {
        this.toastr.error("An error has occured");
        console.log(error) ;
      }
    );
  }

  filtrerUsers(event:Event){
    const nomUser = (event.target as HTMLInputElement).value;
    this.datasource.filter = nomUser.trim().toLowerCase() ;
  }

  openDialogUser(idUser:string,typeDialog:number){
    if (typeDialog == 1) {
      let indexUserTarget = this.datasource.data.findIndex(utilisateur => utilisateur._id === idUser);
      const dialogRef = this.dialog.open(UserDialogComponent,{
        data: {
          dialogType : "editUser",
          userId: idUser,
          mail: this.users[indexUserTarget].email
        }
      });
      dialogRef.afterClosed().subscribe((editedUser:UserEdited)=>{
        if (editedUser.changed) {
          this.blockUI.start('Loading...');
          this.service.sendMessage('user/modifyAccount',{_id: idUser , email: editedUser.email }).subscribe(
            (response)=>{
              this.toastr.success("User profile edited successfully");
              let indexEdit = this.datasource.data.findIndex(utilisateur => utilisateur._id === idUser);
              this.users[indexEdit].email = editedUser.email ;
              this.datasource.data = this.users ;
              console.log(response);
              this.blockUI.stop();
            },
            (error)=>{
              this.toastr.error("An error has occured");
              console.log(error) ;
              this.blockUI.stop();
            }
          )
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent,{
        data : {
          message: "Once you delete this account, there is no going back. Please be certain.",
          buttonText: {
            deleteconfirmed: "Delete Account",
            canceldelete: "Cancel"
          }
        }
      });

      dialogRef.afterClosed().subscribe((confirmedDelete:boolean) => {
        if (confirmedDelete) {
          this.blockUI.start('Loading...');
          this.service.sendMessage('user/deleteAccount',{_id: idUser}).subscribe(
            (response)=>{
              this.toastr.success("User deleted successfully");
              let index_todel = this.datasource.data.findIndex(utilisateur => utilisateur._id === idUser);
              this.users.splice(index_todel,1);
              this.datasource.data = this.users ;
              console.log(response);
              this.blockUI.stop();
            },
            (error) => {
              this.toastr.error("An error has occured while deleting User");
              console.log(error) ;
              this.blockUI.stop();
            }
          );
        }
      });
    }
  }

  OpenAddUser(): void {
    const dialogRef = this.dialog.open(UserDialogComponent,{
      data: {
        dialogType : "addUser"
      }
    });
    dialogRef.afterClosed().subscribe((newUser: NouvUser)=>{
      if (newUser.email && newUser.mdp && newUser.mdpConfirm && newUser.role) {
        this.blockUI.start('Loading...');
        let advertiser:boolean ;
        if (newUser.role === environment.ADVERTISER_ROLE) {
          advertiser = true ;
        } else {
          advertiser = false ;
        }
        this.service.sendMessage('user/createAccount',{email: newUser.email , password: newUser.mdp , ads: advertiser}).subscribe(
          (response)=>{
            this.toastr.success('User added successfully'); 
            if (newUser.role === environment.ADVERTISER_ROLE) {
              let nouvelUtilisateur = {_id: response.data._id, email: response.data.email,id_creator: response.data.id_creator, nbPlaylists:undefined/*, nbads:0*/} ;
              this.users.push(nouvelUtilisateur) ;
            } else {
              let nouvelUtilisateur = {_id: response.data._id, email: response.data.email,id_creator: response.data.id_creator, nbPlaylists:0/*, nbads:undefined*/} ;
              this.users.push(nouvelUtilisateur) ;
            }
            this.datasource.data = this.users ;
            console.log(response);
            this.blockUI.stop();
          },
          (error) => {
            this.toastr.error("An error has occured while Adding the User");
            console.log(error) ;
            this.blockUI.stop();
          }
        )
      }
    });
  }
}

const DATA_TEST: Utilisateur[] = [
  {_id: '420', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '421', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '422', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '423', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '424', email: "mail@test3.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '425', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '426', email: "mail@test3.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*,nbads:undefined*/},
  {_id: '427', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '428', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*,nbads:undefined*/},
  {_id: '429', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '430', email: "mail@test4.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*,nbads:undefined*/},
  {_id: '431', email: "mail@test4.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '432', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '433', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '434', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '435', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '436', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '437', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '438', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '439', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '440', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '420', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '441', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '442', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '443', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '444', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '445', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '446', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '447', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '448', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '449', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '450', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '451', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '452', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '453', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '454', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/},
  {_id: '455', email: "mail@test.com",id_creator: environment.USER_ROLE, nbPlaylists:69/*, nbads:undefined*/},
  {_id: '456', email: "mail@test2.com",id_creator: environment.ADVERTISER_ROLE, nbPlaylists:undefined/*, nbads:69*/}
]