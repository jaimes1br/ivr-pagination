import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, concat, concatMap, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoresService {

  private currentPage = 1;

  private storesDataSubject = new BehaviorSubject<any>([]); //storage ALL STORES
  storesData$: Observable<any> = this.storesDataSubject.asObservable();

  private storesDataTempSubject = new BehaviorSubject<any>([]); //storage ALL STORES from search or all stores
  storesDataTempSubject$: Observable<any> = this.storesDataTempSubject.asObservable();

  private configDataSubject = new BehaviorSubject<any>([]); //storage CONFIG DATA (numer of elements, toal items, etc..)
  configData$: Observable<any> = this.configDataSubject.asObservable();

  private storesListSubject = new BehaviorSubject<any>([]); //return us config and stores per page
  storesList$: Observable<any> = this.storesListSubject.asObservable();

  constructor(private http: HttpClient) { }

  // getPerPage(page: number){
  //   this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=16&offset=${(page) * 16}`).pipe(
  //     map((resp:any) => {
  //       const temp = resp['results'];
  //       return temp.map( (element:any, index:number) =>{
  //             return {
  //               id: index + 1,
  //               store: element.name
  //             }
  //         })
  //     }),
  //     tap((newData:any) => this.storesListSubject.next(newData)),
  //   ).subscribe();  
  // }
  
  getConfig(){
    //this only simulates that the first request is made where we
    // will have the configuration data is not required. we have the http
    return of({
      content: [],
      totalItems: 186,
      totalPages: 12,
      numberOfElements: 16
    })
  }

  getAllPages(){
    return this.getConfig().pipe(
      map((configResp:any) => {
        const { content, ...configData } = configResp;
        this.configDataSubject.next(configData);
        return configData;
      }),
      concatMap(( configData:any ) =>{
        const newParams = new HttpParams().set('limit', configData.totalItems); //we use size
        return this.http.get(`https://pokeapi.co/api/v2/pokemon`,{params: newParams}).pipe(
          tap((storesData:any) =>{
            const { results } = storesData //just take 'content'; result is like all the stores 
            this.storesDataSubject.next({ configData, storesData: results})
            this.storesDataTempSubject.next({ configData, storesData: results})
            this.setCurrentPage(this.currentPage);
          })
        )
      })
    )
  }

  getStoresPerPage(page: number){
    const { storesData, configData } = this.storesDataTempSubject.getValue();
    if(!storesData || !configData) return 

    const { numberOfElements } = configData; 
    let storeList = storesData.slice((page - 1) * numberOfElements, page * numberOfElements );
    storeList = storeList.map( (element:any, index:number) =>{
                return {
                  id: index + 1,
                  store: element.name
                }
              })
    this.storesListSubject.next({configData, storeList});
  }

  setCurrentPage(page: number){
    this.currentPage = page; 
    this.getStoresPerPage(this.currentPage);
  }

  getCurrentPage(){
    return this.currentPage;
  }

  getStoreSearch(toSearch: string){
    //this request returns infoconfig and result(stores) just need to set that values
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${toSearch}`).pipe(
      tap((pkm:any) =>{
        const elemnt = {
          id: pkm.id,
          name: pkm.name
        }
        const configData = {
            totalItems: 1,
            totalPages: 1,
            numberOfElements: 1
          }
        const storesData = [ elemnt ]
        
        this.storesDataTempSubject.next({ configData, storesData });
        this.setCurrentPage(1);   
      })
    )
  }

  setAllStores(){
    this.storesDataTempSubject.next(this.storesDataSubject.getValue());
  
  }
}
