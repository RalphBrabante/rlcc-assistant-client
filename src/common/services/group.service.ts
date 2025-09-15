import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Group,
  GroupsAPIResp,
} from '../../features/pages/circles-page/models/groups';
import { baseUrl } from '../../appConfig';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(private http: HttpClient) {}

  getAllGroupsAndCount(page: number, limit: number): Observable<GroupsAPIResp> {
    return this.http.get<GroupsAPIResp>(baseUrl + '/groups?limit=10&page=1');
  }

  createGroup(group: Group): Observable<GroupsAPIResp> {
    return this.http.post<GroupsAPIResp>(baseUrl + '/groups', { group });
  }

  deleteGroup(id: number): Observable<GroupsAPIResp> {
    return this.http.delete<GroupsAPIResp>(baseUrl + `/groups/${id}`);
  }

  getGroupById(id:string): Observable<GroupsAPIResp> {
    return this.http.get<GroupsAPIResp>(baseUrl + `/groups/${id}`);
  }
}
