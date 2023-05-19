import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {PageEvent} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { StoresService } from '../services/stores.service';
import { Subscription } from 'rxjs';

export interface PeriodicElement {
  store: string;
  id: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {id: 1, store: 'Hydrogen'},
  {id: 2, store: 'Helium' },
  {id: 3, store: 'Lithium'  },
  {id: 4, store: 'Beryllium'},
  {id: 5, store: 'Boron'    },
  {id: 6, store: 'Carbon'   },
  {id: 10,store: 'Neon'     },
  {id: 7, store: 'Nitrogen' },
  {id: 8, store: 'Oxygen'   },
  {id: 9, store: 'Fluorine' },
];

@Component({
  selector: 'ivr-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent implements OnInit {
  isLoading = true;
  displayedColumns: string[] = ['id', 'store'];
  dataSource = ELEMENT_DATA;
  length = 186
  pageSize = 16
  maxPages = 12
  pageIndex = 0
  sub!: Subscription;
  subSearch!: Subscription;
  toSearch = ''
  @ViewChild('searchTerm') searchTerm!: ElementRef;
  currentPage = 1;
  
  constructor(private activatedRoute:ActivatedRoute, 
              private router: Router,
              private storesService: StoresService){}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(e => {
      this.currentPage = e['page'];
      this.toSearch = e['search'];
      
      if(!this.toSearch){
        
        if(!this.currentPage || this.currentPage > this.maxPages || this.currentPage <= 0){
          this.router.navigate(['/home'],{queryParams: { page: 1 }})  
          this.storesService.setCurrentPage(1);        
        }else{
          this.storesService.setCurrentPage(this.currentPage);        
        }
      }else{
        this.subSearch = this.storesService.getStoreSearch(this.toSearch).subscribe();        
      }
    });

    this.sub = this.storesService.storesList$.subscribe(data => {
      const { configData, storeList } = data
      if(!storeList || !configData) return 
      
      this.length = configData.totalItems;
      this.pageSize = configData.numberOfElements;
      this.maxPages = configData.maxPage;
      this.pageIndex = this.currentPage - 1;
      this.dataSource= storeList;
      // this.isLoading = false
    });

  }

  onSearch(){
    const termToSearch = this.searchTerm.nativeElement.value;
    if( !termToSearch){
      localStorage.getItem('cPage');
      const page = !localStorage.getItem('cPage') 
        ? 1
        : localStorage.getItem('cPage');
      
      this.router.navigate(['/home'],{queryParams: { page }}); 
      this.storesService.setAllStores();              
    }else{
      // this.isLoading = true;
      this.router.navigate(['/home'],{queryParams: { search: termToSearch}});                    
    }    
  }

  onChangePage(event: PageEvent){
    localStorage.setItem('cPage',`${event.pageIndex + 1}`);
    this.router.navigate(['/home'],{queryParams: { page: event.pageIndex + 1}})        
  }

  ngOnDestroy(): void {
    if(this.sub) this.sub.unsubscribe();
    if(this.subSearch) this.subSearch.unsubscribe();
  }

}
