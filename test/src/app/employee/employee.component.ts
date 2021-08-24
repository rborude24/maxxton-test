import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface CandidateData{
  id:number,
  name:string,
  department:string,
  joining_date:Date
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})


export class EmployeeComponent implements OnInit {
  @ViewChildren(MatTable) tables!: QueryList<any>;

candidate_data:any=
[
      {"id": 11,"name": "Ash","department": "Finance","joining_date": '8/10/2016'},
      {"id": 12,"name": "John","department": "HR","joining_date": '18/1/2011'},
      { "id": 13, "name": "Zuri", "department": "Operations", "joining_date": '28/11/2019'},
      {"id": 14,  "name": "Vish",  "department": "Development",   "joining_date": '7/7/2017'},
      { "id": 15, "name": "Barry",  "department": "Operations", "joining_date": '19/8/2014'},
      {"id": 16,"name": "Ady",  "department": "Finance",  "joining_date": '5/10/2014'},
      { "id": 17,"name": "Gare","department": "Development",  "joining_date": '6/4/2014'},
      { "id": 18,  "name": "Hola",  "department": "Development",  "joining_date": '8/12/2010'},
      {"id": 19,  "name": "Ola",  "department": "HR",  "joining_date": '7/5/2011'},
      { "id": 20,  "name": "Kim",  "department": "Finance",  "joining_date": '20/10/2010'}
]
  experiencedData: any=[];

  experiencedVisibility:boolean=false;
  DepartmentData: any = [];
  employeeVisibility:boolean = true;
  deleteChecked: boolean =false;
  experiencedChecked: boolean =false;
  constructor() {

  }

  displayedColumns: string[] = ['id', 'name', 'department', 'joining_date'];
  departmentColumns: string[] = ['name','count'];
  dataSource:any;
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort, { static: false })sort: MatSort | undefined;

  ngOnInit(): void {

    this.candidate_data.map((item:any)=>{
      var d = item.joining_date.split('/');
      item.joining_date = new Date(d[2],d[1]-1,d[0]).toDateString();
      // console.log(item.joining_date);
    })
    this.dataSource = new MatTableDataSource<any>(this.candidate_data);

    console.log(this.dataSource);


    this.dataSource.sortingDataAccessor = (item:any, property:any) => {
      switch (property) {
         case 'joining_date': return new Date(item.joining_date);
         default: return item[property];
      }
    };

    this.dataSource.filterPredicate = function(data:any, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };

    // this.dataSource.sort = this.sort;
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event:any) {
    let filterValue = event.target.value.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }


  findExperiencedCandidates(event:any){

    // this.experiencedVisibility = !this.experiencedVisibility;
    if(event){
      this.experiencedData = [];
      this.experiencedChecked = true;
    this.dataSource.data.map((item:any)=>{
      let exp = this.calculateExperience(new Date(item.joining_date));

      if(exp >= 2){
        this.experiencedData.push(item);
      }
    });

    this.dataSource.data =this.experiencedData;
  }
  else if(!this.deleteChecked){
    this.dataSource.data = this.candidate_data;
  }
  // else
  //   this.deleteCandidates(true);

  }

  calculateExperience(date:any){
    // let currentDate = new Date(date);
    let today:any = new Date();

    let ageDifMs =new Date(today - date);
    var ageDate = ageDifMs; // miliseconds from epoch
    console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
    return Math.abs(ageDate.getUTCFullYear() - 1970);

  }

  deleteCandidates(event:any){
    if(event){
      this.deleteChecked = true;
      this.dataSource.data=this.dataSource.data.filter((item:any)=>{return !item.department.includes('Development')});
    }
    else if(!this.experiencedChecked)
      this.dataSource.data = this.candidate_data;

    // else
    //   this.findExperiencedCandidates(true);
  }

  getDepartmentDetails(event:any){

    if(event){
      this.DepartmentData = [];
      this.employeeVisibility = false;
    let temp = this.dataSource.data.map((item:any) => item.department)
    .filter((value:any, index:any, self:any) => self.indexOf(value) === index);

    for(let each of temp){
      let count =0;
      this.dataSource.data.map((item:any)=>{
        if(item.department == each){
          count++;
        }
      });

      this.DepartmentData.push({
        name:each,
        count:count
      })
    }

    console.log(this.DepartmentData);
  }else{
    this.employeeVisibility = true;
  }

  }

}
