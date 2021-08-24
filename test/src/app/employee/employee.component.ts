import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';

export interface CandidateData {
  id: number,
  name: string,
  department: string,
  joining_date: Date
}

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})


export class EmployeeComponent implements OnInit {

  @ViewChildren(MatTable) tables!: QueryList<any>;

  experiencedData: any = [];
  experiencedVisibility: boolean = false;
  DepartmentData: any = [];
  employeeVisibility: boolean = true;
  deleteChecked: boolean = false;
  departmentChecked:boolean = false;
  experiencedChecked: boolean = false;
  displayedColumns: string[] = ['id', 'name', 'department', 'joining_date'];
  departmentColumns: string[] = ['name', 'count'];
  dataSource: any;
  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  candidate_data:any = [];

  constructor() {  }


  ngOnInit(): void {
    this.employeeVisibility = true;
    this.departmentChecked =false;
    this.experiencedChecked =false;
    this.deleteChecked =false;
    this.candidate_data =
    [
      { "id": 11, "name": "Ash", "department": "Finance", "joining_date": '8/10/2016' },
      { "id": 12, "name": "John", "department": "HR", "joining_date": '18/1/2011' },
      { "id": 13, "name": "Zuri", "department": "Operations", "joining_date": '28/11/2019' },
      { "id": 14, "name": "Vish", "department": "Development", "joining_date": '7/7/2017' },
      { "id": 15, "name": "Barry", "department": "Operations", "joining_date": '19/8/2014' },
      { "id": 16, "name": "Ady", "department": "Finance", "joining_date": '5/10/2014' },
      { "id": 17, "name": "Gare", "department": "Development", "joining_date": '6/4/2014' },
      { "id": 18, "name": "Hola", "department": "Development", "joining_date": '8/12/2010' },
      { "id": 19, "name": "Ola", "department": "HR", "joining_date": '7/5/2011' },
      { "id": 20, "name": "Kim", "department": "Finance", "joining_date": '20/10/2010' }
    ]
    this.candidate_data.map((item: any) => {
      var d = item.joining_date.split('/');
      item.joining_date = new Date(d[2], d[1] - 1, d[0]).toDateString();
    })

    this.dataSource = new MatTableDataSource<any>(this.candidate_data);

    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'joining_date': return new Date(item.joining_date);
        default: return item[property];
      }
    };

    this.dataSource.filterPredicate = function (data: any, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };

    // this.dataSource.sort = this.sort;

  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngAfterContentChecked()
  { this.dataSource.sort = this.sort }

  reset(){
    this.ngOnInit();
  }

  //This function is to filter based on Name
  applyFilter(event: any) {
    let filterValue = event.target.value.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }


  //This function is to find 2+ Experienced Candidates
  findExperiencedCandidates(event: any) {
    if (event) {
      this.experiencedData = [];
      this.experiencedChecked = true;
      this.dataSource.data.map((item: any) => {
        let exp = this.calculateExperience(new Date(item.joining_date));

        if (exp >= 2) {
          this.experiencedData.push(item);
        }
      });

      this.dataSource.data = this.experiencedData;
    }
    else
      this.dataSource.data = this.candidate_data;

  }


  //This function is to calculate Experience
  calculateExperience(date: any) {
    let today: any = new Date();
    let ageDate = new Date(today - date);
    console.log(Math.abs(ageDate.getUTCFullYear() - 1970));
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }



  //This function is to delete Candidates who are in Development Department
  deleteCandidates(event: any) {
    if (event) {
      this.deleteChecked = true;
      this.dataSource.data = this.dataSource.data.filter((item: any) => { return !item.department.includes('Development') });
    }
    else
      this.dataSource.data = this.candidate_data;
  }



  //This function is to get Department wise Details
  getDepartmentDetails(event: any) {
    if (event) {
      this.DepartmentData = [];
      this.employeeVisibility = false;
      let temp = this.dataSource.data.map((item: any) => item.department)
        .filter((value: any, index: any, self: any) => self.indexOf(value) === index);

      for (let each of temp) {
        let count = 0;
        this.dataSource.data.map((item: any) => {
          if (item.department == each) {
            count++;
          }
        });

        this.DepartmentData.push({
          name: each,
          count: count
        })
      }
    } else {
      this.employeeVisibility = true;
    }
  }

}
